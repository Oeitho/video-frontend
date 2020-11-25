import { Credentials } from "../../interfaces/credentials";
import { CredentialsState } from "./state";

export const SET_CREDENTIALS = 'SET_CREDENTIALS';
export const RESET_CREDENTIALS = 'RESET_CREDENTIALS';

export interface SetCredentials {
    type: typeof SET_CREDENTIALS;
    payload: CredentialsState;
}

export interface ResetCredentials {
    type: typeof RESET_CREDENTIALS;
}

export type CredentialsActions = SetCredentials | ResetCredentials;

export const setCredentials = (credentials: Credentials | undefined): CredentialsActions => {
    return {
        type: SET_CREDENTIALS,
        payload: {
            credentials: credentials
        }
    };
};

export const resetCredentials = (): CredentialsActions => {
    return {
        type: RESET_CREDENTIALS
    };
};