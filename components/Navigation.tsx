"use client";
import { useRouter } from "next/navigation";
import React from "react";
import History from "./pages/history";
import Home from "./pages/home";
import News from "./pages/news";
import Team from "./pages/team";
import Join from "./pages/join";
import Merch from "./pages/merch";
import Music from "./pages/music";
import { relative } from "path";

interface NavigationProps{
    setMainContent: (mainContent: React.JSX.Element) => void;
}

const Navigation: React.FC<NavigationProps> = ({ setMainContent } ) => {
    
    return (
        <nav style={{position: "relative"}}>
            <ul>
                <li onClick={() => setMainContent(<Home />)} className="nav-buttons">
                <a>OldTimer</a>
                </li>
                <li onClick={() => setMainContent(<History />)} className="nav-buttons">
                <a>Історія</a>
                </li>
                <li onClick={() => setMainContent(<News />)} className="nav-buttons">
                <a>Новини</a>
                </li>
                <li onClick={() => setMainContent(<Team />)} className="nav-buttons">
                <a>Команда</a>
                </li>
                <li onClick={() => setMainContent(<Join />)} className="nav-buttons">
                <a>Приєднатись</a>
                </li>
                <li onClick={() => setMainContent(<Merch />)} className="nav-buttons">
                <a>Мерч</a>
                </li>
            </ul>
        </nav>
    );

}
export default Navigation;