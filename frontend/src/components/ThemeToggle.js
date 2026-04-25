import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { theme, selectTheme } = useTheme();
  
    // Solo Hybrid Theory y Meteora
    const eras = [
      { id: 'hybrid-theory', name: 'HYBRID THEORY', icon: '👤' },
      { id: 'meteora', name: 'METEORA', icon: '🎨' }
    ];

    const handleNextEra = () => {
      const currentIndex = eras.findIndex(e => e.id === theme);
      const nextIndex = (currentIndex + 1) % eras.length;
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