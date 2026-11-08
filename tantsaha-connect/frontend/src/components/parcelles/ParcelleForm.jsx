import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Typography,
} from '@mui/material';
import { CULTURES, SAISONS } from '../../utils/constants';

const ParcelleForm = ({ parcelle, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nom_parcelle: '',
    superficie: '',
    localisation: '',
    id_paysan: 1,
    produits: [],
  });

  const [selectedProduits, setSelectedProduits] = useState([]);
  const [produitDetails, setProduitDetails] = useState({});

  useEffect(() => {
    if (parcelle) {
      setFormData({
        nom_parcelle: parcelle.nom_parcelle || '',
        superficie: parcelle.superficie || '',
        localisation: parcelle.localisation || '',
        id_paysan: parcelle.id_paysan || 1,
      });
      
      // Si la parcelle a des produits
      if (parcelle.produits_ids) {
        const produitsIds = parcelle.produits_ids.split(',').map(id => parseInt(id));
        setSelectedProduits(produitsIds);
      }
    }
  }, [parcelle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProduitChange = (event) => {
    const { value } = event.target;
    setSelectedProduits(typeof value === 'string' ? value.split(',') : value);
  };

  const handleProduitDetailChange = (produitId, field, value) => {
    setProduitDetails(prev => ({
      ...prev,
      [produitId]: {
        ...prev[produitId],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Préparer les données avec les détails des produits
    const produitsData = selectedProduits.map(produitId => ({
      id_produit: produitId,
      ...(produitDetails[produitId] || {})
    }));

    onSubmit({
      ...formData,
      superficie: parseFloat(formData.superficie),
      produits: produitsData
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Nom de la parcelle"
            name="nom_parcelle"
            value={formData.nom_parcelle}
            onChange={handleChange}
            placeholder="Ex: Rizicole Nord, Manioc Ouest..."
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Superficie (hectares)"
            name="superficie"
            type="number"
            value={formData.superficie}
            onChange={handleChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">ha</InputAdornment>,
            }}
            inputProps={{ min: 0.1, step: 0.1 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Localisation"
            name="localisation"
            value={formData.localisation}
            onChange={handleChange}
            placeholder="Ex: Commune de..., Région..."
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Produits cultivés</InputLabel>
            <Select
              multiple
              value={selectedProduits}
              onChange={handleProduitChange}
              label="Produits cultivés"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const produit = CULTURES.find(p => p.id === value);
                    return (
                      <Chip 
                        key={value} 
                        label={produit?.nom || value} 
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    );
                  })}
                </Box>
              )}
            >
              {CULTURES.map((produit) => (
                <MenuItem key={produit.id} value={produit.id}>
                  {produit.nom} ({produit.categorie})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Détails pour chaque produit sélectionné */}
        {selectedProduits.map((produitId) => {
          const produit = CULTURES.find(p => p.id === produitId);
          const details = produitDetails[produitId] || {};

          return (
            <Grid item xs={12} key={produitId}>
              <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Détails pour: {produit?.nom}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Saison</InputLabel>
                      <Select
                        value={details.saison || ''}
                        onChange={(e) => handleProduitDetailChange(produitId, 'saison', e.target.value)}
                        label="Saison"
                      >
                        {SAISONS.map((saison) => (
                          <MenuItem key={saison} value={saison}>
                            {saison}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Quantité estimée"
                      type="number"
                      value={details.quantite_estimee || ''}
                      onChange={(e) => handleProduitDetailChange(produitId, 'quantite_estimee', e.target.value)}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Date plantation"
                      type="date"
                      value={details.date_plantation || ''}
                      onChange={(e) => handleProduitDetailChange(produitId, 'date_plantation', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel} variant="outlined">
          Annuler
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {parcelle ? 'Mettre à jour' : 'Créer la parcelle'}
        </Button>
      </Box>
    </Box>
  );
};

export default ParcelleForm;