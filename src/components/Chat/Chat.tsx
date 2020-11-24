import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import { CredentialsState } from '../../redux/credentials/state';
import { MessageState } from '../../redux/messages/state';
import ChatMessage from './ChatMessage';

interface Props {
    name: string;
    messageText: string;
    setName: (name: string) => any;
    setMessageText: (message: string) => any;
    updateName: () => any;
    sendMessage: () => any;
    credentialsState: CredentialsState;
    messageState: MessageState;
}

const Chat: React.FC<Props> = (props: Props) => {

    const { name, messageText, setName, setMessageText, updateName, sendMessage, credentialsState, messageState,  } = props;
    const messages = messageState.messages;
    const credentials = credentialsState.credentials;

    return (
        <div id="chat-container" style={{
            marginRight: '0px',
            maxWidth: '250px',
        }}>
            <div id="chat" style={{
                boxShadow: '0 0 4px #666666',
                padding: '20px',
                height: '100%',
                display: 'grid',
                gridTemplateRows: 'auto 1fr auto',
            }}>
                <div>
                    { credentials ?
                        <>
                            <input type="text" value={name} onChange={event => setName (event.target.value)} onKeyDown={event => event.key === 'Enter' && updateName()} />
                            <button onClick={updateName}>Change</button>
                        </>
                        : 'Fetching name...' }
                </div>
                <div style={{
                    overflowY: 'scroll',
                }}>
                    {
                        messages ? messages
                            .sort((a, b) => a.id - b.id)
                            .map(message => <ChatMessage message={message} key={message.id} />) : 'Loading messages...'
                    }
                </div>
                <div>
                    {
                        credentials ?
                        <>
                            <input type="text" value={messageText} onChange={event => setMessageText(event.target.value)} onKeyDown={event => event.key === 'Enter' && sendMessage() } />
                            <button onClick={sendMessage}>Send</button>
                        </>
                        : <></>
                    }
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state: RootState) => {
    return {
        credentialsState: state.credentials,
        messageState: state.messages
    };
};

const mapDispatchToProps = { };

export default connect(mapStateToProps, mapDispatchToProps)(Chat);