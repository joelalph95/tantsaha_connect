import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid, Avatar, Snackbar,
  Alert, Chip, Card, CardContent, useTheme
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Phone as PhoneIcon, Person as PersonIcon, Refresh as RefreshIcon,
  Save as SaveIcon, Group as GroupIcon, Landscape as FieldIcon
} from '@mui/icons-material';

const PaysansPage = () => {
  const theme = useTheme(); // Maka ny Mode (Clair/Sombre)
  const [paysans, setPaysans] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPaysan, setSelectedPaysan] = useState(null);
  const [formData, setFormData] = useState({ nom: '', prenom: '', telephone: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fakana ny angona (mitovy amin'ny teo aloha)
  useEffect(() => {
    const donneesSauvegardees = localStorage.getItem('tantsaha_paysans');
    if (donneesSauvegardees) {
      setPaysans(JSON.parse(donneesSauvegardees));
    } else {
      const donneesInitiales = [
        { id_paysan: 1, nom: 'RAKOTO', prenom: 'Jean', telephone: '+261321234567', date_inscription: '2024-01-15', statut: 'actif', parcelles: 3 },
        { id_paysan: 2, nom: 'RASOA', prenom: 'Marie', telephone: '+261331234568', date_inscription: '2024-02-20', statut: 'actif', parcelles: 2 },
      ];
      setPaysans(donneesInitiales);
      localStorage.setItem('tantsaha_paysans', JSON.stringify(donneesInitiales));
    }
  }, []);

  const stats = {
    total: paysans.length,
    parcelles: paysans.reduce((sum, p) => sum + p.parcelles, 0),
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, margin: '0 auto', bgcolor: 'background.default', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight="800" sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', gap: 2 }}>
            <GroupIcon sx={{ fontSize: 40 }} /> Fitantanana ny Tantsaha
          </Typography>
          <Typography variant="body1" color="text.secondary">Fandaminana ireo tantsaha mpikambana</Typography>
        </Box>
        <Box display="flex" gap={1.5}>
          <Button variant="outlined" startIcon={<RefreshIcon />} sx={{ borderRadius: 2 }}>Havaozina</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)} sx={{ borderRadius: 2, px: 3 }}>Tantsaha Vaovao</Button>
        </Box>
      </Box>

      {/* STATS CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Tantsaha voasoratra', val: stats.total, color: theme.palette.primary.main, icon: <PersonIcon /> },
          { label: 'Saha manontolo', val: stats.parcelles, color: theme.palette.info.main, icon: <FieldIcon /> }
        ].map((item, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <Card sx={{ 
              borderRadius: 4, 
              bgcolor: 'background.paper',
              borderBottom: `4px solid ${item.color}`,
              boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: `${item.color}20`, color: item.color, width: 50, height: 50 }}>{item.icon}</Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="800" color="text.primary">{item.val}</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">{item.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* TABLEAU */}
      <TableContainer component={Paper} sx={{ 
        borderRadius: 4, 
        bgcolor: 'background.paper',
        boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 4px 20px rgba(0,0,0,0.08)',
        border: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.divider}` : 'none'
      }}>
        <Table>
          <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Tantsaha</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Finday</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Saha</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Toerana</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }} align="center">Hetsika</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paysans.map((p) => (
              <TableRow key={p.id_paysan} hover sx={{ '& td': { borderColor: theme.palette.divider } }}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>{p.nom[0]}</Avatar>
                    <Box>
                      <Typography fontWeight="700" color="text.primary">{p.prenom} {p.nom}</Typography>
                      <Typography variant="caption" color="text.secondary">ID: #{p.id_paysan}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip icon={<PhoneIcon sx={{ fontSize: '1rem' }} />} label={p.telephone} variant="outlined" size="small" />
                </TableCell>
                <TableCell><Typography fontWeight="600" color="text.primary">{p.parcelles} saha</Typography></TableCell>
                <TableCell>
                  <Chip label={p.statut === 'actif' ? 'Mavitrika' : 'Tsy mavitrika'} color={p.statut === 'actif' ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center" gap={1}>
                    <IconButton size="small" color="primary"><EditIcon /></IconButton>
                    <IconButton size="small" color="error"><DeleteIcon /></IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DIALOG */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', bgcolor: 'background.paper', color: 'text.primary' }}>Tantsaha Vaovao</DialogTitle>
        <DialogContent sx={{ bgcolor: 'background.paper' }}>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField fullWidth label="Anarana" variant="outlined" />
            <TextField fullWidth label="Laharana finday" variant="outlined" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: 'background.paper' }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">Hanafoana</Button>
          <Button variant="contained" startIcon={<SaveIcon />}>Tahirina</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaysansPage;