import {
  ArrowLeft,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Shield,
  Delete as DeleteIcon,
  Download,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import {
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
} from '@mui/material';
import { useState } from 'react';

import { Input } from '../../ui/input';
import { Switch } from '../../ui/switch';

interface SettingsProps {
  onBack: () => void;
}

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
    <div sx={{
      minHeight: "100vh",
      p: 4
    }}>
      <div sx={{}}>
        {/* Header */}
        <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      mb: 8
    }}>
          <Button variant="text" size="small" onClick={onBack}>
            <ArrowLeft sx={{
      mr: 2
    }} />
            Back to Dashboard
          </Button>
        </div>

        <div sx={{
      textAlign: "center",
      mb: 8
    }}>
          <h1 sx={{
      typography: "h3",
      fontWeight: 600,
      mb: 2
    }}>Settings</h1>
          <p sx={{}}>Manage your account preferences and data</p>
        </div>

        <div sx={{
      [theme.breakpoints.up('md')]: {},
      gap: 8
    }}>
          {/* Profile Settings */}
          <div sx={{}}>
            <Card sx={{
      p: 6
    }}>
              <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      mb: 6
    }}>
                <div sx={{
      p: 2,
      borderRadius: "0.5rem"
    }}>
                  <PersonIcon sx={{}} />
                </div>
                <h3 sx={{
      typography: "h5",
      fontWeight: 600
    }}>Profile Information</h3>
              </div>

              <div sx={{}}>
                <div>
                  <label sx={{
      typography: "body1",
      fontWeight: 500,
      mb: 2,}}>Full Name</label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>

                <div>
                  <label sx={{
      typography: "body1",
      fontWeight: 500,
      mb: 2,}}>Email Address</label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>

                <div>
                  <label sx={{
      typography: "body1",
      fontWeight: 500,
      mb: 2,}}>Phone Number</label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>

                <Button
                  onClick={handleProfileUpdate}
                  sx={{
      width: "100%",
      '&:hover': {}
    }}
                >
                  Update Profile
                </Button>
              </div>
            </Card>

            {/* Data Management */}
            <Card sx={{
      p: 6
    }}>
              <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      mb: 6
    }}>
                <div sx={{
      p: 2,
      borderRadius: "0.5rem"
    }}>
                  <Shield sx={{
      color: "blue.500"
    }} />
                </div>
                <h3 sx={{
      typography: "h5",
      fontWeight: 600
    }}>Data Management</h3>
              </div>

              <div sx={{}}>
                <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      p: 3,
      borderRadius: "0.5rem"
    }}>
                  <div>
                    <h4 sx={{
      fontWeight: 500
    }}>Export Data</h4>
                    <p sx={{
      typography: "body1",}}>
                      Download all your data in JSON format
                    </p>
                  </div>
                  <Button variant="outlined" size="small" onClick={handleExportData}>
                    <Download sx={{
      mr: 2
    }} />
                    Export
                  </Button>
                </div>

                <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      p: 3,
      borderRadius: "0.5rem"
    }}>
                  <div>
                    <h4 sx={{
      fontWeight: 500
    }}>Import Data</h4>
                    <p sx={{
      typography: "body1",}}>
                      Import data from another account
                    </p>
                  </div>
                  <Button variant="outlined" size="small" onClick={handleImportData}>
                    <CloudUploadIcon sx={{
      mr: 2
    }} />
                    Import
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Notification Settings */}
          <div sx={{}}>
            <Card sx={{
      p: 6
    }}>
              <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      mb: 6
    }}>
                <div sx={{
      p: 2,
      borderRadius: "0.5rem"
    }}>
                  <NotificationsIcon sx={{
      color: "yellow.500"
    }} />
                </div>
                <h3 sx={{
      typography: "h5",
      fontWeight: 600
    }}>Notification Preferences</h3>
              </div>

              <div sx={{}}>
                <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      p: 3,
      borderRadius: "0.5rem"
    }}>
                  <div>
                    <h4 sx={{
      fontWeight: 500
    }}>Email Alerts</h4>
                    <p sx={{
      typography: "body1",}}>
                      Receive important updates via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailAlerts: checked })
                    }
                  />
                </div>

                <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      p: 3,
      borderRadius: "0.5rem"
    }}>
                  <div>
                    <h4 sx={{
      fontWeight: 500
    }}>Job Match Notifications</h4>
                    <p sx={{
      typography: "body1",}}>
                      Get notified about new job matches
                    </p>
                  </div>
                  <Switch
                    checked={notifications.jobMatches}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, jobMatches: checked })
                    }
                  />
                </div>

                <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      p: 3,
      borderRadius: "0.5rem"
    }}>
                  <div>
                    <h4 sx={{
      fontWeight: 500
    }}>Application Updates</h4>
                    <p sx={{
      typography: "body1",}}>
                      Updates on your job applications
                    </p>
                  </div>
                  <Switch
                    checked={notifications.applicationUpdates}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, applicationUpdates: checked })
                    }
                  />
                </div>

                <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      p: 3,
      borderRadius: "0.5rem"
    }}>
                  <div>
                    <h4 sx={{
      fontWeight: 500
    }}>Weekly Digest</h4>
                    <p sx={{
      typography: "body1",}}>Weekly summary of your activity</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, weeklyDigest: checked })
                    }
                  />
                </div>
              </div>
            </Card>

            {/* Danger Zone */}
            <Card sx={{
      p: 6,}}>
              <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      mb: 6
    }}>
                <div sx={{
      p: 2,
      borderRadius: "0.5rem"
    }}>
                  <DeleteIcon sx={{}} />
                </div>
                <h3 sx={{
      typography: "h5",
      fontWeight: 600,}}>Danger Zone</h3>
              </div>

              <div sx={{}}>
                <div sx={{
      p: 4,
      border: 1,
      borderRadius: "0.5rem"
    }}>
                  <h4 sx={{
      fontWeight: 500,
      mb: 2
    }}>Delete Account</h4>
                  <p sx={{
      typography: "body1",
      mb: 4
    }}>
                    Permanently delete your account and all associated data. This action cannot be
                    undone.
                  </p>

                  {!showDeleteConfirm ? (
                    <Button variant="outlined" onClick={handleDeleteAccount} sx={{
      width: "100%"
    }}>
                      <DeleteIcon sx={{
      mr: 2
    }} />
                      Delete Account
                    </Button>
                  ) : (
                    <div sx={{}}>
                      <p sx={{
      typography: "body1",
      fontWeight: 500,}}>
                        Are you absolutely sure? This action cannot be undone.
                      </p>
                      <div sx={{
      display: "flex",
      gap: 3
    }}>
                        <Button
                          variant="outlined"
                          onClick={() => setShowDeleteConfirm(false)}
                          sx={{
      flex: 1
    }}
                        >
                          Cancel
                        </Button>
                        <Button variant="outlined" onClick={handleDeleteAccount} sx={{
      flex: 1
    }}>
                          Yes, Delete Forever
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Additional Info */}
        <Card sx={{
      mt: 8,
      p: 6,}}>
          <h3 sx={{
      fontWeight: 600,
      mb: 4
    }}>Account Information</h3>
          <div sx={{
      [theme.breakpoints.up('sm')]: {},
      gap: 4,
      typography: "body1"
    }}>
            <div>
              <p sx={{}}>Account created</p>
              <p sx={{
      fontWeight: 500
    }}>January 15, 2024</p>
            </div>
            <div>
              <p sx={{}}>Last login</p>
              <p sx={{
      fontWeight: 500
    }}>Today at 2:30 PM</p>
            </div>
            <div>
              <p sx={{}}>Data usage</p>
              <p sx={{
      fontWeight: 500
    }}>2.4 MB of 100 MB</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
