import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Divider, CircularProgress, useTheme
} from '@mui/material';
import { 
  WarningAmber, 
  BarChart, 
  Lightbulb, 
  CloudQueue, 
  FileDownload, 
  WbSunny, 
  WaterDrop, 
  Air, 
  Grain, 
  Thunderstorm, 
  Cloud,
  Agriculture
} from '@mui/icons-material';

const MeteoPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState([]);

  // Fonction pour générer les 3 prochains jours
  const generateNextThreeDays = () => {
    const days = [];
    const today = new Date();
    
    // Noms des jours et mois en malgache
    const malagasyDays = ['Alahady', 'Alatsinainy', 'Talata', 'Alarobia', 'alakamisy', 'Zoma', 'Asabotsy'];
    const malagasyMonths = ['Janoary', 'Febroary', 'Martsa', 'Aprily', 'Mey', 'Jona', 'Jolay', 'Aogositra', 'Septambra', 'Oktobra', 'Novambra', 'Desambra'];

    for (let i = 1; i <= 3; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      
      const dayName = malagasyDays[nextDate.getDay()];
      const dayNum = nextDate.getDate();
      const monthName = malagasyMonths[nextDate.getMonth()];
      
      const capitalizedDate = `${dayName} ${dayNum} ${monthName}`;
      
      const minTemp = Math.floor(Math.random() * 5) + 18;
      const maxTemp = Math.floor(Math.random() * 5) + 22;
      
      // Conditions météo avec Icônes MUI au lieu des emojis
      const conditions = [
        { icon: <CloudQueue />, label: 'Misy rahona' },
        { icon: <WbSunny />, label: 'Mazava' },
        { icon: <Grain />, label: 'Orana' },
        { icon: <Thunderstorm />, label: 'Kotroka' },
        { icon: <Cloud />, label: 'Manerika' }
      ];
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      
      days.push({
        id: i,
        date: capitalizedDate,
        dayShort: dayName.substring(0, 3),
        temperature: `${minTemp}° - ${maxTemp}°C`,
        condition: condition.label,
        icon: condition.icon,
        humidity: `${Math.floor(Math.random() * 30) + 60}%`,
        wind: `${Math.floor(Math.random() * 10) + 5} km/h`
      });
    }
    
    return days;
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setForecast(generateNextThreeDays());
      setLoading(false);
    }, 500);
  }, []);

  const dynamicCardStyle = {
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 4px 20px rgba(0,0,0,0.05)',
    border: `1px solid ${theme.palette.divider}`,
    transition: '0.3s'
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', p: { xs: 2, md: 4 }, color: 'text.primary' }}>
      
      {/* HEADER */}
      <Box mb={4}>
        <Typography variant="h3" fontWeight="900" sx={{ color: 'primary.main', letterSpacing: '-1px' }}>
          Toetr'andro
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Fanaraha-maso ny tanimboly ao Antananarivo
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* KARATRA LEHIBE */}
        <Grid item xs={12} md={8}>
          <Card sx={{ ...dynamicCardStyle, p: 2, background: theme.palette.mode === 'dark' ? 'linear-gradient(145deg, #1e1e1e 0%, #121212 100%)' : '#fff' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">Androany</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                    <WbSunny sx={{ fontSize: 40, color: 'orange' }} />
                    <Typography variant="h2" fontWeight="900" color="primary">25°C</Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <WaterDrop sx={{ fontSize: 16, color: 'info.main' }} />
                    <Typography variant="caption" color="text.secondary">Hamandoana</Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold">70%</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Air sx={{ fontSize: 16, color: 'grey.500' }} />
                    <Typography variant="caption" color="text.secondary">Rivotra</Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold">12 km/h</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* TOROHEVITRA */}
        <Grid item xs={12} md={4}>
          <Card sx={{ ...dynamicCardStyle, height: '100%', bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : '#f0f4f0' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main', fontWeight: 'bold' }}>
                <Lightbulb /> Torohevitra
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Typography variant="body2">• Hamarino ny fivoahan'ny rano.</Typography>
                <Typography variant="body2">• Alamino tsara ny fanondrahana.</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* VINANY 3 ANDRO */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: '800' }}>Vinavinan'ny andro manaraka</Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: 'background.paper', border: `1px solid ${theme.palette.divider}` }}>
              <Table>
                <TableHead sx={{ bgcolor: 'primary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '35%' }}>Andro</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '20%' }}>Hafanana</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '25%' }}>Toetr'andro</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '20%' }}>Fanampiny</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {forecast.map((day) => (
                    <TableRow key={day.id} hover sx={{ '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'action.hover' : 'grey.50' } }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Box sx={{ color: 'primary.main' }}>{day.icon}</Box>
                          <Box>
                            <Typography variant="subtitle1">{day.dayShort}</Typography>
                            <Typography variant="body2" color="text.secondary">{day.date}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          {day.temperature}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2">{day.condition}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" flexDirection="column" gap={0.5}>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <WaterDrop sx={{ fontSize: 14 }} />
                            <Typography variant="caption" color="text.secondary">{day.humidity}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Air sx={{ fontSize: 14 }} />
                            <Typography variant="caption" color="text.secondary">{day.wind}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>

        {/* SECTION SUPPLEMENTAIRE */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: '800' }}>Fitantanana ara-toetr'andro</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ ...dynamicCardStyle, textAlign: 'center', p: 3 }}>
                <WarningAmber sx={{ fontSize: 50, color: 'warning.main' }} />
                <Typography variant="h6" sx={{ mt: 2 }}>Fampitandremana</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Mety hisy orana mahery rahampitso. Ampiomàno ny fiarovana.
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ ...dynamicCardStyle, textAlign: 'center', p: 3 }}>
                <WaterDrop sx={{ fontSize: 50, color: 'info.main' }} />
                <Typography variant="h6" sx={{ mt: 2 }}>Rano fanondrahana</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  15-20mm mety ilaina amin'ny 48h manaraka
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ ...dynamicCardStyle, textAlign: 'center', p: 3 }}>
                <Agriculture sx={{ fontSize: 50, color: 'success.main' }} />
                <Typography variant="h6" sx={{ mt: 2 }}>Fampandrosoana</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Tsara ny fotoana hananganana ny zava-maniry ankehitriny
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MeteoPage;