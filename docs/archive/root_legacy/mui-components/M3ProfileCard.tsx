import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  alpha,
} from "@mui/material";
import { Edit3, Trash2, Target, TrendingUp } from "lucide-react";

export interface M3ProfileCardProps {
  name: string;
  role: string;
  activeApplications: number;
  atsScore: number;
  lastUpdated: string;
  avatarColor?: string;
  onEdit: () => void;
  onDelete: () => void;
}

const getScoreColor = (score: number) => {
  if (score >= 85) return "#86EFAC";
  if (score >= 70) return "#FDE047";
  return "#FFB4AB";
};

/**
 * M3ProfileCard - Material 3 Expressive Profile Card
 *
 * Anatomy:
 * 1. Base Container (z-index: 0) - M3 Filled Card variant
 * 2. Media Layer (z-index: 1) - Botanical leaf illustration
 * 3. Content Layer (z-index: 2) - Profile information
 */
export const M3ProfileCard: React.FC<M3ProfileCardProps> = ({
  name,
  role,
  activeApplications,
  atsScore,
  lastUpdated,
  avatarColor = "#BDB0D6",
  onEdit,
  onDelete,
}) => {
  const scoreColor = getScoreColor(atsScore);

  return (
    <Card
      variant="filled"
      sx={{
        position: "relative",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        // Base container uses M3 Filled variant
        backgroundColor: "tertiary.main",
        borderRadius: 4,
        border: "none",
        boxShadow: "none",
      }}
    >
      {/* Media Layer (z-index: 1) - Botanical Leaf Illustration */}
      <Box
        sx={{
          position: "absolute",
          bottom: -20,
          right: -20,
          width: 180,
          height: 180,
          opacity: 0.7,
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        {/* Simple leaf SVG shape - muted soft green */}
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Monstera-style leaf shape */}
          <path
            d="M90 20C110 20 130 35 140 55C150 75 155 100 150 125C145 150 130 165 110 170C90 175 70 170 55 155C40 140 30 115 30 90C30 65 40 40 55 28C70 16 80 20 90 20Z"
            fill="#A8C9A0"
            opacity="0.6"
          />
          <path
            d="M95 45C105 50 115 60 120 75C125 90 125 105 118 118C111 131 98 138 85 135C72 132 62 120 58 105C54 90 56 72 65 60C74 48 85 40 95 45Z"
            fill="#B5D4AD"
            opacity="0.5"
          />
        </svg>
      </Box>

      {/* Content Layer (z-index: 2) */}
      <CardContent
        sx={{
          p: 3,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: avatarColor,
              color: "#1E1E23",
              fontWeight: 600,
              fontSize: "1.125rem",
            }}
          >
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Roboto Flex", "Roboto", serif',
                fontWeight: 700,
                color: "tertiary.contrastText",
              }}
            >
              {name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: '"Inter", "Roboto", sans-serif',
                color: alpha("#F8FAFC", 0.8),
              }}
            >
              {role}
            </Typography>
          </Box>
        </Box>

        {/* ATS Score Progress */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}
          >
            <Typography
              variant="body2"
              sx={{
                fontFamily: '"Inter", "Roboto", sans-serif',
                color: alpha("#F8FAFC", 0.8),
              }}
            >
              ATS Score
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: '"Inter", "Roboto", sans-serif',
                fontWeight: 600,
                color: scoreColor,
              }}
            >
              {atsScore}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={atsScore}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: alpha("#131318", 0.3),
              "& .MuiLinearProgress-bar": {
                bgcolor: scoreColor,
                borderRadius: 4,
              },
            }}
          />
        </Box>

        {/* Stat Boxes */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 3 }}>
          {/* Applications Stat */}
          <Box
            sx={{
              bgcolor: alpha("#131318", 0.3),
              borderRadius: 2,
              p: 1.5,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                mb: 0.5,
              }}
            >
              <Target size={14} color="#F8FAFC" />
              <Typography
                variant="caption"
                sx={{
                  fontFamily: '"Inter", "Roboto", sans-serif',
                  color: alpha("#F8FAFC", 0.7),
                }}
              >
                Applications
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Roboto Flex", "Roboto", serif',
                fontWeight: 700,
                color: "tertiary.contrastText",
              }}
            >
              {activeApplications}
            </Typography>
          </Box>

          {/* Potential Stat */}
          <Box
            sx={{
              bgcolor: alpha("#131318", 0.3),
              borderRadius: 2,
              p: 1.5,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                mb: 0.5,
              }}
            >
              <TrendingUp size={14} color="#F8FAFC" />
              <Typography
                variant="caption"
                sx={{
                  fontFamily: '"Inter", "Roboto", sans-serif',
                  color: alpha("#F8FAFC", 0.7),
                }}
              >
                Potential
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Roboto Flex", "Roboto", serif',
                fontWeight: 700,
                color: "tertiary.contrastText",
              }}
            >
              High
            </Typography>
          </Box>
        </Box>

        {/* Last Updated */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography
            variant="caption"
            sx={{
              fontFamily: '"Inter", "Roboto", sans-serif',
              color: alpha("#F8FAFC", 0.6),
            }}
          >
            Updated {lastUpdated}
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Action Buttons */}
        <Box
          sx={{ display: "flex", gap: 1, pt: 2, borderTop: `1px solid ${alpha("#F8FAFC", 0.2)}` }}
        >
          <Button
            variant="text"
            size="small"
            startIcon={<Edit3 size={16} />}
            onClick={onEdit}
            sx={{
              flex: 1,
              color: "tertiary.contrastText",
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 600,
              "&:hover": {
                bgcolor: alpha("#F8FAFC", 0.1),
              },
            }}
          >
            Edit
          </Button>
          <Button
            variant="text"
            size="small"
            startIcon={<Trash2 size={16} />}
            onClick={onDelete}
            sx={{
              flex: 1,
              color: alpha("#F8FAFC", 0.8),
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 600,
              "&:hover": {
                bgcolor: alpha("#FFB4AB", 0.15),
                color: "#FFB4AB",
              },
            }}
          >
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default M3ProfileCard;
