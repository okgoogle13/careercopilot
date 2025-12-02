/**
 * Settings Page
 * Comprehensive settings interface with profile, preferences, notifications, privacy & security
 * Migrated to Electric Alchemist Design System v4.2
 */

import {
  Person,
  Security,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Save,
  Delete,
  Email,
  CloudUpload,
  CheckCircle,
  Warning,
  DarkMode,
  LightMode,
  Download as DownloadIcon,
  Help as HelpIcon,
  Refresh as RefreshIcon,
  PhoneAndroid,
  Sms as SmsIcon,
  BarChart,
  VpnKey as Key,
  Security as Shield,
  Computer,
  Help,
  Info,
  Analytics,
  DesktopWindows as DesktopWindowsIcon,
  Palette as PaletteIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import React, { useState } from 'react';

import {
  Container,
  Card,
  Button,
  Input,
  Textarea,
  Select,
  Switch,
  RadioGroup,
  Checkbox,
  Slider,
  Avatar,
  Tabs,
  Divider,
  Alert,
  Dialog,
  Progress,
} from '../components/electric';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </Box>
  );
}

interface SettingsPageProps {
  onSave?: (settings: any) => void;
  onExport?: () => void;
  onImport?: () => void;
}

export function SettingsPage(props: SettingsPageProps = {}) {
  const { onSave: onSaveProp, onExport: onExportProp, onImport: onImportProp } = props;
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Settings state
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Experienced software developer with a passion for creating innovative solutions.',
    avatar: '',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en-US',
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    autoSave: true,
    compactMode: false,
    animationsEnabled: true,
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    jobAlerts: true,
    analysisComplete: true,
    weeklyDigest: true,
    marketingEmails: false,
    securityAlerts: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    shareAnalytics: true,
    allowCookies: true,
    dataRetention: '2-years',
    twoFactorAuth: false,
    sessionTimeout: 30,
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleProfileChange = (field: string, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handlePreferencesChange = (field: string, value: any) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleNotificationsChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handlePrivacyChange = (field: string, value: any) => {
    setPrivacy((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    const allSettings = {
      profile,
      preferences,
      notifications,
      privacy,
    };

    console.log('Saving settings:', allSettings);
    setHasUnsavedChanges(false);

    if (onSaveProp) {
      onSaveProp(allSettings);
    } else {
      alert('Settings saved successfully!');
    }
  };

  const handleReset = () => {
    setHasUnsavedChanges(false);
  };

  const getGridProps = (xs: number, sm?: number, md?: number, lg?: number, xl?: number) => ({
    size: { xs, ...(sm && { sm }), ...(md && { md }), ...(lg && { lg }), ...(xl && { xl }) },
    item: true,
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account, preferences, and privacy settings
        </Typography>
      </Box>

      {hasUnsavedChanges && (
        <Alert
          severity="warning"
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Stack direction="row" spacing={1}>
              <Button color="inherit" size="small" onClick={handleReset}>
                Discard
              </Button>
              <Button color="inherit" size="small" variant="outlined" onClick={handleSave}>
                Save Changes
              </Button>
            </Stack>
          }
        >
          You have unsaved changes
        </Alert>
      )}

      <GridCompat container spacing={4}>
        <GridCompat {...getGridProps(12, 12, 3)}>
          <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Tabs
              orientation="vertical"
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Tab
                icon={<Person />}
                label="Profile"
                iconPosition="start"
                sx={{ justifyContent: 'flex-start', textTransform: 'none', minHeight: 60 }}
              />
              <Tab
                icon={<SettingsIcon />}
                label="Preferences"
                iconPosition="start"
                sx={{ justifyContent: 'flex-start', textTransform: 'none', minHeight: 60 }}
              />
              <Tab
                icon={<NotificationsIcon />}
                label="Notifications"
                iconPosition="start"
                sx={{ justifyContent: 'flex-start', textTransform: 'none', minHeight: 60 }}
              />
              <Tab
                icon={<Security />}
                label="Privacy & Security"
                iconPosition="start"
                sx={{ justifyContent: 'flex-start', textTransform: 'none', minHeight: 60 }}
              />
              <Tab
                icon={<CloudUpload />}
                label="Data & Storage"
                iconPosition="start"
                sx={{ justifyContent: 'flex-start', textTransform: 'none', minHeight: 60 }}
              />
              <Tab
                icon={<HelpIcon />}
                label="Help & Support"
                iconPosition="start"
                sx={{ justifyContent: 'flex-start', textTransform: 'none', minHeight: 60 }}
              />
            </Tabs>
          </Paper>
        </GridCompat>

        <GridCompat {...getGridProps(12, 12, 9)}>
          <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ px: 4 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Profile Information
                </Typography>

                <Card elevation={0} sx={{ border: 1, borderColor: 'divider', mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Avatar
                        src={profile.avatar}
                        sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}
                      >
                        {profile.firstName.charAt(0)}
                        {profile.lastName.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          Profile Photo
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Upload a photo to personalize your account
                        </Typography>
                        <Stack direction="row" spacing={2}>
                          <Button variant="outlined" startIcon={<CloudUpload />} size="small">
                            Upload Photo
                          </Button>
                          <Button variant="text" size="small" color="error">
                            Remove
                          </Button>
                        </Stack>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                <GridCompat container spacing={3}>
                  <GridCompat {...getGridProps(12, 6, 6)}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={profile.firstName}
                      onChange={(e) => handleProfileChange('firstName', e.target.value)}
                    />
                  </GridCompat>
                  <GridCompat {...getGridProps(12, 6, 6)}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={profile.lastName}
                      onChange={(e) => handleProfileChange('lastName', e.target.value)}
                    />
                  </GridCompat>
                  <GridCompat {...getGridProps(12, 6, 6)}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                    />
                  </GridCompat>
                  <GridCompat {...getGridProps(12, 6, 6)}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={profile.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                    />
                  </GridCompat>
                  <GridCompat {...getGridProps(12, 6, 6)}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={profile.location}
                      onChange={(e) => handleProfileChange('location', e.target.value)}
                    />
                  </GridCompat>
                  <GridCompat {...getGridProps(12, 6, 6)}>
                    <TextField
                      fullWidth
                      label="Website"
                      value={profile.website}
                      onChange={(e) => handleProfileChange('website', e.target.value)}
                    />
                  </GridCompat>
                  <GridCompat {...getGridProps(12, 12, 12)}>
                    <TextField
                      fullWidth
                      label="Bio"
                      multiline
                      rows={4}
                      value={profile.bio}
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                      helperText="Brief description about yourself"
                    />
                  </GridCompat>
                </GridCompat>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ px: 4 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Application Preferences
                </Typography>

                <GridCompat container spacing={3}>
                  <GridCompat {...getGridProps(12, 6)}>
                    <FormControl fullWidth>
                      <InputLabel>Theme</InputLabel>
                      <Select
                        value={preferences.theme}
                        label="Theme"
                        onChange={(e) => handlePreferencesChange('theme', e.target.value)}
                      >
                        <MenuItem value="light">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LightMode />
                            Light
                          </Box>
                        </MenuItem>
                        <MenuItem value="dark">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DarkMode />
                            Dark
                          </Box>
                        </MenuItem>
                        <MenuItem value="auto">System</MenuItem>
                      </Select>
                    </FormControl>
                  </GridCompat>

                  <GridCompat {...getGridProps(12, 6, 6)}>
                    <FormControl fullWidth>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={preferences.language}
                        label="Language"
                        onChange={(e) => handlePreferencesChange('language', e.target.value)}
                      >
                        <MenuItem value="en-US">English (US)</MenuItem>
                        <MenuItem value="en-GB">English (UK)</MenuItem>
                        <MenuItem value="es-ES">Español</MenuItem>
                        <MenuItem value="fr-FR">Français</MenuItem>
                        <MenuItem value="de-DE">Deutsch</MenuItem>
                      </Select>
                    </FormControl>
                  </GridCompat>

                  <GridCompat {...getGridProps(12, 6, 6)}>
                    <FormControl fullWidth>
                      <InputLabel>Timezone</InputLabel>
                      <Select
                        value={preferences.timezone}
                        label="Timezone"
                        onChange={(e) => handlePreferencesChange('timezone', e.target.value)}
                      >
                        <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                        <MenuItem value="America/Denver">Mountain Time</MenuItem>
                        <MenuItem value="America/Chicago">Central Time</MenuItem>
                        <MenuItem value="America/New_York">Eastern Time</MenuItem>
                        <MenuItem value="Europe/London">GMT</MenuItem>
                      </Select>
                    </FormControl>
                  </GridCompat>

                  <GridCompat {...getGridProps(12, 6, 6)}>
                    <FormControl fullWidth>
                      <InputLabel>Date Format</InputLabel>
                      <Select
                        value={preferences.dateFormat}
                        label="Date Format"
                        onChange={(e) => handlePreferencesChange('dateFormat', e.target.value)}
                      >
                        <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                        <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                        <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                      </Select>
                    </FormControl>
                  </GridCompat>

                  <GridCompat {...getGridProps(12, 12, 12)}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Interface Options
                    </Typography>
                  </GridCompat>

                  <GridCompat {...getGridProps(12, 12, 12)}>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <LockIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Auto-save"
                          secondary="Automatically save your work"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={preferences.autoSave}
                            onChange={(e) => handlePreferencesChange('autoSave', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>

                      <ListItem>
                        <ListItemIcon>
                          <DesktopWindowsIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Compact Mode"
                          secondary="Use a more compact interface"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={preferences.compactMode}
                            onChange={(e) =>
                              handlePreferencesChange('compactMode', e.target.checked)
                            }
                          />
                        </ListItemSecondaryAction>
                      </ListItem>

                      <ListItem>
                        <ListItemIcon>
                          <PaletteIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Animations"
                          secondary="Enable interface animations"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={preferences.animationsEnabled}
                            onChange={(e) =>
                              handlePreferencesChange('animationsEnabled', e.target.checked)
                            }
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </GridCompat>
                </GridCompat>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ px: 4 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Notification Preferences
                </Typography>

                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email Notifications"
                      secondary="Receive notifications via email"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notifications.emailNotifications}
                        onChange={(e) =>
                          handleNotificationsChange('emailNotifications', e.target.checked)
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <PhoneAndroid />
                    </ListItemIcon>
                    <ListItemText
                      primary="Push Notifications"
                      secondary="Receive push notifications on your device"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notifications.pushNotifications}
                        onChange={(e) =>
                          handleNotificationsChange('pushNotifications', e.target.checked)
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <SmsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="SMS Notifications"
                      secondary="Receive important alerts via SMS"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notifications.smsNotifications}
                        onChange={(e) =>
                          handleNotificationsChange('smsNotifications', e.target.checked)
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <Divider />

                  <ListItem>
                    <ListItemIcon>
                      <BarChart />
                    </ListItemIcon>
                    <ListItemText
                      primary="Job Alerts"
                      secondary="Get notified about new job opportunities"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notifications.jobAlerts}
                        onChange={(e) => handleNotificationsChange('jobAlerts', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle />
                    </ListItemIcon>
                    <ListItemText
                      primary="Analysis Complete"
                      secondary="When document analysis is finished"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notifications.analysisComplete}
                        onChange={(e) =>
                          handleNotificationsChange('analysisComplete', e.target.checked)
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Weekly Digest"
                      secondary="Weekly summary of your activity"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notifications.weeklyDigest}
                        onChange={(e) =>
                          handleNotificationsChange('weeklyDigest', e.target.checked)
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText
                      primary="Security Alerts"
                      secondary="Important security notifications"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={notifications.securityAlerts}
                        onChange={(e) =>
                          handleNotificationsChange('securityAlerts', e.target.checked)
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Box sx={{ px: 4 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Privacy & Security
                </Typography>

                <GridCompat container spacing={3}>
                  <GridCompat {...getGridProps(12, 12, 12)}>
                    <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Account Security
                        </Typography>

                        <List>
                          <ListItem>
                            <ListItemIcon>
                              <Key />
                            </ListItemIcon>
                            <ListItemText
                              primary="Change Password"
                              secondary="Update your account password"
                            />
                            <ListItemSecondaryAction>
                              <Button variant="outlined" size="small">
                                Change
                              </Button>
                            </ListItemSecondaryAction>
                          </ListItem>

                          <ListItem>
                            <ListItemIcon>
                              <Shield />
                            </ListItemIcon>
                            <ListItemText
                              primary="Two-Factor Authentication"
                              secondary="Add an extra layer of security"
                            />
                            <ListItemSecondaryAction>
                              <Switch
                                checked={privacy.twoFactorAuth}
                                onChange={(e) =>
                                  handlePrivacyChange('twoFactorAuth', e.target.checked)
                                }
                              />
                            </ListItemSecondaryAction>
                          </ListItem>

                          <ListItem>
                            <ListItemIcon>
                              <Computer />
                            </ListItemIcon>
                            <ListItemText
                              primary="Active Sessions"
                              secondary="Manage your logged-in devices"
                            />
                            <ListItemSecondaryAction>
                              <Button variant="outlined" size="small">
                                Manage
                              </Button>
                            </ListItemSecondaryAction>
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </GridCompat>

                  <GridCompat {...getGridProps(12, 12, 12)}>
                    <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Privacy Settings
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Profile Visibility
                          </Typography>
                          <RadioGroup
                            value={privacy.profileVisibility}
                            onChange={(e) =>
                              handlePrivacyChange('profileVisibility', e.target.value)
                            }
                          >
                            <FormControlLabel value="public" control={<Radio />} label="Public" />
                            <FormControlLabel value="private" control={<Radio />} label="Private" />
                            <FormControlLabel
                              value="contacts"
                              control={<Radio />}
                              label="Contacts Only"
                            />
                          </RadioGroup>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Session Timeout (minutes)
                          </Typography>
                          <Slider
                            value={privacy.sessionTimeout}
                            onChange={(e, value) => handlePrivacyChange('sessionTimeout', value)}
                            min={15}
                            max={120}
                            step={15}
                            marks
                            valueLabelDisplay="auto"
                          />
                        </Box>

                        <List>
                          <ListItem>
                            <ListItemText
                              primary="Share Analytics"
                              secondary="Help improve the service with anonymous usage data"
                            />
                            <ListItemSecondaryAction>
                              <Switch
                                checked={privacy.shareAnalytics}
                                onChange={(e) =>
                                  handlePrivacyChange('shareAnalytics', e.target.checked)
                                }
                              />
                            </ListItemSecondaryAction>
                          </ListItem>

                          <ListItem>
                            <ListItemText
                              primary="Allow Cookies"
                              secondary="Enable cookies for better user experience"
                            />
                            <ListItemSecondaryAction>
                              <Switch
                                checked={privacy.allowCookies}
                                onChange={(e) =>
                                  handlePrivacyChange('allowCookies', e.target.checked)
                                }
                              />
                            </ListItemSecondaryAction>
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </GridCompat>
                </GridCompat>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={4}>
              <Box sx={{ px: 4 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Data & Storage
                </Typography>

                <GridCompat container spacing={3}>
                  <GridCompat {...getGridProps(12, 12, 6)}>
                    <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Storage Usage
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Used: 2.3 GB of 10 GB
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={23}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>

                        <List>
                          <ListItem>
                            <ListItemText primary="Documents" secondary="1.8 GB" />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="Images" secondary="300 MB" />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="Cache" secondary="200 MB" />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </GridCompat>

                  <GridCompat {...getGridProps(12, 12, 6)}>
                    <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Data Management
                        </Typography>

                        <Stack spacing={2}>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={() => setExportDialogOpen(true)}
                          >
                            Export Data
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<CloudUpload />}
                            onClick={() => {
                              const data = { profile, preferences, notifications, privacy };
                              const dataStr = JSON.stringify(data, null, 2);
                              const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
                                dataStr
                              )}`;

                              const exportName = `career-copilot-settings-${
                                new Date().toISOString().split('T')[0]
                              }.json`;
                              const linkElement = document.createElement('a');
                              linkElement.setAttribute('href', dataUri);
                              linkElement.setAttribute('download', exportName);
                              linkElement.click();
                            }}
                          >
                            Import Data
                          </Button>
                          <Button fullWidth variant="outlined" startIcon={<CloudUpload />}>
                            Create Backup
                          </Button>
                          <Button fullWidth variant="outlined" startIcon={<RefreshIcon />}>
                            Clear Cache
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </GridCompat>

                  <GridCompat {...getGridProps(12, 12, 12)}>
                    <Card elevation={0} sx={{ border: 1, borderColor: 'error.main' }}>
                      <CardContent>
                        <Typography variant="h6" color="error" gutterBottom>
                          Danger Zone
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          These actions cannot be undone. Please proceed with caution.
                        </Typography>

                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => setDeleteDialogOpen(true)}
                          >
                            Delete Account
                          </Button>
                          <Button variant="outlined" color="warning" startIcon={<Warning />}>
                            Reset All Settings
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </GridCompat>
                </GridCompat>
              </Box>
            </TabPanel>

            {/* Help & Support Tab */}
            <TabPanel value={tabValue} index={5}>
              <Box sx={{ px: 4 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Help & Support
                </Typography>

                <GridCompat container spacing={3}>
                  <GridCompat {...getGridProps(12, 12, 6)}>
                    <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Get Help
                        </Typography>

                        <Stack spacing={2}>
                          <Button fullWidth variant="outlined" startIcon={<Help />}>
                            View Documentation
                          </Button>
                          <Button fullWidth variant="outlined" startIcon={<Email />}>
                            Contact Support
                          </Button>
                          <Button fullWidth variant="outlined" startIcon={<Info />}>
                            Report Bug
                          </Button>
                          <Button fullWidth variant="outlined" startIcon={<Analytics />}>
                            Feature Request
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </GridCompat>

                  <GridCompat {...getGridProps(12, 12, 6)}>
                    <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          About
                        </Typography>

                        <List>
                          <ListItem>
                            <ListItemText primary="Version" secondary="2.1.0" />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="Last Updated" secondary="March 15, 2024" />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="License" secondary="MIT License" />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="Terms of Service" />
                            <ListItemSecondaryAction>
                              <Button size="small">View</Button>
                            </ListItemSecondaryAction>
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="Privacy Policy" />
                            <ListItemSecondaryAction>
                              <Button size="small">View</Button>
                            </ListItemSecondaryAction>
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </GridCompat>
                </GridCompat>
              </Box>
            </TabPanel>

            {/* Save Button */}
            <Box sx={{ p: 4, borderTop: 1, borderColor: 'divider' }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={handleReset}>
                  Reset
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges}
                  startIcon={<Save />}
                >
                  Save Changes
                </Button>
              </Stack>
            </Box>
          </Paper>
        </GridCompat>
      </GridCompat>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle color="error">Delete Account</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
          <Alert severity="error" sx={{ mt: 2 }}>
            All your data will be permanently deleted.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Data Dialog */}
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
        <DialogTitle>Export Your Data</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>Choose what data you'd like to export:</Typography>
          <Stack spacing={1} sx={{ mt: 2 }}>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Profile Information" />
            <FormControlLabel control={<Checkbox defaultChecked />} label="Documents" />
            <FormControlLabel control={<Checkbox defaultChecked />} label="Analysis Reports" />
            <FormControlLabel control={<Checkbox />} label="Application History" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (onExportProp) {
                onExportProp();
              }
              setExportDialogOpen(false);
            }}
          >
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
