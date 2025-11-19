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
  GpsFixed,
} from '@mui/icons-material';
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
import React, { useState } from 'react';

import { Badge } from '../../ui/badge';
import { CardTitle, CardDescription, CardFooter, CardAction } from '../../ui/card';
import { ErrorCard, ErrorProfileCard } from '../common/ErrorCard';
import { LoadingCard, LoadingProfileCard } from '../common/LoadingCard';

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
    <div sx={{
      minHeight: "100vh",
      p: 6
    }}>
      <div sx={{}}>
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
              <ArrowLeft sx={{}} />
              Back to Dashboard
            </Button>
          </div>
          <h1 sx={{
      mb: 2
    }}>Career Copilot Card Library</h1>
          <p sx={{}}>
            A comprehensive showcase of five card variants: Default, Interactive, Selected, Loading,
            and Error
          </p>
        </div>

        {/* Card Variants Documentation */}
        <div sx={{
      gap: 6,
      mb: 8
    }}>
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
            </CardContent>
          </Card>
        </div>

        {/* Live Examples Section */}
        <div sx={{}}>
          {/* Profile Cards Example */}
          <section>
            <h2 sx={{
      mb: 4
    }}>Profile Cards (Interactive & Selected)</h2>
            <p sx={{
      mb: 6
    }}>
              Click on cards to select them. These demonstrate interactive and selected states.
            </p>
            <div sx={{
      [theme.breakpoints.up('sm')]: {},
      [theme.breakpoints.up('md')]: {},
      gap: 6
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
            <h2 sx={{
      mb: 4
    }}>Information Cards (Default)</h2>
            <p sx={{
      mb: 6
    }}>
              Static information cards using the default variant for non-interactive content.
            </p>
            <div sx={{
      [theme.breakpoints.up('sm')]: {},
      [theme.breakpoints.up('md')]: {},
      gap: 6
    }}>
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
                  icon: GpsFixed,
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
                    <CardContent sx={{
      pt: 6
    }}>
                      <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4
    }}>
                        <div sx={{
      p: 2,
      borderRadius: "0.5rem"
    }}>
                          <IconComponent sx={{}} />
                        </div>
                        <div>
                          <p sx={{
      fontWeight: 500
    }}>{stat.value}</p>
                          <p sx={{}}>{stat.title}</p>
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
            <h2 sx={{
      mb: 4
    }}>Template Selection (Mixed Usage)</h2>
            <p sx={{
      mb: 6
    }}>
              Combining all three variants in a template selection interface.
            </p>
            <div sx={{
      [theme.breakpoints.up('sm')]: {},
      gap: 6
    }}>
              {/* Featured Template - Selected */}
              <Card>
                <CardHeader>
                  <div sx={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between"
    }}>
                    <div>
                      <CardTitle>Modern Minimal</CardTitle>
                      <CardDescription>Professional & Clean</CardDescription>
                    </div>
                    <Badge variant="default">Recommended</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div sx={{}}>
                    <div sx={{
      borderRadius: "0.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
                      <FileText sx={{}} />
                    </div>
                    <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                      <CheckCircle sx={{
      color: "green.500"
    }} />
                      <span sx={{
      color: "green.500"
    }}>ATS Optimized</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button sx={{
      width: "100%"
    }}>Currently Selected</Button>
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
                    <div sx={{}}>
                      <div sx={{
      borderRadius: "0.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
                        <FileText sx={{}} />
                      </div>
                      <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                        <Star sx={{
      color: "yellow.500"
    }} />
                        <span>4.{5 + index} rating</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outlined" sx={{
      width: "100%"
    }}>
                      Select Template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          {/* Loading and Error States Example */}
          <section>
            <h2 sx={{
      mb: 4
    }}>Loading & Error States</h2>
            <p sx={{
      mb: 6
    }}>
              Specialized card variants for handling loading and error states with appropriate
              visual feedback.
            </p>
            <div sx={{
      [theme.breakpoints.up('sm')]: {},
      gap: 6
    }}>
              {/* Loading Profile Card */}
              <div sx={{}}>
                <h3 sx={{
      fontWeight: 500,}}>Loading Profile</h3>
                <LoadingProfileCard />
              </div>

              {/* Error Profile Card */}
              <div sx={{}}>
                <h3 sx={{
      fontWeight: 500,}}>Error Profile</h3>
                <ErrorProfileCard onRetry={() => alert('Retrying...')} />
              </div>

              {/* Generic Error Card */}
              <div sx={{}}>
                <h3 sx={{
      fontWeight: 500,}}>Generic Error</h3>
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
            <h2 sx={{
      mb: 4
    }}>State Progression Example</h2>
            <p sx={{
      mb: 6
    }}>
              See how a profile card transitions through different states during the data loading
              lifecycle.
            </p>
            <div sx={{
      [theme.breakpoints.up('sm')]: {},
      gap: 6
    }}>
              <div sx={{}}>
                <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                  <Loader2 sx={{}} />
                  <h4 sx={{
      fontWeight: 500
    }}>1. Loading</h4>
                </div>
                <LoadingCard />
              </div>

              <div sx={{}}>
                <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                  <CheckCircle sx={{
      color: "green.500"
    }} />
                  <h4 sx={{
      fontWeight: 500
    }}>2. Loaded</h4>
                </div>
                <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
                    <div sx={{
      bgcolor: "purple.500",
      borderRadius: "9999px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
                      <span sx={{
      color: "common.white",
      fontWeight: 500
    }}>ND</span>
                    </div>
                    <div>
                      <h3 sx={{
      fontWeight: 500,}}>Nishant Dougall</h3>
                      <p sx={{}}>Community Support Worker</p>
                    </div>
                  </div>
                  <div sx={{}}>
                    <div sx={{
      display: "flex",
      justifyContent: "space-between"
    }}>
                      <span sx={{}}>Applications</span>
                      <Badge variant="secondary">8</Badge>
                    </div>
                    <div sx={{
      display: "flex",
      justifyContent: "space-between"
    }}>
                      <span sx={{}}>ATS Score</span>
                      <span sx={{}}>92%</span>
                    </div>
                  </div>
                </Card>
              </div>

              <div sx={{}}>
                <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                  <Star sx={{}} />
                  <h4 sx={{
      fontWeight: 500
    }}>3. Selected</h4>
                </div>
                <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
                    <div sx={{
      bgcolor: "purple.500",
      borderRadius: "9999px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
                      <span sx={{
      color: "common.white",
      fontWeight: 500
    }}>ND</span>
                    </div>
                    <div>
                      <h3 sx={{
      fontWeight: 500,}}>Nishant Dougall</h3>
                      <p sx={{}}>Community Support Worker</p>
                    </div>
                  </div>
                  <div sx={{}}>
                    <div sx={{
      display: "flex",
      justifyContent: "space-between"
    }}>
                      <span sx={{}}>Applications</span>
                      <Badge variant="secondary">8</Badge>
                    </div>
                    <div sx={{
      display: "flex",
      justifyContent: "space-between"
    }}>
                      <span sx={{}}>ATS Score</span>
                      <span sx={{}}>92%</span>
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

              <div sx={{}}>
                <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                  <AlertTriangle sx={{}} />
                  <h4 sx={{
      fontWeight: 500
    }}>4. Error</h4>
                </div>
                <ErrorProfileCard onRetry={() => alert('Retrying...')} />
              </div>
            </div>
          </section>

          {/* Interactive Demo Link */}
          <section>
            <h2 sx={{
      mb: 4
    }}>Interactive State Demo</h2>
            <p sx={{
      mb: 6
    }}>
              Experience these card variants in action with realistic loading, error, and data
              scenarios.
            </p>
            <Card>
              <CardContent sx={{
      p: 6
    }}>
                <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
                  <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4
    }}>
                    <div sx={{
      p: 3,
      borderRadius: "0.5rem"
    }}>
                      <Play sx={{}} />
                    </div>
                    <div>
                      <h3 sx={{
      fontWeight: 500,
      mb: 1
    }}>Try the Interactive Demo</h3>
                      <p sx={{}}>
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
            <h2 sx={{
      mb: 4
    }}>Usage Guidelines</h2>
            <Card>
              <CardContent sx={{
      pt: 6
    }}>
                <div sx={{
      [theme.breakpoints.up('sm')]: {},
      gap: 6
    }}>
                  <div>
                    <h4 sx={{
      mb: 2,
      fontWeight: 500
    }}>Default Cards</h4>
                    <ul sx={{}}>
                      <li>• Static information display</li>
                      <li>• Statistics and metrics</li>
                      <li>• Non-interactive content</li>
                      <li>• Documentation sections</li>
                    </ul>
                  </div>
                  <div>
                    <h4 sx={{
      mb: 2,
      fontWeight: 500
    }}>Interactive Cards</h4>
                    <ul sx={{}}>
                      <li>• Clickable content</li>
                      <li>• Navigation elements</li>
                      <li>• Template selection</li>
                      <li>• Profile management</li>
                    </ul>
                  </div>
                  <div>
                    <h4 sx={{
      mb: 2,
      fontWeight: 500
    }}>Selected Cards</h4>
                    <ul sx={{}}>
                      <li>• Active selections</li>
                      <li>• Current choices</li>
                      <li>• Featured content</li>
                      <li>• Primary focus areas</li>
                    </ul>
                  </div>
                  <div>
                    <h4 sx={{
      mb: 2,
      fontWeight: 500
    }}>Loading Cards</h4>
                    <ul sx={{}}>
                      <li>• Data fetching states</li>
                      <li>• Skeleton placeholders</li>
                      <li>• Initial page loads</li>
                      <li>• Async operations</li>
                    </ul>
                  </div>
                  <div>
                    <h4 sx={{
      mb: 2,
      fontWeight: 500
    }}>Error Cards</h4>
                    <ul sx={{}}>
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
