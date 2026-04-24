// src/components/AlbumModal.js

import React from 'react';
import './AlbumModal.css';

const AlbumModal = ({ album, onClose, onSongClick, onAnalyzeAlbum, albumAnalysis, isAnalyzingAlbum }) => {
  if (!album) return null;

  // Creamos un slug del título (ej: "Hybrid Theory" -> "hybrid-theory")
  const albumSlug = album.albumTitle.toLowerCase().replace(/\s+/g, '-');

  const modalStyle = {
    // Si tienes el backCover lo usamos, si no, usamos el cover normal como fallback
    '--album-back-url': `url(${album.backCover || album.cover})`
  };
  
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className={`modal-case ${albumSlug}-theme`} 
        style={modalStyle} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-modal-btn" onClick={onClose}>×</button>
        
        <div className="cd-back-content">
          {/* Encabezado: Título y Botón de Análisis */}
          <div className="album-header-area">
            <h2 className="back-album-title">{album.albumTitle}</h2>
            <button 
              className="back-analyze-btn" 
              onClick={() => onAnalyzeAlbum(album.albumTitle)}
              disabled={isAnalyzingAlbum}
            >
              {isAnalyzingAlbum ? 'Analizando...' : 'ANÁLISIS GENERAL'}
            </button>
          </div>

          {/* Área de Contenido: Lista o Análisis */}
          <div className="back-main-scrollable">
            {isAnalyzingAlbum && (
              <div className="back-loading">
                <div className="spinner"></div>
                <p>IA analizando el disco...</p>
              </div>
            )}

            {albumAnalysis && !isAnalyzingAlbum && (
              <div className="back-analysis-text">
                <p>{albumAnalysis}</p>
                <button className="back-to-list-btn" onClick={() => onAnalyzeAlbum(null)}>Ver Tracklist</button>
              </div>
            )}

            {!albumAnalysis && !isAnalyzingAlbum && (
              <ul className="back-tracklist">
                {album.songs.map((song, index) => (
                  <li key={index} className="back-track-item" onClick={() => { onSongClick(song); onClose(); }}>
                    <span className="track-index">{(index + 1).toString().padStart(2, '0')}:</span>
                    <span className="track-name">{song.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button className="back-analyze-btn" onClick={() => onAnalyzeAlbum(album.albumTitle)}>
            {isAnalyzingAlbum ? 'ANALIZANDO...' : 'ANÁLISIS GENERAL'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlbumModal;