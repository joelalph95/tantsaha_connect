import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  Divider,
  Snackbar,
  Alert,
  Fab,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Agriculture as AgricultureIcon,
  BugReport as BugIcon,
  Spa as PlantIcon,
  Water as WaterIcon,
  FilterList as FilterIcon,
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

const JournalPage = () => {
  const [observations, setObservations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedObservation, setSelectedObservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [filters, setFilters] = useState({
    type: 'rehetra',
    parcelle: 'rehetra',
    mois: 'rehetra',
  });

  const [formData, setFormData] = useState({
    titre: '',
    parcelle: '',
    type: 'observation',
    description: '',
    date: new Date().toISOString().split('T')[0],
    actions: '',
    produits_affectes: '',
    gravite: 'ambany',
  });

  // Karazana fanaraha-maso (Types d'observations)
  const typesObservation = [
    { value: 'observation', label: 'Fanaraha-maso ankapobeny', icon: <AgricultureIcon />, color: 'primary' },
    { value: 'insectes', label: 'Bibikely / Kiky', icon: <BugIcon />, color: 'error' },
    { value: 'maladies', label: 'Aretin’ny voly', icon: <PlantIcon />, color: 'warning' },
    { value: 'sol', label: 'Toetran’ny tany', icon: <WaterIcon />, color: 'info' },
    { value: 'meteo', label: 'Vokatry ny toetrandro', icon: <CalendarIcon />, color: 'success' },
  ];

  // Angon-drakitra andrana ho an'ny tanimboly (Parcelles)
  const parcelles = [
    { id: 1, nom: 'Tanimbary Avaratra', culture: 'Vary' },
    { id: 2, nom: 'Sahan-katsaka', culture: 'Katsaka' },
    { id: 3, nom: 'Sahan-anana', culture: 'Legioma isan-karazany' },
  ];

  useEffect(() => {
    fetchObservations();
  }, []);

  const fetchObservations = () => {
    setLoading(true);
    try {
      const donneesSauvegardees = localStorage.getItem('tantsaha_journal');
      
      if (donneesSauvegardees) {
        setObservations(JSON.parse(donneesSauvegardees));
      } else {
        // Angon-drakitra santionany
        const donneesInitiales = [
          {
            id_observation: 1,
            titre: 'Misy fositra ny vary',
            parcelle: 'Tanimbary Avaratra',
            type: 'insectes',
            description: 'Hita fa misy fositra ny vary any amin’ny ilany avaratra atsinanana. Manodidina ny 10% ny vokatry ny fahasimbana.',
            date_observation: '2024-10-15',
            actions: 'Hamafazana fanafody natoraly (neem)',
            produits_affectes: 'Vary',
            gravite: 'antonony',
            photo: null,
          },
          {
            id_observation: 2,
            titre: 'Maina loatra ny tany',
            parcelle: 'Sahan-katsaka',
            type: 'sol',
            description: 'Tsy ampy hamandoana ny tany, misy vaky ny tany. Mila tondrahana haingana.',
            date_observation: '2024-10-14',
            actions: 'Tondrahana rahampitso maraina',
            produits_affectes: 'Katsaka',
            gravite: 'ambany',
            photo: null,
          }
        ];
        setObservations(donneesInitiales);
        localStorage.setItem('tantsaha_journal', JSON.stringify(donneesInitiales));
      }
    } catch (error) {
      console.error('Fahadisoana teo am-pamohana ny diary:', error);
      showSnackbar('Nisy olana teo am-pamohana ny diary', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (observation = null) => {
    setSelectedObservation(observation);
    if (observation) {
      setFormData({
        titre: observation.titre,
        parcelle: observation.parcelle,
        type: observation.type,
        description: observation.description,
        date: observation.date_observation,
        actions: observation.actions || '',
        produits_affectes: observation.produits_affectes || '',
        gravite: observation.gravite || 'ambany',
      });
    } else {
      setFormData({
        titre: '',
        parcelle: '',
        type: 'observation',
        description: '',
        date: new Date().toISOString().split('T')[0],
        actions: '',
        produits_affectes: '',
        gravite: 'ambany',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedObservation(null);
  };

  const validateForm = () => {
    if (!formData.titre.trim()) {
      showSnackbar('Tsy maintsy fenoina ny lohateny', 'error');
      return false;
    }
    if (!formData.parcelle) {
      showSnackbar('Tsy maintsy fenoina ny toerana/parcelle', 'error');
      return false;
    }
    if (!formData.description.trim()) {
      showSnackbar('Tsy maintsy fenoina ny fanazavana', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    try {
      let nouvellesObservations;
      
      if (selectedObservation) {
        nouvellesObservations = observations.map(obs => 
          obs.id_observation === selectedObservation.id_observation 
            ? {
                ...obs,
                titre: formData.titre,
                parcelle: formData.parcelle,
                type: formData.type,
                description: formData.description,
                date_observation: formData.date,
                actions: formData.actions,
                produits_affectes: formData.produits_affectes,
                gravite: formData.gravite,
              }
            : obs
        );
        showSnackbar('Voaova soa aman-tsara ny fanaraha-maso', 'success');
      } else {
        const nouvelleObservation = {
          id_observation: Date.now(),
          titre: formData.titre,
          parcelle: formData.parcelle,
          type: formData.type,
          description: formData.description,
          date_observation: formData.date,
          actions: formData.actions,
          produits_affectes: formData.produits_affectes,
          gravite: formData.gravite,
          photo: null,
        };
        
        nouvellesObservations = [...observations, nouvelleObservation];
        showSnackbar('Voatahiry soa aman-tsara ny fanaraha-maso vaovao', 'success');
      }

      setObservations(nouvellesObservations);
      localStorage.setItem('tantsaha_journal', JSON.stringify(nouvellesObservations));
      handleCloseDialog();
      
    } catch (error) {
      showSnackbar('Nisy olana teo am-pitahirizana', 'error');
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Tena hovonoina tokoa ve ity fanaraha-maso ity?')) {
      return;
    }

    try {
      const nouvellesObservations = observations.filter(obs => obs.id_observation !== id);
      setObservations(nouvellesObservations);
      localStorage.setItem('tantsaha_journal', JSON.stringify(nouvellesObservations));
      showSnackbar('Voafafa soa aman-tsara', 'success');
    } catch (error) {
      showSnackbar('Nisy olana teo am-pamafana', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleRefresh = () => {
    fetchObservations();
    showSnackbar('Nohavaozina ny diary', 'info');
  };

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(observations, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `diary_tantsaha_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      showSnackbar('Vita ny famoahana ny rakitra (export)', 'success');
    } catch (error) {
      showSnackbar('Nisy olana teo am-pamoahana ny rakitra', 'error');
    }
  };

  const getTypeInfo = (type) => {
    return typesObservation.find(t => t.value === type) || typesObservation[0];
  };

  const getGraviteColor = (gravite) => {
    switch (gravite) {
      case 'ambany': return 'success';
      case 'antonony': return 'warning';
      case 'ambony': return 'error';
      default: return 'default';
    }
  };

  const filteredObservations = observations.filter(obs => {
    if (filters.type !== 'rehetra' && obs.type !== filters.type) return false;
    if (filters.parcelle !== 'rehetra' && obs.parcelle !== filters.parcelle) return false;
    return true;
  });

  const stats = {
    total: observations.length,
    insectes: observations.filter(o => o.type === 'insectes').length,
    maladies: observations.filter(o => o.type === 'maladies').length,
    urgentes: observations.filter(o => o.gravite === 'ambony').length,
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Lohateny */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            📓 Diary ho an'ny Tantsaha
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Raketo ireo zava-mitranga eny an-tanimbary sy an-tsaha (bibikely, aretina, toetran'ny tany)
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}>
            Havoaka (Export)
          </Button>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}>
            Havaozina
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Hanampy Fanaraha-maso
          </Button>
        </Box>
      </Box>

      {/* Tabilao kely ny antontan'isa */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">{stats.total}</Typography>
              <Typography variant="body2" color="text.secondary">Fitambaran'ny fanaraha-maso</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error">{stats.insectes}</Typography>
              <Typography variant="body2" color="text.secondary">Olana momba ny bibikely</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning">{stats.maladies}</Typography>
              <Typography variant="body2" color="text.secondary">Aretin'ny voly</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error">{stats.urgentes}</Typography>
              <Typography variant="body2" color="text.secondary">Tena maika hovahana</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sivana (Filtres) */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon /> Sivana
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Karazany</InputLabel>
              <Select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                label="Karazany"
              >
                <MenuItem value="rehetra">Ny rehetra</MenuItem>
                {typesObservation.map((type) => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Toerana/Parcelle</InputLabel>
              <Select
                value={filters.parcelle}
                onChange={(e) => setFilters({ ...filters, parcelle: e.target.value })}
                label="Toerana/Parcelle"
              >
                <MenuItem value="rehetra">Ny toerana rehetra</MenuItem>
                {parcelles.map((p) => (
                  <MenuItem key={p.id} value={p.nom}>{p.nom}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Lisitry ny fanaraha-maso */}
      <Grid container spacing={3}>
        {filteredObservations.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">Tsy misy fanaraha-maso hita</Typography>
            </Paper>
          </Grid>
        ) : (
          filteredObservations.map((observation) => {
            const typeInfo = getTypeInfo(observation.type);
            return (
              <Grid item xs={12} key={observation.id_observation}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6">{observation.titre}</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip label={typeInfo.label} size="small" color={typeInfo.color} variant="outlined" />
                          <Chip label={observation.parcelle} size="small" variant="outlined" />
                          <Chip label={`Hamafiny: ${observation.gravite}`} size="small" color={getGraviteColor(observation.gravite)} />
                        </Box>
                      </Box>
                      <Box>
                        <IconButton size="small" color="primary" onClick={() => handleOpenDialog(observation)}><EditIcon /></IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(observation.id_observation)}><DeleteIcon /></IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{observation.description}</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" display="block">Vokatra voakasika:</Typography>
                        <Typography variant="body2">{observation.produits_affectes || '-'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" display="block">Andrana hatao:</Typography>
                        <Typography variant="body2">{observation.actions || '-'}</Typography>
                      </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">📅 {observation.date_observation}</Typography>
                      <Typography variant="caption" color="text.secondary">ID: #{observation.id_observation}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      {/* Bokotra mitsingevana hanampiana vaovao */}
      <Fab color="primary" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={() => handleOpenDialog()}>
        <AddIcon />
      </Fab>

      {/* Varavarankely fanampiana/fanovana */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedObservation ? 'Hanova ny Fanaraha-maso' : 'Fanaraha-maso Vaovao'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Lohateny *" value={formData.titre} onChange={(e) => setFormData({ ...formData, titre: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Toerana/Parcelle *</InputLabel>
                <Select value={formData.parcelle} label="Toerana/Parcelle *" onChange={(e) => setFormData({ ...formData, parcelle: e.target.value })}>
                  {parcelles.map((p) => <MenuItem key={p.id} value={p.nom}>{p.nom} ({p.culture})</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Karazany *</InputLabel>
                <Select value={formData.type} label="Karazany *" onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                  {typesObservation.map((t) => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Andro *" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Hamafin'ny olana</InputLabel>
                <Select value={formData.gravite} label="Hamafin'ny olana" onChange={(e) => setFormData({ ...formData, gravite: e.target.value })}>
                  <MenuItem value="ambany">Ambany</MenuItem>
                  <MenuItem value="antonony">Antonony</MenuItem>
                  <MenuItem value="ambony">Ambony (Tena maika)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="Fanazavana amin'ny antsipiriany *" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Inona no hita eny an-tsaha?" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Vokatra voakasika" value={formData.produits_affectes} onChange={(e) => setFormData({ ...formData, produits_affectes: e.target.value })} placeholder="Vary, katsaka, sns..." />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Andrana hatao hamahana ny olana" value={formData.actions} onChange={(e) => setFormData({ ...formData, actions: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hanafoana</Button>
          <Button onClick={handleSubmit} variant="contained">{selectedObservation ? 'Havaozina' : 'Hatahiry'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default JournalPage;