import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent,
  Switch, FormControlLabel, Button, 
  Alert, List, ListItem, ListItemText, ListItemIcon,
  Divider, Paper, Dialog,
  DialogTitle, DialogContent, DialogActions,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';

import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Save as SaveIcon,
  Backup as BackupIcon,
  Delete as DeleteIcon,
  Sync as SyncIcon,
  Storage as StorageIcon,
  VolumeUp as VolumeIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  WifiOff as WifiOffIcon,
  Wifi as WifiIcon,
  Person as PersonIcon,
  Crop as CropIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const ParametresPage = ({ darkMode, toggleDarkMode, showSnackbar }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    modeOffline: true,
    autoSauvegarde: true,
    intervalleSauvegarde: 30,
    emailNotifications: false,
    smsNotifications: true,
    audioConseils: true,
    gpsLocalisation: true,
    autoSync: false,
    intervalleSync: 60,
  });

  const [statistiques, setStatistiques] = useState({
    parcelles: 3,
    observations: 15,
    conseilsEcoutes: 8,
    espaceUtilise: '45 MB',
    derniereSauvegarde: '15-01-2024 14:30',
    derniereSynchronisation: '14-01-2024 10:15',
  });

  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('tantsaha_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem('tantsaha_settings', JSON.stringify(settings));
    showSnackbar('Voatahiry soa aman-tsara ny fandrindrana', 'success');
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      notifications: true,
      modeOffline: true,
      autoSauvegarde: true,
      intervalleSauvegarde: 30,
      emailNotifications: false,
      smsNotifications: true,
      audioConseils: true,
      gpsLocalisation: true,
      autoSync: false,
      intervalleSync: 60,
    };
    
    setSettings(defaultSettings);
    localStorage.setItem('tantsaha_settings', JSON.stringify(defaultSettings));
    showSnackbar('Naverina tamin\'ny taloha ny fandrindrana', 'info');
    setOpenResetDialog(false);
  };

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showSnackbar('Vita ny fampitoviana angona', 'success');
    }, 2000);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      {/* Lohany */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2, fontWeight: 'bold' }}>
          <SettingsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          Fandrindrana & Fikirakirana
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Amboary ny fampiasana ny rindrambaiko araka ny safidinao
        </Typography>
      </Box>

      <Alert 
        severity={settings.modeOffline ? "info" : "success"}
        icon={settings.modeOffline ? <WifiOffIcon /> : <WifiIcon />}
        sx={{ mb: 3 }}
      >
        {settings.modeOffline ? 
          "Mandeha ivelan'ny aterineto - Voatahiry ato amin'ny fitaovana ny asa" :
          "Mifandray amin'ny aterineto - Afaka mampitovy angona amin'ny server"
        }
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          
          {/* Endrika & Mpampiasa - Nesorina ny loko */}
          <Accordion defaultExpanded sx={{ mb: 2, borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PersonIcon color="primary" />
                <Typography variant="h6">Endrika & Mpampiasa</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch checked={darkMode} onChange={toggleDarkMode} color="primary" />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                        Hajia {darkMode ? 'mazava' : 'maizina'}
                      </Box>
                    }
                    sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', width: '100%', flexDirection: 'row-reverse' }}
                  />

                  <Divider sx={{ my: 1 }} />

                  <FormControlLabel
                    control={<Switch checked={settings.audioConseils} onChange={(e) => handleSettingChange('audioConseils', e.target.checked)} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <VolumeIcon />
                        Feo amin'ny torohevitra
                      </Box>
                    }
                    sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexDirection: 'row-reverse' }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Fampandrenesana */}
          <Accordion sx={{ mb: 2, borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <NotificationsIcon color="primary" />
                <Typography variant="h6">Fampandrenesana</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch checked={settings.notifications} onChange={(e) => handleSettingChange('notifications', e.target.checked)} />}
                    label="Fampandrenesana ankapobeny"
                    sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', width: '100%', flexDirection: 'row-reverse' }}
                  />
                  <FormControlLabel
                    control={<Switch checked={settings.smsNotifications} disabled={!settings.notifications} onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)} />}
                    label="Fampandrenesana amin'ny SMS"
                    sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexDirection: 'row-reverse' }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Fifandraisana */}
          <Accordion sx={{ mb: 2, borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SyncIcon color="primary" />
                <Typography variant="h6">Fifandraisana & Fampitoviana</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={<Switch checked={settings.modeOffline} onChange={(e) => handleSettingChange('modeOffline', e.target.checked)} />}
                  label="Atao lohalaharana ny ivelan'ny aterineto"
                  sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexDirection: 'row-reverse' }}
                />
              </Box>
              <Button 
                fullWidth
                variant="outlined" 
                startIcon={isSyncing ? <RefreshIcon /> : <SyncIcon />} 
                onClick={handleSyncNow}
                disabled={settings.modeOffline || isSyncing}
              >
                {isSyncing ? 'Eo am-pampitoviana...' : 'Ampitovio ny angona izao'}
              </Button>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Tsanganana ankavanana */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StorageIcon color="primary" />
              Antontan'isa
            </Typography>
            <List dense>
              <ListItem disableGutters><ListItemIcon><CropIcon /></ListItemIcon><ListItemText primary="Saha miasa" secondary={statistiques.parcelles} /></ListItem>
              <Divider />
              <ListItem disableGutters><ListItemIcon><InfoIcon /></ListItemIcon><ListItemText primary="Fanaraha-maso" secondary={statistiques.observations} /></ListItem>
              <Divider />
              <ListItem disableGutters><ListItemIcon><BackupIcon /></ListItemIcon><ListItemText primary="Tahiry farany" secondary={statistiques.derniereSauvegarde} /></ListItem>
            </List>
          </Paper>

          <Button 
            fullWidth 
            variant="contained" 
            size="large"
            startIcon={<SaveIcon />} 
            onClick={handleSaveSettings}
            sx={{ mb: 2, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
          >
            Tehirizo ny fanovana
          </Button>

          <Button 
            fullWidth 
            variant="text" 
            color="error" 
            startIcon={<DeleteIcon />} 
            onClick={() => setOpenResetDialog(true)}
          >
            Averina amin'ny taloha
          </Button>
        </Grid>
      </Grid>

      <Dialog open={openResetDialog} onClose={() => setOpenResetDialog(false)}>
        <DialogTitle>Hamafiso ny famerenana</DialogTitle>
        <DialogContent>
          <Typography>Tena te hamerina ny fandrindrana rehetra amin'ny taloha ve ianao?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenResetDialog(false)}>Hanafoana</Button>
          <Button onClick={handleResetSettings} color="error" variant="contained">Averina izao</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ParametresPage;