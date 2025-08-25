import { useState } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '../../utils/apiClient';

export const useGoogleIntegration = () => {
  const [isDisconnecting, setIsDisconnecting] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const handleConnect = async () => {
    try {
      const data = await apiClient.get<{ authorization_url: string }>(
        '/integrations/google/authorize'
      );
      window.location.href = data.authorization_url;
    } catch (error) {
      toast.error('Could not initiate connection with Google.');
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await apiClient.post('/integrations/google/disconnect');
      toast.success('Successfully disconnected from Google.');
      // Note: We might need a way to update the integrationStatus in the parent component.
      // This will be handled by a callback or a shared state management solution later.
    } catch (error) {
      toast.error('Failed to disconnect from Google.');
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleScanEmails = async () => {
    setIsScanning(true);
    toast.loading('Scanning for new job opportunities...');
    try {
      const data = await apiClient.post<{ message: string }>(
        '/integrations/google/scan-emails'
      );
      toast.dismiss();
      toast.success(data.message || 'Email scan completed!');
    } catch (error) {
      toast.dismiss();
      toast.error('An error occurred while scanning emails.');
    } finally {
      setIsScanning(false);
    }
  };

  return {
    isDisconnecting,
    isScanning,
    handleConnect,
    handleDisconnect,
    handleScanEmails,
  };
};
