"use client";
import { useEffect, useState } from "react";
import photosList from "@public/photos-list.json";

const Home = () => {
    const [counter, setCounter] = useState(1);
    const [carImage, setCarImage] = useState("/photos/slider/1.jpg");
    const images = photosList.map((photo: string) => `/photos/slider/${photo}`);

    const changeImage = () => {
        setCounter((prevCounter) => (prevCounter + 1) % images.length);
    };

    const manualChange = (n: number) => {
        setCounter((prevCounter) => (prevCounter + n + images.length) % images.length);
    };

    useEffect(() => {
        const intervalId = setInterval(changeImage, 3000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        setCarImage(images[counter]);
    }, [counter, images]);

    return (
        <div className="page-wrapper">
            <section className="intro-section">
                <p>
                    <strong>OLDTIMER.VN</strong> — це автомобільна спільнота в місті Вінниця, метою якої є об'єднання людей,
                    що захоплюються старими автомобілями (янтаймери, олдтаймери, ретро), інколи мотоциклами.
                </p>
                <p>
                    Ми створюємо єдине середовище для спілкування (через закриту групу в месенджері), організації зустрічей,
                    взаємопідтримки та загального просування автомобільної культури в місті, а також пом'якшення бар'єрів
                    між суспільством та власниками "старих авто".
                </p>
            </section>

            <div className="slider">
                <img id="car_image" src={carImage} alt="Car image" />
                <a className="prev" onClick={() => manualChange(-1)}>&#10094;</a>
                <a className="next" onClick={() => manualChange(1)}>&#10095;</a>
            </div>

            <section className="other-pages">
                <h2>Дізнайтесь більше про нас відвідуючи сторінки:</h2>
                <div className="page-descriptions">
                    <div className="page-box">
                        <div className="page-title">Історія</div>
                        <div className="page-text">Як виник клуб Oldtimer та як все починалося у Вінниці.</div>
                    </div>
                    <div className="page-box">
                        <div className="page-title">Наша команда</div>
                        <div className="page-text">Учасники клубу, які роблять спільноту живою та дружньою.</div>
                    </div>
                    <div className="page-box">
                        <div className="page-title">Новини</div>
                        <div className="page-text">Події, зустрічі та важливі анонси клубу.</div>
                    </div>
                    <div className="page-box">
                        <div className="page-title">Мерч</div>
                        <div className="page-text">Унікальні речі для поціновувачів ретро-авто (футболки, худі тощо).</div>
                    </div>
                    <div className="page-box">
                        <div className="page-title">Приєднатися</div>
                        <div className="page-text">Як стати частиною нашої спільноти.</div>
                    </div>
                </div>
            </section>

            <section className="after-slider">
                <p>Якщо ви потрапили на цю сторінку через візитівку, яку знайшли на своєму авто, значить ваше авто привернуло нашу увагу.</p>
                <p>Ви поділяєте наше захоплення старими автомобілями та вбачаєте в цьому сенс? — будемо раді вам!</p>
                <p>Для долучення до спільноти сконтактуйте з нами у зручний для вас спосіб:</p>
                <div className="contact-icons">
                    <div className="icon-box">
                        <a href="https://www.instagram.com/oldtimer.vn?igsh=MTR5YTc2ODNrbzhyNw==" target="_blank">
                            <img src="../photos/icons/instagram-icon.png" alt="Instagram" className="icon-large" />
                        </a>
                        <a href="https://www.instagram.com/oldtimer.vn?igsh=MTR5YTc2ODNrbzhyNw==" target="_blank">
                            <div className="icon-label">oldtimer.vn</div>
                        </a>
                    </div>
                    <div className="icon-box">
                        <a href="https://chat.whatsapp.com/Gowc8wF1BGsKmyyi0MuVCB" target="_blank">
                            <img src="../photos/icons/whatsapp-icon.png" alt="WhatsApp" className="icon-large" />
                        </a>
                        <a href="https://chat.whatsapp.com/Gowc8wF1BGsKmyyi0MuVCB" target="_blank">
                            <div className="icon-label">Oldtimer</div>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
