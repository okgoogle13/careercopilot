import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
  Container,
  alpha,
} from "@mui/material";
import { ArrowLeft, Sparkles, Target, TrendingUp, MessageSquare, ArrowRight } from "lucide-react";

export interface CareerGrowthHubProps {
  onNavigate: (feature: "job-matching" | "career-intelligence" | "interview-prep") => void;
  onBack: () => void;
}

const features = [
  {
    id: "job-matching" as const,
    title: "AI Job Matching",
    description:
      "Find roles that perfectly match your skills and experience using advanced AI analysis.",
    icon: Target,
    color: "#60A5FA",
    benefits: ["Personalized job recommendations", "Skill gap analysis", "Salary insights"],
  },
  {
    id: "career-intelligence" as const,
    title: "Career Intelligence",
    description: "Get data-driven insights about your career trajectory and growth opportunities.",
    icon: TrendingUp,
    color: "#86EFAC",
    benefits: ["Career path analysis", "Market trend insights", "Skill demand forecasting"],
  },
  {
    id: "interview-prep" as const,
    title: "Interview Preparation",
    description: "Practice with AI-powered mock interviews tailored to your target roles.",
    icon: MessageSquare,
    color: "#F472B6",
    benefits: [
      "Behavioral question practice",
      "Industry-specific scenarios",
      "Personalized feedback",
    ],
  },
];

export const CareerGrowthHub: React.FC<CareerGrowthHubProps> = ({ onNavigate, onBack }) => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Button
            variant="text"
            startIcon={<ArrowLeft size={16} />}
            onClick={onBack}
            sx={{
              color: "text.secondary",
              mb: 4,
            }}
          >
            Back to Dashboard
          </Button>

          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                mb: 3,
              }}
            >
              <Sparkles size={32} color="#A78BFA" />
              <Typography
                variant="h2"
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
                Career Growth Hub
              </Typography>
            </Box>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 800, mx: "auto", fontWeight: 400 }}
            >
              Leverage AI to supercharge your career growth with personalized insights, job
              matching, and interview preparation.
            </Typography>
          </Box>
        </Box>

        {/* Feature Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Grid item xs={12} lg={4} key={feature.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "surface.container",
                    border: 1,
                    borderColor: "outline.variant",
                    transition: "all 0.3s",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "primary.main",
                      transform: "translateY(-4px)",
                      boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
                    },
                  }}
                  onClick={() => onNavigate(feature.id)}
                >
                  <CardContent sx={{ flex: 1, p: 4 }}>
                    {/* AI Badge */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                      <Chip
                        icon={<Sparkles size={14} />}
                        label="AI Powered"
                        size="small"
                        sx={{
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                          color: "primary.main",
                          borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
                          border: 1,
                        }}
                      />
                    </Box>

                    {/* Icon */}
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 3,
                        bgcolor: (theme) => alpha(feature.color, 0.12),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                        transition: "transform 0.3s",
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <Icon size={32} color={feature.color} />
                    </Box>

                    {/* Title & Description */}
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        fontFamily: '"Roboto Flex", "Roboto", serif',
                        fontWeight: 700,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3, lineHeight: 1.7 }}
                    >
                      {feature.description}
                    </Typography>

                    {/* Benefits */}
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{
                          color: "text.secondary",
                          display: "block",
                          mb: 1,
                        }}
                      >
                        Key Features
                      </Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {feature.benefits.map((benefit, index) => (
                          <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                bgcolor: "primary.main",
                                flexShrink: 0,
                              }}
                            />
                            <Typography variant="body2" color="text.primary">
                              {benefit}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      endIcon={<ArrowRight size={16} />}
                      sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        py: 1.5,
                        fontWeight: 600,
                        "&:hover": {
                          bgcolor: "primary.dark",
                        },
                      }}
                    >
                      Explore {feature.title}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Additional Info */}
        <Card
          sx={{
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
            border: 1,
            borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
          }}
        >
          <CardContent sx={{ p: 5, textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <Sparkles size={24} color="#A78BFA" />
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Roboto Flex", "Roboto", serif',
                  fontWeight: 700,
                }}
              >
                Powered by Advanced AI
              </Typography>
            </Box>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: "auto", mb: 3 }}
            >
              Our career growth tools are powered by cutting-edge AI technology that analyzes market
              trends, job requirements, and your unique profile to provide personalized career
              guidance.
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1.5 }}>
              <Chip label="Machine Learning" variant="outlined" />
              <Chip label="Natural Language Processing" variant="outlined" />
              <Chip label="Real-time Data Analysis" variant="outlined" />
              <Chip label="Personalized Recommendations" variant="outlined" />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default CareerGrowthHub;
