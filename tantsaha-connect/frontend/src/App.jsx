import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme} from '@mui/material';

import PrivateRoute from './components/auth/PrivateRoute';
import LoginPage from './pages/LoginPage';
import Navigation from './components/layout/Navigation';
import Header from './components/layout/Header';

import Dashboard from './pages/Dashboard';
import MeteoPage from './pages/MeteoPage';
import ParcellesPage from './pages/ParcellesPage';
import PaysansPage from './pages/PaysansPage';
import JournalPage from './pages/JournalPage';
import ConseilsPage from './pages/ConseilsPage';
import AlertesPage from './pages/AlertesPage';
import ParametresPage from './pages/ParametresPage';
import RegisterPage from './pages/RegisterPage';

import authService from './services/authService';

function App() {
  // 🔹 Dark mode initialisé depuis localStorage
  const [darkMode, setDarkMode] = useState(
    () => JSON.parse(localStorage.getItem('darkMode')) ?? false
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: { main: '#2E7D32', light: '#4CAF50', dark: '#1B5E20' },
          secondary: { main: '#FF9800' },
          background: {
            default: darkMode ? '#121212' : '#f5f5f5',
            paper: darkMode ? '#1e1e1e' : '#fafafa',
          },
        },
        shape: { borderRadius: 8 },
      }),
    [darkMode]
  );

  // 🔹 Toggle dark mode avec sauvegarde
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      localStorage.setItem('darkMode', JSON.stringify(!prev));
      return !prev;
    });
  };

  // 🔹 Simple snackbar de test
  const showSnackbar = (msg) => alert(msg);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          {/* Navigation latérale */}
          <Navigation />

          {/* Header */}
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

          {/* Contenu principal */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              mt: { xs: 7, md: 8 }, // marge top pour header
              minHeight: '100vh',
              width: { xs: '100%', md: 'calc(100% - 260px)' },
              transition: 'width 0.3s',
            }}
          >
            <Routes>
              {/* Routes principales */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/meteo" element={<MeteoPage />} />
              <Route path="/parcelles" element={<ParcellesPage />} />
              <Route path="/paysans" element={<PaysansPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/conseils" element={<ConseilsPage />} />
              <Route path="/alertes" element={<AlertesPage />} />

              {/* Paramètres avec darkMode */}
              <Route
                path="/parametres"
                element={
                  <ParametresPage
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                    showSnackbar={showSnackbar}
                  />
                }
              />

              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Redirection pour toute route inconnue */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
