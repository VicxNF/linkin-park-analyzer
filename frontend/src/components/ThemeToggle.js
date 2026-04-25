import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { theme, selectTheme } = useTheme();
  
    // Solo Hybrid Theory y Meteora
    const eras = [
      { id: 'hybrid-theory', name: 'HYBRID THEORY', cdImg: '/cds/hybrid-theory-cd.jpg' },
      { id: 'meteora', name: 'METEORA', cdImg: '/cds/meteora-cd.jpg' }, // Placeholder
      { id: 'minutes-to-midnight', name: 'MINUTES TO MIDNIGHT', cdImg: '/cds/mtm-cd.png' } // Placeholder
    ];

    const handleNextEra = () => {
      const currentIndex = eras.findIndex(e => e.id === theme);
      const nextIndex = (currentIndex + 1) % eras.length;
      selectTheme(eras[nextIndex].id);
    };

    const currentEra = eras.find(e => e.id === theme) || eras[0];
  
    return (
      <div className="cd-selector-container" onClick={handleNextEra}>
        <div className="cd-player-base">
          <div className={`cd-disc ${theme}-active`}>
            <img src={currentEra.cdImg} alt="Disco Linkin Park" className="cd-img" />
            {/* El agujero central del CD */}
            <div className="cd-center-hole"></div>
            {/* Reflejo de luz para que parezca plástico */}
            <div className="cd-shine"></div>
          </div>
        </div>
      </div>
    );
};

export default ThemeToggle;