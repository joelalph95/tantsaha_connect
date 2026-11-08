import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
} from '@mui/material';
import {
  Thermostat as ThermostatIcon,
  WaterDrop as WaterDropIcon,
  Air as AirIcon,
  Cloud as CloudIcon,
} from '@mui/icons-material';

const MeteoCard = ({ meteoData }) => {
  const getPluieColor = (pluie) => {
    switch (pluie?.toLowerCase()) {
      case 'forte':
        return 'error';
      case 'moyenne':
        return 'warning';
      case 'faible':
        return 'success';
      default:
        return 'default';
    }
  };

  const getTemperatureColor = (temp) => {
    if (temp > 30) return 'error';
    if (temp < 15) return 'info';
    return 'success';
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h5" component="div">
            🌤️ tohentsy ny andro 
          </Typography>
          <Chip 
            label={meteoData.date_meteo || 'Aujourd\'hui'} 
            color="primary" 
            size="small" 
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <ThermostatIcon color={getTemperatureColor(meteoData.temperature)} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  hafanana
                </Typography>
                <Typography variant="h4">
                  {meteoData.temperature}°C
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <WaterDropIcon color="info" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  hamadona
                </Typography>
                <Typography variant="h4">
                  {meteoData.humidite}%
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <CloudIcon color={getPluieColor(meteoData.pluie)} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Précipitations
                </Typography>
                <Typography variant="h6">
                  {meteoData.pluie || 'Faible'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <AirIcon color="action" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Rivotra
                </Typography>
                <Typography variant="h6">
                  {meteoData.vent || '10 km/h'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box mt={3} p={2} bgcolor="grey.50" borderRadius={2}>
          <Typography variant="body2" color="text.secondary">
            <strong>Conseil du jour :</strong> {getMeteoAdvice(meteoData)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const getMeteoAdvice = (meteo) => {
  if (meteo.pluie?.toLowerCase().includes('forte')) {
    return 'Évitez les travaux des champs aujourd\'hui en raison des fortes pluies.';
  }
  if (meteo.temperature > 30) {
    return 'Arrosez vos cultures tôt le matin ou en fin d\'après-midi.';
  }
  return 'Conditions météo favorables pour les travaux agricoles.';
};

export default MeteoCard;