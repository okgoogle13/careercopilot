import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { db } from '../firebase-config';
import { doc, onSnapshot } from 'firebase/firestore';
import { LoadingState } from '../components/ui';
import { PageLayout } from '../components/layout/PageLayout';
import { GoogleIntegrationSettings } from '../components/settings/GoogleIntegrationSettings';
import { ThemeSettings } from '../components/settings/ThemeSettings';
import {
  VoiceProfileSettings,
  VoiceProfile,
} from '../components/settings/VoiceProfileSettings';
import { useGoogleIntegration } from '../hooks/settings/useGoogleIntegration';
import { useThemeSettings } from '../hooks/settings/useThemeSettings';
import { useVoiceProfile } from '../hooks/settings/useVoiceProfile';

const SettingsPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Data states managed by the component
  const [integrationStatus, setIntegrationStatus] =
    useState<string>('Not Connected');
  const [selectedTheme, setSelectedTheme] = useState<string>('professional');
  const [initialVoiceProfile, setInitialVoiceProfile] =
    useState<VoiceProfile | null>(null);

  // Custom hooks for handling logic
  const {
    isDisconnecting,
    isScanning,
    handleConnect,
    handleDisconnect,
    handleScanEmails,
  } = useGoogleIntegration();

  const { handleThemeSelect } = useThemeSettings(
    selectedTheme,
    setSelectedTheme
  );

  const {
    voiceProfile,
    isGenerating: isGeneratingVoiceProfile,
    handleGenerate: handleGenerateVoiceProfile,
  } = useVoiceProfile(initialVoiceProfile);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, currentUser => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const unsubscribeSnapshot = onSnapshot(userDocRef, docSnap => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setIntegrationStatus(
              data.integrations?.google_gmail?.connected
                ? 'Connected'
                : 'Not Connected'
            );
            setSelectedTheme(data.preferences?.themeId || 'professional');
            setInitialVoiceProfile(data.voice_profile || null);
          }
          setLoading(false);
        });
        return () => unsubscribeSnapshot();
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  if (loading) return <LoadingState message="Loading settings..." />;

  return (
    <PageLayout
      title="Settings"
      subtitle="Manage your account preferences and integrations"
    >
      <GoogleIntegrationSettings
        integrationStatus={integrationStatus}
        isDisconnecting={isDisconnecting}
        isScanning={isScanning}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onScan={handleScanEmails}
      />

      <ThemeSettings
        selectedTheme={selectedTheme}
        onSelectTheme={handleThemeSelect}
      />

      <VoiceProfileSettings
        voiceProfile={voiceProfile}
        isGenerating={isGeneratingVoiceProfile}
        onGenerate={handleGenerateVoiceProfile}
      />
    </PageLayout>
  );
};

export default SettingsPage;
