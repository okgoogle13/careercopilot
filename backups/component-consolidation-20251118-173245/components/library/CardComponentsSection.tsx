import { Favorite as Heart } from '@mui/icons-material';
import { Box } from '@mui/material';
import { Button, IconButton, Typography, Box } from '@mui/material';
import React, { useState } from 'react';

import { ErrorCard, ErrorProfileCard } from '../common/ErrorCard';
import { LoadingProfileCard } from '../common/LoadingCard';
import { Badge } from '../ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardAction,
} from '../ui/card';

import { ComponentSection, ComponentDemo } from './ComponentDemo';

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
        <div sx={{
      gap: 4
    }}>
          <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
            <div sx={{
      border: 1,
      borderRadius: "0.25rem",}}></div>
            <div>
              <p sx={{
      fontWeight: 500
    }}>Default Card</p>
              <p sx={{}}>
                Standard card with subtle border for static content
              </p>
            </div>
          </div>
          <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
            <div sx={{
      border: 1,
      borderRadius: "0.25rem",
      boxShadow: 4,}}></div>
            <div>
              <p sx={{
      fontWeight: 500
    }}>Interactive Card</p>
              <p sx={{}}>
                Hover effects and cursor pointer for clickable content
              </p>
            </div>
          </div>
          <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
            <div sx={{
      border: 2,
      borderRadius: "0.25rem",
      boxShadow: 4,}}></div>
            <div>
              <p sx={{
      fontWeight: 500
    }}>Selected Card</p>
              <p sx={{}}>
                Prominent purple border and glow for active/selected state
              </p>
            </div>
          </div>
          <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
            <div sx={{
      border: 1,
      borderRadius: "0.25rem",}}></div>
            <div>
              <p sx={{
      fontWeight: 500
    }}>Loading Card</p>
              <p sx={{}}>
                Skeleton placeholders during data loading states
              </p>
            </div>
          </div>
          <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
            <div sx={{
      border: 1,
      borderRadius: "0.25rem",}}></div>
            <div>
              <p sx={{
      fontWeight: 500
    }}>Error Card</p>
              <p sx={{}}>
                Red-tinted border and background for error states
              </p>
            </div>
          </div>
        </div>
      </ComponentDemo>

      {/* Interactive Profile Cards */}
      <ComponentDemo title="Profile Cards (Interactive & Selected)">
        <div sx={{
      [theme.breakpoints.up('sm')]: {},
      [theme.breakpoints.up('md')]: {},
      gap: 4
    }}>
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
                <div sx={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between"
    }}>
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
                      sx={{
      p: 1,}}
                    >
                      <Heart
                        sx={{}}
                      />
                    </Button>
                  </CardAction>
                </div>
              </CardHeader>
              {profile.id !== 'card-3' && (
                <CardContent>
                  <div sx={{}}>
                    <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
                      <span sx={{}}>Applications</span>
                      <Badge variant="secondary">{profile.applications}</Badge>
                    </div>
                    <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
                      <span sx={{}}>ATS Score</span>
                      <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                        <div sx={{
      borderRadius: "9999px",
      overflow: "hidden"
    }}>
                          <div
                            sx={{
      height: "100%",
      borderRadius: "9999px"
    }}
                            style={{ width: `${profile.atsScore}%` }}
                          />
                        </div>
                        <span sx={{
      fontWeight: 500
    }}>{profile.atsScore}%</span>
                      </div>
                    </div>
                    <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
                      <span sx={{}}>Status</span>
                      <Badge variant={profile.status === 'Active' ? 'default' : 'secondary'}>
                        {profile.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              )}
              <CardFooter>
                <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%"
    }}>
                  <span sx={{}}>
                    {profile.lastUpdated || 'Click to create'}
                  </span>
                  {selectedCard === profile.id && (
                    <Badge variant="default" sx={{}}>
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
        <div sx={{
      [theme.breakpoints.up('sm')]: {},
      gap: 4
    }}>
          <div sx={{}}>
            <h4 sx={{
      fontWeight: 500
    }}>Loading Profile Card</h4>
            <LoadingProfileCard />
          </div>
          <div sx={{}}>
            <h4 sx={{
      fontWeight: 500
    }}>Error Profile Card</h4>
            <ErrorProfileCard onRetry={() => alert('Retrying...')} />
          </div>
          <div sx={{}}>
            <h4 sx={{
      fontWeight: 500
    }}>Generic Error Card</h4>
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
