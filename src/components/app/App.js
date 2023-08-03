import { useState } from "react";
import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from '../errorBoundary/errorBoundary';
import AppBanner from "../appBanner/AppBanner";
import ComicsList from "../comicsList/ComicsList";

import decoration from '../../resources/img/vision.png';

const App = () => {
    // id приходит из компонента CharList, устанавливается в state и далее передается в компонет CharInfo
    const [selectedChar, setChar] = useState(null);

    // устанавливаем selectedChar в state
    const onCharSelected = (id) => {
        setChar(id);
    }

    return (
        <div className="app">
            <AppHeader />
            <main>
                {/* <RandomChar />
                <div className="char__content">
                    передаем метод onCharSelected в CharList
                    <CharList onCharSelected={onCharSelected} />
                    <ErrorBoundary>
                        передаем id из state в CharInfo при помощи charId
                        <CharInfo charId={selectedChar} />
                    </ErrorBoundary>
                </div>
                <img className="bg-decoration" src={decoration} alt="vision" /> */}

                <AppBanner />
                <ComicsList />
            </main>
        </div>
    )
}

export default App;