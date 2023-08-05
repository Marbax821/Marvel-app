import { useState } from "react";

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from '../errorBoundary/errorBoundary';

import decoration from '../../resources/img/vision.png';

const MainPage = () => {
    // id приходит из компонента CharList, устанавливается в state и далее передается в компонет CharInfo
    const [selectedChar, setChar] = useState(null);

    // устанавливаем selectedChar в state
    const onCharSelected = (id) => {
        setChar(id);
    }

    return (
        <>
            <RandomChar />
            <div className="char__content">
                {/* передаем метод onCharSelected в CharList */}
                <CharList onCharSelected={onCharSelected} />
                <ErrorBoundary>
                    {/* передаем id из state в CharInfo при помощи charId */}
                    <CharInfo charId={selectedChar} />
                </ErrorBoundary>
            </div>
            <img className="bg-decoration" src={decoration} alt="vision" />
        </>
    )
}

export default MainPage;