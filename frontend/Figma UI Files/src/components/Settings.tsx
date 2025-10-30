import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { ArrowLeft, User, Bell, Shield, Trash2, Download, Upload } from "lucide-react";

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const [profile, setProfile] = useState({
    name: "Nishant Dougall",
    email: "nishant.dougall@email.com",
    phone: "+61 4XX XXX XXX"
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    jobMatches: true,
    applicationUpdates: false,
    weeklyDigest: true
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleProfileUpdate = () => {
    // Handle profile update
    console.log("Profile updated:", profile);
  };

  const handleExportData = () => {
    // Handle data export
    console.log("Exporting user data...");
  };

  const handleImportData = () => {
    // Handle data import
    console.log("Importing user data...");
  };

  const handleDeleteAccount = () => {
    if (showDeleteConfirm) {
      // Handle account deletion
      console.log("Account deleted");
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Profile Information</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number</label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  />
                </div>

                <Button onClick={handleProfileUpdate} className="w-full bg-primary hover:bg-primary/90">
                  Update Profile
                </Button>
              </div>
            </Card>

            {/* Data Management */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold">Data Management</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                  <div>
                    <h4 className="font-medium">Export Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Download all your data in JSON format
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleExportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                  <div>
                    <h4 className="font-medium">Import Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Import data from another account
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleImportData}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Notification Settings */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Bell className="w-5 h-5 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold">Notification Preferences</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive important updates via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailAlerts}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, emailAlerts: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                  <div>
                    <h4 className="font-medium">Job Match Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new job matches
                    </p>
                  </div>
                  <Switch
                    checked={notifications.jobMatches}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, jobMatches: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                  <div>
                    <h4 className="font-medium">Application Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Updates on your job applications
                    </p>
                  </div>
                  <Switch
                    checked={notifications.applicationUpdates}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, applicationUpdates: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                  <div>
                    <h4 className="font-medium">Weekly Digest</h4>
                    <p className="text-sm text-muted-foreground">
                      Weekly summary of your activity
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, weeklyDigest: checked})
                    }
                  />
                </div>
              </div>
            </Card>

            {/* Danger Zone */}
            <Card className="p-6 border-destructive/30 bg-destructive/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <Trash2 className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold text-destructive">Danger Zone</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-background border border-destructive/30 rounded-lg">
                  <h4 className="font-medium text-destructive mb-2">Delete Account</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  
                  {!showDeleteConfirm ? (
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-destructive">
                        Are you absolutely sure? This action cannot be undone.
                      </p>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteAccount}
                          className="flex-1"
                        >
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
        <Card className="mt-8 p-6 bg-muted/20">
          <h3 className="font-semibold mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Account created</p>
              <p className="font-medium">January 15, 2024</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last login</p>
              <p className="font-medium">Today at 2:30 PM</p>
            </div>
            <div>
              <p className="text-muted-foreground">Data usage</p>
              <p className="font-medium">2.4 MB of 100 MB</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}