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

  const consumeCommand = (json: {command: string, payload: {[key: string]: any}}) => {
    const command = json.command;
    switch(command) {
        case 'pause':
            if (playing) setPlaying(false);
            break;
        case 'play':
            if (!playing) setPlaying(true);
            break;
        case 'url':
            if (json.payload.url) {
              setPlaying(false);
              // @ts-ignore
              ref?.current?.seekTo(0)
              setUrl(json.payload.url);
            }
            break;
        case 'chat':
            if (json.payload.message) appendMessages([json.payload.message]);
            break;
        case 'keep-alive':
            console.log('keep-alive received'); 
            break;
        default:
            break;
        }
  };

  const {
    sendMessage,
  } = useWebSocket(`${process.env.REACT_APP_API_WS_URL}`, {
    onMessage: (message: MessageEvent) => {
        const json: {command: string, currentTime?: number, payload: {[key: string]: string}} = JSON.parse(message.data);
        const currentTime = json.currentTime;
        consumeCommand(json);
        // @ts-ignore
        const localTime = ref.current.getCurrentTime();
        // @ts-ignore
        if (currentTime &&  Math.abs(currentTime - localTime) > 0.3) ref.current.seekTo(currentTime);
    }
  });

  const sendCommand = useCallback((command, payload: { [ key: string ]: string }) => {
      if (!ref.current) return;
      // @ts-ignore
      const currentTime = ref.current.getCurrentTime();
      const json = {
          currentTime,
          command,
          payload
      };
      sendMessage(JSON.stringify(json));
  }, [sendMessage]);

  useEffect(() => {
    const keepAliveInterval = setInterval(() => sendCommand('keep-alive', {}), 10000);
    return () => clearInterval(keepAliveInterval);
  }, [sendCommand]);

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
