import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Button, Alert } from '../ui';

interface GoogleIntegrationSettingsProps {
  integrationStatus: string;
  isDisconnecting: boolean;
  isScanning: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onScan: () => void;
}

export const GoogleIntegrationSettings: React.FC<GoogleIntegrationSettingsProps> = ({
  integrationStatus,
  isDisconnecting,
  isScanning,
  onConnect,
  onDisconnect,
  onScan,
}) => {
  return (
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
              Connect your Google account to enable automatic job discovery and
              calendar integration.
            </Alert>
            <Button onClick={onConnect}>Connect Google Account</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert variant="success" title="Google Account Connected">
              Your Google account is successfully connected and syncing.
            </Alert>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={onScan}
                disabled={isScanning}
                variant="secondary"
              >
                {isScanning ? 'Scanning...' : 'Scan Emails Now'}
              </Button>
              <Button
                onClick={onDisconnect}
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
  );
};
