import React, { useEffect, useState } from 'react';
import { Credentials } from '../../interfaces/credentials';
import { connect } from 'react-redux';
import { setMessages } from '../../redux/messages/actions';
import { setCredentials } from '../../redux/credentials/actions';
import { setAuthors } from '../../redux/authors/actions';
import { RootState } from '../../redux/rootReducer';
import { CredentialsState } from '../../redux/credentials/state';
import { MessageState } from '../../redux/messages/state';
import { Message } from '../../interfaces/message';
import { Author } from '../../interfaces/author';
import Chat from './Chat';

interface Props {
    credentialsState: CredentialsState;
    setCredentials: (credentials: Credentials) => any;
    setMessages: (messages: Message[]) => any;
    setAuthors: (authors: Author[]) => any;
    sendCommand: (command: string, url: string) => any;
}

const ChatManager: React.FC<Props> = (props: Props) => {

    const {credentialsState, setCredentials, setMessages, setAuthors, sendCommand} = props;
    const credentials = credentialsState.credentials;

    const [messageText, setMessageText] = useState('');
    const [name, setName] = useState(credentials ? credentials.name : '');

    const requestFailure = (response: Response) => {
        if (response.ok) return false;
        console.error(`Request failed with status code: ${response.status}!`);
        return true;
    };

    const createUser = async () => {
        const response = await fetch('http://localhost:8080/author', {
            method: 'POST',
            cache:'no-cache', 
            headers: { 'Content-Type': 'application/json' }
        });

        if (requestFailure(response)) return;

        const credentials: Credentials = await response.json();
        setCredentials(credentials);
        setName(credentials.name);
    };

    const refreshChat = async () => {
        const response = await fetch('http://localhost:8080/chat', {
            method: 'GET',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' }
        });
        if (requestFailure(response)) return;

        const messages: { messages: Message[] } = await response.json();
        setMessages(messages.messages);
    }

    const refreshAuthors = async () => {
        const response = await fetch('http://localhost:8080/author', {
            method: 'GET',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' }
        });
        if (requestFailure(response)) return;

        const authors: { authors: Author[] } = await response.json();
        setAuthors(authors.authors); 
    }

    const refreshData = async () => {
        refreshChat();
        refreshAuthors();
    };

    useEffect(() => {
        if (!credentials) createUser();
        const interval = setInterval(refreshData, 250);
        return () => clearInterval(interval);
    }, []);

    const updateName = () => {
        if (credentials === undefined) return;
        fetch("http://localhost:8080/author/" + credentials.id, {
            method: 'PATCH',
            cache: 'no-cache',
            mode: 'cors',
            body: JSON.stringify({name}),
            headers: {
                'Content-Type': 'application/json',
                'secret': credentials.secret,
            },
        });
        setCredentials({...credentials, name});
    };

    const sendMessage = () => {
        if (credentials === undefined || messageText === '') return;
        if (messageText.substring(0, 4) === 'url ') {
            sendCommand('url', messageText.substring(4));
            setMessageText('');
            return;
        }
        fetch("http://localhost:8080/chat", {
            method: 'POST',
            cache: 'no-cache',
            mode: 'cors',
            body: JSON.stringify({ message: messageText }),
            headers: {
                'Content-Type': 'application/json',
                'id': credentials.id.toString(),
                'secret': credentials.secret,
            }
        })
        setMessageText('');
    };

    return (
        <Chat name={name} messageText={messageText} setName={setName} setMessageText={setMessageText} sendMessage={sendMessage} updateName={updateName} />
    )
}

const mapStateToProps = (state: RootState) => {
    return {
        credentialsState: state.credentials,
    };
};

const mapDispatchToProps = { setCredentials, setMessages, setAuthors };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatManager);