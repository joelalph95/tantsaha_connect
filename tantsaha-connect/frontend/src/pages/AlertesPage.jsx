import React, { useState } from 'react';
import {
  Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText,
  Chip, Alert as MuiAlert, Button, Divider, Grid, IconButton,
  Tooltip, Card, CardContent, useTheme, Zoom
} from '@mui/material';
import {
  Warning as WarningIcon,
  NotificationsActive as NotificationsIcon,
  Cloud as RainIcon,
  AcUnit as FrostIcon,
  BugReport as PestIcon,
  Whatshot as DroughtIcon,
  CheckCircle as SeenIcon,
  Sync as SyncIcon,
  Download as DownloadIcon,
  Air as WindIcon,
} from '@mui/icons-material';

const AlertesPage = () => {
  const theme = useTheme();
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter] = useState('Toutes');
  
  const [alertes, setAlertes] = useState([
    { id: 1, type: 'Orana mivatravatra', description: 'Hisy orana be ao anatin\'ny 24 ora. Tandremo ny tondra-drano.', date: '2026-01-10', niveau: 'Élevé', icon: 'rain', vu: false },
    { id: 2, type: 'Bibikely mpanimba', description: 'Misy valala sy kankana hita amin\'ny faritra misy anao.', date: '2026-01-09', niveau: 'Moyen', icon: 'pest', vu: true },
    { id: 3, type: 'Haintany', description: 'Tsy hisy orana mandritra ny herinandro. Ampiasao ny fitahirizan-drano.', date: '2026-01-08', niveau: 'Moyen', icon: 'drought', vu: false },
    { id: 4, type: 'Rivotra mahery', description: 'Misy rivotra mifofofofo rahampitso. Arovy ny zana-kazo.', date: '2026-01-07', niveau: 'Élevé', icon: 'wind', vu: true },
  ]);

  const getIcon = (iconName, color) => {
    const style = { fontSize: 28, color: color };
    switch (iconName) {
      case 'rain': return <RainIcon sx={style} />;
      case 'pest': return <PestIcon sx={style} />;
      case 'drought': return <DroughtIcon sx={style} />;
      case 'wind': return <WindIcon sx={style} />;
      case 'frost': return <FrostIcon sx={style} />;
      default: return <WarningIcon sx={style} />;
    }
  };

  const getColor = (niveau) => {
    switch (niveau) {
      case 'Élevé': return theme.palette.error.main;
      case 'Moyen': return theme.palette.warning.main;
      case 'Faible': return theme.palette.info.main;
      default: return theme.palette.text.secondary;
    }
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
    }, 1500);
  };

  const filteredAlertes = alertes.filter(alert => {
    if (filter === 'Toutes') return true;
    if (filter === 'Non vues') return !alert.vu;
    if (filter === 'Élevé') return alert.niveau === 'Élevé';
    return true;
  });

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, margin: '0 auto' }}>
      
      {/* 1. HEADER SY ACTION BUTTONS */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 2, color: 'primary.main' }}>
            <NotificationsIcon sx={{ fontSize: 40 }} /> Fanairana sy Loza
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ireo loza mitatao sy fanairana ho an'ny fambolenao
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ borderRadius: 3, textTransform: 'none' }}>
            Hampidina
          </Button>
          <Button 
            variant="contained" 
            startIcon={<SyncIcon className={syncing ? 'rotate-animation' : ''} />} 
            onClick={handleSync}
            disabled={syncing}
            sx={{ borderRadius: 3, textTransform: 'none', px: 3 }}
          >
            {syncing ? 'Mampifandray...' : 'Havaozina'}
          </Button>
        </Box>
      </Box>

      {/* 2. DASHBOARD STATUS (MINI STATS) */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Totaliny', val: alertes.length, color: 'primary.main', bg: 'rgba(25, 118, 210, 0.1)' },
          { label: 'Tsy mbola hita', val: alertes.filter(a => !a.vu).length, color: 'warning.main', bg: 'rgba(237, 108, 2, 0.1)' },
          { label: 'Maika be', val: alertes.filter(a => a.niveau === 'Élevé').length, color: 'error.main', bg: 'rgba(211, 47, 47, 0.1)' },
        ].map((stat, i) => (
          <Grid item xs={4} key={i}>
            <Card sx={{ borderRadius: 4, bgcolor: stat.bg, border: '1px solid', borderColor: stat.color, boxShadow: 'none' }}>
              <CardContent sx={{ textAlign: 'center', py: '16px !important' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: stat.color }}>{stat.val}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 600, color: stat.color, textTransform: 'uppercase' }}>{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 3. FILTERS AREA */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ fontWeight: 700, mr: 1 }}>Sivanina:</Typography>
        {['Toutes', 'Non vues', 'Élevé', 'Moyen'].map((f) => (
          <Chip
            key={f}
            label={f === 'Toutes' ? 'Rehetra' : f === 'Non vues' ? 'Tsy mbola hita' : f}
            onClick={() => setFilter(f)}
            color={filter === f ? 'primary' : 'default'}
            variant={filter === f ? 'filled' : 'outlined'}
            sx={{ borderRadius: 2, fontWeight: 600, cursor: 'pointer' }}
          />
        ))}
      </Box>

      {/* 4. LIST OF ALERTS */}
      <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredAlertes.map((alerte) => (
            <Zoom in={true} key={alerte.id}>
              <Card 
                sx={{ 
                  borderRadius: 4,
                  borderLeft: `6px solid ${getColor(alerte.niveau)}`,
                  transition: '0.3s',
                  '&:hover': { transform: 'translateX(5px)', boxShadow: theme.shadows[4] },
                  bgcolor: alerte.vu ? 'background.paper' : 'rgba(255, 152, 0, 0.03)'
                }}
              >
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    !alerte.vu && (
                      <Tooltip title="Marihina fa hita">
                        <IconButton 
                          onClick={() => setAlertes(prev => prev.map(a => a.id === alerte.id ? {...a, vu: true} : a))}
                          sx={{ bgcolor: 'success.light', color: 'white', '&:hover': { bgcolor: 'success.main' } }}
                        >
                          <SeenIcon />
                        </IconButton>
                      </Tooltip>
                    )
                  }
                >
                  <ListItemIcon sx={{ mt: 1 }}>
                    {getIcon(alerte.icon, getColor(alerte.niveau))}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                          {alerte.type}
                        </Typography>
                        {!alerte.vu && <Chip label="Vaovao" size="small" color="warning" sx={{ height: 20, fontSize: 10, fontWeight: 900 }} />}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                          {alerte.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            📅 {alerte.date}
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: getColor(alerte.niveau) }}>
                            ● Ambaratonga: {alerte.niveau}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              </Card>
            </Zoom>
          ))}
        </List>
      </Paper>

      {/* CSS for Rotation */}
      <style>
        {`
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .rotate-animation {
            animation: rotate 1s linear infinite;
          }
        `}
      </style>
    </Box>
  );
};

export default AlertesPage;