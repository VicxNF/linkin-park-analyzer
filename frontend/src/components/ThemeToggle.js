import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
  
    return (
      <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Cambiar tema">
        <span className="toggle-knob">
          {theme === 'light' ? '☀️' : '🌙'}
        </span>
      </button>
    );
  };
  
  export default ThemeToggle;