import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Switch,
  Grid,
  Divider,
  alpha,
} from '@mui/material';
import { ArrowLeft, User, Bell, Shield, Trash2, Download, Upload } from 'lucide-react';

export interface SettingsProps {
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const [profile, setProfile] = useState({
    name: 'Nishant Dougall',
    email: 'nishant.dougall@email.com',
    phone: '+61 4XX XXX XXX',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    jobMatches: true,
    applicationUpdates: false,
    weeklyDigest: true,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleProfileUpdate = () => {
    console.log('Profile updated:', profile);
  };

  const handleExportData = () => {
    console.log('Exporting user data...');
  };

  const handleImportData = () => {
    console.log('Importing user data...');
  };

  const handleDeleteAccount = () => {
    if (showDeleteConfirm) {
      console.log('Account deleted');
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 6 }}>
          <Button variant="text" size="small" startIcon={<ArrowLeft size={16} />} onClick={onBack}>
            Back to Dashboard
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 600, mb: 1 }}>
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account preferences and data
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Profile Settings */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Card variant="glass">
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                        borderRadius: 2,
                      }}
                    >
                      <User size={20} color="#A78BFA" />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Profile Information
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        Full Name
                      </Typography>
                      <TextField
                        fullWidth
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </Box>

                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        Email Address
                      </Typography>
                      <TextField
                        fullWidth
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </Box>

                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        Phone Number
                      </Typography>
                      <TextField
                        fullWidth
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </Box>

                    <Button variant="aurora" onClick={handleProfileUpdate} fullWidth>
                      Update Profile
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Data Management */}
              <Card variant="glass">
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: (theme) => alpha('#60a5fa', 0.1),
                        borderRadius: 2,
                      }}
                    >
                      <Shield size={20} color="#60a5fa" />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Data Management
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        bgcolor: 'surface.container',
                        borderRadius: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Export Data
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Download all your data in JSON format
                        </Typography>
                      </Box>
                      <Button variant="outlined" size="small" startIcon={<Download size={16} />} onClick={handleExportData}>
                        Export
                      </Button>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        bgcolor: 'surface.container',
                        borderRadius: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Import Data
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Import data from another account
                        </Typography>
                      </Box>
                      <Button variant="outlined" size="small" startIcon={<Upload size={16} />} onClick={handleImportData}>
                        Import
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Notification Settings */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Card variant="glass">
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: (theme) => alpha('#fbbf24', 0.1),
                        borderRadius: 2,
                      }}
                    >
                      <Bell size={20} color="#fbbf24" />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Notification Preferences
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        bgcolor: 'surface.container',
                        borderRadius: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Email Alerts
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Receive important updates via email
                        </Typography>
                      </Box>
                      <Switch
                        checked={notifications.emailAlerts}
                        onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        bgcolor: 'surface.container',
                        borderRadius: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Job Match Notifications
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Get notified about new job matches
                        </Typography>
                      </Box>
                      <Switch
                        checked={notifications.jobMatches}
                        onChange={(e) => setNotifications({ ...notifications, jobMatches: e.target.checked })}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        bgcolor: 'surface.container',
                        borderRadius: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Application Updates
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Updates on your job applications
                        </Typography>
                      </Box>
                      <Switch
                        checked={notifications.applicationUpdates}
                        onChange={(e) => setNotifications({ ...notifications, applicationUpdates: e.target.checked })}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        bgcolor: 'surface.container',
                        borderRadius: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Weekly Digest
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Weekly summary of your activity
                        </Typography>
                      </Box>
                      <Switch
                        checked={notifications.weeklyDigest}
                        onChange={(e) => setNotifications({ ...notifications, weeklyDigest: e.target.checked })}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card
                sx={{
                  borderColor: (theme) => alpha(theme.palette.error.main, 0.3),
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.05),
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                        borderRadius: 2,
                      }}
                    >
                      <Trash2 size={20} color="#FFB4AB" />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                      Danger Zone
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 3,
                      bgcolor: 'background.default',
                      border: 1,
                      borderColor: (theme) => alpha(theme.palette.error.main, 0.3),
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main', mb: 1 }}>
                      Delete Account
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </Typography>

                    {!showDeleteConfirm ? (
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<Trash2 size={16} />}
                        onClick={handleDeleteAccount}
                        fullWidth
                      >
                        Delete Account
                      </Button>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
                          Are you absolutely sure? This action cannot be undone.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Button variant="outlined" onClick={() => setShowDeleteConfirm(false)} sx={{ flex: 1 }}>
                            Cancel
                          </Button>
                          <Button variant="contained" color="error" onClick={handleDeleteAccount} sx={{ flex: 1 }}>
                            Yes, Delete Forever
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>

        {/* Additional Info */}
        <Card
          sx={{
            mt: 6,
            bgcolor: (theme) => alpha(theme.palette.surface.container, 0.2),
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Account Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Account created
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  January 15, 2024
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Last login
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Today at 2:30 PM
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Data usage
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  2.4 MB of 100 MB
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Settings;
