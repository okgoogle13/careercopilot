import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";

export function Settings() {
  const [firstName, setFirstName] = useState("Nishant");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("nishant@example.com");
  const [bio, setBio] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [applicationUpdates, setApplicationUpdates] = useState(true);
  const [jobMatches, setJobMatches] = useState(false);

  return (
    <div className="p-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1
          style={{
            fontSize: "4.5rem",
            lineHeight: "1.1",
            fontFamily: "Roboto Flex, sans-serif",
            fontWeight: "800",
            fontStretch: "150%",
            color: "#E6E1E5",
          }}
        >
          Settings
        </h1>
        <p className="text-[#CAC4D0] mt-2">Manage your account preferences and settings</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-[#25232A] border-[#49454F] mb-8">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-[#D0BCFF] data-[state=active]:text-[#381E72]"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="data-[state=active]:bg-[#D0BCFF] data-[state=active]:text-[#381E72]"
          >
            Preferences
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-[#D0BCFF] data-[state=active]:text-[#381E72]"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-[#D0BCFF] data-[state=active]:text-[#381E72]"
          >
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div
            className="bg-[#25232A] rounded-[28px] p-8"
            style={{
              backgroundImage: "radial-gradient(circle, #E6DEFF 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              backgroundBlendMode: "overlay",
              backgroundPosition: "0 0",
            }}
          >
            <h3 className="text-[#E6E1E5] mb-6">Profile Settings</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-sm text-[#CAC4D0] mb-2"
                    style={{
                      fontFamily: "Roboto Flex, sans-serif",
                      fontStretch: "50%",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    First Name
                  </label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-[#2B2930] border-[#49454F] text-[#E6E1E5] rounded-full h-12"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm text-[#CAC4D0] mb-2"
                    style={{
                      fontFamily: "Roboto Flex, sans-serif",
                      fontStretch: "50%",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Last Name
                  </label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-[#2B2930] border-[#49454F] text-[#E6E1E5] rounded-full h-12"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm text-[#CAC4D0] mb-2"
                  style={{
                    fontFamily: "Roboto Flex, sans-serif",
                    fontStretch: "50%",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#2B2930] border-[#49454F] text-[#E6E1E5] rounded-full h-12"
                />
              </div>

              <div>
                <label
                  className="block text-sm text-[#CAC4D0] mb-2"
                  style={{
                    fontFamily: "Roboto Flex, sans-serif",
                    fontStretch: "50%",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Bio
                </label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="bg-[#2B2930] border-[#49454F] text-[#E6E1E5] rounded-[28px]"
                />
              </div>

              <Button className="bg-[#D0BCFF] text-[#381E72] hover:bg-[#E6DDFF] rounded-full px-8 h-12">
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <div
            className="bg-[#25232A] rounded-[28px] p-8"
            style={{
              backgroundImage: "radial-gradient(circle, #E6DEFF 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              backgroundBlendMode: "overlay",
              backgroundPosition: "0 0",
            }}
          >
            <h3 className="text-[#E6E1E5] mb-6">Preferences</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-[#49454F]">
                <div>
                  <p className="text-[#E6E1E5]">Dark Mode</p>
                  <p className="text-sm text-[#CAC4D0]">Use dark theme throughout the app</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <div className="flex items-center justify-between py-4 border-b border-[#49454F]">
                <div>
                  <p className="text-[#E6E1E5]">Email Notifications</p>
                  <p className="text-sm text-[#CAC4D0]">Receive email updates and notifications</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div
            className="bg-[#25232A] rounded-[28px] p-8"
            style={{
              backgroundImage: "radial-gradient(circle, #E6DEFF 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              backgroundBlendMode: "overlay",
              backgroundPosition: "0 0",
            }}
          >
            <h3 className="text-[#E6E1E5] mb-6">Notification Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-[#49454F]">
                <div>
                  <p className="text-[#E6E1E5]">Application Updates</p>
                  <p className="text-sm text-[#CAC4D0]">
                    Get notified about application status changes
                  </p>
                </div>
                <Switch checked={applicationUpdates} onCheckedChange={setApplicationUpdates} />
              </div>

              <div className="flex items-center justify-between py-4 border-b border-[#49454F]">
                <div>
                  <p className="text-[#E6E1E5]">Job Matches</p>
                  <p className="text-sm text-[#CAC4D0]">
                    Receive notifications for matching job opportunities
                  </p>
                </div>
                <Switch checked={jobMatches} onCheckedChange={setJobMatches} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div
            className="bg-[#25232A] rounded-[28px] p-8"
            style={{
              backgroundImage: "radial-gradient(circle, #E6DEFF 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              backgroundBlendMode: "overlay",
              backgroundPosition: "0 0",
            }}
          >
            <h3 className="text-[#E6E1E5] mb-6">Security Settings</h3>
            <div className="space-y-6">
              <div>
                <label
                  className="block text-sm text-[#CAC4D0] mb-2"
                  style={{
                    fontFamily: "Roboto Flex, sans-serif",
                    fontStretch: "50%",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Current Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-[#2B2930] border-[#49454F] text-[#E6E1E5] rounded-full h-12"
                />
              </div>

              <div>
                <label
                  className="block text-sm text-[#CAC4D0] mb-2"
                  style={{
                    fontFamily: "Roboto Flex, sans-serif",
                    fontStretch: "50%",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-[#2B2930] border-[#49454F] text-[#E6E1E5] rounded-full h-12"
                />
              </div>

              <div>
                <label
                  className="block text-sm text-[#CAC4D0] mb-2"
                  style={{
                    fontFamily: "Roboto Flex, sans-serif",
                    fontStretch: "50%",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-[#2B2930] border-[#49454F] text-[#E6E1E5] rounded-full h-12"
                />
              </div>

              <Button className="bg-[#D0BCFF] text-[#381E72] hover:bg-[#E6DDFF] rounded-full px-8 h-12">
                Update Password
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
