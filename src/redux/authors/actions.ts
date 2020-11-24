import { Author } from "../../interfaces/author";
import { AuthorState } from "./state";

export const SET_AUTHORS = 'SET_AUTHORS';
export const APPEND_AUTHORS = 'APPEND_AUTHORS';
export const RESET_AUTHORS = 'RESET_AUTHORS';

export interface SetAuthors {
    type: typeof SET_AUTHORS;
    payload: AuthorState;
}

export interface AppendAuthors {
    type: typeof APPEND_AUTHORS;
    payload: Author[];
}

export interface ResetAuthors {
    type: typeof RESET_AUTHORS;
}

export type AuthorActions = SetAuthors | AppendAuthors | ResetAuthors;

export const setAuthors = (authors: Author[]): AuthorActions => {
    return {
        type: SET_AUTHORS,
        payload: {
            authors: authors
        }
    };
};

export const appendAuthors = (authors: Author[]): AuthorActions => {
    return {
        type: APPEND_AUTHORS,
        payload: authors
    };
};

export const resetAuthors = (): AuthorActions => {
    return {
        type: RESET_AUTHORS
    };
};