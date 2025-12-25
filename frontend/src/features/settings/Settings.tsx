import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { PageHeader } from '../../components/shared/PageHeader';

export function Settings() {
  const [firstName, setFirstName] = useState('Nishant');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('nishant@example.com');
  const [bio, setBio] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [applicationUpdates, setApplicationUpdates] = useState(true);
  const [jobMatches, setJobMatches] = useState(false);

  // Reusable card style
  const cardStyle = {
    backgroundImage: 'radial-gradient(circle, var(--sys-color-primary) 1px, transparent 1px)',
    backgroundSize: '20px 20px',
    backgroundBlendMode: 'overlay',
    backgroundPosition: '0 0',
  };

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500 ease-spring">
      {/* Header */}
      <PageHeader
        title="Settings"
        description="Manage your account preferences and settings"
      />

      {/* Tabs */}
      <Tabs
        defaultValue="profile"
        className="w-full"
      >
        <TabsList className="bg-surface-container border border-outline-variant mb-8 p-1 rounded-tech h-auto shadow-sm">
          {['Profile', 'Preferences', 'Notifications', 'Security'].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab.toLowerCase()}
              className="rounded-pebble data-[state=active]:bg-primary-container data-[state=active]:text-on-primary-container data-[state=active]:shadow-sm text-on-surface-variant hover:text-on-surface transition-all px-6 py-2 ease-spring duration-300"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div
            className="bg-surface-container rounded-tech p-8 border border-outline-variant shadow-elevation-1"
            style={cardStyle}
          >
            <h3 className="text-on-surface mb-6 text-headline-small font-bold">Profile Settings</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-on-surface-variant mb-2 font-medium">First Name</label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-surface-container-high border-outline-variant text-on-surface rounded-pebble h-12 focus:ring-primary focus:border-primary transition-all ease-spring"
                  />
                </div>
                <div>
                  <label className="block text-sm text-on-surface-variant mb-2 font-medium">Last Name</label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-surface-container-high border-outline-variant text-on-surface rounded-pebble h-12 focus:ring-primary focus:border-primary transition-all ease-spring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-on-surface-variant mb-2 font-medium">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-surface-container-high border-outline-variant text-on-surface rounded-pebble h-12 focus:ring-primary focus:border-primary transition-all ease-spring"
                />
              </div>

              <div>
                <label className="block text-sm text-on-surface-variant mb-2 font-medium">Bio</label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="bg-surface-container-high border-outline-variant text-on-surface rounded-tech focus:ring-primary focus:border-primary resize-none transition-all ease-spring"
                />
              </div>

              <Button className="bg-primary text-on-primary hover:bg-primary/90 rounded-gem px-8 h-12 shadow-sm hover:shadow-elevation-1 transition-all ease-spring">
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <div
            className="bg-surface-container rounded-tech p-8 border border-outline-variant shadow-elevation-1"
            style={cardStyle}
          >
            <h3 className="text-on-surface mb-6 text-headline-small font-bold">Preferences</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-outline-variant">
                <div>
                  <p className="text-on-surface font-medium">Dark Mode</p>
                  <p className="text-sm text-on-surface-variant">Use dark theme throughout the app</p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              <div className="flex items-center justify-between py-4 border-b border-outline-variant">
                <div>
                  <p className="text-on-surface font-medium">Email Notifications</p>
                  <p className="text-sm text-on-surface-variant">Receive email updates and notifications</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div
            className="bg-surface-container rounded-tech p-8 border border-outline-variant shadow-elevation-1"
            style={cardStyle}
          >
            <h3 className="text-on-surface mb-6 text-headline-small font-bold">Notification Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-outline-variant">
                <div>
                  <p className="text-on-surface font-medium">Application Updates</p>
                  <p className="text-sm text-on-surface-variant">
                    Get notified about application status changes
                  </p>
                </div>
                <Switch
                  checked={applicationUpdates}
                  onCheckedChange={setApplicationUpdates}
                />
              </div>

              <div className="flex items-center justify-between py-4 border-b border-outline-variant">
                <div>
                  <p className="text-on-surface font-medium">Job Matches</p>
                  <p className="text-sm text-on-surface-variant">
                    Receive notifications for matching job opportunities
                  </p>
                </div>
                <Switch
                  checked={jobMatches}
                  onCheckedChange={setJobMatches}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div
            className="bg-surface-container rounded-tech p-8 border border-outline-variant shadow-elevation-1"
            style={cardStyle}
          >
            <h3 className="text-on-surface mb-6 text-headline-small font-bold">Security Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-on-surface-variant mb-2 font-medium">Current Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-surface-container-high border-outline-variant text-on-surface rounded-pebble h-12 focus:ring-primary focus:border-primary transition-all ease-spring"
                />
              </div>

              <div>
                <label className="block text-sm text-on-surface-variant mb-2 font-medium">New Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-surface-container-high border-outline-variant text-on-surface rounded-pebble h-12 focus:ring-primary focus:border-primary transition-all ease-spring"
                />
              </div>

              <div>
                <label className="block text-sm text-on-surface-variant mb-2 font-medium">Confirm New Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-surface-container-high border-outline-variant text-on-surface rounded-pebble h-12 focus:ring-primary focus:border-primary transition-all ease-spring"
                />
              </div>

              <Button className="bg-primary text-on-primary hover:bg-primary/90 rounded-gem px-8 h-12 shadow-sm hover:shadow-elevation-1 transition-all ease-spring">
                Update Password
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
