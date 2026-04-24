import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Iniciamos con 'dark' (que será nuestro From Zero) o lo que esté guardado
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const body = window.document.body;
    // Limpiamos clases viejas
    body.classList.remove('light-mode', 'dark-mode', 'theme-hybrid-theory');
    
    // Si el tema es 'hybrid-theory', añadimos su clase específica
    // Si es 'dark' o 'light', mantenemos la compatibilidad inicial
    if (theme === 'hybrid-theory') {
      body.classList.add('theme-hybrid-theory');
    } else {
      body.classList.add(`${theme}-mode`);
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Esta función ahora nos permitirá cambiar a una era específica
  const selectTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, selectTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};