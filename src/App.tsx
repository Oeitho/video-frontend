import React, { useCallback, useEffect, useRef, useState } from 'react';

import ChatManager from './components/Chat/ChatManager';
import { VideoPlayer } from './components/Video/VideoPlayer';
import useWebSocket from 'react-use-websocket';

function App() {

  const ref = useRef(null);
  const [url, setUrl] = useState('https://www.youtube.com/watch?v=qjG7TqoQog4');
  const [playing, setPlaying] = useState(true);

  const consumeCommand = (command: string, url: string | undefined) => {
    switch(command) {
        case 'pause':
            if (playing) setPlaying(false);
            break;
        case 'play':
            if (!playing) setPlaying(true);
            break;
        case 'url':
            if (url) setUrl(url);
    }
  };

  const {
    sendMessage,
  } = useWebSocket(`ws://${process.env.REACT_APP_API_URL}`, {
    onMessage: (message: MessageEvent) => {
        const json = JSON.parse(message.data);
        const command = json.command;
        const url = json.url;

        consumeCommand(command, url);
        // @ts-ignore
        ref.current.seekTo(json.currentTime);
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
  }, []);

  const dimensions_query = () => {
    const width = window.innerWidth - 200;
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

export default App;
