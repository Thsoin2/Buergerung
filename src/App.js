import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Komponenten importieren
import Home from './components/Home';
import InteractiveMap from './components/InteractiveMap';
import FactManager from './components/FactManager';
import Quiz from './components/Quiz';
import Progress from './components/Progress';

function App() {
  // Dark Mode State
  const [darkMode, setDarkMode] = useState(false);

  // Dark Mode aus localStorage laden oder System-Präferenz verwenden
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Dark Mode speichern, wenn es sich ändert
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Dark Mode umschalten
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className={`app-container min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <header className="bg-red-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold flex items-center">
              <span className="mr-2">🇨🇭</span>
              <span>SwissCitizen Prep</span>
            </Link>
            <div className="flex items-center">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-red-700 transition-colors"
                aria-label={darkMode ? 'Zum hellen Modus wechseln' : 'Zum dunklen Modus wechseln'}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
          <nav className="bg-red-700">
            <div className="container mx-auto px-4">
              <ul className="flex overflow-x-auto py-2 space-x-4">
                <li>
                  <Link to="/" className="text-white hover:text-red-200 whitespace-nowrap">
                    <span className="mr-1">🏠</span> Home
                  </Link>
                </li>
                <li>
                  <Link to="/map" className="text-white hover:text-red-200 whitespace-nowrap">
                    <span className="mr-1">🗺️</span> Karte
                  </Link>
                </li>
                <li>
                  <Link to="/facts" className="text-white hover:text-red-200 whitespace-nowrap">
                    <span className="mr-1">📚</span> Fakten
                  </Link>
                </li>
                <li>
                  <Link to="/quiz" className="text-white hover:text-red-200 whitespace-nowrap">
                    <span className="mr-1">❓</span> Quiz
                  </Link>
                </li>
                <li>
                  <Link to="/progress" className="text-white hover:text-red-200 whitespace-nowrap">
                    <span className="mr-1">📊</span> Fortschritt
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-6 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<InteractiveMap />} />
            <Route path="/facts" element={<FactManager />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/progress" element={<Progress />} />
          </Routes>
        </main>

        <footer className={`py-4 text-center text-sm ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
          <div className="container mx-auto px-4">
            <p>© {new Date().getFullYear()} SwissCitizen Prep | Alle Rechte vorbehalten</p>
            <p className="mt-1">Entwickelt für die Vorbereitung auf das Schweizer Einbürgerungsgespräch</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
