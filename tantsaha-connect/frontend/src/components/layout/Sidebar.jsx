import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  Cloud,
  Grass,
  People,
  Book,
  Notifications,
  Lightbulb,
  Settings,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 260;

// Ny menu amin'ny teny malagasy
const menuItems = [
  { text: 'Tabilao fanehoana', icon: <Dashboard />, path: '/' },
  { text: 'Toetr\'andro', icon: <Cloud />, path: '/meteo' },
  { text: 'Saha sy Parsele', icon: <Grass />, path: '/parcelles' },
  { text: 'Tantsaha', icon: <People />, path: '/paysans' },
  { text: 'Diary', icon: <Book />, path: '/journal' },
  { text: 'Fanairana', icon: <Notifications />, path: '/alertes' },
  { text: 'Torohevitra', icon: <Lightbulb />, path: '/conseils' },
  { text: 'Fandrindrana', icon: <Settings />, path: '/parametres' },
];

const Sidebar = ({ mobileOpen, handleDrawerToggle, isMobile }) => {
  const location = useLocation();

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Lohan'ny sisiny (Header Sidebar) */}
      <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h5" fontWeight="bold">
          Tantsaha Connect
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          Fitantanana fambolena hendry
        </Typography>
      </Box>

      <Divider />

      {/* Ny Menu rehetra */}
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={isMobile ? handleDrawerToggle : undefined}
            sx={{
              mb: 1,
              mx: 1,
              borderRadius: 2,
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.main',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="fitaovana fitetezana"
    >
      {/* Ho an'ny finday (Mobile) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Ho an'ny solosaina (Desktop) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;