// pages/LoginPage.js
import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Link,
  Avatar,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  LockOutlined as LockIcon,
  Visibility,
  VisibilityOff,
  EmailOutlined as EmailIcon,
} from '@mui/icons-material';

function LoginPage() {
  const navigate = useNavigate();
  
  // États du formulaire
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  // États UI
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Gestion des changements de champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (error) setError('');
  };
  
  // Toggle visibilité du mot de passe
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validation basique
    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Veuillez entrer un email valide');
      setLoading(false);
      return;
    }
    
    try {
      // Simulation d'appel API - à remplacer par votre service d'authentification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Ici, vous intégrerez votre service d'authentification réel
      // const user = await authService.login(formData.email, formData.password);
      
      // Pour l'exemple, on simule une connexion réussie
      const mockUser = {
        id: 1,
        email: formData.email,
        name: 'Utilisateur Test',
        role: 'agriculteur'
      };
      
      // Sauvegarder l'utilisateur dans localStorage ou context
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock-jwt-token');
      
      // Rediriger vers le dashboard
      navigate('/');
      
    } catch (err) {
      setError(err.message || 'Échec de la connexion. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };
  
  // Login rapide pour développement
  const handleQuickLogin = (role) => {
    const users = {
      admin: { email: 'admin@agri.com', password: 'admin123' },
      agriculteur: { email: 'agriculteur@agri.com', password: 'farmer123' },
      consultant: { email: 'consultant@agri.com', password: 'consult123' }
    };
    
    setFormData(users[role]);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Logo ou avatar */}
        <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
          <LockIcon fontSize="large" />
        </Avatar>
        
        {/* Titre */}
        <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          Connexion AgriConnect
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Accédez à votre tableau de bord agricole
        </Typography>

        {/* Formulaire */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%', 
            borderRadius: 2,
            backgroundColor: 'background.paper'
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Champ Email */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            {/* Champ Mot de passe */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            {/* Bouton de connexion */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem'
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Se connecter'
              )}
            </Button>
            
            {/* Liens d'action */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link 
                component={RouterLink} 
                to="/register" 
                variant="body2"
                sx={{ display: 'block', mb: 1 }}
              >
                Pas encore de compte ? Inscrivez-vous
              </Link>
              
              <Link 
                component={RouterLink} 
                to="/forgot-password" 
                variant="body2"
                sx={{ color: 'text.secondary' }}
              >
                Mot de passe oublié ?
              </Link>
            </Box>
          </Box>
        </Paper>
        
        {/* Section de développement - à supprimer en production */}
        {process.env.NODE_ENV === 'development' && (
          <Box sx={{ mt: 4, width: '100%' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
              Connexion rapide (développement)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => handleQuickLogin('admin')}
              >
                Admin
              </Button>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => handleQuickLogin('agriculteur')}
              >
                Agriculteur
              </Button>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => handleQuickLogin('consultant')}
              >
                Consultant
              </Button>
            </Box>
          </Box>
        )}
        
        {/* Footer */}
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} AgriConnect. Tous droits réservés.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Version 1.0.0
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;