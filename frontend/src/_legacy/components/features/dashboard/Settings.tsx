import {
  ArrowLeft,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Download,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Shield,
} from '@mui/icons-material';
import { Box, Button, Card } from '@mui/material';
import { useState } from 'react';

import { Input } from '../../input/input';
import { Switch } from '../../switch/switch';

// ... (interface and state definitions remain the same)

export function Settings({ onBack }: SettingsProps) {
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
    // Handle profile update
    console.log('Profile updated:', profile);
  };

  const handleExportData = () => {
    // Handle data export
    console.log('Exporting user data...');
  };

  const handleImportData = () => {
    // Handle data import
    console.log('Importing user data...');
  };

  const handleDeleteAccount = () => {
    if (showDeleteConfirm) {
      // Handle account deletion
      console.log('Account deleted');
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <Box sx={{ backgroundColor: 'var(--sys-color-surface)', minHeight: '100vh', padding: 'var(--sys-spacing-4)' }}>
      <Box sx={{ maxWidth: '1200px', margin: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-spacing-4)', marginBottom: 'var(--sys-spacing-8)' }}>
          <Button
            variant="text"
            size="small"
            onClick={onBack}
            sx={{ color: 'var(--sys-color-on-surface-variant)' }}
          >
            <ArrowLeft sx={{ marginRight: 'var(--sys-spacing-2)' }} />
            Back to Dashboard
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', marginBottom: 'var(--sys-spacing-8)' }}>
          <h1 style={{ font: 'var(--sys-type-display-small)', color: 'var(--sys-color-on-surface)' }}>Settings</h1>
          <p style={{ font: 'var(--sys-type-title-medium)', color: 'var(--sys-color-on-surface-variant)' }}>
            Manage your account preferences and data
          </p>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 'var(--sys-spacing-8)' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--sys-spacing-6)' }}>
            <Card sx={{ padding: 'var(--sys-spacing-6)', borderRadius: 'var(--shape-corner-large)', boxShadow: 'var(--elevation-level1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-spacing-3)', marginBottom: 'var(--sys-spacing-6)' }}>
                <Box sx={{ padding: 'var(--sys-spacing-2)', borderRadius: 'var(--shape-corner-medium)', backgroundColor: 'var(--sys-color-primary-container)' }}>
                  <PersonIcon sx={{ color: 'var(--sys-color-on-primary-container)' }} />
                </Box>
                <h3 style={{ font: 'var(--sys-type-title-large)', color: 'var(--sys-color-on-surface)' }}>Profile Information</h3>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--sys-spacing-4)' }}>
                <div>
                  <label style={{ font: 'var(--sys-type-body-medium)', color: 'var(--sys-color-on-surface-variant)', marginBottom: 'var(--sys-spacing-2)' }}>Full Name</label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ font: 'var(--sys-type-body-medium)', color: 'var(--sys-color-on-surface-variant)', marginBottom: 'var(--sys-spacing-2)' }}>Email Address</label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ font: 'var(--sys-type-body-medium)', color: 'var(--sys-color-on-surface-variant)', marginBottom: 'var(--sys-spacing-2)' }}>Phone Number</label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <Button
                  onClick={handleProfileUpdate}
                  variant="contained"
                  sx={{ width: '100%', backgroundColor: 'var(--sys-color-primary)', color: 'var(--sys-color-on-primary)' }}
                >
                  Update Profile
                </Button>
              </Box>
            </Card>
            <Card sx={{ padding: 'var(--sys-spacing-6)', borderRadius: 'var(--shape-corner-large)', boxShadow: 'var(--elevation-level1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-spacing-3)', marginBottom: 'var(--sys-spacing-6)' }}>
                <Box sx={{ padding: 'var(--sys-spacing-2)', borderRadius: 'var(--shape-corner-medium)', backgroundColor: 'var(--sys-color-secondary-container)' }}>
                  <Shield sx={{ color: 'var(--sys-color-on-secondary-container)' }} />
                </Box>
                <h3 style={{ font: 'var(--sys-type-title-large)', color: 'var(--sys-color-on-surface)' }}>Data Management</h3>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--sys-spacing-4)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--sys-spacing-3)', borderRadius: 'var(--shape-corner-medium)', backgroundColor: 'var(--sys-color-surface-container-low)' }}>
                  <div>
                    <h4 style={{ font: 'var(--sys-type-title-medium)', color: 'var(--sys-color-on-surface)' }}>Export Data</h4>
                    <p style={{ font: 'var(--sys-type-body-medium)', color: 'var(--sys-color-on-surface-variant)' }}>
                      Download all your data in JSON format
                    </p>
                  </div>
                  <Button variant="outlined" size="small" onClick={handleExportData}>
                    <Download sx={{ marginRight: 'var(--sys-spacing-2)' }} />
                    Export
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--sys-spacing-3)', borderRadius: 'var(--shape-corner-medium)', backgroundColor: 'var(--sys-color-surface-container-low)' }}>
                  <div>
                    <h4 style={{ font: 'var(--sys-type-title-medium)', color: 'var(--sys-color-on-surface)' }}>Import Data</h4>
                    <p style={{ font: 'var(--sys-type-body-medium)', color: 'var(--sys-color-on-surface-variant)' }}>
                      Import data from another account
                    </p>
                  </div>
                  <Button variant="outlined" size="small" onClick={handleImportData}>
                    <CloudUploadIcon sx={{ marginRight: 'var(--sys-spacing-2)' }} />
                    Import
                  </Button>
                </Box>
              </Box>
            </Card>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--sys-spacing-6)' }}>
            <Card sx={{ padding: 'var(--sys-spacing-6)', borderRadius: 'var(--shape-corner-large)', boxShadow: 'var(--elevation-level1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-spacing-3)', marginBottom: 'var(--sys-spacing-6)' }}>
                <Box sx={{ padding: 'var(--sys-spacing-2)', borderRadius: 'var(--shape-corner-medium)', backgroundColor: 'var(--sys-color-tertiary-container)' }}>
                  <NotificationsIcon sx={{ color: 'var(--sys-color-on-tertiary-container)' }} />
                </Box>
                <h3 style={{ font: 'var(--sys-type-title-large)', color: 'var(--sys-color-on-surface)' }}>Notification Preferences</h3>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--sys-spacing-4)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--sys-spacing-3)', borderRadius: 'var(--shape-corner-medium)', backgroundColor: 'var(--sys-color-surface-container-low)' }}>
                  <div>
                    <h4 style={{ font: 'var(--sys-type-title-medium)', color: 'var(--sys-color-on-surface)' }}>Email Alerts</h4>
                    <p style={{ font: 'var(--sys-type-body-medium)', color: 'var(--sys-color-on-surface-variant)' }}>
                      Receive important updates via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailAlerts: checked })
                    }
                  />
                </Box>
                {/* ... other notification items */}
              </Box>
            </Card>
            <Card sx={{ padding: 'var(--sys-spacing-6)', borderRadius: 'var(--shape-corner-large)', backgroundColor: 'var(--sys-color-error-container)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-spacing-3)', marginBottom: 'var(--sys-spacing-6)' }}>
                <Box sx={{ padding: 'var(--sys-spacing-2)', borderRadius: 'var(--shape-corner-medium)', backgroundColor: 'var(--sys-color-error)' }}>
                  <DeleteIcon sx={{ color: 'var(--sys-color-on-error)' }} />
                </Box>
                <h3 style={{ font: 'var(--sys-type-title-large)', color: 'var(--sys-color-on-error-container)' }}>Danger Zone</h3>
              </Box>
              <Box sx={{ padding: 'var(--sys-spacing-4)', border: '1px solid var(--sys-color-error)', borderRadius: 'var(--shape-corner-medium)' }}>
                <h4 style={{ font: 'var(--sys-type-title-medium)', color: 'var(--sys-color-on-error-container)', marginBottom: 'var(--sys-spacing-2)' }}>Delete Account</h4>
                <p style={{ font: 'var(--sys-type-body-medium)', color: 'var(--sys-color-on-error-container)', marginBottom: 'var(--sys-spacing-4)' }}>
                  Permanently delete your account and all associated data. This action cannot be
                  undone.
                </p>
                {!showDeleteConfirm ? (
                  <Button variant="outlined" onClick={handleDeleteAccount} sx={{ width: '100%', borderColor: 'var(--sys-color-error)', color: 'var(--sys-color-error)' }}>
                    <DeleteIcon sx={{ marginRight: 'var(--sys-spacing-2)' }} />
                    Delete Account
                  </Button>
                ) : (
                  <Box>
                    <p style={{ font: 'var(--sys-type-body-medium)', color: 'var(--sys-color-on-error-container)' }}>
                      Are you absolutely sure? This action cannot be undone.
                    </p>
                    <Box sx={{ display: 'flex', gap: 'var(--sys-spacing-3)' }}>
                      <Button
                        variant="outlined"
                        onClick={() => setShowDeleteConfirm(false)}
                        sx={{ flex: 1, borderColor: 'var(--sys-color-error)', color: 'var(--sys-color-error)' }}
                      >
                        Cancel
                      </Button>
                      <Button variant="contained" onClick={handleDeleteAccount} sx={{ flex: 1, backgroundColor: 'var(--sys-color-error)', color: 'var(--sys-color-on-error)' }}>
                        Yes, Delete Forever
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Card>
          </Box>
        </Box>

        <Card sx={{ marginTop: 'var(--sys-spacing-8)', padding: 'var(--sys-spacing-6)', borderRadius: 'var(--shape-corner-large)', boxShadow: 'var(--elevation-level1)' }}>
          <h3 style={{ font: 'var(--sys-type-title-medium)', marginBottom: 'var(--sys-spacing-4)' }}>
            Account Information
          </h3>
          <Box sx={{ display: 'grid', gridTemplateColumns: { sm: 'repeat(3, 1fr)' }, gap: 'var(--sys-spacing-4)' }}>
            <div>
              <p style={{ font: 'var(--sys-type-body-small)', color: 'var(--sys-color-on-surface-variant)' }}>
                Account created
              </p>
              <p style={{ font: 'var(--sys-type-body-large)', fontWeight: 500 }}>January 15, 2024</p>
            </div>
            {/* ... other info items */}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
