import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@careercopilot/ui';
import { Input } from '@careercopilot/ui';
import { Textarea } from '@careercopilot/ui';
import { Button } from '@careercopilot/ui';
import { Switch } from '@careercopilot/ui';
import { SettingsControl } from '@/screens/10_settings/SettingsControl';

export function Settings() {
  const [firstName, setFirstName] = useState('Nishant');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('nishant@example.com');
  const [bio, setBio] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [applicationUpdates, setApplicationUpdates] = useState(true);
  const [jobMatches, setJobMatches] = useState(false);

  const cardStyle = {
    backgroundImage: 'radial-gradient(circle, var(--sys-color-primary) 1px, transparent 1px)',
    backgroundSize: '20px 20px',
    backgroundBlendMode: 'overlay' as const,
    backgroundPosition: '0 0',
  };

  return (
    <SettingsControl
      className="max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500 ease-spring"
      title="Your Workbench"
      subtitle="Set how Career Copilot supports your applications."
      showActions={false}
    >
      <Tabs
        defaultValue="profile"
        className="w-full"
      >
        <TabsList className="bg-surface-container border border-outline-variant mb-8 p-1 rounded-placard h-auto shadow-sm">
          {[
            { label: 'Identity', value: 'profile', shapeClass: 'rounded-blockRiot01' },
            { label: 'Rhythm', value: 'preferences', shapeClass: 'rounded-blockRiot02' },
            { label: 'Signals', value: 'notifications', shapeClass: 'rounded-blockRiot03' },
            { label: 'Access', value: 'security', shapeClass: 'rounded-placardTorn01' },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`${tab.shapeClass} data-[state=active]:bg-primary-container data-[state=active]:text-on-primary-container data-[state=active]:shadow-sm text-on-surface-variant hover:text-on-surface transition-all px-6 py-2 ease-spring duration-300`}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile">
          <div
            className="bg-surface-container rounded-placard p-8 border border-outline-variant shadow-elevation-1"
            style={cardStyle}
          >
            <h3 className="text-on-surface mb-6 text-headline-small font-bold">Profile Signals</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-on-surface-variant mb-2 font-medium">
                    Given Name
                  </label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-surface-container-high border-outline-variant text-on-surface rounded-blockRiot01 h-12 focus:ring-primary focus:border-primary transition-all ease-spring"
                  />
                </div>
                <div>
                  <label className="block text-sm text-on-surface-variant mb-2 font-medium">
                    Family Name
                  </label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-surface-container-high border-outline-variant text-on-surface rounded-blockRiot02 h-12 focus:ring-primary focus:border-primary transition-all ease-spring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-on-surface-variant mb-2 font-medium">
                  Contact Line
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-surface-container-high border-outline-variant text-on-surface rounded-blockRiot03 h-12 focus:ring-primary focus:border-primary transition-all ease-spring"
                />
              </div>

              <div>
                <label className="block text-sm text-on-surface-variant mb-2 font-medium">
                  Positioning Note
                </label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write the short line you want your work to carry..."
                  rows={4}
                  className="bg-surface-container-high border-outline-variant text-on-surface rounded-placardTorn01 focus:ring-primary focus:border-primary resize-none transition-all ease-spring"
                />
              </div>

              <Button className="bg-primary text-on-primary hover:bg-primary/90 rounded-strike px-8 h-12 shadow-sm hover:shadow-elevation-1 transition-all ease-spring">
                Save This Setup
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preferences">
          <div
            className="bg-surface-container rounded-placard p-8 border border-outline-variant shadow-elevation-1"
            style={cardStyle}
          >
            <h3 className="text-on-surface mb-6 text-headline-small font-bold">Workbench Rhythm</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-outline-variant">
                <div>
                  <p className="text-on-surface font-medium">Solidarity Mode</p>
                  <p className="text-sm text-on-surface-variant">
                    Keep the interface on the KR night-shift palette
                  </p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              <div className="flex items-center justify-between py-4 border-b border-outline-variant">
                <div>
                  <p className="text-on-surface font-medium">Dispatch Notes</p>
                  <p className="text-sm text-on-surface-variant">
                    Receive short field updates in your inbox
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div
            className="bg-surface-container rounded-placard p-8 border border-outline-variant shadow-elevation-1"
            style={cardStyle}
          >
            <h3 className="text-on-surface mb-6 text-headline-small font-bold">Dispatch Signals</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-outline-variant">
                <div>
                  <p className="text-on-surface font-medium">Queue Updates</p>
                  <p className="text-sm text-on-surface-variant">
                    Hear when an application changes position
                  </p>
                </div>
                <Switch
                  checked={applicationUpdates}
                  onCheckedChange={setApplicationUpdates}
                />
              </div>

              <div className="flex items-center justify-between py-4 border-b border-outline-variant">
                <div>
                  <p className="text-on-surface font-medium">Scout Alerts</p>
                  <p className="text-sm text-on-surface-variant">
                    Surface new roles that match your current push
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

        <TabsContent value="security">
          <div
            className="bg-surface-container rounded-placard p-8 border border-outline-variant shadow-elevation-1"
            style={cardStyle}
          >
            <h3 className="text-on-surface mb-6 text-headline-small font-bold">Access Line</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-on-surface-variant mb-2 font-medium">
                  Current Passphrase
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-surface-container-high border-outline-variant text-on-surface rounded-blockRiot01 h-12 focus:ring-primary focus:border-primary transition-all ease-spring"
                />
              </div>

              <div>
                <label className="block text-sm text-on-surface-variant mb-2 font-medium">
                  New Passphrase
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-surface-container-high border-outline-variant text-on-surface rounded-blockRiot02 h-12 focus:ring-primary focus:border-primary transition-all ease-spring"
                />
              </div>

              <div>
                <label className="block text-sm text-on-surface-variant mb-2 font-medium">
                  Confirm New Passphrase
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-surface-container-high border-outline-variant text-on-surface rounded-blockRiot03 h-12 focus:ring-primary focus:border-primary transition-all ease-spring"
                />
              </div>

              <Button className="bg-primary text-on-primary hover:bg-primary/90 rounded-strike px-8 h-12 shadow-sm hover:shadow-elevation-1 transition-all ease-spring">
                Refresh Access
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </SettingsControl>
  );
}
