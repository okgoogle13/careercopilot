import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Grid,
  alpha,
} from '@mui/material';
import { FileText, Briefcase, Calendar, MessageSquare } from 'lucide-react';
import { M3ProfileCard } from './M3ProfileCard';

/**
 * M3CardExamples - Showcases Material 3 Expressive Card Variants
 * 
 * Demonstrates:
 * 1. M3 Outlined Cards - for content, activity, actions
 * 2. M3 Filled Cards - for profiles, featured content
 * 3. Profile Card with botanical illustration
 */
export const M3CardExamples: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
      <Container maxWidth="xl">
        {/* Page Title */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Roboto Flex", "Roboto", serif',
              fontWeight: 700,
              mb: 2,
            }}
          >
            Material 3 Expressive Cards
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}
          >
            Muted, professional design with solid cards and subtle accents
          </Typography>
        </Box>

        {/* M3 Outlined Cards Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Roboto Flex", "Roboto", serif',
              fontWeight: 600,
              mb: 3,
            }}
          >
            M3 Outlined Cards
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Used for: Recent Activity, Quick Actions, general content
          </Typography>

          <Grid container spacing={3}>
            {/* Recent Activity Card */}
            <Grid item xs={12} md={6} lg={4}>
              <Card
                variant="outlined"
                sx={{
                  backgroundColor: 'surface.container',
                  borderRadius: 4,
                  border: 1,
                  borderColor: 'outline.variant',
                  boxShadow: 'none',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                        borderRadius: 2,
                      }}
                    >
                      <FileText size={20} color="#BDB0D6" />
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: '"Roboto Flex", "Roboto", serif',
                          fontWeight: 600,
                        }}
                      >
                        Resume Updated
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        2 hours ago
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}
                  >
                    Your Community Support Worker resume has been optimized for ATS compatibility.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Action Card */}
            <Grid item xs={12} md={6} lg={4}>
              <Card
                variant="outlined"
                sx={{
                  backgroundColor: 'surface.container',
                  borderRadius: 4,
                  border: 1,
                  borderColor: 'outline.variant',
                  boxShadow: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: (theme) => alpha(theme.palette.tertiary.main, 0.12),
                        borderRadius: 2,
                      }}
                    >
                      <Briefcase size={20} color="#D8BFD0" />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Roboto Flex", "Roboto", serif',
                        fontWeight: 600,
                      }}
                    >
                      Find Jobs
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}
                  >
                    Browse opportunities that match your profile and skills.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Activity Timeline Card */}
            <Grid item xs={12} md={6} lg={4}>
              <Card
                variant="outlined"
                sx={{
                  backgroundColor: 'surface.container',
                  borderRadius: 4,
                  border: 1,
                  borderColor: 'outline.variant',
                  boxShadow: 'none',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: (theme) => alpha(theme.palette.success.main, 0.12),
                        borderRadius: 2,
                      }}
                    >
                      <Calendar size={20} color="#86EFAC" />
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: '"Roboto Flex", "Roboto", serif',
                          fontWeight: 600,
                        }}
                      >
                        Interview Scheduled
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Tomorrow at 2:00 PM
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}
                  >
                    Peer Worker position at Mental Health Services Australia.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* M3 Filled Cards Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Roboto Flex", "Roboto", serif',
              fontWeight: 600,
              mb: 3,
            }}
          >
            M3 Filled Cards
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Used for: Profile cards, featured content
          </Typography>

          <Grid container spacing={3}>
            {/* Simple Filled Card Example */}
            <Grid item xs={12} md={6} lg={4}>
              <Card
                variant="filled"
                sx={{
                  backgroundColor: 'tertiary.main',
                  borderRadius: 4,
                  border: 'none',
                  boxShadow: 'none',
                  color: 'tertiary.contrastText',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: alpha('#F8FAFC', 0.15),
                        borderRadius: 2,
                      }}
                    >
                      <MessageSquare size={20} color="#F8FAFC" />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Roboto Flex", "Roboto", serif',
                        fontWeight: 600,
                        color: 'tertiary.contrastText',
                      }}
                    >
                      Featured Tip
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      color: alpha('#F8FAFC', 0.9),
                    }}
                  >
                    Tailor your resume for each application to increase ATS compatibility by up to 40%.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Profile Cards with Botanical Illustrations */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Roboto Flex", "Roboto", serif',
              fontWeight: 600,
              mb: 3,
            }}
          >
            Profile Cards (M3 Filled with Media Layer)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Three-layer design: Base (Filled Card) + Media (Botanical Illustration) + Content
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <M3ProfileCard
                name="Nishant Dougall"
                role="Community Support Worker"
                activeApplications={8}
                atsScore={87}
                lastUpdated="2 days ago"
                avatarColor="#BDB0D6"
                onEdit={() => console.log('Edit profile')}
                onDelete={() => console.log('Delete profile')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <M3ProfileCard
                name="Sarah Martinez"
                role="Peer Worker"
                activeApplications={5}
                atsScore={92}
                lastUpdated="1 week ago"
                avatarColor="#D8BFD0"
                onEdit={() => console.log('Edit profile')}
                onDelete={() => console.log('Delete profile')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <M3ProfileCard
                name="James Chen"
                role="Mental Health Advocate"
                activeApplications={12}
                atsScore={78}
                lastUpdated="3 days ago"
                avatarColor="#A8C9A0"
                onEdit={() => console.log('Edit profile')}
                onDelete={() => console.log('Delete profile')}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Design Tokens Reference */}
        <Box sx={{ mt: 8, p: 4, bgcolor: 'surface.container', borderRadius: 4, border: 1, borderColor: 'outline.variant' }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Roboto Flex", "Roboto", serif',
              fontWeight: 600,
              mb: 3,
            }}
          >
            Design Tokens Used
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Colors
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 32, height: 32, bgcolor: 'primary.main', borderRadius: 1 }} />
                  <Typography variant="body2">primary.main: #BDB0D6</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 32, height: 32, bgcolor: 'tertiary.main', borderRadius: 1 }} />
                  <Typography variant="body2">tertiary.main: #D8BFD0</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 32, height: 32, bgcolor: 'surface.container', borderRadius: 1, border: 1, borderColor: 'outline.variant' }} />
                  <Typography variant="body2">surface.container: #1E1E23</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Typography
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">
                  Headings: Roboto Flex (serif/expressive)
                </Typography>
                <Typography variant="body2">
                  Body: Inter (sans-serif)
                </Typography>
                <Typography variant="body2">
                  Border Radius: 16px (cards)
                </Typography>
                <Typography variant="body2">
                  Shadows: None (M3 specification)
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default M3CardExamples;
