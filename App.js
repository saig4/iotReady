import React, { useState, useEffect } from 'react';

function App() {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audioPlayer, setAudioPlayer] = useState(null);

  useEffect(() => {
    const savedPlaylist = JSON.parse(localStorage.getItem('playlist'));
    if (savedPlaylist) {
      setPlaylist(savedPlaylist);
    }
    
    const handleTrackEnd = () => {
      if (currentTrackIndex < playlist.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
      } else {
        setCurrentTrackIndex(0);
      }
    };

    if (audioPlayer) {
      audioPlayer.addEventListener('ended', handleTrackEnd);
      return () => audioPlayer.removeEventListener('ended', handleTrackEnd);
    }
  }, [audioPlayer, currentTrackIndex, playlist]);

  useEffect(() => {
    localStorage.setItem('playlist', JSON.stringify(playlist));
  }, [playlist]);

  useEffect(() => {
    const savedTrackIndex = parseInt(localStorage.getItem('currentTrackIndex'), 10);
    if (!isNaN(savedTrackIndex)) {
      setCurrentTrackIndex(savedTrackIndex);
    }
  }, []);

  const handleFileChange = (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setPlaylist(prevPlaylist => [...prevPlaylist, URL.createObjectURL(file)]);
    }
  };

  const handlePlay = (index) => {
    setCurrentTrackIndex(index);
  };

  const handleAudioRef = (element) => {
    setAudioPlayer(element);
  };

  return (
    <div>
      <h1>Audio Player</h1>
      <input type="file" accept="audio/*" onChange={handleFileChange} multiple />
      <div>
        {playlist.map((track, index) => (
          <div key={index}>
            <button onClick={() => handlePlay(index)}>Play Track {index + 1}</button>
          </div>
        ))}
      </div>
      <div>
        <h2>Now Playing</h2>
        {playlist.length > 0 && (
          <audio ref={handleAudioRef} controls autoPlay src={playlist[currentTrackIndex]} />
        )}
      </div>
    </div>
  );
}

export default App;





