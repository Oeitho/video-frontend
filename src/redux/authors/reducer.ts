import { APPEND_AUTHORS, AuthorActions, RESET_AUTHORS, SET_AUTHORS } from "./actions";
import { AuthorState } from "./state"

const initialState: AuthorState = { authors: [] };

export const AuthorReducer = (state = initialState, action: AuthorActions): AuthorState => {
    switch(action.type) {
        case SET_AUTHORS:
            return { ...action.payload };
        case APPEND_AUTHORS:
            return { authors: [...state.authors, ...action.payload] }
        case RESET_AUTHORS:
            return { ...initialState };
        default:
            return state;
    }
}