import { Message } from "../../interfaces/message";
import { MessageState } from "./state";

export const SET_MESSAGES = 'SET_MESSAGES';
export const APPEND_MESSAGES = 'APPEND_MESSAGE';
export const RESET_MESSAGES = 'RESET_MESSAGES';

export interface SetMessages {
    type: typeof SET_MESSAGES;
    payload: MessageState;
}

export interface AppendMessages {
    type: typeof APPEND_MESSAGES;
    payload: Message[];
}

export interface ResetMessages {
    type: typeof RESET_MESSAGES;
}

export type MessageActions = SetMessages | AppendMessages | ResetMessages;

export const setMessages = (messages: Message[]): MessageActions => {
    return {
        type: SET_MESSAGES,
        payload: {
            messages: messages
        }
    };
}

export const appendMessages = (messages: Message[]): MessageActions => {
    return {
        type: APPEND_MESSAGES,
        payload: messages
    }
};

export const resetMessages = (): MessageActions => {
    return {
        type: RESET_MESSAGES
    }
};