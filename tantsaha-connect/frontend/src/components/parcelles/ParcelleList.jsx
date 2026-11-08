import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import parcellesService from '../../services/parcellesService';
import ParcelleForm from './ParcelleForm';

const ParcelleList = () => {
  const [parcelles, setParcelles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedParcelle, setSelectedParcelle] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    fetchParcelles();
  }, []);

  const fetchParcelles = async () => {
    try {
      setLoading(true);
      const data = await parcellesService.getAllParcelles();
      setParcelles(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (parcelle) => {
    setSelectedParcelle(parcelle);
    setOpenForm(true);
  };

  const handleDelete = (parcelle) => {
    setSelectedParcelle(parcelle);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await parcellesService.deleteParcelle(selectedParcelle.id_parcelle);
      fetchParcelles();
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setSelectedParcelle(null);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (selectedParcelle) {
        await parcellesService.updateParcelle(selectedParcelle.id_parcelle, data);
      } else {
        await parcellesService.createParcelle(data);
      }
      fetchParcelles();
      handleFormClose();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const getSuperficieColor = (superficie) => {
    if (superficie < 1) return 'success';
    if (superficie < 5) return 'warning';
    return 'error';
  };

  return (
    <>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Liste des Parcelles ({parcelles.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenForm(true)}
          >
            Nouvelle Parcelle
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell><strong>Nom</strong></TableCell>
                <TableCell><strong>Superficie (ha)</strong></TableCell>
                <TableCell><strong>Localisation</strong></TableCell>
                <TableCell><strong>Paysan</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : parcelles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Aucune parcelle enregistrée
                  </TableCell>
                </TableRow>
              ) : (
                parcelles
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((parcelle) => (
                    <TableRow key={parcelle.id_parcelle} hover>
                      <TableCell>
                        <Typography fontWeight="medium">
                          {parcelle.nom_parcelle}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${parcelle.superficie} ha`}
                          color={getSuperficieColor(parcelle.superficie)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{parcelle.localisation}</TableCell>
                      <TableCell>
                        {parcelle.paysan_nom} {parcelle.paysan_prenom}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(parcelle)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(parcelle)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={parcelles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page"
        />
      </Paper>

      {/* Formulaire parcelle */}
      <Dialog
        open={openForm}
        onClose={handleFormClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedParcelle ? 'Modifier la Parcelle' : 'Nouvelle Parcelle'}
        </DialogTitle>
        <DialogContent>
          <ParcelleForm
            parcelle={selectedParcelle}
            onSubmit={handleFormSubmit}
            onCancel={handleFormClose}
          />
        </DialogContent>
      </Dialog>

      {/* Dialogue de confirmation suppression */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer la parcelle "{selectedParcelle?.nom_parcelle}" ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Annuler</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ParcelleList;