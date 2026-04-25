import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Ahora el tema por defecto es 'hybrid-theory'
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'hybrid-theory');

  useEffect(() => {
    const body = window.document.body;

    // Solo mantenemos estos dos temas por ahora
    const allThemeClasses = [
      'theme-hybrid-theory', 
      'theme-meteora'
    ];

    body.classList.remove(...allThemeClasses, 'light-mode', 'dark-mode');
    
    // Aplicamos siempre el prefijo theme-
    body.classList.add(`theme-${theme}`);
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const selectTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, selectTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};