import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

export interface SettingsProps {
  onSave?: (settings: any) => void;
}

const SettingsPage: React.FC<SettingsProps> = ({ onSave }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    emailAlerts: true,
  });

  const handleSettingChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSettings = { ...settings, [key]: event.target.checked };
    setSettings(newSettings);
    onSave?.(newSettings);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account preferences
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Preferences
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <List>
          <ListItem>
            <ListItemText
              primary="Email Notifications"
              secondary="Receive notifications via email"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications}
                  onChange={handleSettingChange('notifications')}
                />
              }
              label=""
            />
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Dark Mode"
              secondary="Use dark theme"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={handleSettingChange('darkMode')}
                />
              }
              label=""
            />
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Email Alerts"
              secondary="Receive job alerts via email"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailAlerts}
                  onChange={handleSettingChange('emailAlerts')}
                />
              }
              label=""
            />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default SettingsPage;