import '/public/history.css';

const History = () => {
    return (
        <>
            <section className="history-section">
                <h1>Історія клубу Oldtimer</h1>

                <div className="car-item">
                    <img id="hist-e28" src="/photos/e28.jpg" alt="BMW E28" className="car-photo"/>
                    <div className="car-description">BMW E28, 1985 рік</div>
                        <div className="car-text-container">
                            <p>У 2017 році в мальовничому місті Вінниця зародилася унікальна автомобільна спільнота — клуб Oldtimer. Його засновником став молодий ентузіаст і власник легендарного BMW E28 — Андрій, який із дитинства захоплювався класичними автомобілями.</p>
                        </div>
                </div>
                

                <h2>Початок історії</h2>
                <div className="car-item">
                    <img id="hist-w123" src="/photos/w123.jpg" alt="Mercedes W123" className="car-photo"/>
                    <div className="car-description">Mercedes W123, 1980 рік</div>
                        <div className="car-text-container">
                            <p>Ідея створити клуб виникла під час вечірньої поїздки на його улюбленому BMW. На узбіччі він побачив схожого "олдтаймера" — старенький Mercedes W123. Двоє водіїв зустрілися, поговорили про свої машини й вирішили: у Вінниці має бути місце, де поціновувачі класичних авто зможуть збиратися, ділитися досвідом та просто насолоджуватися атмосферою автоностальгії.</p>
                        </div>
                </div>

                <h2>Перші кроки</h2>
                <div className="car-item">
                    <img id="hist-beetle" src="/photos/volkswagen-beetle.jpg" alt="Volkswagen Beetle" className="car-photo"/>
                    <div className="car-description">Volkswagen Beetle, 1973 рік</div>
                        <div className="car-text-container">
                            <p>Андрій розпочав з малого: створив сторінку в соціальних мережах, де публікував історії свого BMW E28, ділився фотографіями відновлення авто та запрошував інших ентузіастів до спільних зустрічей. Уже через кілька місяців клуб налічував понад десяток учасників, серед яких були власники різних "олдтаймерів": від ВАЗ-2101 до Volkswagen Beetle.</p>
                        </div>
                </div>

                <h2>Розвиток</h2>
                <div className="car-item">
                    <img id="hist-capri" src="/photos/ford-1979.jpg" alt="Ford Capri 1979" className="car-photo"/>
                    <div className="car-description">Ford Capri, 1979 рік</div>
                        <div className="car-text-container">
                            <p>З кожним роком клуб ріс. У 2020 році Oldtimer провів свій перший масштабний фестиваль ретро-автомобілів, на якому зібралося понад 50 машин з різних міст України. Захід привернув увагу не лише ентузіастів, а й широкого загалу. Серед учасників були навіть власники унікальних авто, таких як Ford Capri 1979 року і ГАЗ 24.</p>
                        </div>
                </div>
                

                <h2>Сьогодення</h2>
                <div className="car-item">
                    <div className="meeting-photos">
                        <img src="/photos/meetup-2024-1.jpeg" alt="Зустріч 2024" className="meeting-vertical-one"/>
                        <img src="/photos/meetup-2024-2.jpeg" alt="Зустріч 2024" className="meeting-vertical-two"/>
                        <img src="/photos/meetup-2024-3.jpeg" alt="Зустріч 2024" className="meeting-vertical-three"/>
                    </div>
                    <div className="car-description">Щорічна зустріч клубу Oldtimer</div>
                    <div className="car-text-container">
                        <p>Сьогодні клуб Oldtimer — це велика родина, де ретро-автомобілі не просто машини, а справжні історії на колесах. Спільнота активно популяризує свою діяльність, бере участь у благодійних заходах і продовжує надихати людей берегти автоісторію.</p>
                    </div>
                </div>
            </section>
        </>
    )
}
export default History;