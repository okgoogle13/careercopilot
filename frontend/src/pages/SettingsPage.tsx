import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { db } from '../firebase-config';
import { doc, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [integrationStatus, setIntegrationStatus] = useState<string>('Not Connected');
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

    const handleConnect = async () => {
        if (!user) return;
        try {
            const token = await user.getIdToken();
            const response = await fetch('/api/v1/integrations/google/authorize', { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error('Failed to get authorization URL.');
            const data = await response.json();
            window.location.href = data.authorization_url;
        } catch (error) {
            toast.error('Could not initiate connection with Google.');
        }
    };

    const handleDisconnect = async () => {
        if (!user) return;
        setIsDisconnecting(true);
        try {
            const token = await user.getIdToken();
            await fetch('/api/v1/integrations/google/disconnect', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
            toast.success('Successfully disconnected from Google.');
        } catch (error) {
            toast.error('Failed to disconnect from Google.');
        } finally {
            setIsDisconnecting(false);
        }
    };

    const handleScanEmails = async () => {
        if (!user) return;
        setIsScanning(true);
        toast.loading("Scanning for new job opportunities...");
        try {
            const token = await user.getIdToken();
            const response = await fetch('/api/v1/integrations/google/scan-emails', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error('Failed to start email scan.');
            const data = await response.json();
            toast.dismiss();
            toast.success(data.message || "Email scan completed!");
        } catch (error) {
            toast.dismiss();
            toast.error('An error occurred while scanning emails.');
        } finally {
            setIsScanning(false);
        }
    };
    
    // ... render functions for voice profile and themes are unchanged ...

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-2 border-b pb-2">Integrations</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Connect Your Google Account to automatically find job opportunities in Gmail and create application reminders in your Calendar.
                </p>
                {integrationStatus === 'Not Connected' ? (
                    <button onClick={handleConnect} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Connect Google Account
                    </button>
                ) : (
                    <div className="space-y-4">
                        <p className="font-semibold text-green-700">✓ Connected to Google</p>
                        <div className="flex space-x-4">
                            <button onClick={handleScanEmails} disabled={isScanning} className="bg-gray-500 hover:bg-gray-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded">
                                {isScanning ? "Scanning..." : "Scan Emails Now"}
                            </button>
                            <button onClick={handleDisconnect} disabled={isDisconnecting} className="bg-red-500 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-2 px-4 rounded">
                                {isDisconnecting ? "Disconnecting..." : "Disconnect"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Other sections remain the same */}
        </div>
    );
};

export default SettingsPage;
