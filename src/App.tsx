import React, { useCallback, useEffect, useRef, useState } from 'react';

import ChatManager from './components/Chat/ChatManager';
import { VideoPlayer } from './components/Video/VideoPlayer';
import useWebSocket from 'react-use-websocket';
import { connect } from 'react-redux';

import { appendMessages } from './redux/messages/actions';
import { Message } from './interfaces/message';

interface Props {
  appendMessages: (messages: Message[]) => any;
}

const App: React.FC<Props> = (props: Props) => {

  const { appendMessages } = props;

  const ref = useRef(null);
  const [url, setUrl] = useState('https://www.youtube.com/watch?v=qjG7TqoQog4');
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_HTTP_URL}/video`, {
      method: 'GET',
      cache: 'no-cache',
    })
      .then(response => response.json())
      .then(response => setUrl(response.current))
      .catch(console.error);
  }, []);

  const consumeCommand = (messageText: string) => {
    const json = JSON.parse(messageText);
    const command = json.command;
    switch(command) {
        case 'pause':
            if (playing) setPlaying(false);
            break;
        case 'play':
            if (!playing) setPlaying(true);
            break;
        case 'url':
            if (json.url) setUrl(json.url);
            break;
        case 'chat':
            if (json.message) appendMessages([json.message]);
            break;
        default:
            break;
          }
    return json.currentTime;
  };

  const {
    sendMessage,
  } = useWebSocket(`${process.env.REACT_APP_API_WS_URL}`, {
    onMessage: (message: MessageEvent) => {
        const currentTime = consumeCommand(message.data);
        // @ts-ignore
        if (currentTime) ref.current.seekTo(currentTime);
    }
  });

  const sendCommand = useCallback((command, url) => {
      if (!ref.current) return;
      // @ts-ignore
      const currentTime = ref.current.getCurrentTime();
      const json = {
          currentTime,
          command,
          url
      };
      sendMessage(JSON.stringify(json));
  }, [sendMessage]);

  const dimensions_query = () => {
    const width = window.innerWidth - 250;
    const height = window.innerHeight;
    return { width, height };
  };

  useEffect(() => {
    const resize = () => setDimensions(dimensions_query());
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  const [dimensions, setDimensions] = useState(dimensions_query()); 

  return (
    <div className="App" style={{
      display: "flex",
      height: '100vh',
      overflowY: 'hidden',
    }} >
      <VideoPlayer playing={playing} url={url} dimensions={dimensions} reference={ref} sendCommand={sendCommand} />
      <ChatManager sendCommand={sendCommand} />
    </div>
  );
}

export default connect(undefined, { appendMessages })(App);
