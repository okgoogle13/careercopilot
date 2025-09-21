import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { LoadingProfileCard } from "./LoadingCard"; 
import { ErrorProfileCard } from "./ErrorCard";
import { ProfileCard } from "./ProfileCard";
import { CreateProfileCard } from "./CreateProfileCard";
import { ArrowLeft, RefreshCw, Wifi, WifiOff } from "lucide-react";

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

type DataState = "loading" | "loaded" | "error" | "empty";

export function StateDemoShowcase({ onBack }: StateDemoShowcaseProps) {
  const [dataState, setDataState] = useState<DataState>("loading");
  const [connectionStatus, setConnectionStatus] = useState<"online" | "offline">("online");
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const mockProfiles: Profile[] = [
    {
      id: "1",
      name: "Nishant Dougall",
      role: "Community Support Worker",
      activeApplications: 8,
      atsScore: 92,
      lastUpdated: "2 hours ago",
      avatarColor: "#7c3aed"
    },
    {
      id: "2", 
      name: "Nishant Dougall",
      role: "Peer Worker",
      activeApplications: 5,
      atsScore: 87,
      lastUpdated: "1 day ago",
      avatarColor: "#a855f7"
    }
  ];

  // Simulate data loading
  const simulateDataLoad = (delay: number = 2000, shouldFail: boolean = false) => {
    setDataState("loading");
    
    setTimeout(() => {
      if (shouldFail || connectionStatus === "offline") {
        setDataState("error");
        setProfiles([]);
      } else {
        setDataState("loaded");
        setProfiles(mockProfiles);
      }
    }, delay);
  };

  useEffect(() => {
    simulateDataLoad();
  }, []);

  const handleRetryLoad = () => {
    simulateDataLoad(1500, false);
  };

  const handleToggleConnection = () => {
    const newStatus = connectionStatus === "online" ? "offline" : "online";
    setConnectionStatus(newStatus);
    
    if (newStatus === "offline") {
      setDataState("error");
    } else {
      simulateDataLoad(1000, false);
    }
  };

  const handleSimulateError = () => {
    simulateDataLoad(1000, true);
  };

  const handleResetToEmpty = () => {
    setDataState("empty");
    setProfiles([]);
  };

  const renderProfileCards = () => {
    switch (dataState) {
      case "loading":
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <LoadingProfileCard key={index} />
            ))}
          </div>
        );

      case "error":
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ErrorProfileCard 
              onRetry={handleRetryLoad}
              title="Connection Error"
              message={connectionStatus === "offline" 
                ? "You're offline. Please check your internet connection." 
                : "Failed to load profiles. Server may be temporarily unavailable."}
            />
            <ErrorProfileCard 
              onRetry={handleRetryLoad}
              title="Data Sync Failed"
              message="Profile data couldn't be synchronized. Some information may be outdated."
            />
          </div>
        );

      case "empty":
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <CreateProfileCard onCreate={() => alert("Creating new profile...")} />
          </div>
        );

      case "loaded":
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
            <CreateProfileCard onCreate={() => alert("Creating new profile...")} />
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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Component Library
            </Button>
          </div>
          <h1 className="mb-2">Interactive State Management Demo</h1>
          <p className="text-muted-foreground">
            Experience how the card variants work together in realistic loading, error, and data scenarios
          </p>
        </div>

        {/* Control Panel */}
        <div className="mb-8">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Simulation Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => simulateDataLoad(2000, false)}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Simulate Loading
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleSimulateError}
                  className="gap-2"
                >
                  Simulate Error
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleResetToEmpty}
                  className="gap-2"
                >
                  Show Empty State
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleToggleConnection}
                  className="gap-2"
                >
                  {connectionStatus === "online" ? (
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
                  <Badge variant={
                    dataState === "loaded" ? "default" : 
                    dataState === "loading" ? "secondary" : 
                    dataState === "error" ? "destructive" : "outline"
                  }>
                    {dataState.charAt(0).toUpperCase() + dataState.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Connection:</span>
                  <Badge variant={connectionStatus === "online" ? "default" : "destructive"}>
                    {connectionStatus === "online" ? (
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
              {dataState === "loaded" ? `${profiles.length} profiles` : dataState}
            </Badge>
          </div>
          
          {renderProfileCards()}
        </div>

        {/* Real-world Usage Examples */}
        <div className="mt-12 space-y-6">
          <h2>Real-world Implementation Patterns</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
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

            <Card variant="default">
              <CardHeader>
                <CardTitle>Implementation Tips</CardTitle>
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