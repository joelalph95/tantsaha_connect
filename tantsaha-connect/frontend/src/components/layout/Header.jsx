import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Badge, 
  Avatar, 
  Box, 
  Menu, 
  MenuItem,
  Chip,
  LinearProgress,
  useTheme
} from '@mui/material';
import { 
  Notifications, 
  Person, 
  WifiOff,
  Cloud,
  Warning,
  Info
} from '@mui/icons-material';
import authService from '../../services/authService';

const Header = ({ showSnackbar, isOffline = false, hasUrgentAlerts = true }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleNotificationsMenu = (event) => setNotificationsAnchorEl(event.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
    setNotificationsAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  // Notifications basées sur les scénarios du rapport
  const notifications = [
    { 
      id: 1, 
      text: 'Alerte cyclonique dans votre région', 
      time: 'Il y a 2 heures', 
      read: false,
      type: 'urgent',
      icon: <Warning color="error" />
    },
    { 
      id: 2, 
      text: 'Période favorable pour semer du riz', 
      time: 'Il y a 5 heures', 
      read: true,
      type: 'warning',
      icon: <Info color="warning" />
    },
    { 
      id: 3, 
      text: 'Pluie prévue demain, attendre pour semer', 
      time: 'Hier', 
      read: true,
      type: 'info',
      icon: <Cloud color="info" />
    },
    { 
      id: 4, 
      text: 'Marché agricole à Ambatondrazaka demain', 
      time: 'Il y a 2 jours', 
      read: true,
      type: 'info',
      icon: <Info color="success" />
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Date formatée simplement pour les agriculteurs
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short',
    year: 'numeric'
  });
  
  // Saison agricole basique (simplifiée)
  const getAgriculturalSeason = () => {
    const month = currentDate.getMonth() + 1;
    if (month >= 11 || month <= 3) return 'Saison des pluies';
    if (month >= 4 && month <= 6) return 'Saison de récolte';
    return 'Saison sèche';
  };

  // Couleurs adaptées au mode sombre
  const primaryColor = isDarkMode ? '#81C784' : '#2E7D32'; // Vert plus clair en mode sombre
  const backgroundColor = isDarkMode ? '#1E1E1E' : 'white';
  const borderColor = isDarkMode ? '#333' : '#e0e0e0';
  const cardBackground = isDarkMode ? '#2D2D2D' : '#f5f5f5';
  const textColor = isDarkMode ? '#E0E0E0' : 'text.primary';
  const secondaryTextColor = isDarkMode ? '#B0B0B0' : 'text.secondary';

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={isDarkMode ? 4 : 1}
      sx={{
        width: { md: 'calc(100% - 260px)' },
        ml: { md: '260px' },
        bgcolor: backgroundColor,
        color: textColor,
        boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: `1px solid ${borderColor}`,
        transition: 'all 0.3s ease',
      }}
    >
      <Toolbar sx={{ minHeight: '64px', px: { xs: 2, md: 3 } }}>
        {/* Section date et saison */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ 
            fontSize: { xs: '1rem', md: '1.25rem' },
            fontWeight: 'bold',
            color: primaryColor
          }}>
            {dateString}
          </Typography>
          <Typography variant="caption" sx={{ 
            color: secondaryTextColor,
            display: { xs: 'none', sm: 'block' }
          }}>
            {getAgriculturalSeason()} • {isOffline ? 'Mode hors ligne actif' : 'Données synchronisées'}
          </Typography>
        </Box>

        {/* Indicateur de statut pour desktop */}
        {!isOffline ? (
          <Chip 
            label="En ligne" 
            size="small" 
            color="success" 
            variant={isDarkMode ? "outlined" : "filled"}
            sx={{ 
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              borderColor: isDarkMode ? '#4CAF50' : undefined
            }}
          />
        ) : (
          <Chip 
            icon={<WifiOff />}
            label="Hors ligne" 
            size="small" 
            color="error" 
            variant={isDarkMode ? "outlined" : "filled"}
            sx={{ 
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              borderColor: isDarkMode ? '#F44336' : undefined
            }}
          />
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Bouton Notifications simplifié */}
          <IconButton 
            color="inherit" 
            onClick={handleNotificationsMenu} 
            aria-label="notifications"
            sx={{
              bgcolor: hasUrgentAlerts 
                ? (isDarkMode ? '#4a1f1f' : '#ffebee') 
                : 'transparent',
              '&:hover': { 
                bgcolor: hasUrgentAlerts 
                  ? (isDarkMode ? '#5a2f2f' : '#ffcdd2') 
                  : (isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)') 
              }
            }}
          >
            <Badge 
              badgeContent={unreadCount} 
              color="error"
              max={9}
            >
              <Notifications />
            </Badge>
          </IconButton>

          {/* Menu Notifications adapté */}
          <Menu
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleClose}
            PaperProps={{ 
              sx: { 
                width: { xs: 280, md: 350 },
                maxHeight: 400,
                mt: 1,
                bgcolor: isDarkMode ? '#2D2D2D' : 'white',
                color: textColor,
                '& .MuiMenuItem-root': {
                  minHeight: 'auto',
                  py: 1.5
                }
              } 
            }}
          >
            <MenuItem disabled sx={{ 
              fontWeight: 'bold',
              bgcolor: isDarkMode ? '#3D3D3D' : '#f5f5f5',
              color: primaryColor
            }}>
              Alertes ({unreadCount} non lues)
            </MenuItem>
            
            {notifications.map((n) => (
              <MenuItem 
                key={n.id} 
                onClick={handleClose}
                sx={{
                  borderLeft: n.type === 'urgent' ? '4px solid #f44336' : 
                             n.type === 'warning' ? '4px solid #ff9800' : '4px solid #4caf50',
                  bgcolor: !n.read 
                    ? (isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa') 
                    : 'transparent',
                  opacity: n.read ? 0.7 : 1,
                  '&:hover': {
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                  <Box sx={{ mr: 1.5, mt: 0.5 }}>
                    {n.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ 
                      fontWeight: !n.read ? '600' : '400',
                      color: n.type === 'urgent' 
                        ? '#f44336' 
                        : (isDarkMode ? '#E0E0E0' : 'text.primary')
                    }}>
                      {n.text}
                    </Typography>
                    <Typography variant="caption" color={secondaryTextColor}>
                      {n.time}
                    </Typography>
                  </Box>
                  {!n.read && (
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      bgcolor: '#f44336', 
                      borderRadius: '50%',
                      ml: 1
                    }} />
                  )}
                </Box>
              </MenuItem>
            ))}
            
            <MenuItem disabled sx={{ 
              justifyContent: 'center',
              color: primaryColor,
              fontSize: '0.75rem',
              bgcolor: isDarkMode ? '#3D3D3D' : 'transparent'
            }}>
              <Box component="span" sx={{ mr: 1 }}>🔄</Box>
              Synchronisé il y a 2h
            </MenuItem>
          </Menu>

          
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{ 
              sx: { 
                width: 200,
                mt: 1,
                bgcolor: isDarkMode ? '#2D2D2D' : 'white',
                color: textColor,
                '& .MuiDivider-root': {
                  borderColor: borderColor
                }
              } 
            }}
          >
            <MenuItem disabled sx={{ 
              flexDirection: 'column', 
              alignItems: 'flex-start',
              bgcolor: isDarkMode ? '#3D3D3D' : '#f5f5f5'
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Rakoto Jean
              </Typography>
              <Typography variant="caption" color={secondaryTextColor}>
                Agriculteur - Analamanga
              </Typography>
            </MenuItem>
            
            <MenuItem 
              onClick={handleClose} 
              sx={{ 
                fontSize: '0.9rem',
                '&:hover': {
                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)'
                }
              }}
            >
              <Box component="span" sx={{ mr: 1.5 }}>👤</Box>
              Mon Profil
            </MenuItem>
            <MenuItem 
              onClick={handleClose} 
              sx={{ 
                fontSize: '0.9rem',
                '&:hover': {
                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)'
                }
              }}
            >
              <Box component="span" sx={{ mr: 1.5 }}>⚙️</Box>
              Paramètres
            </MenuItem>
            
            <Box sx={{ 
              px: 2, 
              py: 1, 
              borderTop: `1px solid ${borderColor}`,
              borderBottom: `1px solid ${borderColor}`
            }}>
              <Typography variant="caption" color={secondaryTextColor} sx={{ display: 'block', mb: 0.5 }}>
                Stockage utilisé
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={65} 
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  mb: 1,
                  bgcolor: isDarkMode ? '#555' : '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: primaryColor
                  }
                }} 
              />
              <Typography variant="caption" color={secondaryTextColor}>
                8GB / 12GB • 65%
              </Typography>
            </Box>
            
            <MenuItem 
              onClick={handleLogout} 
              sx={{ 
                fontSize: '0.9rem',
                color: '#f44336',
                borderTop: `1px solid ${borderColor}`,
                mt: 1,
                '&:hover': {
                  bgcolor: isDarkMode ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.08)'
                }
              }}
            >
              <Box component="span" sx={{ mr: 1.5 }}>🚪</Box>
              Déconnexion
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;