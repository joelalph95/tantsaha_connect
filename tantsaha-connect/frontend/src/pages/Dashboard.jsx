
import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Card, Paper, CircularProgress, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
 Grass as GrassIcon,
 People as PeopleIcon,
 Notifications as AlertIcon,
 Lightbulb as AdviceIcon,
} from '@mui/icons-material';

import MeteoCard from '../components/meteo/MeteoCard';
import StatsCard from '../components/dashboard/StatsCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import parcellesService from '../services/parcellesService';

const API_KEY = 'YOUR_OPENWEATHER_API_KEY';
const CITY = 'Antananarivo';

const Dashboard = () => {
 const theme = useTheme(); 
 const isDarkMode = theme.palette.mode === 'dark';

 const [meteoData, setMeteoData] = useState(null);
 const [loading, setLoading] = useState(true);
 const [stats, setStats] = useState({
  parcelles: 0,
  paysans: 5,
    alertes: 3,
    conseils: 12,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${API_KEY}&lang=mg`
      );
      const weatherJson = await weatherResponse.json();

      if (weatherResponse.ok) {
        setMeteoData({
          temperature: Math.round(weatherJson.main.temp),
          humidite: weatherJson.main.humidity,
          vent: Math.round(weatherJson.wind.speed * 3.6),
          Orana: weatherJson.weather[0].description,
          date_meteo: new Date().toLocaleDateString('mg-MG'),
          icon: weatherJson.weather[0].icon
        });
      }

      const parcelles = await parcellesService.getAllParcelles();
      setStats(prev => ({
        ...prev,
        parcelles: parcelles ? parcelles.length : 0,
      }));

    } catch (error) {
      console.error('Fahadisoana:', error);
      setMeteoData({
        temperature: 24, humidite: 60, vent: 15, 
        pluie: 'Mibaliaka ny andro', date_meteo: 'Androany', icon: '01d'
      });
    } finally {
      setLoading(false);
    }
  };

  // Ity fomba ity dia mitazona ny endriky ny bokotra Quick Action teo aloha
  const quickActionStyle = {
    textAlign: 'center',
    p: 2,
    cursor: 'pointer',
    transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: 3,
    // Miova loko ny ambadika araka ny mode (clair/dark)
    bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#fafafa',
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
    '&:hover': { 
      bgcolor: 'action.hover', 
      transform: 'translateY(-5px)',
      borderColor: theme.palette.primary.main,
      boxShadow: isDarkMode ? '0 8px 20px rgba(0,0,0,0.4)' : '0 8px 20px rgba(0,0,0,0.1)'
    },
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" bgcolor="background.default">
        <CircularProgress color="success" />
      </Box>
    );
  }

  return (
    // Nampiana ny bgcolor: 'background.default' mba hifanaraka amin'ny Settings
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      
      {/* HEADER SECTION */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: '800', color: isDarkMode ? 'white' : 'primary.main', letterSpacing: '-1px' }}>
          Tabilao Fanaraha-maso
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', opacity: 0.8 }}>
          Tonga soa! Inty ny topy maso amin'ny asanao androany ao {CITY}.
        </Typography>
      </Box>

      {/* 1. KARATRA ANTONTAN'ISA (STATS) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Saha & Parsele"
            value={stats.parcelles}
            icon={<GrassIcon />}
            color={theme.palette.success.main}
            subtitle="Parsele voasoratra"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Tantsaha"
            value={stats.paysans}
            icon={<PeopleIcon />}
            color={theme.palette.info.main}
            subtitle="Mpiara-miasa"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Fanairana"
            value={stats.alertes}
            icon={<AlertIcon />}
            color={theme.palette.warning.main}
            subtitle="Tokony hojerena"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Torohevitra"
            value={stats.conseils}
            icon={<AdviceIcon />}
            color={theme.palette.secondary.main}
            subtitle="Androany"
          />
        </Grid>
      </Grid>

      {/* 2. TOETR'ANDRO SY ASA VAO HAINGANA */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <MeteoCard meteoData={meteoData} title="Toetr'andro androany" />
        </Grid>
        <Grid item xs={12} md={4}>
          <RecentActivity />
        </Grid>
      </Grid>

      {/* 3. FIDIRANA HAINGANA (QUICK ACTIONS) */}
      <Paper
        sx={{
          p: 3,
          mt: 4,
          borderRadius: 4,
          // Loko mavitrika ho an'ny Paper
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: '700', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
          Fidirana Haingana
        </Typography>
        <Divider sx={{ mb: 3, opacity: 0.1 }} />
        <Grid container spacing={2}>
          {[
            { label: 'Hanampy Saha', icon: <GrassIcon />, color: theme.palette.success.main },
            { label: 'Hijery Fanairana', icon: <AlertIcon />, color: theme.palette.warning.main },
            { label: 'Torohevitra', icon: <AdviceIcon />, color: theme.palette.secondary.main },
            { label: 'Tantsaha', icon: <PeopleIcon />, color: theme.palette.info.main },
          ].map((action, idx) => (
            <Grid item xs={6} md={3} key={idx}>
              <Card sx={quickActionStyle}>
                <Box sx={{ color: action.color, mb: 1.5 }}>
                  {React.cloneElement(action.icon, { sx: { fontSize: 35 } })}
                </Box>
                <Typography variant="body2" fontWeight="700" color="text.primary">{action.label}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;