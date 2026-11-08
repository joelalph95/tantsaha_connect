import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

const StatsCard = ({ title, value, icon, color, subtitle }) => {
  return (
    <Card sx={{ 
      height: '100%',
      borderLeft: `4px solid ${color}`,
      transition: 'transform 0.3s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
      }
    }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: `${color}20`,
              borderRadius: '50%',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 28, color } })}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mt={2}>
          <TrendingUp sx={{ fontSize: 16, color: '#4CAF50', mr: 0.5 }} />
          <Typography variant="caption" color="text.secondary">
            +12% depuis le mois dernier
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;