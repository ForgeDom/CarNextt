"use client";
import musicList from "@public/music-list.json";
import { useRef, useState, useEffect } from "react";

const MusicPlayer = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [musicSrc, setMusicSrc] = useState(musicList[0]);
    const [musicIndex, setMusicIndex] = useState(0);
    const [isMusicPlayed, setIsMusicPlayed] = useState(false);
    const trackNameRef = useRef<HTMLDivElement>(null);

    const calculateAnimationDuration = (text: string) => {
        // Base duration for average length text
        const baseDuration = 10;
        // Adjust duration based on text length
        const lengthFactor = text.length / 20; // 20 is the average expected length
        // Minimum duration of 5s, maximum of 15s
        // return Math.max(5, Math.min(15, baseDuration * lengthFactor));
        return 10;
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const playMusic = async () => {
                try {
                    await audio.load(); // Завантажуємо новий трек
                    if (isMusicPlayed) {
                        await audio.play(); // Відтворюємо, якщо потрібно
                    }
                } catch (error) {
                    console.error("Помилка відтворення:", error);
                }
            };
            playMusic();
        }
    }, [musicSrc]);

    const PlayPause = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isMusicPlayed) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        setIsMusicPlayed(!isMusicPlayed);
    };

        const handleTrackChange = async (shouldPlay: boolean) => {
        const audio = audioRef.current;
        if (audio) {
            audio.pause(); // Зупиняємо поточний трек
            audio.src = `/car_music/${musicSrc}`; // Встановлюємо нове джерело
            try {
                await audio.load(); // Завантажуємо новий трек
                if (shouldPlay) {
                    await audio.play(); // Відтворюємо, якщо потрібно
                }
            } catch (error) {
                console.error("Помилка відтворення:", error);
            }
        }
    };
    
    const nextMusic = () => {
        let newIndex = musicIndex === musicList.length - 1 ? 0 : musicIndex + 1;

        setMusicIndex(newIndex);
        setMusicSrc(musicList[newIndex]); // Зміна musicSrc автоматично викличе useEffect
    };

    const prevMusic = () => {
        let newIndex = musicIndex === 0 ? musicList.length - 1 : musicIndex - 1;

        setMusicIndex(newIndex);
        setMusicSrc(musicList[newIndex]); // Зміна musicSrc автоматично викличе useEffect
    };

    const handleSpacebar = (event: KeyboardEvent) => {
        if (
            event.code === "Space" &&
            !["INPUT", "TEXTAREA"].includes((document.activeElement as HTMLElement).tagName)
        ) {
            event.preventDefault();
            PlayPause(); // Use your existing function
        }
    };

    window.addEventListener("keydown", handleSpacebar);

    useEffect(() => {
        const textEl = trackNameRef.current;
        if (!textEl) return;
    
        const updateMarquee = () => {
            const container = textEl.parentElement;
            if (!container) return;
    
            const textWidth = textEl.scrollWidth;
            const containerWidth = container.offsetWidth;
    
            // Start just outside the right edge
            const start = containerWidth;
            // End when the whole text is off to the left
            const end = -textWidth;
            console.log(end);
    
            const distance = start - end;
            const speed = 100; // pixels per second
            const duration = distance / speed;
    
            // Optional pause before restarting
            const pause = 1; // seconds
    
            textEl.style.setProperty('--marquee-start', `${start}px`);
            textEl.style.setProperty('--marquee-end', `${end}px`);
            textEl.style.setProperty('--animation-duration', `${duration}s`);
            textEl.style.setProperty('--animation-delay', `${pause}s`);
        };
    
        updateMarquee(); // Initial
        window.addEventListener('resize', updateMarquee); // Update on resize
    
        return () => window.removeEventListener('resize', updateMarquee);
    }, [musicSrc]);
    

    return (
        <div className="music-player">
            <div id ="song_name"className="track-name" data-text={musicSrc} ref={trackNameRef}>{}</div>
            <div className="player-buttons">
                <button onClick={prevMusic}>Prev</button>
                <button onClick={PlayPause}>
                    {isMusicPlayed ? "⏸" : "⏵"}
                </button>
                <button onClick={nextMusic}>Next</button>
            </div>
            <audio
                ref={audioRef}
                src={`/car_music/${musicSrc}`}
                style={{ display: "none" }}
                onEnded={() => nextMusic()}
            />
        </div>
    );
}

export default MusicPlayer;