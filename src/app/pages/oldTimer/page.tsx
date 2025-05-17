"use client";
import emailjs from "@emailjs/browser";
import React, { useEffect, useState } from "react";
import Home from "../../../../components/pages/home";
import Game from "../../../../components/pages/game";
import Navigation from "../../../../components/Navigation";
import MusicPlayer from "../../../../components/MusicPlayer";

export default function oldTimer() {
    const [subscribed, setSubscribed] = useState<boolean>(false);
    const [email, setEmail] = useState("");
    const [mainContent, setMainContent] = useState<React.JSX.Element>(<Home/>);

    useEffect(() => {
        const storedValue = localStorage.getItem("subscribed");
        if (storedValue !== null) {
            const parsedValue = JSON.parse(storedValue) as boolean;
            setSubscribed(parsedValue);
            if (parsedValue) {
                document.querySelector(".Subscribed")!.innerHTML =
                    "Ви успішно підписались на розсилку від клубу OLDTIMER";
                document.querySelector(".subscribe-form button")!.textContent =
                    "Відписатись";
            }
        }
    }, []);

    function subscribe(event: React.MouseEvent | React.KeyboardEvent) {
    event.preventDefault();
    const emailEl = document.getElementById("emailInput") as HTMLInputElement;

    if (emailEl.value) {
        const email = emailEl.value;
        console.log(email);
        emailEl.value = "";
        if (!validateEmail(email)) {
            document.querySelector(".Subscribed")!.innerHTML =
                "Некоректно вказана електронна пошта";
            return;
        }

        emailjs.send(
            "service_y0v138t",
            "template_yk0qz4s",
            { email },
            "EKd1zTLqaMemtv6yM"
        ).then(
            () => {
                console.log("Email sent successfully");
                setSubscribed(true);
                localStorage.setItem("subscribed", JSON.stringify(true));
                document.querySelector(".subscribe-form button")!.textContent =
                    "Відписатись";
                document.querySelector(".Subscribed")!.innerHTML =
                    "Ви успішно підписались на розсилку від клубу OLDTIMER";
            },
            (error) => {
                console.error("Email sending failed", error);
                document.querySelector(".Subscribed")!.innerHTML =
                    "Помилка при надсиланні листа. Спробуйте пізніше.";
            }
        );
    }
}


    function validateEmail(email: string) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    function unsubscribe(event: React.MouseEvent) {
        event.preventDefault();
        setSubscribed(false);
        localStorage.removeItem("subscribed");
        document.querySelector(".subscribe-form button")!.textContent =
            "Підписатись";
        document.querySelector(".Subscribed")!.innerHTML = "";
    }

    return (
        <>
            <header>
                <Navigation
                    setMainContent={setMainContent}
                />
                <MusicPlayer/>
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
                            if (e.key === 'Enter')
                                subscribe(e);
                        }}
                        required
                    />
                    <button
                        type="submit"
                        className="submitBtn"
                        onClick={(e) => {
                            if (subscribed)
                                unsubscribe(e);
                            else
                                subscribe(e);
                        }}
                    >
                        {subscribed ? "Відписатись" : "Підписатись"}
                    </button>
                </form>
                <p className="Subscribed"></p>
                <p className="small-link">
                    <a href="#" onClick={(e) => { e.preventDefault(); setMainContent(<Game/>) }}>
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
    )
}