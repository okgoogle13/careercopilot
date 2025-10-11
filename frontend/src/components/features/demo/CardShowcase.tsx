import React, { useState } from 'react';
import { Badge } from '../../ui/badge';
import { LoadingCard, LoadingProfileCard } from '../common/LoadingCard';
import { ErrorCard, ErrorProfileCard } from '../common/ErrorCard';
import { CardTitle, CardDescription, CardFooter, CardAction } from '../../ui/card';
import {
  Star,
  Favorite as Heart,
  Person as User,
  MyLocation as Target,
  TrendingUp,
  Description as FileText,
  CheckCircle,
  ArrowLeft,
  Warning as AlertTriangle,
  AutorenewRounded as Loader2,
  PlayArrow as Play,
} from '@mui/icons-material';
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

interface CardShowcaseProps {
  onBack: () => void;
}

export function CardShowcase({ onBack }: CardShowcaseProps) {
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="text" size="small" onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="mb-2">Career Copilot Card Library</h1>
          <p className="text-muted-foreground">
            A comprehensive showcase of five card variants: Default, Interactive, Selected, Loading,
            and Error
          </p>
        </div>

        {/* Card Variants Documentation */}
        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader
              title={<Typography variant="h3">Card Component Variants</Typography>}
              subheader={
                <Typography variant="body2" color="text.secondary">
                  Five distinct states designed for different interaction patterns and data states
                </Typography>
              }
            ></CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>

        {/* Live Examples Section */}
        <div className="space-y-8">
          {/* Profile Cards Example */}
          <section>
            <h2 className="mb-4">Profile Cards (Interactive & Selected)</h2>
            <p className="text-muted-foreground mb-6">
              Click on cards to select them. These demonstrate interactive and selected states.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  onClick={() => handleCardClick(profile.id)}
                  sx={{
                    cursor: 'pointer',
                    ...(selectedCard === profile.id
                      ? {
                          borderColor: 'primary.main',
                          borderWidth: 2,
                          boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}25`,
                        }
                      : {
                          '&:hover': {
                            boxShadow: (theme) => `0 4px 12px ${theme.palette.primary.main}15`,
                          },
                        }),
                  }}
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
                        <Badge
                          variant="default"
                          sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}
                        >
                          Selected
                        </Badge>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          {/* Default Cards Example */}
          <section>
            <h2 className="mb-4">Information Cards (Default)</h2>
            <p className="text-muted-foreground mb-6">
              Static information cards using the default variant for non-interactive content.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: User,
                  title: 'Total Profiles',
                  value: '2',
                  description: 'Active job profiles',
                },
                {
                  icon: FileText,
                  title: 'Documents',
                  value: '12',
                  description: 'Generated this month',
                },
                {
                  icon: Target,
                  title: 'Applications',
                  value: '13',
                  description: 'Submitted applications',
                },
                {
                  icon: TrendingUp,
                  title: 'Avg ATS Score',
                  value: '89%',
                  description: 'Across all profiles',
                },
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{stat.value}</p>
                          <p className="text-muted-foreground">{stat.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Mixed Usage Example */}
          <section>
            <h2 className="mb-4">Template Selection (Mixed Usage)</h2>
            <p className="text-muted-foreground mb-6">
              Combining all three variants in a template selection interface.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Featured Template - Selected */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Modern Minimal</CardTitle>
                      <CardDescription>Professional & Clean</CardDescription>
                    </div>
                    <Badge variant="default">Recommended</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-500">ATS Optimized</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Currently Selected</Button>
                </CardFooter>
              </Card>

              {/* Interactive Templates */}
              {[
                { name: 'Executive Pro', description: 'Corporate & Formal' },
                { name: 'Creative Portfolio', description: 'Design & Media' },
              ].map((template, index) => (
                <Card key={index}>
                  <CardHeader
                    title={<Typography variant="h3">{template.name}</Typography>}
                    subheader={
                      <Typography variant="body2" color="text.secondary">
                        {template.description}
                      </Typography>
                    }
                  ></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>4.{5 + index} rating</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Select Template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          {/* Loading and Error States Example */}
          <section>
            <h2 className="mb-4">Loading & Error States</h2>
            <p className="text-muted-foreground mb-6">
              Specialized card variants for handling loading and error states with appropriate
              visual feedback.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Loading Profile Card */}
              <div className="space-y-3">
                <h3 className="font-medium text-card-foreground">Loading Profile</h3>
                <LoadingProfileCard />
              </div>

              {/* Error Profile Card */}
              <div className="space-y-3">
                <h3 className="font-medium text-card-foreground">Error Profile</h3>
                <ErrorProfileCard onRetry={() => alert('Retrying...')} />
              </div>

              {/* Generic Error Card */}
              <div className="space-y-3">
                <h3 className="font-medium text-card-foreground">Generic Error</h3>
                <ErrorCard
                  title="Connection Failed"
                  message="Unable to connect to the server. Please check your internet connection."
                  onRetry={() => alert('Retrying connection...')}
                />
              </div>
            </div>
          </section>

          {/* State Comparison */}
          <section>
            <h2 className="mb-4">State Progression Example</h2>
            <p className="text-muted-foreground mb-6">
              See how a profile card transitions through different states during the data loading
              lifecycle.
            </p>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  <h4 className="font-medium">1. Loading</h4>
                </div>
                <LoadingCard />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <h4 className="font-medium">2. Loaded</h4>
                </div>
                <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">ND</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-card-foreground">Nishant Dougall</h3>
                      <p className="text-muted-foreground">Community Support Worker</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Applications</span>
                      <Badge variant="secondary">8</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ATS Score</span>
                      <span className="text-primary">92%</span>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  <h4 className="font-medium">3. Selected</h4>
                </div>
                <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">ND</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-card-foreground">Nishant Dougall</h3>
                      <p className="text-muted-foreground">Community Support Worker</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Applications</span>
                      <Badge variant="secondary">8</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ATS Score</span>
                      <span className="text-primary">92%</span>
                    </div>
                  </div>
                  <Badge
                    variant="default"
                    sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}
                  >
                    Selected
                  </Badge>
                </Card>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <h4 className="font-medium">4. Error</h4>
                </div>
                <ErrorProfileCard onRetry={() => alert('Retrying...')} />
              </div>
            </div>
          </section>

          {/* Interactive Demo Link */}
          <section>
            <h2 className="mb-4">Interactive State Demo</h2>
            <p className="text-muted-foreground mb-6">
              Experience these card variants in action with realistic loading, error, and data
              scenarios.
            </p>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Play className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Try the Interactive Demo</h3>
                      <p className="text-muted-foreground">
                        Simulate loading states, network errors, and data management scenarios
                      </p>
                    </div>
                  </div>
                  <Button>Launch Demo</Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Usage Guidelines */}
          <section>
            <h2 className="mb-4">Usage Guidelines</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-5 gap-6">
                  <div>
                    <h4 className="mb-2 font-medium">Default Cards</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Static information display</li>
                      <li>• Statistics and metrics</li>
                      <li>• Non-interactive content</li>
                      <li>• Documentation sections</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-medium">Interactive Cards</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Clickable content</li>
                      <li>• Navigation elements</li>
                      <li>• Template selection</li>
                      <li>• Profile management</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-medium">Selected Cards</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Active selections</li>
                      <li>• Current choices</li>
                      <li>• Featured content</li>
                      <li>• Primary focus areas</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-medium">Loading Cards</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Data fetching states</li>
                      <li>• Skeleton placeholders</li>
                      <li>• Initial page loads</li>
                      <li>• Async operations</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-medium">Error Cards</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Failed data loads</li>
                      <li>• Network errors</li>
                      <li>• Validation failures</li>
                      <li>• Server errors</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
