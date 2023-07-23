import { Component } from 'react';
import Spinner from '../spinner/spinner';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/errorMessage';

import './charList.scss';


//скрывать кнопку прев при достиженни первых персонажей
class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false,
        selectedChar: null // добавляем состояние для хранения идентификатора выбранного персонажа
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
        console.log('didmount');
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)

        console.log('onrequest');
    }

    onRequestPrev = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoadedPrev)
            .catch(this.onError)

        console.log('onrequestPrev');
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({ offset, charList }) => ({
            charList: newCharList,
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onCharListLoadedPrev = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({ offset, charList }) => ({
            charList: newCharList,
            loading: false,
            newItemLoading: false,
            offset: offset - 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    onCharClick = (id) => {
        this.setState({
            selectedChar: id
        })
    }

    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    renderItems(arr) {
        const { selectedChar } = this.state;

        const items = arr.map((item) => {
            let imgStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }

            return (
                <li
                    className={`char__item ${item.id === selectedChar ? 'char__item_selected' : ''}`}
                    key={item.id}
                    onClick={() => {
                        this.onCharClick(item.id);
                        this.props.onCharSelected(item.id)
                    }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {

        const { charList, loading, error, offset, newItemLoading, charEnded } = this.state;

        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                {charEnded ? <h2>Ooops, no more characters left</h2> : null}
                <div className="buttons-wrap">
                    <button
                        className="button button__main button__long"
                        disabled={newItemLoading}
                        style={{ 'display': charEnded ? 'none' : 'block' }}
                        onClick={() => this.onRequestPrev(offset)}>
                        <div className="inner">load prev</div>
                    </button>
                    <button
                        className="button button__main button__long"
                        disabled={newItemLoading}
                        style={{ 'display': charEnded ? 'none' : 'block' }}
                        onClick={() => this.onRequest(offset)}>
                        <div className="inner">load more</div>
                    </button>
                </div>
            </div>
        )
    }
}

export default CharList;