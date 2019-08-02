import React, { useState, useEffect } from 'react';
import './App.css';
import Player from './Player';

export type AppProps = {
  url: string;
  port?: number;
}

export default ({ url, port = 8080 }: AppProps) => {

  const [playing, setPlaying] = useState(true);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    const dataSocket = new WebSocket(`ws://${url}:8083`);

    dataSocket.onmessage = event => {
      if (!event) {
        throw new Error('Invalid data.');
      }
      const parsed = JSON.parse(event.data);
      setMotion(parsed.motion);
    }

    return () => {
      dataSocket.close();
    }
  }, []);

  const updateVideo = () => {
    fetch(`http://${url}:3000/api`, { method: 'POST', body: JSON.stringify({ framerate: 30, height: 720, width: 1280 }), headers: {'Content-Type': 'application/json'} })
      .then(res => res.json())
      .then(res => console.log(res));
  }

  return (
    <div>
      {/* <div> */}
        <Player 
          url={`ws://${url}:${port}`}
          play={playing}
        />
        {/* <svg viewBox="0 0 64 64" style={{
          opacity: .7,
          cursor: 'pointer'        
        }}>
          <path d="M26,45.5L44,32L26,18.6v27V45.5L26,45.5z M32,2C15.4,2,2,15.5,2,32c0,16.6,13.4,30,30,30c16.6,0,30-13.4,30-30 C62,15.4,48.5,2,32,2L32,2z M32,56c-9.7,0-18.5-5.9-22.2-14.8C6.1,32.2,8.1,21.9,15,15c6.9-6.9,17.2-8.9,26.2-5.2 C50.1,13.5,56,22.3,56,32C56,45.3,45.2,56,32,56L32,56z"></path>
        </svg>
      </div> */}
      <button onClick={() => setPlaying(!playing)}>
        {
          playing ? "⏸" : "	▶"
        }
      </button>
      {motion ? <span style={{color: 'red'}}>MOVING</span> : <span>NOT MOVING</span>}
      <button onClick={updateVideo}>Update</button>
    </div>
  );
}