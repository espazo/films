import {IMovie} from "../../services/MovieService";
import {ISearchCondition} from "../../services/CommonTypes";
import {
    DeleteAction,
    MovieActions,
    MovieChangeSwitchAction,
    SaveMoviesAction,
    SetConditionAction,
    SetLoadingAction
} from "../actions/MovieAction";
import {Reducer} from "react";
import {log} from "node:util";

export type IMovieCondition = Required<ISearchCondition>;

export interface IMovieState {
    data: IMovie[],
    condition: IMovieCondition,
    total: number,
    isLoading: boolean,
    totalPage: number,
}

const defaultState: IMovieState = {
    data: [],
    condition: {
        page: 1,
        limit: 10,
        key: '',
    },
    total: 0,
    isLoading: false,
    totalPage: 0,
};

type MovieReducer<A> = Reducer<IMovieState, A>;

const saveMovie: MovieReducer<SaveMoviesAction> = function (prevState, action) {
    // return Object.assign({}, prevState, {
    //     data: action.payload.movies,
    //     total: action.payload.total,
    // });
    return {
        ...prevState,
        data: action.payload.movies,
        total: action.payload.total,
        totalPage: Math.ceil(action.payload.total / prevState.condition.limit),
    };
}

const setCondition: MovieReducer<SetConditionAction> = function (prevState, action) {
    const newState = {
        ...prevState,
        condition: {
            ...prevState.condition,
            ...action.payload,
        },
    };

    newState.totalPage = Math.ceil(newState.total / newState.condition.limit);
    return newState;
}

const setLoading: MovieReducer<SetLoadingAction> = function (prevState, action) {
    return {
        ...prevState,
        isLoading: action.payload,
    };
}

const deleteMovie: MovieReducer<DeleteAction> = function (prevState, action) {
    return {
        ...prevState,
        data: prevState.data.filter(m => m._id != action.payload),
        total: prevState.total - 1,
        totalPage: Math.ceil((prevState.total - 1) / prevState.condition.limit),
    };
}

const changeSwitch: MovieReducer<MovieChangeSwitchAction> = function (prevState, action) {
    const movie = prevState.data.find(d => d._id == action.payload.id);
    if (!movie) {
        return prevState;
    }

    const newMovie = {...movie};
    newMovie[action.payload.type] = action.payload.checked;

    const data = prevState.data.map(d => {
        return d._id == action.payload.id ? newMovie : d;
    });

    return {
        ...prevState,
        data,
    };
}

export default function (preyState: IMovieState = defaultState, action: MovieActions) {
    switch (action.type) {
        case 'movie_delete':
            return deleteMovie(preyState, action);
        case 'movie_save':
            return saveMovie(preyState, action);
        case 'movie_set_condition':
            return setCondition(preyState, action);
        case 'movie_set_loading':
            return setLoading(preyState, action);
        case 'movie_switch':
            return changeSwitch(preyState, action);
        default:
            return preyState;
    }
};
