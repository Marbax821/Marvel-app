import { Component } from "react";
import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from '../errorBoundary/errorBoundary';

import decoration from '../../resources/img/vision.png';

class App extends Component {
    // id приходит из компонента CharList, устанавливается в state и далее передается в компонет CharInfo
    state = {
        selectedChar: null
    }

    // устанавливаем selectedChar в state
    onCharSelected = (id) => {
        this.setState({
            selectedChar: id
        })
    }

    render() {
        return (
            <div className="app">
                <AppHeader />
                <main>
                    <RandomChar />
                    <div className="char__content">
                        {/* передаем метод onCharSelected в CharList */}
                        <CharList onCharSelected={this.onCharSelected} />
                        <ErrorBoundary>
                            {/* передаем id из state в CharInfo при помощи charId */}
                            <CharInfo charId={this.state.selectedChar} />
                        </ErrorBoundary>
                    </div>
                    <img className="bg-decoration" src={decoration} alt="vision" />
                </main>
            </div>
        )
    }
}

export default App;