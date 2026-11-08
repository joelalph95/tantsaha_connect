import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';

const ParcellesPage = () => {
  // État des parcelles
  const [parcelles, setParcelles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // État pour la modale d'ajout
  const [openDialog, setOpenDialog] = useState(false);
  const [newParcelle, setNewParcelle] = useState({
    nom_parcelle: '',
    superficie: '',
    localisation: '',
    culture: '',
    saison: new Date().getFullYear() + ' - Saison Principale'
  });
  
  // États pour les notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Charger les parcelles au démarrage
  useEffect(() => {
    chargerParcelles();
  }, []);

  // Charger les parcelles depuis le stockage local (JSON)
  const chargerParcelles = () => {
    setLoading(true);
    try {
      // Simuler un chargement depuis un fichier JSON
      // Dans une vraie app, ce serait une requête API ou lecture de fichier
      const donneesSimulees = [
        {
          id_parcelle: 1,
          nom_parcelle: 'Rizière Nord',
          superficie: 2.5,
          localisation: 'Ambohimanambola',
          culture: 'Riz',
          saison: '2024 - Saison Principale',
          date_creation: '2024-01-15'
        },
        {
          id_parcelle: 2,
          nom_parcelle: 'Champs de Maïs',
          superficie: 1.8,
          localisation: 'Antananarivo',
          culture: 'Maïs',
          saison: '2024 - Saison Principale',
          date_creation: '2024-02-20'
        }
      ];
      
      // Essayer de charger depuis localStorage d'abord
      const donneesSauvegardees = localStorage.getItem('tantsaha_parcelles');
      if (donneesSauvegardees) {
        setParcelles(JSON.parse(donneesSauvegardees));
      } else {
        // Utiliser les données simulées pour le premier chargement
        setParcelles(donneesSimulees);
        localStorage.setItem('tantsaha_parcelles', JSON.stringify(donneesSimulees));
      }
    } catch (error) {
      console.error('Erreur de chargement des parcelles:', error);
      setSnackbar({
        open: true,
        message: 'Erreur de chargement des parcelles',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Gestion du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewParcelle(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Ouvrir la modale d'ajout
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Fermer la modale
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewParcelle({
      nom_parcelle: '',
      superficie: '',
      localisation: '',
      culture: '',
      saison: new Date().getFullYear() + ' - Saison Principale'
    });
  };

  // Soumettre le formulaire
  const handleSubmit = async () => {
    try {
      // Validation
      if (!newParcelle.nom_parcelle.trim()) {
        setSnackbar({
          open: true,
          message: 'Le nom de la parcelle est obligatoire',
          severity: 'error'
        });
        return;
      }

      if (!newParcelle.superficie || parseFloat(newParcelle.superficie) <= 0) {
        setSnackbar({
          open: true,
          message: 'La superficie doit être un nombre positif',
          severity: 'error'
        });
        return;
      }

      // Créer la nouvelle parcelle
      const nouvelleParcelle = {
        id_parcelle: Date.now(), // ID unique
        nom_parcelle: newParcelle.nom_parcelle.trim(),
        superficie: parseFloat(newParcelle.superficie),
        localisation: newParcelle.localisation.trim(),
        culture: newParcelle.culture.trim(),
        saison: newParcelle.saison,
        date_creation: new Date().toISOString().split('T')[0],
        statut: 'active'
      };

      // Mettre à jour l'état local
      const nouvellesParcelles = [...parcelles, nouvelleParcelle];
      setParcelles(nouvellesParcelles);

      // Sauvegarder dans localStorage (ou JSON dans une vraie app)
      localStorage.setItem('tantsaha_parcelles', JSON.stringify(nouvellesParcelles));

      // Afficher un message de succès
      setSnackbar({
        open: true,
        message: 'Parcelle ajoutée avec succès!',
        severity: 'success'
      });

      // Fermer la modale et réinitialiser le formulaire
      handleCloseDialog();

    } catch (error) {
      console.error('Erreur lors de l\'ajout de la parcelle:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de l\'ajout de la parcelle',
        severity: 'error'
      });
    }
  };

  // Supprimer une parcelle
  const handleDeleteParcelle = (id) => {
    try {
      const nouvellesParcelles = parcelles.filter(p => p.id_parcelle !== id);
      setParcelles(nouvellesParcelles);
      localStorage.setItem('tantsaha_parcelles', JSON.stringify(nouvellesParcelles));
      
      setSnackbar({
        open: true,
        message: 'Parcelle supprimée avec succès',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression',
        severity: 'error'
      });
    }
  };

  // Gérer le rafraîchissement manuel
  const handleRefresh = () => {
    chargerParcelles();
    setSnackbar({
      open: true,
      message: 'Liste des parcelles rafraîchie',
      severity: 'info'
    });
  };

  // Fermer le Snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  // Composant pour les statistiques (intégré directement)
  const ParcelleStats = () => {
    const totalSuperficie = parcelles.reduce((sum, parcelle) => sum + parcelle.superficie, 0);
    const culturesUniques = [...new Set(parcelles.map(p => p.culture))].filter(Boolean);

    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          📊 Statistiques des Parcelles
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box textAlign="center">
              <Typography variant="h4" color="primary">
                {parcelles.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Parcelles actives
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box textAlign="center">
              <Typography variant="h4" color="primary">
                {totalSuperficie.toFixed(2)} ha
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Superficie totale
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box textAlign="center">
              <Typography variant="h4" color="primary">
                {culturesUniques.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Types de cultures
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // Composant pour la liste des parcelles (intégré directement)
  const ParcelleList = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      );
    }

    if (parcelles.length === 0) {
      return (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucune parcelle enregistrée
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Commencez par ajouter votre première parcelle
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Ajouter ma première parcelle
          </Button>
        </Paper>
      );
    }

    return (
      <Paper sx={{ p: 2 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Liste des parcelles ({parcelles.length})
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            size="small"
          >
            Nouvelle parcelle
          </Button>
        </Box>

        <Grid container spacing={2}>
          {parcelles.map((parcelle) => (
            <Grid item xs={12} sm={6} md={4} key={parcelle.id_parcelle}>
              <Paper 
                sx={{ 
                  p: 2, 
                  height: '100%',
                  borderLeft: 4,
                  borderColor: 'primary.main',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {parcelle.nom_parcelle}
                </Typography>
                
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Culture:</strong> {parcelle.culture || 'Non spécifiée'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Superficie:</strong> {parcelle.superficie} hectares
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Localisation:</strong> {parcelle.localisation || 'Non spécifiée'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Saison:</strong> {parcelle.saison}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="primary"
                    onClick={() => {/* Gérer l'édition */}}
                  >
                    Modifier
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="error"
                    onClick={() => handleDeleteParcelle(parcelle.id_parcelle)}
                  >
                    Supprimer
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête avec boutons d'action */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            🌱 Gestion des Parcelles
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez vos parcelles agricoles, ajoutez des cultures et suivez leur évolution
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Rafraîchir la liste">
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Actualiser
            </Button>
          </Tooltip>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Nouvelle parcelle
          </Button>
        </Box>
      </Box>

      {/* Contenu principal */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ParcelleStats />
        </Grid>
        
        <Grid item xs={12}>
          <ParcelleList />
        </Grid>
      </Grid>

      {/* Modale d'ajout de parcelle */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter une nouvelle parcelle</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              name="nom_parcelle"
              label="Nom de la parcelle *"
              type="text"
              fullWidth
              variant="outlined"
              value={newParcelle.nom_parcelle}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              required
            />
            
            <TextField
              margin="dense"
              name="superficie"
              label="Superficie (hectares) *"
              type="number"
              fullWidth
              variant="outlined"
              value={newParcelle.superficie}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              InputProps={{
                inputProps: { 
                  min: 0.01,
                  step: 0.01
                }
              }}
              required
            />
            
            <TextField
              margin="dense"
              name="culture"
              label="Culture principale"
              type="text"
              fullWidth
              variant="outlined"
              value={newParcelle.culture}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              placeholder="Ex: Riz, Maïs, Manioc..."
            />
            
            <TextField
              margin="dense"
              name="localisation"
              label="Localisation"
              type="text"
              fullWidth
              variant="outlined"
              value={newParcelle.localisation}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              placeholder="Ex: Ambohimanambola, Antananarivo"
            />
            
            <TextField
              margin="dense"
              name="saison"
              label="Saison de culture"
              type="text"
              fullWidth
              variant="outlined"
              value={newParcelle.saison}
              onChange={handleInputChange}
              placeholder="Ex: 2024 - Saison Principale"
            />
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              * Champs obligatoires
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            startIcon={<SaveIcon />}
          >
            Créer la parcelle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ParcellesPage;