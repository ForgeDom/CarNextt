"use client";
import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import Home from "../../../../components/pages/home";
import Game from "../../../../components/pages/game";
import Navigation from "../../../../components/Navigation";
import MusicPlayer from "../../../../components/MusicPlayer";

const DynamicHome = dynamic(() => import('../../../../components/pages/home'), { ssr: false });
const DynamicGame = dynamic(() => import('../../../../components/pages/game'), { ssr: false });
const DynamicNavigation = dynamic(() => import('../../../../components/Navigation'), { ssr: false });
const DynamicMusicPlayer = dynamic(() => import('../../../../components/MusicPlayer'), { ssr: false });

export default function OldTimer() {
    const [subscribed, setSubscribed] = useState<boolean>(false);
    const [mainContent, setMainContent] = useState<React.JSX.Element>(<DynamicHome />);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const storedValue = localStorage.getItem("subscribed");
        if (storedValue !== null) {
            const parsedValue = JSON.parse(storedValue) as boolean;
            setSubscribed(parsedValue);

            const subMsg = document.querySelector(".Subscribed");
            const btn = document.querySelector(".subscribe-form button");

            if (parsedValue && subMsg && btn) {
                subMsg.innerHTML = "Ви успішно підписались на розсилку від клубу OLDTIMER";
                btn.textContent = "Відписатись";
            }
        }
    }, []);

    async function subscribe(event: React.MouseEvent | React.KeyboardEvent) {
        event.preventDefault();

        if (typeof window === "undefined") return;

        const emailEl = document.getElementById("emailInput") as HTMLInputElement | null;
        if (!emailEl || !emailEl.value) return;

        const email = emailEl.value.trim();
        emailEl.value = "";

        if (!validateEmail(email)) {
            document.querySelector(".Subscribed")!.innerHTML =
                "Некоректно вказана електронна пошта";
            return;
        }

        try {
            const emailjs = await import("@emailjs/browser");

            await emailjs.send(
                "service_y0v138t",
                "template_yk0qz4s",
                { email },
                "EKd1zTLqaMemtv6yM"
            );

            setSubscribed(true);
            localStorage.setItem("subscribed", JSON.stringify(true));

            document.querySelector(".subscribe-form button")!.textContent = "Відписатись";
            document.querySelector(".Subscribed")!.innerHTML =
                "Ви успішно підписались на розсилку від клубу OLDTIMER";
        } catch (error) {
            console.error("Email sending failed", error);
            document.querySelector(".Subscribed")!.innerHTML =
                "Помилка при надсиланні листа. Спробуйте пізніше.";
        }
    }

    function unsubscribe(event: React.MouseEvent) {
        event.preventDefault();
        if (typeof window === "undefined") return;

        setSubscribed(false);
        localStorage.removeItem("subscribed");

        document.querySelector(".subscribe-form button")!.textContent = "Підписатись";
        document.querySelector(".Subscribed")!.innerHTML = "";
    }

    function validateEmail(email: string) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    return (
        <>
            <header>
                <DynamicNavigation setMainContent={setMainContent} />
                <DynamicMusicPlayer />
            </header>

            <main>
                <div id="main-content">
                    {mainContent}
                </div>
            </main>

            <section className="subscribe-section">
                <p>
                    Щоб отримувати електронні листи про наші майбутні виставки підпишіться
                    на розсилку
                </p>
                <form className="subscribe-form">
                    <input
                        type="email"
                        placeholder="Ваша електронна пошта"
                        id="emailInput"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') subscribe(e);
                        }}
                        required
                    />
                    <button
                        type="submit"
                        className="submitBtn"
                        onClick={(e) => {
                            subscribed ? unsubscribe(e) : subscribe(e);
                        }}
                    >
                        {subscribed ? "Відписатись" : "Підписатись"}
                    </button>
                </form>
                <p className="Subscribed"></p>
                <p className="small-link">
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        setMainContent(<DynamicGame />);
                    }}>
                        Хочете пройти маленький інтерактивчик?
                    </a>
                </p>
            </section>

            <footer>
                <p>© 2017 - 2024 OLDTIMER</p>
                <div className="social-icons">
                    <a
                        href="https://www.instagram.com/oldtimer.vn?igsh=MTR5YTc2ODNrbzhyNw=="
                        target="_blank"
                    >
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://t.me/demetriss_l" target="_blank">
                        <i className="fab fa-telegram"></i>
                    </a>
                    <a href="https://www.facebook.com/oldtimer.vn" target="_blank">
                        <i className="fab fa-facebook"></i>
                    </a>
                </div>
            </footer>
        </>
    );
}
