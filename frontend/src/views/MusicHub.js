// src/views/MusicHub.js

import React from 'react';
import './MusicHub.css'; // Crearemos este archivo de CSS ahora

const MusicHub = () => {
  const videoId = '97Mj6pXYMd8?si=oFYEqfjsTIX4GITH'; // ID de "Up From The Bottom"
  const playlistId = '37i9dQZF1DZ06evO47cwRq'; // ID de la playlist "This is Linkin Park"

  return (
    <div className="music-hub-container">
      <div className="video-panel">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="playlist-panel">
        <iframe
          style={{ borderRadius: '12px' }}
          src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default MusicHub;