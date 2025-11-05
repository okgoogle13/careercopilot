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
      "bg-background": true,
      p: 4
    }}>
      <div sx={{
      "max-w-4xl": true,
      "mx-auto": true
    }}>
        {/* Header */}
        <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      mb: 8
    }}>
          <Button variant="text" size="small" onClick={onBack}>
            <ArrowLeft sx={{
      "w-4": true,
      "h-4": true,
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
      typography: h3,
      fontWeight: 600,
      mb: 2
    }}>Settings</h1>
          <p sx={{
      "text-muted-foreground": true
    }}>Manage your account preferences and data</p>
        </div>

        <div sx={{
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('md')]: { "grid-cols-2": true },
      gap: 8
    }}>
          {/* Profile Settings */}
          <div sx={{
      "space-y-6": true
    }}>
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
      "bg-primary/10": true,
      borderRadius: 0.5rem
    }}>
                  <PersonIcon sx={{
      "w-5": true,
      "h-5": true,
      "text-primary": true
    }} />
                </div>
                <h3 sx={{
      typography: h5,
      fontWeight: 600
    }}>Profile Information</h3>
              </div>

              <div sx={{
      "space-y-4": true
    }}>
                <div>
                  <label sx={{
      typography: body1,
      fontWeight: 500,
      mb: 2,
      "block": true
    }}>Full Name</label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>

                <div>
                  <label sx={{
      typography: body1,
      fontWeight: 500,
      mb: 2,
      "block": true
    }}>Email Address</label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>

                <div>
                  <label sx={{
      typography: body1,
      fontWeight: 500,
      mb: 2,
      "block": true
    }}>Phone Number</label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>

                <Button
                  onClick={handleProfileUpdate}
                  sx={{
      width: "100%",
      "bg-primary": true,
      '&:hover': { "bg-primary/90": true }
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
      "bg-blue-500/10": true,
      borderRadius: 0.5rem
    }}>
                  <Shield sx={{
      "w-5": true,
      "h-5": true,
      color: "blue.500"
    }} />
                </div>
                <h3 sx={{
      typography: h5,
      fontWeight: 600
    }}>Data Management</h3>
              </div>

              <div sx={{
      "space-y-4": true
    }}>
                <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      p: 3,
      "bg-card": true,
      borderRadius: 0.5rem
    }}>
                  <div>
                    <h4 sx={{
      fontWeight: 500
    }}>Export Data</h4>
                    <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>
                      Download all your data in JSON format
                    </p>
                  </div>
                  <Button variant="outlined" size="small" onClick={handleExportData}>
                    <Download sx={{
      "w-4": true,
      "h-4": true,
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
      "bg-card": true,
      borderRadius: 0.5rem
    }}>
                  <div>
                    <h4 sx={{
      fontWeight: 500
    }}>Import Data</h4>
                    <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>
                      Import data from another account
                    </p>
                  </div>
                  <Button variant="outlined" size="small" onClick={handleImportData}>
                    <CloudUploadIcon sx={{
      "w-4": true,
      "h-4": true,
      mr: 2
    }} />
                    Import
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Notification Settings */}
          <div sx={{
      "space-y-6": true
    }}>
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
      "bg-yellow-500/10": true,
      borderRadius: 0.5rem
    }}>
                  <NotificationsIcon sx={{
      "w-5": true,
      "h-5": true,
      color: "yellow.500"
    }} />
                </div>
                <h3 sx={{
      typography: h5,
      fontWeight: 600
    }}>Notification Preferences</h3>
              </div>

              <div sx={{
      "space-y-4": true
    }}>
                <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      p: 3,
      "bg-card": true,
      borderRadius: 0.5rem
    }}>
                  <div>
                    <h4 sx={{
      fontWeight: 500
    }}>Email Alerts</h4>
                    <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>
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
      "bg-card": true,
      borderRadius: 0.5rem
    }}>
                  <div>
                    <h4 sx={{
      fontWeight: 500
    }}>Job Match Notifications</h4>
                    <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>
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
      "bg-card": true,
      borderRadius: 0.5rem
    }}>
                  <div>
                    <h4 sx={{
      fontWeight: 500
    }}>Application Updates</h4>
                    <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>
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
      "bg-card": true,
      borderRadius: 0.5rem
    }}>
                  <div>
                    <h4 sx={{
      fontWeight: 500
    }}>Weekly Digest</h4>
                    <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Weekly summary of your activity</p>
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
      p: 6,
      "border-destructive/30": true,
      "bg-destructive/5": true
    }}>
              <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      mb: 6
    }}>
                <div sx={{
      p: 2,
      "bg-destructive/10": true,
      borderRadius: 0.5rem
    }}>
                  <DeleteIcon sx={{
      "w-5": true,
      "h-5": true,
      "text-destructive": true
    }} />
                </div>
                <h3 sx={{
      typography: h5,
      fontWeight: 600,
      "text-destructive": true
    }}>Danger Zone</h3>
              </div>

              <div sx={{
      "space-y-4": true
    }}>
                <div sx={{
      p: 4,
      "bg-background": true,
      border: 1,
      "border-destructive/30": true,
      borderRadius: 0.5rem
    }}>
                  <h4 sx={{
      fontWeight: 500,
      "text-destructive": true,
      mb: 2
    }}>Delete Account</h4>
                  <p sx={{
      typography: body1,
      "text-muted-foreground": true,
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
      "w-4": true,
      "h-4": true,
      mr: 2
    }} />
                      Delete Account
                    </Button>
                  ) : (
                    <div sx={{
      "space-y-3": true
    }}>
                      <p sx={{
      typography: body1,
      fontWeight: 500,
      "text-destructive": true
    }}>
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
      p: 6,
      "bg-muted/20": true
    }}>
          <h3 sx={{
      fontWeight: 600,
      mb: 4
    }}>Account Information</h3>
          <div sx={{
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-3": true },
      gap: 4,
      typography: body1
    }}>
            <div>
              <p sx={{
      "text-muted-foreground": true
    }}>Account created</p>
              <p sx={{
      fontWeight: 500
    }}>January 15, 2024</p>
            </div>
            <div>
              <p sx={{
      "text-muted-foreground": true
    }}>Last login</p>
              <p sx={{
      fontWeight: 500
    }}>Today at 2:30 PM</p>
            </div>
            <div>
              <p sx={{
      "text-muted-foreground": true
    }}>Data usage</p>
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
