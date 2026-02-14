import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Chip,
  alpha,
} from "@mui/material";
import {
  Plus,
  User,
  TrendingUp,
  Settings,
  FileText,
  Sparkles,
  BarChart3,
  Target,
  Brain,
  ChevronRight,
} from "lucide-react";
import { ProfileCard } from "./ProfileCard";
import { CreateProfileCard } from "./CreateProfileCard";

export interface Profile {
  id: string;
  name: string;
  role: string;
  activeApplications: number;
  atsScore: number;
  lastUpdated: string;
  avatarColor: string;
}

const mockProfiles: Profile[] = [
  {
    id: "1",
    name: "Nishant Dougall",
    role: "Community Support Worker",
    activeApplications: 8,
    atsScore: 87,
    lastUpdated: "2 days ago",
    avatarColor: "#e2b8ff",
  },
  {
    id: "2",
    name: "Nishant Dougall",
    role: "Peer Worker",
    activeApplications: 5,
    atsScore: 92,
    lastUpdated: "1 week ago",
    avatarColor: "#d4fb7f",
  },
];

export interface DashboardProps {
  onCreateProfile: () => void;
  onEditProfile: (profile: Profile) => void;
  onNavigateToCareerGrowth?: () => void;
  onNavigateToSettings?: () => void;
  isEmpty?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onCreateProfile,
  onEditProfile,
  onNavigateToCareerGrowth,
  onNavigateToSettings,
  isEmpty = false,
}) => {
  const [profiles, setProfiles] = useState(isEmpty ? [] : mockProfiles);

  const handleDeleteProfile = (id: string) => {
    setProfiles(profiles.filter((p) => p.id !== id));
  };

  // Empty state for first-time users
  if (isEmpty || profiles.length === 0) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 8,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: '"Roboto Flex", "Roboto", serif',
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Welcome to Angry Unicorn
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your AI-powered career companion
              </Typography>
            </Box>
            <Button
              onClick={onNavigateToSettings}
              sx={{ color: "text.secondary", minWidth: "auto", p: 1 }}
            >
              <Settings size={20} />
            </Button>
          </Box>

          {/* Empty State Content */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              minHeight: "60vh",
              justifyContent: "center",
            }}
          >
            <Box sx={{ position: "relative", mb: 6 }}>
              <Box
                sx={{
                  width: 96,
                  height: 96,
                  borderRadius: 4,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <FileText size={48} color="#A78BFA" />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={12} color="white" />
              </Box>
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Roboto Flex", "Roboto", serif',
                fontWeight: 700,
                mb: 2,
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.tertiary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Ready to Launch Your Career?
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mb: 6, fontWeight: 400 }}
            >
              Create your first AI-optimized resume or cover letter to start landing more
              interviews. Our advanced ATS analysis ensures your documents get noticed.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Plus size={20} />}
                onClick={onCreateProfile}
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                Create Your First Document
              </Button>
              {onNavigateToCareerGrowth && (
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Brain size={20} />}
                  onClick={onNavigateToCareerGrowth}
                  sx={{
                    borderColor: "tertiary.main",
                    color: "tertiary.main",
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    "&:hover": {
                      borderColor: "tertiary.dark",
                      bgcolor: (theme) => alpha(theme.palette.tertiary.main, 0.08),
                    },
                  }}
                >
                  Explore AI Tools
                </Button>
              )}
            </Box>

            {/* Feature Grid */}
            <Grid container spacing={4} sx={{ mt: 6, maxWidth: 900 }}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <Target size={24} color="#A78BFA" />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    ATS Optimization
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    AI-powered resume scoring and optimization
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: (theme) => alpha(theme.palette.tertiary.main, 0.12),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <Brain size={24} color="#F472B6" />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Smart Insights
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get personalized career recommendations
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: (theme) => alpha(theme.palette.success.main, 0.12),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <TrendingUp size={24} color="#86EFAC" />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Career Growth
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track progress and achieve your goals
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    );
  }

  // Dashboard with profiles
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 6 }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Roboto Flex", "Roboto", serif',
                fontWeight: 700,
                mb: 1,
              }}
            >
              Career Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your job search with AI-powered insights
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Plus size={16} />}
              onClick={onCreateProfile}
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                fontWeight: 600,
              }}
            >
              Create Document
            </Button>
            <Button
              onClick={onNavigateToSettings}
              sx={{ color: "text.secondary", minWidth: "auto", p: 1 }}
            >
              <Settings size={20} />
            </Button>
          </Box>
        </Box>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "surface.container", border: 1, borderColor: "outline.variant" }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Active Applications
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontFamily: '"Roboto Flex", "Roboto", serif',
                        fontWeight: 700,
                        color: "primary.main",
                      }}
                    >
                      {profiles.reduce((sum, p) => sum + p.activeApplications, 0)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                      borderRadius: 2,
                    }}
                  >
                    <Target size={24} color="#A78BFA" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "surface.container", border: 1, borderColor: "outline.variant" }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Average ATS Score
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontFamily: '"Roboto Flex", "Roboto", serif',
                        fontWeight: 700,
                        color: "tertiary.main",
                      }}
                    >
                      {Math.round(
                        profiles.reduce((sum, p) => sum + p.atsScore, 0) / profiles.length,
                      ) || 0}
                      %
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: (theme) => alpha(theme.palette.tertiary.main, 0.12),
                      borderRadius: 2,
                    }}
                  >
                    <BarChart3 size={24} color="#F472B6" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "surface.container", border: 1, borderColor: "outline.variant" }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      AI Optimizations
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontFamily: '"Roboto Flex", "Roboto", serif',
                        fontWeight: 700,
                        background: (theme) =>
                          `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.tertiary.main})`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      24
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                      borderRadius: 2,
                    }}
                  >
                    <Brain size={24} color="#A78BFA" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Featured Career Growth Section */}
        {onNavigateToCareerGrowth && (
          <Card
            sx={{
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
              border: 1,
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
              mb: 6,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 3,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                        borderRadius: 2,
                      }}
                    >
                      <Sparkles size={24} color="#A78BFA" />
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: '"Roboto Flex", "Roboto", serif',
                          fontWeight: 700,
                          background: (theme) =>
                            `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.tertiary.main})`,
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        AI Career Intelligence
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Get personalized insights and recommendations
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.main" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Job market analysis
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "tertiary.main" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Skill gap assessment
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: (theme) =>
                            `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.tertiary.main})`,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Interview preparation
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  endIcon={<ChevronRight size={16} />}
                  onClick={onNavigateToCareerGrowth}
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                  }}
                >
                  Explore Tools
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Profile Grid */}
        <Box>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Roboto Flex", "Roboto", serif',
                fontWeight: 700,
              }}
            >
              Your Profiles
            </Typography>
            <Chip
              label={`${profiles.length} Active`}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                color: "primary.main",
                fontWeight: 600,
              }}
            />
          </Box>

          <Grid container spacing={3}>
            {profiles.map((profile) => (
              <Grid item xs={12} md={6} lg={4} key={profile.id}>
                <ProfileCard
                  name={profile.name}
                  role={profile.role}
                  activeApplications={profile.activeApplications}
                  atsScore={profile.atsScore}
                  lastUpdated={profile.lastUpdated}
                  avatarColor={profile.avatarColor}
                  onEdit={() => onEditProfile(profile)}
                  onDelete={() => handleDeleteProfile(profile.id)}
                />
              </Grid>
            ))}
            <Grid item xs={12} md={6} lg={4}>
              <CreateProfileCard onCreate={onCreateProfile} />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
