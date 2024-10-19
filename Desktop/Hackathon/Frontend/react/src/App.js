import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');  // Flask backend URL

function App() {
  const [videoFrame, setVideoFrame] = useState(null);
  const [glossary, setGlossary] = useState([
    { name: 'Scalpel', description: 'A small, sharp knife used for surgery.' },
    { name: 'Artery', description: 'A blood vessel that carries blood away from the heart.' },
    { name: 'Forceps', description: 'A tool used to grasp tissue.' }
  ]);

  useEffect(() => {
    // Request video processing from backend
    socket.emit('start_video', 'C:/Users/hrushi/Downloads/videoplayback.mp4');  // Adjust this to the actual path of your video
    
    // Receive video frames
    socket.on('video_frame', (data) => {
      setVideoFrame(`data:image/jpeg;base64,${data.frame}`);
    });

    return () => {
      socket.off('video_frame');
    };
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 3 }}>
        <h1>Surgery Video</h1>
        {videoFrame ? <img src={videoFrame} alt="Surgery Video" style={{ width: '100%' }} /> : <p>Waiting for video...</p>}
      </div>
      <div style={{ flex: 1, marginLeft: '20px' }}>
        <h2>Glossary</h2>
        <ul>
          {glossary.map((item, index) => (
            <li key={index}>
              <strong>{item.name}:</strong> {item.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
