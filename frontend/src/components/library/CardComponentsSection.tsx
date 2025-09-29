import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { LoadingProfileCard } from '../features/common/LoadingCard';
import { ErrorCard, ErrorProfileCard } from '../features/common/ErrorCard';
import { ComponentSection, ComponentDemo } from './ComponentDemo';
import { Favorite as Heart } from '@mui/icons-material';
import {
  Button,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardAction,
} from '../ui/card';

export function CardComponentsSection() {
  const [selectedCard, setSelectedCard] = useState<string | null>('card-2');
  const [favoriteCards, setFavoriteCards] = useState<Set<string>>(new Set(['card-1']));

  const handleCardClick = (cardId: string) => {
    setSelectedCard(selectedCard === cardId ? null : cardId);
  };

  const handleFavoriteToggle = (cardId: string) => {
    const newFavorites = new Set(favoriteCards);
    if (newFavorites.has(cardId)) {
      newFavorites.delete(cardId);
    } else {
      newFavorites.add(cardId);
    }
    setFavoriteCards(newFavorites);
  };

  return (
    <ComponentSection
      title="Card Components"
      description="Five distinct card variants designed for different interaction patterns and data states"
    >
      {/* Card Variants Overview */}
      <ComponentDemo title="Card Variants Overview">
        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border border-border rounded bg-card"></div>
            <div>
              <p className="font-medium">Default Card</p>
              <p className="text-muted-foreground">
                Standard card with subtle border for static content
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border border-border rounded bg-card shadow-lg shadow-primary/10"></div>
            <div>
              <p className="font-medium">Interactive Card</p>
              <p className="text-muted-foreground">
                Hover effects and cursor pointer for clickable content
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-primary rounded bg-card shadow-lg shadow-primary/20"></div>
            <div>
              <p className="font-medium">Selected Card</p>
              <p className="text-muted-foreground">
                Prominent purple border and glow for active/selected state
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border border-border rounded bg-card animate-pulse"></div>
            <div>
              <p className="font-medium">Loading Card</p>
              <p className="text-muted-foreground">
                Skeleton placeholders during data loading states
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border border-destructive/50 rounded bg-destructive/5"></div>
            <div>
              <p className="font-medium">Error Card</p>
              <p className="text-muted-foreground">
                Red-tinted border and background for error states
              </p>
            </div>
          </div>
        </div>
      </ComponentDemo>

      {/* Interactive Profile Cards */}
      <ComponentDemo title="Profile Cards (Interactive & Selected)">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              id: 'card-1',
              name: 'Nishant Dougall',
              role: 'Community Support Worker',
              applications: 8,
              atsScore: 92,
              lastUpdated: '2 hours ago',
              status: 'Active',
            },
            {
              id: 'card-2',
              name: 'Nishant Dougall',
              role: 'Peer Worker',
              applications: 5,
              atsScore: 87,
              lastUpdated: '1 day ago',
              status: 'Draft',
            },
            {
              id: 'card-3',
              name: 'Create New Profile',
              role: 'Add a new job application profile',
              applications: 0,
              atsScore: 0,
              lastUpdated: '',
              status: 'New',
            },
          ].map((profile) => (
            <Card
              key={profile.id}
              variant={selectedCard === profile.id ? 'selected' : 'interactive'}
              onClick={() => handleCardClick(profile.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{profile.name}</CardTitle>
                    <CardDescription>{profile.role}</CardDescription>
                  </div>
                  <CardAction>
                    <Button
                      variant="text"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteToggle(profile.id);
                      }}
                      className="p-1 h-8 w-8"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favoriteCards.has(profile.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </Button>
                  </CardAction>
                </div>
              </CardHeader>
              {profile.id !== 'card-3' && (
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Applications</span>
                      <Badge variant="secondary">{profile.applications}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">ATS Score</span>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${profile.atsScore}%` }}
                          />
                        </div>
                        <span className="font-medium">{profile.atsScore}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant={profile.status === 'Active' ? 'default' : 'secondary'}>
                        {profile.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              )}
              <CardFooter>
                <div className="flex items-center justify-between w-full">
                  <span className="text-muted-foreground">
                    {profile.lastUpdated || 'Click to create'}
                  </span>
                  {selectedCard === profile.id && (
                    <Badge variant="elevation" className="bg-primary">
                      Selected
                    </Badge>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ComponentDemo>

      {/* Loading & Error States */}
      <ComponentDemo title="Loading & Error Card States">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium">Loading Profile Card</h4>
            <LoadingProfileCard />
          </div>
          <div className="space-y-3">
            <h4 className="font-medium">Error Profile Card</h4>
            <ErrorProfileCard onRetry={() => alert('Retrying...')} />
          </div>
          <div className="space-y-3">
            <h4 className="font-medium">Generic Error Card</h4>
            <ErrorCard
              title="Connection Failed"
              message="Unable to connect to the server."
              onRetry={() => alert('Retrying connection...')}
            />
          </div>
        </div>
      </ComponentDemo>
    </ComponentSection>
  );
}
