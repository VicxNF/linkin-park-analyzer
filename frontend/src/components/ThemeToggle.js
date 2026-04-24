import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
    // CAMBIO AQUÍ: Usamos 'selectTheme' que es como lo definiste en el Context
    const { theme, selectTheme } = useTheme(); 
  
    const eras = [
      { id: 'dark', name: 'FROM ZERO', icon: '🌌' },
      { id: 'hybrid-theory', name: 'HYBRID THEORY', icon: '👤' }
    ];

    const handleNextEra = () => {
      const currentIndex = eras.findIndex(e => e.id === theme);
      const nextIndex = (currentIndex + 1) % eras.length;
      // CAMBIO AQUÍ: Llamamos a 'selectTheme'
      selectTheme(eras[nextIndex].id); 
    };

    const currentEra = eras.find(e => e.id === theme) || eras[0];
  
    return (
      <div className="era-selector-wrapper">
        <span className="era-name-label">{currentEra.name}</span>
        <button onClick={handleNextEra} className={`theme-toggle-btn era-${theme}`} aria-label="Cambiar Era">
          <div className="toggle-knob">
            {currentEra.icon}
          </div>
        </button>
      </div>
    );
};
  
export default ThemeToggle;