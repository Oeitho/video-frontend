import React, {MutableRefObject } from 'react';
import ReactPlayer from 'react-player';

interface Props {
    playing: boolean;
    url: string;
    dimensions: { 
        width: number;
        height: number; 
    };
    reference: MutableRefObject<null>;
    sendCommand: (command: string, url: string) => any;
}

export const VideoPlayer: React.FC<Props> = (props: Props) => {
    const { playing, url, dimensions, reference, sendCommand } = props;

    return (
        <ReactPlayer
            url={url}
            ref={reference}
            playing={playing}
            controls={true}
            muted={true}
            height={dimensions.height}
            width={dimensions.width}
            onPause={() => { if (playing) setTimeout(() => sendCommand('pause', ''), 50) }}
            onPlay={() => { if (!playing) setTimeout(() => sendCommand('play', ''), 50) }}
            />
    );
}