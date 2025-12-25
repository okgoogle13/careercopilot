import React from "react";
import { Box, Typography, Button, Grid, Card, CardContent, alpha } from "@mui/material";
import {
  FileText,
  Target,
  Brain,
  TrendingUp,
  Sparkles,
  Plus,
  Clock,
  CheckCircle,
} from "lucide-react";
import { WelcomeBanner } from "./WelcomeBanner";
import { ActionCard } from "./ActionCard";
import { DocumentCard } from "./DocumentCard";

interface DashboardViewProps {
  onCreateDocument?: () => void;
  onViewAnalytics?: () => void;
  onNavigateToOpportunities?: () => void;
  onNavigateToApplications?: () => void;
}

// Mock data for demonstration
const mockDocuments = [
  {
    id: "1",
    title: "Software Engineer Resume",
    type: "resume" as const,
    status: "completed" as const,
    version: "2.1",
    lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    atsScore: 87,
    tags: ["Tech", "Senior Level"],
    aiGenerated: true,
  },
  {
    id: "2",
    title: "Google Cover Letter",
    type: "cover-letter" as const,
    status: "completed" as const,
    version: "1.0",
    lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    atsScore: 92,
    tags: ["Tech", "FAANG"],
    aiGenerated: true,
  },
  {
    id: "3",
    title: "Product Manager Resume",
    type: "resume" as const,
    status: "draft" as const,
    version: "1.0",
    lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    createdDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    atsScore: 78,
    tags: ["Product", "Mid Level"],
    aiGenerated: false,
  },
];

const profileData = {
  totalApplications: 24,
  activeApplications: 8,
  interviewsScheduled: 3,
  lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  recentAchievements: [
    "ATS score improved by 15%",
    "Applied to 3 dream companies",
    "Resume optimized for tech roles",
  ],
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  onCreateDocument,
  onViewAnalytics,
  onNavigateToOpportunities,
  onNavigateToApplications,
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
          p: { xs: 3, md: 6 },
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {/* Welcome Banner */}
        <WelcomeBanner
          userName="Nishant"
          profileData={profileData}
          onCreateDocument={onCreateDocument}
          onViewAnalytics={onViewAnalytics}
        />

        {/* Quick Actions Grid */}
        <Box>
          <Box
            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Quick Actions
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Create Document Action */}
            <Grid item xs={12} md={6} lg={4}>
              <ActionCard
                title="Create New Document"
                description="Generate an AI-optimized resume or cover letter tailored to your target role"
                icon={FileText}
                variant="primary"
                status="available"
                priority="high"
                estimatedTime="5-10 min"
                actionText="Start Creating"
                onClick={onCreateDocument}
                aiPowered={true}
                badge={{
                  text: "Most Popular",
                  variant: "default",
                }}
              />
            </Grid>

            {/* Find Opportunities */}
            <Grid item xs={12} md={6} lg={4}>
              <ActionCard
                title="Find Job Opportunities"
                description="Discover jobs that match your skills and get AI-powered insights on each role"
                icon={Target}
                variant="tertiary"
                status="available"
                priority="medium"
                estimatedTime="3-5 min"
                actionText="Browse Jobs"
                onClick={onNavigateToOpportunities}
                aiPowered={true}
              />
            </Grid>

            {/* Track Applications */}
            <Grid item xs={12} md={6} lg={4}>
              <ActionCard
                title="Track Applications"
                description="Monitor your job applications, interview schedules, and follow-up actions"
                icon={TrendingUp}
                variant="secondary"
                status="available"
                priority="medium"
                actionText="View Tracker"
                onClick={onNavigateToApplications}
                metadata={[
                  { label: "Active", value: 8 },
                  { label: "Pending", value: 3 },
                ]}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Recent Documents */}
        <Box>
          <Box
            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Recent Documents
            </Typography>
            <Button
              variant="text"
              startIcon={<Plus size={16} />}
              onClick={onCreateDocument}
              sx={{
                color: "primary.main",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              New Document
            </Button>
          </Box>

          <Grid container spacing={3}>
            {mockDocuments.map((doc) => (
              <Grid item xs={12} md={6} lg={4} key={doc.id}>
                <DocumentCard
                  document={doc}
                  onEdit={() => console.log("Edit", doc.id)}
                  onDelete={() => console.log("Delete", doc.id)}
                  onDownload={() => console.log("Download", doc.id)}
                  onView={() => console.log("View", doc.id)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Job Search Intelligence Card */}
        <Card
          variant="glass"
          sx={{
            p: 4,
            background: (theme) =>
              `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(
                theme.palette.tertiary.main,
                0.05,
              )})`,
            border: 2,
            borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.4),
            },
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: (theme) =>
                    `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(
                      theme.palette.tertiary.main,
                      0.2,
                    )})`,
                  boxShadow: (theme) => theme.customShadows.glowAurora,
                }}
              >
                <Brain size={24} color="#A78BFA" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Job Search Intelligence
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  AI-powered insights and recommendations
                </Typography>
              </Box>
            </Box>
            <Sparkles size={20} color="#F472B6" />
          </Box>

          {/* Stats Grid */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "surface.container",
                  border: 1,
                  borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: (theme) => theme.customShadows.glowPrimary,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Target size={16} color="#A78BFA" />
                  <Typography variant="body2" color="text.secondary">
                    Applications
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {profileData.activeApplications}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Active this month
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "surface.container",
                  border: 1,
                  borderColor: (theme) => alpha(theme.palette.tertiary.main, 0.2),
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: (theme) => theme.customShadows.glowTertiary,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Clock size={16} color="#F472B6" />
                  <Typography variant="body2" color="text.secondary">
                    Interviews
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {profileData.interviewsScheduled}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Scheduled
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "surface.container",
                  border: 1,
                  borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: (theme) => theme.customShadows.glowPrimary,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <CheckCircle size={16} color="#A78BFA" />
                  <Typography variant="body2" color="text.secondary">
                    Response Rate
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  67%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  +12% this week
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "surface.container",
                  border: 1,
                  borderColor: (theme) => alpha(theme.palette.tertiary.main, 0.2),
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: (theme) => theme.customShadows.glowTertiary,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <TrendingUp size={16} color="#F472B6" />
                  <Typography variant="body2" color="text.secondary">
                    Avg ATS Score
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  85%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Excellent
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardView;
