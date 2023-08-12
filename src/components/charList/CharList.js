import { useState, useEffect, useRef } from 'react';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';

import './charList.scss';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner />;
            break;
        case 'loading':
            return newItemLoading ? <Component /> : <Spinner />;
            break;
        case 'confirmed':
            return <Component />
        case 'error':
            return <ErrorMessage />;
            break;
        default:
            throw new Error('Unexpected process state');
    }
}


//скрывать кнопку прев при достиженни первых персонажей
const CharList = (props) => {
    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    const [selectedChar, setSelectedChar] = useState(null); // добавляем состояние для хранения идентификатора выбранного персонажа

    const { getAllCharacters, process, setProcess } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
        //console.log('didmount');
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllCharacters(offset).then(onCharListLoaded).then(() => setProcess('confirmed'));

        //console.log('onrequest');
    }

    const onRequestPrev = (offset) => {
        getAllCharacters(offset).then(onCharListLoadedPrev);

        //console.log('onrequestPrev');
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => newCharList);
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
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset - 9);
        setCharEnded(charEnded => ended);
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

    // if (loading) {
    //     import('./someFunc')
    //         .then(obj => obj.logger())
    //         .catch();
    // }

    return (
        <div className="char__list">
            {setContent(process, () => renderItems(charList), newItemLoading)}
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