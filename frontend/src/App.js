import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AnalyzerView from './views/AnalyzerView';
import MusicHub from './views/MusicHub';

import './App.css';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <header className="main-header">
        <NavLink to="/" className="logo-link">LINKIN PARK</NavLink>
        <nav className="main-nav">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
          >
            Analizador Interactivo
          </NavLink>
          <NavLink
            to="/listen"
            className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
          >
            Centro Musical
          </NavLink>
        </nav>
      </header>

      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <AnalyzerView />
                </motion.div>
              }
            />
            <Route
              path="/listen"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <MusicHub />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;