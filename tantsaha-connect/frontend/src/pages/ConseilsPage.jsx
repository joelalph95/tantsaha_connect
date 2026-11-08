import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Snackbar,
  Alert,
  Fab,
  Badge,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  VolumeUp as VolumeUpIcon,
  Download as DownloadIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Book as BookIcon,
  Agriculture as AgricultureIcon,
  Grass as GrassIcon,
  Spa as PlantIcon,
  LocalFlorist as FlowerIcon,
  Restaurant as FoodIcon,
  EmojiNature as NatureIcon,
} from '@mui/icons-material';

const ConseilsPage = () => {
  const [conseils, setConseils] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedConseil, setSelectedConseil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [playingAudio, setPlayingAudio] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    categorie: 'tous',
    produit: 'tous',
  });

  // Catégories de produits agricoles malgaches selon le rapport
  const categories = [
    { value: 'tous', label: 'Toutes les catégories', icon: <BookIcon /> },
    { value: 'rizicole', label: 'Rizicole', icon: <AgricultureIcon />, color: 'primary' },
    { value: 'tubercule', label: 'Tubercules', icon: <GrassIcon />, color: 'secondary' },
    { value: 'legumineuse', label: 'Légumineuses', icon: <PlantIcon />, color: 'success' },
    { value: 'fruit', label: 'Fruits', icon: <FlowerIcon />, color: 'warning' },
    { value: 'epice', label: 'Épices', icon: <FoodIcon />, color: 'error' },
    { value: 'autres', label: 'Autres', icon: <NatureIcon />, color: 'info' },
  ];

  // Produits agricoles populaires malgaches
  const produits = [
    { value: 'tous', label: 'Tous les produits' },
    { value: 'riz', label: 'Riz', categorie: 'rizicole' },
    { value: 'manioc', label: 'Manioc', categorie: 'tubercule' },
    { value: 'patate_douce', label: 'Patate douce', categorie: 'tubercule' },
    { value: 'mais', label: 'Maïs', categorie: 'rizicole' },
    { value: 'arachide', label: 'Arachide', categorie: 'legumineuse' },
    { value: 'haricot', label: 'Haricot', categorie: 'legumineuse' },
    { value: 'cafe', label: 'Café', categorie: 'autres' },
    { value: 'vanille', label: 'Vanille', categorie: 'epice' },
    { value: 'litchi', label: 'Litchi', categorie: 'fruit' },
    { value: 'ananas', label: 'Ananas', categorie: 'fruit' },
    { value: 'poivre', label: 'Poivre', categorie: 'epice' },
  ];

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: 'rizicole',
    produits: [],
    audio_url: '',
    audio_downloaded: false,
    saison: 'toutes',
    niveau: 'débutant',
  });

  // Saisons agricoles
  const saisons = [
    { value: 'toutes', label: 'Toutes saisons' },
    { value: 'saison_pluie', label: 'Saison des pluies' },
    { value: 'saison_seche', label: 'Saison sèche' },
    { value: 'saison_froide', label: 'Saison froide' },
    { value: 'transition', label: 'Transition' },
  ];

  // Niveaux de difficulté
  const niveaux = [
    { value: 'débutant', label: 'Débutant', color: 'success' },
    { value: 'intermediaire', label: 'Intermédiaire', color: 'warning' },
    { value: 'avance', label: 'Avancé', color: 'error' },
  ];

  // Charger les conseils au démarrage
  useEffect(() => {
    fetchConseils();
  }, []);

  const fetchConseils = () => {
    setLoading(true);
    try {
      const donneesSauvegardees = localStorage.getItem('tantsaha_conseils');
      
      if (donneesSauvegardees) {
        setConseils(JSON.parse(donneesSauvegardees));
      } else {
        // Données initiales selon le rapport (BF5: texte + audio)
        const donneesInitiales = [
          {
            id_conseil: 1,
            titre: 'Semis du riz en saison des pluies',
            description: 'Pour un semis réussi du riz, choisissez des grains sains. Semez à une profondeur de 2-3 cm avec un espacement de 20 cm entre les plants. La première irrigation doit être légère pour ne pas déplacer les grains.',
            categorie: 'rizicole',
            produits: ['riz'],
            audio_url: 'https://example.com/audio/semis-riz.mp3',
            audio_downloaded: true,
            saison: 'saison_pluie',
            niveau: 'débutant',
            date_ajout: '2024-10-01',
            vues: 45,
          },
          {
            id_conseil: 2,
            titre: 'Lutte biologique contre les parasites du manioc',
            description: 'Utilisez des coccinelles pour contrôler les pucerons. Plantez des œillets d\'Inde autour de votre champ pour repousser les nématodes. Évitez les pesticides chimiques qui tuent les prédateurs naturels.',
            categorie: 'tubercule',
            produits: ['manioc'],
            audio_url: 'https://example.com/audio/lutte-manioc.mp3',
            audio_downloaded: false,
            saison: 'toutes',
            niveau: 'intermediaire',
            date_ajout: '2024-09-28',
            vues: 32,
          },
          {
            id_conseil: 3,
            titre: 'Fertilisation organique pour le maïs',
            description: 'Mélangez 1/3 de fumier de vache, 1/3 de compost végétal et 1/3 de cendres de bois. Appliquez 500g par plant au moment du semis. Arrosez légèrement après application.',
            categorie: 'rizicole',
            produits: ['mais'],
            audio_url: 'https://example.com/audio/fertilisation-mais.mp3',
            audio_downloaded: true,
            saison: 'saison_pluie',
            niveau: 'débutant',
            date_ajout: '2024-09-25',
            vues: 28,
          },
          {
            id_conseil: 4,
            titre: 'Conservation des patates douces',
            description: 'Récoltez par temps sec. Laissez sécher à l\'ombre pendant 2 jours. Stockez dans un endroit frais (15-20°C) et bien ventilé. Évitez les chocs lors de la manipulation.',
            categorie: 'tubercule',
            produits: ['patate_douce'],
            audio_url: 'https://example.com/audio/conservation-patate.mp3',
            audio_downloaded: false,
            saison: 'saison_seche',
            niveau: 'intermediaire',
            date_ajout: '2024-09-20',
            vues: 19,
          },
          {
            id_conseil: 5,
            titre: 'Pollinisation de la vanille',
            description: 'La pollinisation manuelle se fait tôt le matin. Utilisez un petit bâton pour transférer le pollen. Une fleur pollinisée donne une gousse. Protégez du vent excessif.',
            categorie: 'epice',
            produits: ['vanille'],
            audio_url: 'https://example.com/audio/pollinisation-vanille.mp3',
            audio_downloaded: false,
            saison: 'saison_froide',
            niveau: 'avance',
            date_ajout: '2024-09-15',
            vues: 12,
          },
        ];
        setConseils(donneesInitiales);
        localStorage.setItem('tantsaha_conseils', JSON.stringify(donneesInitiales));
      }
    } catch (error) {
      console.error('Erreur de chargement des conseils:', error);
      showSnackbar('Erreur de chargement des conseils', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (conseil = null) => {
    setSelectedConseil(conseil);
    if (conseil) {
      setFormData({
        titre: conseil.titre,
        description: conseil.description,
        categorie: conseil.categorie,
        produits: conseil.produits || [],
        audio_url: conseil.audio_url || '',
        audio_downloaded: conseil.audio_downloaded || false,
        saison: conseil.saison || 'toutes',
        niveau: conseil.niveau || 'débutant',
      });
    } else {
      setFormData({
        titre: '',
        description: '',
        categorie: 'rizicole',
        produits: [],
        audio_url: '',
        audio_downloaded: false,
        saison: 'toutes',
        niveau: 'débutant',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedConseil(null);
  };

  const validateForm = () => {
    if (!formData.titre.trim()) {
      showSnackbar('Le titre est obligatoire', 'error');
      return false;
    }
    if (!formData.description.trim()) {
      showSnackbar('La description est obligatoire', 'error');
      return false;
    }
    if (formData.produits.length === 0) {
      showSnackbar('Sélectionnez au moins un produit', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    try {
      let nouveauxConseils;
      
      if (selectedConseil) {
        nouveauxConseils = conseils.map(c => 
          c.id_conseil === selectedConseil.id_conseil 
            ? {
                ...c,
                titre: formData.titre,
                description: formData.description,
                categorie: formData.categorie,
                produits: formData.produits,
                audio_url: formData.audio_url,
                audio_downloaded: formData.audio_downloaded,
                saison: formData.saison,
                niveau: formData.niveau,
              }
            : c
        );
        showSnackbar('Conseil modifié avec succès', 'success');
      } else {
        const nouveauConseil = {
          id_conseil: Date.now(),
          titre: formData.titre,
          description: formData.description,
          categorie: formData.categorie,
          produits: formData.produits,
          audio_url: formData.audio_url,
          audio_downloaded: formData.audio_downloaded,
          saison: formData.saison,
          niveau: formData.niveau,
          date_ajout: new Date().toISOString().split('T')[0],
          vues: 0,
        };
        
        nouveauxConseils = [...conseils, nouveauConseil];
        showSnackbar('Conseil ajouté avec succès', 'success');
      }

      setConseils(nouveauxConseils);
      localStorage.setItem('tantsaha_conseils', JSON.stringify(nouveauxConseils));
      handleCloseDialog();
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showSnackbar('Erreur lors de la sauvegarde', 'error');
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce conseil ?')) {
      return;
    }

    try {
      const nouveauxConseils = conseils.filter(c => c.id_conseil !== id);
      setConseils(nouveauxConseils);
      localStorage.setItem('tantsaha_conseils', JSON.stringify(nouveauxConseils));
      showSnackbar('Conseil supprimé avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      showSnackbar('Erreur lors de la suppression', 'error');
    }
  };

  const handlePlayAudio = (conseil) => {
    if (playingAudio === conseil.id_conseil) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(conseil.id_conseil);
      // Simuler l'incrémentation des vues
      const updatedConseils = conseils.map(c => 
        c.id_conseil === conseil.id_conseil 
          ? { ...c, vues: (c.vues || 0) + 1 }
          : c
      );
      setConseils(updatedConseils);
      localStorage.setItem('tantsaha_conseils', JSON.stringify(updatedConseils));
    }
  };

  const handleDownloadAudio = (conseil) => {
    // Simuler le téléchargement (BF5: audio téléchargeable)
    const updatedConseils = conseils.map(c => 
      c.id_conseil === conseil.id_conseil 
        ? { ...c, audio_downloaded: true }
        : c
    );
    setConseils(updatedConseils);
    localStorage.setItem('tantsaha_conseils', JSON.stringify(updatedConseils));
    showSnackbar('Audio téléchargé pour usage hors-ligne', 'success');
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleRefresh = () => {
    fetchConseils();
    showSnackbar('Conseils rafraîchis', 'info');
  };

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(conseils, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conseils_agricoles_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showSnackbar('Conseils exportés avec succès', 'success');
    } catch (error) {
      showSnackbar('Erreur lors de l\'export', 'error');
    }
  };

  // Filtrer et rechercher les conseils
  const filteredConseils = conseils.filter(conseil => {
    // Filtre par catégorie
    if (filters.categorie !== 'tous' && conseil.categorie !== filters.categorie) {
      return false;
    }
    
    // Filtre par produit
    if (filters.produit !== 'tous' && !conseil.produits.includes(filters.produit)) {
      return false;
    }
    
    // Recherche par texte
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        conseil.titre.toLowerCase().includes(searchLower) ||
        conseil.description.toLowerCase().includes(searchLower) ||
        conseil.produits.some(p => p.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  // Trouver les informations de catégorie
  const getCategorieInfo = (categorieValue) => {
    return categories.find(c => c.value === categorieValue) || categories[0];
  };

  // Statistiques
  const stats = {
    total: conseils.length,
    avecAudio: conseils.filter(c => c.audio_url).length,
    telecharges: conseils.filter(c => c.audio_downloaded).length,
    vuesTotal: conseils.reduce((sum, c) => sum + (c.vues || 0), 0),
  };

  // Conseils populaires (top 3)
  const conseilsPopulaires = [...conseils]
    .sort((a, b) => (b.vues || 0) - (a.vues || 0))
    .slice(0, 3);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <Typography>Chargement des conseils...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            💡 Conseils Agricoles
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Recevez des conseils adaptés aux cultures malgaches (texte + audio) selon BF5
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Exporter
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nouveau Conseil
          </Button>
        </Box>
      </Box>

      {/* Recherche et filtres */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Rechercher un conseil..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={filters.categorie}
                onChange={(e) => setFilters({ ...filters, categorie: e.target.value })}
                label="Catégorie"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {cat.icon}
                      {cat.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Produit</InputLabel>
              <Select
                value={filters.produit}
                onChange={(e) => setFilters({ ...filters, produit: e.target.value })}
                label="Produit"
              >
                {produits.map((prod) => (
                  <MenuItem key={prod.value} value={prod.value}>
                    {prod.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Cartes de statistiques */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Conseils disponibles
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success" gutterBottom>
                {stats.avecAudio}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avec audio
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="info" gutterBottom>
                {stats.telecharges}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Téléchargés hors-ligne
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning" gutterBottom>
                {stats.vuesTotal}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Écoutes totales
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Section des conseils populaires */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        🏆 Conseils les plus populaires
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {conseilsPopulaires.map((conseil, index) => {
          const categorieInfo = getCategorieInfo(conseil.categorie);
          const niveauInfo = niveaux.find(n => n.value === conseil.niveau);
          return (
            <Grid item xs={12} md={4} key={conseil.id_conseil}>
              <Card sx={{ height: '100%', position: 'relative' }}>
                <Badge 
                  badgeContent={index + 1} 
                  color="primary" 
                  sx={{ 
                    position: 'absolute', 
                    top: 10, 
                    right: 10,
                    '& .MuiBadge-badge': {
                      fontSize: '0.75rem',
                      height: 24,
                      minWidth: 24,
                    }
                  }}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    {categorieInfo.icon}
                    <Chip 
                      label={categorieInfo.label} 
                      size="small" 
                      color={categorieInfo.color}
                      variant="outlined"
                    />
                    <Chip 
                      label={niveauInfo.label} 
                      size="small" 
                      color={niveauInfo.color}
                      sx={{ ml: 'auto' }}
                    />
                  </Box>
                  
                  <Typography variant="h6" gutterBottom>
                    {conseil.titre}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                    {conseil.description.length > 100 
                      ? `${conseil.description.substring(0, 100)}...` 
                      : conseil.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Produits concernés:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {conseil.produits.map(prod => (
                        <Chip 
                          key={prod} 
                          label={produits.find(p => p.value === prod)?.label || prod} 
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      <VolumeUpIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                      {conseil.vues || 0} écoutes
                    </Typography>
                    
                    <Box>
                      {conseil.audio_url && (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handlePlayAudio(conseil)}
                        >
                          {playingAudio === conseil.id_conseil ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                      )}
                      {conseil.audio_url && !conseil.audio_downloaded && (
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleDownloadAudio(conseil)}
                          title="Télécharger pour hors-ligne"
                        >
                          <DownloadIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Tous les conseils */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        📚 Tous les conseils ({filteredConseils.length})
      </Typography>
      
      {filteredConseils.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun conseil trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {conseils.length === 0 
              ? 'Commencez par ajouter votre premier conseil' 
              : 'Aucun conseil ne correspond à votre recherche'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Ajouter un conseil
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredConseils.map((conseil) => {
            const categorieInfo = getCategorieInfo(conseil.categorie);
            const niveauInfo = niveaux.find(n => n.value === conseil.niveau);
            const saisonInfo = saisons.find(s => s.value === conseil.saison);
            
            return (
              <Grid item xs={12} key={conseil.id_conseil}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {conseil.titre}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            icon={categorieInfo.icon}
                            label={categorieInfo.label}
                            size="small"
                            color={categorieInfo.color}
                            variant="outlined"
                          />
                          <Chip
                            label={niveauInfo.label}
                            size="small"
                            color={niveauInfo.color}
                          />
                          <Chip
                            label={saisonInfo?.label || 'Toutes saisons'}
                            size="small"
                            variant="outlined"
                          />
                          {conseil.audio_url && (
                            <Chip
                              icon={<VolumeUpIcon />}
                              label="Avec audio"
                              size="small"
                              color={conseil.audio_downloaded ? "success" : "default"}
                              variant={conseil.audio_downloaded ? "filled" : "outlined"}
                            />
                          )}
                        </Box>
                      </Box>
                      
                      <Box>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(conseil)}
                          title="Modifier"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(conseil.id_conseil)}
                          title="Supprimer"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography variant="body1" paragraph>
                      {conseil.description}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Produits concernés:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {conseil.produits.map(prod => {
                            const produitInfo = produits.find(p => p.value === prod);
                            return (
                              <Chip 
                                key={prod} 
                                label={produitInfo?.label || prod} 
                                size="small"
                                variant="outlined"
                              />
                            );
                          })}
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                          {conseil.audio_url && (
                            <>
                              <IconButton
                                color="primary"
                                onClick={() => handlePlayAudio(conseil)}
                                title={playingAudio === conseil.id_conseil ? "Pause" : "Écouter"}
                              >
                                {playingAudio === conseil.id_conseil ? <PauseIcon /> : <PlayArrowIcon />}
                              </IconButton>
                              
                              {!conseil.audio_downloaded && (
                                <Button
                                  size="small"
                                  startIcon={<DownloadIcon />}
                                  onClick={() => handleDownloadAudio(conseil)}
                                  variant="outlined"
                                >
                                  Télécharger
                                </Button>
                              )}
                            </>
                          )}
                          
                          <Typography variant="caption" color="text.secondary">
                            <VolumeUpIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                            {conseil.vues || 0} écoutes
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Ajouté le: {conseil.date_ajout}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: #{conseil.id_conseil}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Dialogue pour créer/modifier un conseil */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedConseil ? 'Modifier le Conseil' : 'Nouveau Conseil Agricole'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre du conseil *"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                margin="normal"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description détaillée *"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                margin="normal"
                required
                multiline
                rows={4}
                placeholder="Décrivez le conseil agricole de manière claire et détaillée..."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Catégorie *</InputLabel>
                <Select
                  value={formData.categorie}
                  onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                  label="Catégorie *"
                >
                  {categories.filter(c => c.value !== 'tous').map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {cat.icon}
                        {cat.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Niveau *</InputLabel>
                <Select
                  value={formData.niveau}
                  onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
                  label="Niveau *"
                >
                  {niveaux.map((niv) => (
                    <MenuItem key={niv.value} value={niv.value}>
                      {niv.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Saison</InputLabel>
                <Select
                  value={formData.saison}
                  onChange={(e) => setFormData({ ...formData, saison: e.target.value })}
                  label="Saison"
                >
                  {saisons.map((sais) => (
                    <MenuItem key={sais.value} value={sais.value}>
                      {sais.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Produits concernés *</InputLabel>
                <Select
                  multiple
                  value={formData.produits}
                  onChange={(e) => setFormData({ ...formData, produits: e.target.value })}
                  label="Produits concernés *"
                >
                  {produits.filter(p => p.value !== 'tous').map((prod) => (
                    <MenuItem key={prod.value} value={prod.value}>
                      {prod.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL de l'audio (optionnel)"
                value={formData.audio_url}
                onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                margin="normal"
                placeholder="https://example.com/audio/conseil.mp3"
                helperText="BF5: Conseil avec audio téléchargeable"
              />
            </Grid>

            {formData.audio_url && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <VolumeUpIcon color="primary" />
                  <Typography variant="body2" color="text.secondary">
                    Audio disponible - téléchargeable pour usage hors-ligne
                  </Typography>
                </Box>
              </Grid>
            )}

            {selectedConseil && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  ID: #{selectedConseil.id_conseil} • Ajouté le: {selectedConseil.date_ajout} • 
                  Écoutes: {selectedConseil.vues || 0}
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            startIcon={selectedConseil ? <EditIcon /> : <AddIcon />}
          >
            {selectedConseil ? 'Mettre à jour' : 'Enregistrer'}
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

export default ConseilsPage;