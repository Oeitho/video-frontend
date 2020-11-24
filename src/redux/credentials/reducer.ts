import { CredentialsActions, RESET_CREDENTIALS, SET_CREDENTIALS } from "./actions";
import { CredentialsState } from "./state";

const initialState: CredentialsState = { };

export const credentialsReducer = (state = initialState, action: CredentialsActions): CredentialsState => {
    switch(action.type) {
        case SET_CREDENTIALS:
            return { ...action.payload };
        case RESET_CREDENTIALS:
            return { ...initialState };
        default:
            return state;
    }
};