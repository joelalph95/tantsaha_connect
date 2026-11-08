import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Box,
} from '@mui/material';
import {
  Notifications as AlertIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const RecentActivity = () => {
  const activities = [
    {
      type: 'alerte',
      title: 'Alerte météo',
      description: 'Pluies fortes prévues demain',
      time: 'Il y a 2 heures',
      icon: <WarningIcon color="warning" />,
      status: 'non_vu',
    },
    {
      type: 'observation',
      title: 'Nouvelle observation',
      description: 'Parcelle "Rizicole Nord" - insectes détectés',
      time: 'Il y a 5 heures',
      icon: <InfoIcon color="info" />,
      status: 'vu',
    },
    {
      type: 'conseil',
      title: 'Conseil publié',
      description: 'Technique d\'irrigation optimisée',
      time: 'Hier',
      icon: <CheckIcon color="success" />,
      status: 'vu',
    },
    {
      type: 'parcelle',
      title: 'Parcelle ajoutée',
      description: 'Parcelle "Manioc Ouest" - 2.5 ha',
      time: 'Avant-hier',
      icon: <AlertIcon color="primary" />,
      status: 'vu',
    },
  ];

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Activités Récentes
        </Typography>
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {activities.map((activity, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {activity.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="subtitle2">
                        {activity.title}
                      </Typography>
                      {activity.status === 'non_vu' && (
                        <Chip
                          label="Nouveau"
                          color="error"
                          size="small"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < activities.length - 1 && <Divider variant="inset" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;