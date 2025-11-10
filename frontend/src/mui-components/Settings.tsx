import React from 'react';
import { Box, Typography, Button, Container, Card, CardContent, TextField, Switch, FormControlLabel, alpha } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';

export interface SettingsProps { onBack: () => void; }

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Button variant="text" startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 4 }}>
          Back to Dashboard
        </Button>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" sx={{ fontFamily: '"Roboto Flex", "Roboto", serif', fontWeight: 700, mb: 1 }}>Settings</Typography>
          <Typography variant="body1" color="text.secondary">Manage your account preferences and data</Typography>
        </Box>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ p: 1.5, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12), borderRadius: 2 }}>
                <PersonIcon sx={{ fontSize: 20, color: '#A78BFA' }} />
              </Box>
              <Typography variant="h6" sx={{ fontFamily: '"Roboto Flex", "Roboto", serif', fontWeight: 700 }}>Profile</Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
              <TextField fullWidth label="Full Name" defaultValue="Nishant Dougall" />
              <TextField fullWidth label="Email" defaultValue="nishant.dougall@email.com" />
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ mt: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ p: 1.5, bgcolor: (theme) => alpha(theme.palette.tertiary.main, 0.12), borderRadius: 2 }}>
                <NotificationsIcon sx={{ fontSize: 20, color: '#F472B6' }} />
              </Box>
              <Typography variant="h6" sx={{ fontFamily: '"Roboto Flex", "Roboto", serif', fontWeight: 700 }}>Notifications</Typography>
            </Box>
            <FormControlLabel control={<Switch defaultChecked />} label="Email Notifications" />
            <FormControlLabel control={<Switch />} label="Push Notifications" />
          </CardContent>
        </Card>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained">Save Changes</Button>
        </Box>
      </Box>
    </Container>
  );
};
