import { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/spinner';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/errorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }

    updateChar = () => {
        const { charId } = this.props;
        // если нет charId то остановим метод, т.к изначальное значение null
        if (!charId) {
            return;
        }

        this.onCharLoading();

        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError);
        
        // для теста ошибки
        //this.foo.bar = 0;
    }

    onCharLoaded = (char) => {
        //console.log('update');
        this.setState({
            char: char,
            // как только загрузились данные переопределяем loading в false
            loading: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    // метод для показа спиннера после нажатия на кнопку подгрузки рандомного персонажа
    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    render() {
        const { char, loading, error } = this.state;

        // если не загружен персонаж, не загрузка и не ошибка тогда покажем персонажа скелетон по дефолту
        const skeleton = char || loading || error ? null : <Skeleton />
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error || !char) ? <View char={char} /> : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
}

// для удобства разделим верстку на 2 разных компонента, 1й будет заниматься только интерфейсом, 2й логикой и состоянием
const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char;

    let imgStyle = { 'objectFit': 'cover' };
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = { 'objectFit': 'contain' };
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics with this characters.'}
                {
                    comics.map((item, i) => {
                        // если  списка больше чем 9, не формировать дальше верстку
                        // eslint-disable-next-line
                        if (i > 9) return;
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;