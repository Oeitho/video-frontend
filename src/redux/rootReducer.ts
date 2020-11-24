import { combineReducers } from 'redux';
import { AuthorReducer } from './authors/reducer';
import { credentialsReducer } from './credentials/reducer';
import { messageReducer } from './messages/reducer';

export const rootReducer = combineReducers({
    credentials: credentialsReducer,
    messages: messageReducer,
    authors: AuthorReducer,
});

export type RootState = ReturnType<typeof rootReducer>;