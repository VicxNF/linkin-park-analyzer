// src/App.js - El nuevo enrutador principal

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AnalyzerView from './views/AnalyzerView'; // Importamos el analizador
import MusicHub from './views/MusicHub'; // Importamos el nuevo hub musical
import './App.css'; // El CSS principal de la App

function App() {
  return (
    <Router>
      <div className="App">
        <header className="main-header">
          <Link to="/" className="logo-link">LINKIN PARK</Link>
          <nav className="main-nav">
            <Link to="/">Analizador Interactivo</Link>
            <Link to="/listen">Centro Musical</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<AnalyzerView />} />
            <Route path="/listen" element={<MusicHub />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;