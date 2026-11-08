import React from 'react';
import {
  Paper,
  Grid,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import {
  Grass,
  Park,
  LocalFlorist,
  Spa,
} from '@mui/icons-material';
import { CULTURES } from '../../utils/constants';

const ParcelleStats = () => {
  const stats = {
    totalSuperficie: 12.5,
    parcelleMoyenne: 2.1,
    culturesPrincipales: [
      { nom: 'Riz', superficie: 4.2, pourcentage: 34 },
      { nom: 'Manioc', superficie: 3.8, pourcentage: 30 },
      { nom: 'Maïs', superficie: 2.5, pourcentage: 20 },
      { nom: 'Autres', superficie: 2.0, pourcentage: 16 },
    ],
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        📊 Statistiques des Parcelles
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Box textAlign="center">
            <Grass sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
            <Typography variant="h5">{stats.totalSuperficie} ha</Typography>
            <Typography variant="body2" color="text.secondary">
              Superficie totale
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={3}>
          <Box textAlign="center">
            <Park sx={{ fontSize: 40, color: '#2196F3', mb: 1 }} />
            <Typography variant="h5">{stats.parcelleMoyenne} ha</Typography>
            <Typography variant="body2" color="text.secondary">
              Par parcelle moyenne
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={3}>
          <Box textAlign="center">
            <LocalFlorist sx={{ fontSize: 40, color: '#9C27B0', mb: 1 }} />
            <Typography variant="h5">4</Typography>
            <Typography variant="body2" color="text.secondary">
              Types de cultures
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={3}>
          <Box textAlign="center">
            <Spa sx={{ fontSize: 40, color: '#FF9800', mb: 1 }} />
            <Typography variant="h5">6</Typography>
            <Typography variant="body2" color="text.secondary">
              Parcelles actives
            </Typography>
          </Box>
        </Grid>

        {/* Répartition des cultures */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Répartition des cultures
          </Typography>
          {stats.culturesPrincipales.map((culture, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2">{culture.nom}</Typography>
                <Typography variant="body2">
                  {culture.superficie} ha ({culture.pourcentage}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={culture.pourcentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: index === 0 ? '#4CAF50' : 
                            index === 1 ? '#2196F3' : 
                            index === 2 ? '#9C27B0' : '#FF9800'
                  }
                }}
              />
            </Box>
          ))}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ParcelleStats;