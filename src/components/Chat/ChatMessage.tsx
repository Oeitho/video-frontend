import { connect } from 'react-redux';
import React from 'react';
import { Message } from '../../interfaces/message';
import { RootState } from '../../redux/rootReducer';
import { AuthorState } from '../../redux/authors/state';

interface Props {
    message: Message;
    authorState: AuthorState;
}

const ChatMessage: React.FC<Props> = (props: Props) => {
    const { message, authorState } = props;
    const authors = authorState.authors;

    const findName = (userId: number) => {
        for (let i = 0; i < authors.length; i++) {
            if (authors[i].id === userId) {
                return authors[i].name;
            }
        }
        return 'Unknown author';
    }

    return (
        <div className="chat-message-container" style={{
            display: 'block',
            margin: '10px 5px',
        }}>
            <div className="chat-author" style={{
                fontWeight: 'bold'
            }}>
                {findName(message.user_id)}
            </div>
            <div className="chat-message" style={{}}>
                {message.chat_message}
            </div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        authorState: state.authors
    };
};

const mapDispatchToProps = { };

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessage);