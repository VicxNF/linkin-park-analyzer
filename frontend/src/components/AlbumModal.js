// src/components/AlbumModal.js

import React from 'react';
import './AlbumModal.css';

const AlbumModal = ({ album, onClose, onSongClick }) => {
  if (!album) {
    return null;
  }

  const modalStyle = {
    backgroundImage: `linear-gradient(rgba(18, 18, 18, 0.85), rgba(18, 18, 18, 0.9)), url(${album.cover})`
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={modalStyle} onClick={(e) => e.stopPropagation()}>
        
        <button className="close-modal-btn" onClick={onClose}>×</button>
        
        <h2 className="modal-album-title">{album.albumTitle}</h2>
        <p className="modal-album-year">{album.year}</p>
        
        <ul className="modal-song-list">
          {album.songs.map((song) => (
            <li
              key={song.title}
              className="modal-song-item"
              onClick={() => {
                onSongClick(song);
                onClose();
              }}
            >
              {song.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AlbumModal;