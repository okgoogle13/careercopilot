import React from "react";
import { Box, Typography, Button, Card, CardContent, alpha } from "@mui/material";
import { Plus, Sparkles, FileText } from "lucide-react";

export interface CreateProfileCardProps {
  onCreate: () => void;
}

export const CreateProfileCard: React.FC<CreateProfileCardProps> = ({ onCreate }) => {
  return (
    <Card
      onClick={onCreate}
      sx={{
        bgcolor: "surface.container",
        border: 1,
        borderColor: "outline.variant",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.3s",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-4px)",
          boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
          "& .icon-container": {
            transform: "scale(1.1)",
          },
          "& .button-cta": {
            transform: "scale(1.05)",
          },
        },
      }}
    >
      <CardContent
        sx={{
          p: 4,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 3,
        }}
      >
        {/* Icon */}
        <Box sx={{ position: "relative" }}>
          <Box
            className="icon-container"
            sx={{
              width: 64,
              height: 64,
              borderRadius: 3,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.3s",
            }}
          >
            <Plus size={32} color="#A78BFA" />
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: -4,
              right: -4,
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.tertiary.main})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={12} color="white" />
          </Box>
        </Box>

        {/* Text */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Roboto Flex", "Roboto", serif',
              fontWeight: 700,
              mb: 1,
            }}
          >
            Create New Document
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 280, lineHeight: 1.7 }}
          >
            Build AI-optimized resumes and cover letters that get you noticed by employers and pass
            ATS systems.
          </Typography>
        </Box>

        {/* Document Type */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FileText size={14} color="#94A3B8" />
          <Typography variant="caption" color="text.secondary">
            Resume & Cover Letters
          </Typography>
        </Box>

        {/* CTA Button */}
        <Button
          className="button-cta"
          variant="contained"
          startIcon={<Plus size={16} />}
          onClick={(e) => {
            e.stopPropagation();
            onCreate();
          }}
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            px: 3,
            py: 1.5,
            fontWeight: 600,
            transition: "transform 0.3s",
          }}
        >
          Get Started
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateProfileCard;
