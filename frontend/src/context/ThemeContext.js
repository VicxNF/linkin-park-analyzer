import React, { createContext, useState, useEffect, useContext } from 'react';
import lightBgImage from '../assets/linkinpark-claro.jpg';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const img = new Image();
    img.src = lightBgImage;
  }, []);

  useEffect(() => {
    const body = window.document.body;
    body.classList.remove('light-mode', 'dark-mode');
    body.classList.add(`${theme}-mode`);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};  