import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { db } from '../firebase-config';
import { doc, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { ThemePreview } from '../components';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  LoadingState,
  Alert,
} from '../components/ui';
import { useAuthStatus } from '../hooks/useAuthStatus';

const THEMES = [
  { id: 'professional', name: 'Professional' },
  { id: 'modern', name: 'Modern' },
  { id: 'creative', name: 'Creative' },
];

interface VoiceProfile {
  tone: string[];
  common_phrases: string[];
  skill_keywords: string[];
}

const SettingsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuthStatus();
  const [integrationStatus, setIntegrationStatus] =
    useState<string>('Not Connected');
  const [selectedTheme, setSelectedTheme] = useState<string>('professional');
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
  const [isGeneratingVoiceProfile, setIsGeneratingVoiceProfile] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDisconnecting, setIsDisconnecting] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribeSnapshot = onSnapshot(userDocRef, docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setIntegrationStatus(
            data.integrations?.google_gmail?.connected
              ? 'Connected'
              : 'Not Connected'
          );
          setSelectedTheme(data.preferences?.themeId || 'professional');
          setVoiceProfile(data.voice_profile || null);
        }
        setLoading(false);
      });
      return () => unsubscribeSnapshot();
    } else {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleConnect = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/v1/integrations/google/authorize', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to get authorization URL.');
      const data = await response.json();
      window.location.href = data.authorization_url;
    } catch {
      toast.error('Could not initiate connection with Google.');
    }
  };

  const handleDisconnect = async () => {
    if (!user) return;
    setIsDisconnecting(true);
    try {
      const token = await user.getIdToken();
      await fetch('/api/v1/integrations/google/disconnect', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Successfully disconnected from Google.');
    } catch {
      toast.error('Failed to disconnect from Google.');
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleScanEmails = async () => {
    if (!user) return;
    setIsScanning(true);
    toast.loading('Scanning for new job opportunities...');
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/v1/integrations/google/scan-emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to start email scan.');
      const data = await response.json();
      toast.dismiss();
      toast.success(data.message || 'Email scan completed!');
    } catch {
      toast.dismiss();
      toast.error('An error occurred while scanning emails.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleThemeSelect = async (themeId: string) => {
    if (!user) {
      toast.error('You must be logged in to change settings.');
      return;
    }
    setSelectedTheme(themeId);
    try {
      const token = await user.getIdToken();
      await fetch('/api/v1/settings/theme', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ theme_id: themeId }),
      });
      toast.success('Theme preference saved!');
    } catch {
      toast.error('Could not save theme preference.');
    }
  };

  const handleGenerateVoiceProfile = async () => {
    if (!user) {
      toast.error('You must be logged in.');
      return;
    }
    setIsGeneratingVoiceProfile(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/v1/profile/generate-voice-profile', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || 'Failed to generate voice profile.'
        );
      }
      const newVoiceProfile = await response.json();
      setVoiceProfile(newVoiceProfile);
      toast.success('Successfully generated and saved your voice profile!');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsGeneratingVoiceProfile(false);
    }
  };

  if (loading) return <LoadingState message="Loading settings..." />;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account preferences and integrations
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>
            Connect Your Google Account to automatically find job opportunities
            in Gmail and create application reminders in your Calendar.
          </CardDescription>
        </CardHeader>
        <div className="p-6">
          {integrationStatus === 'Not Connected' ? (
            <div className="space-y-4">
              <Alert variant="info" title="Google Account Not Connected">
                Connect your Google account to enable automatic job discovery
                and calendar integration.
              </Alert>
              <Button onClick={handleConnect}>Connect Google Account</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert variant="success" title="Google Account Connected">
                Your Google account is successfully connected and syncing.
              </Alert>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleScanEmails}
                  disabled={isScanning}
                  variant="secondary"
                >
                  {isScanning ? 'Scanning...' : 'Scan Emails Now'}
                </Button>
                <Button
                  onClick={handleDisconnect}
                  disabled={isDisconnecting}
                  variant="danger"
                >
                  {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>PDF Theme</CardTitle>
          <CardDescription>
            Choose the visual style for your generated PDF documents.
          </CardDescription>
        </CardHeader>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {THEMES.map(theme => (
              <div
                key={theme.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedTheme === theme.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleThemeSelect(theme.id)}
              >
                <div className="mb-3">
                  <ThemePreview
                    themeId={theme.id}
                    themeName={theme.name}
                    width={150}
                    height={120}
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold">{theme.name}</h3>
                  {selectedTheme === theme.id && (
                    <span className="text-blue-500 text-sm font-medium">
                      ✓ Selected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Voice Profile</CardTitle>
          <CardDescription>
            Generate a personalized voice profile to help tailor your documents
            to your writing style.
          </CardDescription>
        </CardHeader>
        <div className="p-6">
          {!voiceProfile ? (
            <div className="text-center py-8">
              <Alert variant="info" className="mb-6">
                No voice profile generated yet. Create one to personalize your
                document generation.
              </Alert>
              <Button
                onClick={handleGenerateVoiceProfile}
                disabled={isGeneratingVoiceProfile}
              >
                {isGeneratingVoiceProfile
                  ? 'Generating...'
                  : 'Generate Voice Profile'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Your Voice Profile
                  </h3>
                  <p className="text-sm text-gray-600">
                    Personalized writing style analysis
                  </p>
                </div>
                <Button
                  onClick={handleGenerateVoiceProfile}
                  disabled={isGeneratingVoiceProfile}
                  variant="secondary"
                  size="sm"
                >
                  {isGeneratingVoiceProfile ? 'Regenerating...' : 'Regenerate'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Tone</h4>
                  <div className="flex flex-wrap gap-1">
                    {voiceProfile.tone.map((item, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Common Phrases
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {voiceProfile.common_phrases.map((phrase, index) => (
                      <span
                        key={index}
                        className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                      >
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Skill Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {voiceProfile.skill_keywords.map((skill, index) => (
                      <span
                        key={index}
                        className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
