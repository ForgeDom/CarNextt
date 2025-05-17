import { useState, FormEvent, SyntheticEvent } from 'react';
import carsData from '../../src/app/carsData.json';

interface UserData {
  name: string;
  age: number;
  weight: number;
  zodiac: string;
  music: string;
}

interface Car {
  id: number;
  name: string;
  category: string;
  image: string;
  suitableFor: {
    age: [number, number];
    weight: [number, number];
    music: string[];
    zodiac: string[];
  };
}

interface ClosestMatch {
  car: Car;
  score: number;
  mismatches: string[];
}

const Game = () => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [closestMatches, setClosestMatches] = useState<ClosestMatch[]>([]);

  const zodiacSigns = Array.from(new Set(
    (carsData as { cars: Car[] }).cars.flatMap(car => car.suitableFor.zodiac)
  )).sort();

  const musicGenres = Array.from(new Set(
    (carsData as { cars: Car[] }).cars.flatMap(car => car.suitableFor.music)
  )).sort();

  const getImageUrl = (imagePath: string) => {
    // Вилучаємо назву підпапки (muscle/, classic/ тощо)
    const filename = imagePath.split('/').pop() || '';
    return `/photos/cars/${filename}`;
  };

  const findClosestMatches = (userData: UserData): ClosestMatch[] => {
    return (carsData as { cars: Car[] }).cars.map(car => {
      const mismatches: string[] = [];
      let score = 0;

      const [minAge, maxAge] = car.suitableFor.age;
      if (userData.age < minAge || userData.age > maxAge) {
        mismatches.push(`вік (${minAge}-${maxAge} років)`);
      } else {
        score += 1;
      }

      const [minWeight, maxWeight] = car.suitableFor.weight;
      if (userData.weight < minWeight || userData.weight > maxWeight) {
        mismatches.push(`вага (${minWeight}-${maxWeight} кг)`);
      } else {
        score += 1;
      }

      if (!car.suitableFor.music.includes(userData.music)) {
        mismatches.push(`музика (${car.suitableFor.music.join(', ')})`);
      } else {
        score += 1;
      }

      if (userData.zodiac && !car.suitableFor.zodiac.includes(userData.zodiac)) {
        mismatches.push(`знак зодіаку (${car.suitableFor.zodiac.join(', ')})`);
      } else if (userData.zodiac) {
        score += 1;
      }

      return { car, score, mismatches };
    }).sort((a, b) => b.score - a.score).slice(0, 3); 
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuggestions([]);
    setClosestMatches([]);
    setSelectedCar(null);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      const userData: UserData = {
        name: formData.get('name')?.toString() || '',
        age: parseInt(formData.get('age')?.toString() || '0'),
        weight: parseInt(formData.get('weight')?.toString() || '0'),
        zodiac: (formData.get('zodiac')?.toString() || '').toLowerCase(),
        music: formData.get('fav-genre')?.toString() || ''
      };

      if (!userData.age || !userData.weight) {
        throw new Error('Будь ласка, заповніть обов\'язкові поля (вік та вага)');
      }

      const suitableCars = (carsData as { cars: Car[] }).cars.filter((car) => {
        const [minAge, maxAge] = car.suitableFor.age;
        const [minWeight, maxWeight] = car.suitableFor.weight;
        
        return (
          userData.age >= minAge &&
          userData.age <= maxAge &&
          userData.weight >= minWeight &&
          userData.weight <= maxWeight &&
          car.suitableFor.music.includes(userData.music) &&
          (userData.zodiac ? car.suitableFor.zodiac.includes(userData.zodiac) : true)
        );
      });

      if (suitableCars.length === 0) {
        const matches = findClosestMatches(userData);
        setClosestMatches(matches);

        const suggestionsList = [];
        
        const ageRange = (carsData as { cars: Car[] }).cars.flatMap(car => car.suitableFor.age);
        const minAge = Math.min(...ageRange);
        const maxAge = Math.max(...ageRange);
        if (userData.age < minAge || userData.age > maxAge) {
          suggestionsList.push(`Ваш вік повинен бути в межах від ${minAge} до ${maxAge} років`);
        }

        const weightRange = (carsData as { cars: Car[] }).cars.flatMap(car => car.suitableFor.weight);
        const minWeight = Math.min(...weightRange);
        const maxWeight = Math.max(...weightRange);
        if (userData.weight < minWeight || userData.weight > maxWeight) {
          suggestionsList.push(`Ваша вага повинна бути в межах від ${minWeight} до ${maxWeight} кг`);
        }

        if (!musicGenres.includes(userData.music)) {
          suggestionsList.push(`Оберіть один з доступних жанрів музики: ${musicGenres.join(', ')}`);
        }

        if (userData.zodiac && !zodiacSigns.includes(userData.zodiac)) {
          suggestionsList.push(`Оберіть один з доступних знаків зодіаку: ${zodiacSigns.join(', ')}`);
        }

        setSuggestions(suggestionsList);
      } else {
        const randomIndex = Math.floor(Math.random() * suitableCars.length);
        setSelectedCar(suitableCars[randomIndex]);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Сталася невідома помилка');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = (e: SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    console.error('Помилка завантаження зображення:', target.src);
    target.src = '/photos/cars/alfa-romeo-8c-2900.jpeg';
  };

  return (
    <>
      <link rel="stylesheet" href="/randomizer.css" />
      <h1 className='h1-game'>Виберіть свій ідеальний вінтажний автомобіль</h1>
      <p className='p-game'>Дізнайтесь, який з вінтажних автомобілів найкраще пасує саме вам! 
            Заповніть поля нижче, вкажіть ваші дані, такі як вік, вага, знак зодіаку та улюблений музичний жанр, 
            і натисніть "Підібрати авто!". Ми підберемо для вас ідеальний автомобіль, який відповідає вашій особистості.
      </p>
      <div className="containera">
        <div className="part1">
        <form className="htmlForma" onSubmit={handleSubmit}>
            <div className="grid-item">
              <label htmlFor="age">Вік*</label>
              <input 
                type="number" 
                id="age" 
                name="age" 
                min="18" 
                max="100" 
                required 
              />
            </div>
            <div className="grid-item">
              <label htmlFor="weight">Вага (кг)*</label>
              <input 
                type="number" 
                id="weight" 
                name="weight" 
                min="40" 
                max="150" 
                required 
              />
            </div>
            <div className="grid-item">
              <label htmlFor="zodiac">Знак зодіаку</label>
              <select id="zodiac" name="zodiac">
                <option value="">Оберіть знак зодіаку</option>
                {zodiacSigns.map((sign) => (
                  <option key={sign} value={sign}>
                    {sign.charAt(0).toUpperCase() + sign.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid-item">
              <label htmlFor="fav-genre">Улюблена музика*</label>
              <select id="fav-genre" name="fav-genre" required>
                <option value="">Оберіть жанр</option>
                {musicGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid-item button-container">
              <button 
                type="submit" 
                className="butona" 
                disabled={isLoading}
              >
                {isLoading ? 'Завантаження...' : 'Підібрати авто!'}
              </button>
            </div>
          </form>
          {error && (
            <div className="error-container">
              <p className="error-message">{error}</p>
              {suggestions.length > 0 && (
                <div className="suggestions">
                  <p>Рекомендації:</p>
                  <ul>
                    {suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="part2">
          <div className="new-photo">
            {selectedCar ? (
              <>
                <img 
                  src={getImageUrl(selectedCar.image)} 
                  alt={selectedCar.name} 
                  onError={handleImageError}
                  key={`selected-${selectedCar.id}`}
                />
                <h1>{selectedCar.name}</h1>
                <p>Категорія: {selectedCar.category}</p>
              </>
            ) : closestMatches.length > 0 ? (
              <>
                <img 
                  src={getImageUrl(closestMatches[0].car.image)} 
                  alt={closestMatches[0].car.name} 
                  onError={handleImageError}
                  key={`closest-${closestMatches[0].car.id}`}
                />
                <h1>{closestMatches[0].car.name}</h1>
                {/* <p>Категорія: {closestMatches[0].car.category}</p> */}
                {closestMatches[0].mismatches.length > 0 && (
                  <div className="mismatches">
                    {/* <p>Не відповідає критеріям:</p>
                    <ul>
                      {closestMatches[0].mismatches.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul> */}
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Game;