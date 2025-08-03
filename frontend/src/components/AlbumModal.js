import React from 'react';
import './AlbumModal.css';

const AlbumModal = ({ album, onClose, onSongClick, onAnalyzeAlbum, albumAnalysis, isAnalyzingAlbum }) => {
  if (!album) {
    return null;
  }

  const modalStyle = {
    // Usamos la variable CSS --album-cover-url para pasar la URL de la imagen al CSS
    '--album-cover-url': `url(${album.cover})`
  };
  
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>×</button>
        
        <div className="modal-left-panel">
          <img src={album.cover} alt={`Portada de ${album.albumTitle}`} className="modal-album-cover" />
        </div>

        <div className="modal-right-panel">
          <h2 className="modal-album-title">{album.albumTitle}</h2>
          <p className="modal-album-year">{album.year}</p>

          <button 
            className="analyze-album-btn" 
            onClick={() => onAnalyzeAlbum(album.albumTitle)}
            disabled={isAnalyzingAlbum}
          >
            {isAnalyzingAlbum ? 'Analizando Álbum...' : 'Análisis General del Álbum'}
          </button>
          
          {isAnalyzingAlbum && (
            <div className="loading-container modal-loading">
              <div className="spinner"></div>
              <p>La IA está "escuchando" el álbum completo...</p>
            </div>
          )}

          {albumAnalysis && !isAnalyzingAlbum && (
            <div className="album-analysis-container">
              <h4>Análisis Temático del Álbum:</h4>
              <p>{albumAnalysis}</p>
            </div>
          )}

          {!albumAnalysis && !isAnalyzingAlbum && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbumModal;