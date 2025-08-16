import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { db } from '../firebase-config';
import { doc, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';

const THEMES = [
    { id: 'professional', name: 'Professional', imageUrl: 'https://via.placeholder.com/150/DDEBF7/8498B5?text=Pro' },
    { id: 'modern', name: 'Modern', imageUrl: 'https://via.placeholder.com/150/DDEBF7/8498B5?text=Modern' },
    { id: 'creative', name: 'Creative', imageUrl: 'https://via.placeholder.com/150/DDEBF7/8498B5?text=Creative' },
];

interface VoiceProfile {
    tone: string[];
    common_phrases: string[];
    skill_keywords: string[];
}

const SettingsPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [integrationStatus, setIntegrationStatus] = useState<string>('Not Connected');
    const [selectedTheme, setSelectedTheme] = useState<string>('professional');
    const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
    const [isGeneratingVoiceProfile, setIsGeneratingVoiceProfile] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [isDisconnecting, setIsDisconnecting] = useState<boolean>(false);
    const [isScanning, setIsScanning] = useState<boolean>(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userDocRef = doc(db, 'users', currentUser.uid);
                const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setIntegrationStatus(data.integrations?.google_gmail?.connected ? 'Connected' : 'Not Connected');
                        setSelectedTheme(data.preferences?.themeId || 'professional');
                        setVoiceProfile(data.voice_profile || null);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error('Error listening to user document:', error);
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

    const handleConnect = async () => {
        if (!user) return;
        try {
            const token = await user.getIdToken();
            const response = await fetch('/api/v1/integrations/google/authorize', { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            if (!response.ok) throw new Error('Failed to get authorization URL.');
            const data = await response.json();
            window.location.href = data.authorization_url;
        } catch (error) {
            console.error('Connection error:', error);
            toast.error('Could not initiate connection with Google.');
        }
    };

    const handleDisconnect = async () => {
        if (!user) return;
        setIsDisconnecting(true);
        try {
            const token = await user.getIdToken();
            const response = await fetch('/api/v1/integrations/google/disconnect', { 
                method: 'POST', 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            if (!response.ok) throw new Error('Failed to disconnect');
            toast.success('Successfully disconnected from Google.');
        } catch (error) {
            console.error('Disconnect error:', error);
            toast.error('Failed to disconnect from Google.');
        } finally {
            setIsDisconnecting(false);
        }
    };

    const handleScanEmails = async () => {
        if (!user) return;
        setIsScanning(true);
        const toastId = toast.loading("Scanning for new job opportunities...");
        try {
            const token = await user.getIdToken();
            const response = await fetch('/api/v1/integrations/google/scan-emails', { 
                method: 'POST', 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            if (!response.ok) throw new Error('Failed to start email scan.');
            const data = await response.json();
            toast.success(data.message || "Email scan completed!", { id: toastId });
        } catch (error) {
            console.error('Email scan error:', error);
            toast.error('An error occurred while scanning emails.', { id: toastId });
        } finally {
            setIsScanning(false);
        }
    };

    const handleThemeSelect = async (themeId: string) => {
        if (!user) {
            toast.error("You must be logged in to change settings.");
            return;
        }
        setSelectedTheme(themeId);
        try {
            const token = await user.getIdToken();
            const response = await fetch('/api/v1/settings/theme', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ theme_id: themeId }),
            });
            if (!response.ok) throw new Error('Failed to save theme preference');
            toast.success("Theme preference saved!");
        } catch (error) {
            console.error('Theme save error:', error);
            toast.error("Could not save theme preference.");
        }
    };

    const handleGenerateVoiceProfile = async () => {
        if (!user) {
            toast.error("You must be logged in.");
            return;
        }
        setIsGeneratingVoiceProfile(true);
        try {
            const token = await user.getIdToken();
            const response = await fetch('/api/v1/profile/generate-voice-profile', { 
                method: 'POST', 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to generate voice profile.");
            }
            const newVoiceProfile = await response.json();
            setVoiceProfile(newVoiceProfile);
            toast.success("Successfully generated and saved your voice profile!");
        } catch (error: any) {
            console.error('Voice profile generation error:', error);
            toast.error(error.message);
        } finally {
            setIsGeneratingVoiceProfile(false);
        }
    };

    const renderVoiceProfile = () => {
        if (!voiceProfile) {
            return (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No voice profile generated yet.</p>
                    <button 
                        onClick={handleGenerateVoiceProfile}
                        disabled={isGeneratingVoiceProfile}
                        className="bg-green-500 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                        {isGeneratingVoiceProfile ? 'Generating...' : 'Generate Voice Profile'}
                    </button>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Your Voice Profile</h3>
                    <button 
                        onClick={handleGenerateVoiceProfile}
                        disabled={isGeneratingVoiceProfile}
                        className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
                    >
                        {isGeneratingVoiceProfile ? 'Regenerating...' : 'Regenerate'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <h4 className="font-medium text-gray-800 mb-2">Tone</h4>
                        <div className="flex flex-wrap gap-1">
                            {voiceProfile.tone.map((item, index) => (
                                <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-800 mb-2">Common Phrases</h4>
                        <div className="flex flex-wrap gap-1">
                            {voiceProfile.common_phrases.map((phrase, index) => (
                                <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {phrase}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-800 mb-2">Skill Keywords</h4>
                        <div className="flex flex-wrap gap-1">
                            {voiceProfile.skill_keywords.map((skill, index) => (
                                <span key={index} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderThemes = () => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {THEMES.map((theme) => (
                    <div 
                        key={theme.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                            selectedTheme === theme.id 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleThemeSelect(theme.id)}
                    >
                        <img 
                            src={theme.imageUrl} 
                            alt={theme.name}
                            className="w-full h-32 object-cover rounded mb-3"
                        />
                        <div className="text-center">
                            <h3 className="font-semibold">{theme.name}</h3>
                            {selectedTheme === theme.id && (
                                <span className="text-blue-500 text-sm font-medium">✓ Selected</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>

            {/* Integrations Section */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-2 border-b pb-2">Integrations</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Connect your Google Account to automatically find job opportunities in Gmail and create application reminders in your Calendar.
                </p>
                {integrationStatus === 'Not Connected' ? (
                    <button 
                        onClick={handleConnect} 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                        Connect Google Account
                    </button>
                ) : (
                    <div className="space-y-4">
                        <p className="font-semibold text-green-700">✓ Connected to Google</p>
                        <div className="flex flex-wrap gap-4">
                            <button 
                                onClick={handleScanEmails} 
                                disabled={isScanning} 
                                className="bg-gray-500 hover:bg-gray-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
                            >
                                {isScanning ? "Scanning..." : "Scan Emails Now"}
                            </button>
                            <button 
                                onClick={handleDisconnect} 
                                disabled={isDisconnecting} 
                                className="bg-red-500 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-2 px-4 rounded transition-colors"
                            >
                                {isDisconnecting ? "Disconnecting..." : "Disconnect"}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* PDF Theme Selection */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-2 border-b pb-2">PDF Theme</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Choose the visual style for your generated PDF documents.
                </p>
                {renderThemes()}
            </div>

            {/* Voice Profile Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-2 border-b pb-2">Voice Profile</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Generate a personalized voice profile to help tailor your documents to your writing style.
                </p>
                {renderVoiceProfile()}
            </div>
        </div>
    );
};

export default SettingsPage;