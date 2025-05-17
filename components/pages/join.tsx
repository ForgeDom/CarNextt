import '../../public/join.css';

const Join: React.FC = () => {
    return (
        <section className="join-section">
            <h1>Приєднатися до клубу Oldtimer</h1>
            <p style={{textAlign:"center", maxWidth:"600px", margin:"0 auto"}}>Якщо у вас є раритетний автомобіль, ви можете стати частиною нашого клубу Oldtimer!</p>
            <div className="join-form-container">
                <iframe 
                    src="https://docs.google.com/forms/d/e/1FAIpQLScEb4aQ6lxxwMoLbQ1ViKz5S4X3CVYczNihg8BH_Erv7obb0w/viewform?embedded=true" 
                    width={640} 
                    height={856} 
                    frameBorder="0" 
                    marginHeight={0} 
                    marginWidth={0}
                >
                    Загрузка…
                </iframe>
            </div>
        </section>
    );
}

export default Join;
