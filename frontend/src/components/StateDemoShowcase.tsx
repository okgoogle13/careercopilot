import { ArrowLeft, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { CreateProfileCard } from './CreateProfileCard';
import { ErrorProfileCard } from './ErrorCard';
import { LoadingProfileCard } from './LoadingCard';
import { ProfileCard } from './ProfileCard';
import { Badge } from './ui/badge';
import {
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
} from '@mui/material';

interface StateDemoShowcaseProps {
  onBack: () => void;
}

interface Profile {
  id: string;
  name: string;
  role: string;
  activeApplications: number;
  atsScore: number;
  lastUpdated: string;
  avatarColor: string;
}

type DataState = 'loading' | 'loaded' | 'error' | 'empty';

export function StateDemoShowcase({ onBack }: StateDemoShowcaseProps) {
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online');
  const [dataState, setDataState] = useState<DataState>('loading');
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const simulateDataLoad = useCallback((delay = 1000, shouldFail = false) => {
    const mockProfiles: Profile[] = [
      {
        id: '1',
        name: 'Alex Johnson',
        role: 'Senior Frontend Developer',
        activeApplications: 5,
        atsScore: 92,
        lastUpdated: '2 hours ago',
        avatarColor: 'bg-blue-500',
      },
      {
        id: '2',
        name: 'Jamie Smith',
        role: 'UX/UI Designer',
        activeApplications: 3,
        atsScore: 88,
        lastUpdated: '1 hour ago',
        avatarColor: 'bg-purple-500',
      },
    ];

    setDataState('loading');

    setTimeout(() => {
      if (shouldFail) {
        setDataState('error');
        setProfiles([]);
      } else {
        setDataState('loaded');
        setProfiles(mockProfiles);
      }
    }, delay);
  }, []);

  useEffect(() => {
    simulateDataLoad();
  }, [simulateDataLoad]);

  const handleRetryLoad = useCallback(() => {
    if (connectionStatus === 'offline') {
      setDataState('error');
      return;
    }
    simulateDataLoad(1500, false);
  }, [connectionStatus, simulateDataLoad]);

  const handleToggleConnection = () => {
    const newStatus = connectionStatus === 'online' ? 'offline' : 'online';
    setConnectionStatus(newStatus);

    if (newStatus === 'offline') {
      setDataState('error');
    } else {
      simulateDataLoad(1000, false);
    }
  };

  const handleSimulateError = () => {
    simulateDataLoad(1000, true);
  };

  const handleResetToEmpty = () => {
    setDataState('empty');
    setProfiles([]);
  };

  const renderProfileCards = () => {
    switch (dataState) {
      case 'loading':
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <LoadingProfileCard key={index} />
            ))}
          </div>
        );

      case 'error':
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ErrorProfileCard
              onRetry={handleRetryLoad}
              title="Connection Error"
              message={
                connectionStatus === 'offline'
                  ? "You're offline. Please check your internet connection."
                  : 'Failed to load profiles. Server may be temporarily unavailable.'
              }
            />
            <ErrorProfileCard
              onRetry={handleRetryLoad}
              title="Data Sync Failed"
              message="Profile data couldn't be synchronized. Some information may be outdated."
            />
          </div>
        );

      case 'empty':
        return (
          <div className="space-y-4">
            <div className="text-center p-8">
              <p className="text-muted-foreground mb-4">No profiles found</p>
              <Button onClick={handleRetryLoad} variant="outlined" className="mr-2">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
            <CreateProfileCard onCreate={() => console.log('Create new profile')} />
          </div>
        );

      case 'loaded':
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                name={profile.name}
                role={profile.role}
                activeApplications={profile.activeApplications}
                atsScore={profile.atsScore}
                lastUpdated={profile.lastUpdated}
                avatarColor={profile.avatarColor}
                onEdit={() => alert(`Editing ${profile.name}`)}
                onDelete={() => alert(`Deleting ${profile.name}`)}
              />
            ))}
            <CreateProfileCard onCreate={() => alert('Creating new profile...')} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="text" size="small" onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Component Library
            </Button>
          </div>
          <h1 className="mb-2">Interactive State Management Demo</h1>
          <p className="text-muted-foreground">
            Experience how the card variants work together in realistic loading, error, and data
            scenarios
          </p>
        </div>

        {/* Control Panel */}
        <div className="mb-8">
          <Card variant="elevation">
            <CardHeader title={<Typography variant='h3'>Simulation Controls</Typography>}>

            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outlined"
                  onClick={() => simulateDataLoad(2000, false)}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Simulate Loading
                </Button>

                <Button variant="outlined" onClick={handleSimulateError} className="gap-2">
                  Simulate Error
                </Button>

                <Button variant="outlined" onClick={handleResetToEmpty} className="gap-2">
                  Show Empty State
                </Button>

                <Button variant="outlined" onClick={handleToggleConnection} className="gap-2">
                  {connectionStatus === 'online' ? (
                    <>
                      <WifiOff className="w-4 h-4" />
                      Go Offline
                    </>
                  ) : (
                    <>
                      <Wifi className="w-4 h-4" />
                      Go Online
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Current State:</span>
                  <Badge
                    variant={
                      dataState === 'loaded'
                        ? 'default'
                        : dataState === 'loading'
                          ? 'secondary'
                          : dataState === 'error'
                            ? 'destructive'
                            : 'outline'
                    }
                  >
                    {dataState.charAt(0).toUpperCase() + dataState.slice(1)}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Connection:</span>
                  <Badge variant={connectionStatus === 'online' ? 'default' : 'destructive'}>
                    {connectionStatus === 'online' ? (
                      <>
                        <Wifi className="w-3 h-3 mr-1" />
                        Online
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3 h-3 mr-1" />
                        Offline
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Cards Display */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2>Job Application Profiles</h2>
            <Badge variant="secondary">
              {dataState === 'loaded' ? `${profiles.length} profiles` : dataState}
            </Badge>
          </div>

          {renderProfileCards()}
        </div>

        {/* Real-world Usage Examples */}
        <div className="mt-12 space-y-6">
          <h2>Real-world Implementation Patterns</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card variant="elevation">
              <CardHeader title={<Typography variant='h3'>Best Practices</Typography>}>

              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Always show loading states for operations taking &gt;200ms</li>
                  <li>• Provide retry functionality for failed operations</li>
                  <li>• Use skeleton placeholders that match the final content layout</li>
                  <li>• Differentiate between network errors and data errors</li>
                  <li>• Offer offline functionality where possible</li>
                </ul>
              </CardContent>
            </Card>

            <Card variant="elevation">
              <CardHeader title={<Typography variant='h3'>Implementation Tips</Typography>}>

              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Use React.Suspense with ErrorBoundaries</li>
                  <li>• Implement exponential backoff for retries</li>
                  <li>• Cache successful responses to reduce loading states</li>
                  <li>• Show partial data when available during errors</li>
                  <li>• Provide clear error messages with actionable steps</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
