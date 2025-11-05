import { ArrowLeft, Refresh as RefreshCw, Wifi, WifiOff } from '@mui/icons-material';
import { Box } from '@mui/material';
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
import { useCallback, useEffect, useState } from 'react';

import { Badge } from '../../ui/badge';
import { ErrorProfileCard } from '../common/ErrorCard';
import { LoadingProfileCard } from '../common/LoadingCard';
import { CreateProfileCard } from '../profile/CreateProfileCard';
import { ProfileCard } from '../profile/ProfileCard';

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
          <div sx={{
      "grid": true,
      gap: 6,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      [theme.breakpoints.up('md')]: { "grid-cols-3": true }
    }}>
            {Array.from({ length: 3 }).map((_, index) => (
              <LoadingProfileCard key={index} />
            ))}
          </div>
        );

      case 'error':
        return (
          <div sx={{
      "grid": true,
      gap: 6,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      [theme.breakpoints.up('md')]: { "grid-cols-3": true }
    }}>
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
          <div sx={{
      "space-y-4": true
    }}>
            <div sx={{
      textAlign: "center",
      p: 8
    }}>
              <p sx={{
      "text-muted-foreground": true,
      mb: 4
    }}>No profiles found</p>
              <Button onClick={handleRetryLoad} variant="outlined" sx={{
      mr: 2
    }}>
                <RefreshCw sx={{
      "w-4": true,
      "h-4": true,
      mr: 2
    }} />
                Refresh
              </Button>
            </div>
            <CreateProfileCard onCreate={() => console.log('Create new profile')} />
          </div>
        );

      case 'loaded':
        return (
          <div sx={{
      "grid": true,
      gap: 6,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      [theme.breakpoints.up('md')]: { "grid-cols-3": true }
    }}>
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
    <div sx={{
      minHeight: "100vh",
      "bg-background": true,
      p: 6
    }}>
      <div sx={{
      "max-w-7xl": true,
      "mx-auto": true
    }}>
        {/* Header */}
        <div sx={{
      mb: 8
    }}>
          <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      mb: 4
    }}>
            <Button variant="text" size="small" onClick={onBack} sx={{
      gap: 2
    }}>
              <ArrowLeft sx={{
      "w-4": true,
      "h-4": true
    }} />
              Back to Component Library
            </Button>
          </div>
          <h1 sx={{
      mb: 2
    }}>Interactive State Management Demo</h1>
          <p sx={{
      "text-muted-foreground": true
    }}>
            Experience how the card variants work together in realistic loading, error, and data
            scenarios
          </p>
        </div>

        {/* Control Panel */}
        <div sx={{
      mb: 8
    }}>
          <Card variant="elevation">
            <CardHeader
              title={<Typography variant="h3">Simulation Controls</Typography>}
            ></CardHeader>
            <CardContent>
              <div sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 3
    }}>
                <Button
                  variant="outlined"
                  onClick={() => simulateDataLoad(2000, false)}
                  sx={{
      gap: 2
    }}
                >
                  <RefreshCw sx={{
      "w-4": true,
      "h-4": true
    }} />
                  Simulate Loading
                </Button>

                <Button variant="outlined" onClick={handleSimulateError} sx={{
      gap: 2
    }}>
                  Simulate Error
                </Button>

                <Button variant="outlined" onClick={handleResetToEmpty} sx={{
      gap: 2
    }}>
                  Show Empty State
                </Button>

                <Button variant="outlined" onClick={handleToggleConnection} sx={{
      gap: 2
    }}>
                  {connectionStatus === 'online' ? (
                    <>
                      <WifiOff sx={{
      "w-4": true,
      "h-4": true
    }} />
                      Go Offline
                    </>
                  ) : (
                    <>
                      <Wifi sx={{
      "w-4": true,
      "h-4": true
    }} />
                      Go Online
                    </>
                  )}
                </Button>
              </div>

              <div sx={{
      mt: 4,
      display: "flex",
      alignItems: "center",
      gap: 4
    }}>
                <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                  <span sx={{
      "text-muted-foreground": true
    }}>Current State:</span>
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

                <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                  <span sx={{
      "text-muted-foreground": true
    }}>Connection:</span>
                  <Badge variant={connectionStatus === 'online' ? 'default' : 'destructive'}>
                    {connectionStatus === 'online' ? (
                      <>
                        <Wifi sx={{
      "w-3": true,
      "h-3": true,
      mr: 1
    }} />
                        Online
                      </>
                    ) : (
                      <>
                        <WifiOff sx={{
      "w-3": true,
      "h-3": true,
      mr: 1
    }} />
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
        <div sx={{
      "space-y-6": true
    }}>
          <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
            <h2>Job Application Profiles</h2>
            <Badge variant="secondary">
              {dataState === 'loaded' ? `${profiles.length} profiles` : dataState}
            </Badge>
          </div>

          {renderProfileCards()}
        </div>

        {/* Real-world Usage Examples */}
        <div sx={{
      mt: 12,
      "space-y-6": true
    }}>
          <h2>Real-world Implementation Patterns</h2>

          <div sx={{
      "grid": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      gap: 6
    }}>
            <Card variant="elevation">
              <CardHeader title={<Typography variant="h3">Best Practices</Typography>}></CardHeader>
              <CardContent>
                <ul sx={{
      "space-y-2": true,
      "text-muted-foreground": true
    }}>
                  <li>• Always show loading states for operations taking &gt;200ms</li>
                  <li>• Provide retry functionality for failed operations</li>
                  <li>• Use skeleton placeholders that match the final content layout</li>
                  <li>• Differentiate between network errors and data errors</li>
                  <li>• Offer offline functionality where possible</li>
                </ul>
              </CardContent>
            </Card>

            <Card variant="elevation">
              <CardHeader
                title={<Typography variant="h3">Implementation Tips</Typography>}
              ></CardHeader>
              <CardContent>
                <ul sx={{
      "space-y-2": true,
      "text-muted-foreground": true
    }}>
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
