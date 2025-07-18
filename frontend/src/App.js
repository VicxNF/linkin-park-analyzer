import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnalysisChart from './components/AnalysisChart';
import './App.css';
import YouTube from 'react-youtube'; 

// La URL base de nuestra API de Flask
const API_URL = 'https://linkin-park-api.onrender.com';

function App() {
  const [albums, setAlbums] = useState([]); // Estado para guardar los datos de la API
  const [selectedSongAnalysis, setSelectedSongAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState(null);

  // useEffect se ejecuta una vez para cargar todos los datos de los álbumes
  useEffect(() => {
    axios.get(`${API_URL}/api/albums`)
      .then(response => {
        setAlbums(response.data);
      })
      .catch(error => {
        console.error("Error fatal al obtener los álbumes:", error);
        setError('No se pudo cargar la información de los álbumes. ¿Está el servidor del backend corriendo?');
      });
  }, []); // El array vacío asegura que solo se ejecute una vez

  const handleSongClick = (albumTitle, songTitle) => {
    setIsLoading(true);
    setSelectedSongAnalysis(null);
    setCurrentVideoId(null);
    setError('');

    axios.get(`${API_URL}/api/analyze/${albumTitle}/${songTitle}`)
      .then(response => {
        setSelectedSongAnalysis(response.data);
        setCurrentVideoId(response.data.videoId);
      })
      .catch(error => {
        console.error("Hubo un error al analizar la canción:", error);
        setError('No se pudo analizar la canción.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const playerOptions = {
    height: '300', // Altura del reproductor
    width: '100%',  // Hará que ocupe todo el ancho de su contenedor
    playerVars: {
      autoplay: 1, // Reproduce automáticamente al cargar
    },
  };

  return (
    <div className="App">
      <h1>Analizador de Sentimientos de Letras de Linkin Park</h1>

      <div className="albums-container">
        {albums.map(album => (
          <div key={album.albumTitle} className="album-card">
          <img src={album.cover} alt={album.albumTitle} className="album-cover" />
          <div className="song-list">  {/* Esta es la capa que aparece al hacer hover */}
            <h3 className="album-title-hover">{album.albumTitle}</h3> {/* Un h3 para el título en hover */}
            <p className="album-year-hover">{album.year}</p>
            {album.songs.map(song => (
              <li key={song.title} className="song-item" onClick={() => handleSongClick(album.albumTitle, song.title)}>
                {song.title}
              </li>
            ))}
          </div>
        </div>
        ))}
      </div>

      {(isLoading || selectedSongAnalysis) && (
      <div className="results-section">
        
        {/* Los mensajes de carga y error van aquí dentro */}
        {isLoading && <p>Analizando y cargando canción...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* El reproductor */}
        {currentVideoId && (
          <div className="player-container">
            <YouTube videoId={currentVideoId} opts={playerOptions} />
          </div>
        )}
        {selectedSongAnalysis && (
          <div className="analysis-result">
            <h2>Análisis de: "{selectedSongAnalysis.song}"</h2>
            <div className="chart-container">
              <AnalysisChart sentiment={selectedSongAnalysis.sentiment} />
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
}

export default App;