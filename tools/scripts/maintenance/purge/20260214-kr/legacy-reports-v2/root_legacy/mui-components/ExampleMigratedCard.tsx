import React from "react";
import { Card, CardContent, Typography, Box, Button, Chip, alpha } from "@mui/material";
import { Sparkles as SparklesIcon } from "lucide-react";

/**
 * Example Migrated Component
 *
 * This shows how a Tailwind-based component is converted to MUI.
 *
 * BEFORE (Tailwind):
 * <div className="glass-bg backdrop-blur-md rounded-xl p-6 border border-glass hover:border-primary transition-all">
 *   <div className="flex items-center gap-2 mb-4">
 *     <SparklesIcon className="w-5 h-5 text-primary" />
 *     <h3 className="text-xl font-semibold text-on-surface">AI-Powered Resume</h3>
 *     <span className="ml-auto bg-tertiary/20 text-tertiary px-2 py-1 rounded text-xs">New</span>
 *   </div>
 *   <p className="text-sm text-on-surface-variant mb-4">
 *     Generate professional resumes in seconds with AI assistance
 *   </p>
 *   <button className="w-full bg-gradient-primary text-white py-2 rounded-lg hover:shadow-glow-aurora">
 *     Get Started
 *   </button>
 * </div>
 */

interface ExampleMigratedCardProps {
  title?: string;
  description?: string;
  isNew?: boolean;
  onAction?: () => void;
}

export const ExampleMigratedCard: React.FC<ExampleMigratedCardProps> = ({
  title = "AI-Powered Resume",
  description = "Generate professional resumes in seconds with AI assistance",
  isNew = true,
  onAction,
}) => {
  return (
    <Card
      variant="glass"
      sx={{
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-4px)",
          boxShadow: (theme) => theme.customShadows.glowPrimary,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header with Icon, Title, and Badge */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <SparklesIcon
            size={20}
            style={{ color: "#A78BFA" }} // theme.palette.primary.main
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              flex: 1,
            }}
          >
            {title}
          </Typography>
          {isNew && (
            <Chip
              label="New"
              size="small"
              sx={{
                height: 24,
                fontSize: "0.75rem",
                fontWeight: 600,
                background: (theme) => alpha(theme.palette.tertiary.main, 0.2),
                color: "tertiary.main",
                border: (theme) => `1px solid ${alpha(theme.palette.tertiary.main, 0.3)}`,
              }}
            />
          )}
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>

        {/* Action Button with Aurora Gradient */}
        <Button
          variant="aurora"
          fullWidth
          onClick={onAction}
          sx={{
            py: 1.25,
            fontWeight: 600,
          }}
        >
          Get Started
        </Button>
      </CardContent>
    </Card>
  );
};

/**
 * Example with Aurora Gradient Border
 *
 * This shows how to create the signature Aurora gradient border effect
 */
export const ExampleAuroraBorderCard: React.FC<ExampleMigratedCardProps> = (props) => {
  return (
    <Box
      sx={{
        p: "2px", // Border width
        borderRadius: 3,
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.tertiary.main})`,
      }}
    >
      <Box sx={{ borderRadius: "22px" }}>
        <ExampleMigratedCard {...props} />
      </Box>
    </Box>
  );
};

/**
 * Example Grid Layout
 *
 * Shows how to create a responsive grid of cards
 */
import { Grid } from "@mui/material";

export const ExampleCardGrid: React.FC = () => {
  const cards = [
    {
      title: "AI-Powered Resume",
      description: "Generate professional resumes in seconds with AI assistance",
      isNew: true,
    },
    {
      title: "Cover Letter Generator",
      description: "Create personalized cover letters tailored to each job",
      isNew: true,
    },
    {
      title: "ATS Optimization",
      description: "Optimize your documents for Applicant Tracking Systems",
      isNew: false,
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} md={6} lg={4} key={index}>
          <ExampleMigratedCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ExampleMigratedCard;
