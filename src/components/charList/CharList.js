import { useState, useEffect, useRef } from 'react';
import Spinner from '../spinner/spinner';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/errorMessage';

import './charList.scss';


//скрывать кнопку прев при достиженни первых персонажей
const CharList = (props) => {
    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    const [selectedChar, setSelectedChar] = useState(null); // добавляем состояние для хранения идентификатора выбранного персонажа

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest();
        console.log('didmount');
    }, []);

    const onRequest = (offset) => {
        onCharListLoading();
        marvelService.getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError)

        console.log('onrequest');
    }

    const onRequestPrev = (offset) => {
        onCharListLoading();
        marvelService.getAllCharacters(offset)
            .then(onCharListLoadedPrev)
            .catch(onError)

        console.log('onrequestPrev');
    }

    const onCharListLoading = () => {
        setNewItemLoading(true);
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => newCharList);
        setLoading(loading => false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const onCharListLoadedPrev = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => newCharList);
        setLoading(loading => false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset - 9);
        setCharEnded(charEnded => ended);
    }

    const onError = () => {
        setError(true);
    }

    const onCharClick = (id) => {
        setSelectedChar(id);
    }

    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    function renderItems(arr) {
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
                        onCharClick(item.id);
                        props.onCharSelected(item.id)
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

    const items = renderItems(charList);

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
                    onClick={() => onRequestPrev(offset)}>
                    <div className="inner">load prev</div>
                </button>
                <button
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{ 'display': charEnded ? 'none' : 'block' }}
                    onClick={() => onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        </div>
    )
}

export default CharList;