import { APPEND_MESSAGES, MessageActions, RESET_MESSAGES, SET_MESSAGES } from "./actions";
import { MessageState } from "./state"

const initialState: MessageState = { messages: [] };

export const messageReducer = (state = initialState, action: MessageActions): MessageState => {
    switch(action.type) {
        case SET_MESSAGES:
            return { ...action.payload };
        case APPEND_MESSAGES:
            return { ...state, messages: [...state.messages , ...action.payload] };
        case RESET_MESSAGES:
            return { ...initialState };
        default:
            return state;
    }
};