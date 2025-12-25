import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Chip,
  alpha,
  Divider,
} from "@mui/material";
import { Edit3, Trash2, Target, TrendingUp } from "lucide-react";

export interface ProfileCardProps {
  name: string;
  role: string;
  activeApplications: number;
  atsScore: number;
  lastUpdated: string;
  avatarColor: string;
  onEdit: () => void;
  onDelete: () => void;
  isSelected?: boolean;
}

const getScoreColor = (score: number) => {
  if (score >= 85) return "#86EFAC";
  if (score >= 70) return "#FDE047";
  return "#FFB4AB";
};

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  role,
  activeApplications,
  atsScore,
  lastUpdated,
  avatarColor,
  onEdit,
  onDelete,
  isSelected = false,
}) => {
  const scoreColor = getScoreColor(atsScore);

  return (
    <Card
      sx={{
        bgcolor: "surface.container",
        border: 1,
        borderColor: isSelected ? "primary.main" : "outline.variant",
        transition: "all 0.3s",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: (theme) => `0 4px 16px ${alpha(theme.palette.primary.main, 0.08)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header with Avatar and Score */}
        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: avatarColor,
                color: "#000",
                fontWeight: 600,
                border: (theme) => `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            >
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {role}
              </Typography>
            </Box>
          </Box>

          <Chip
            label={`${atsScore}%`}
            size="small"
            sx={{
              bgcolor: (theme) => alpha(scoreColor, 0.12),
              color: scoreColor,
              fontWeight: 600,
              border: 1,
              borderColor: (theme) => alpha(scoreColor, 0.2),
              transition: "transform 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          />
        </Box>

        {/* ATS Score Progress */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}
          >
            <Typography variant="body2" color="text.secondary">
              ATS Score
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: scoreColor }}>
              {atsScore}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={atsScore}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: (theme) => alpha(scoreColor, 0.2),
              "& .MuiLinearProgress-bar": {
                bgcolor: scoreColor,
                borderRadius: 3,
              },
            }}
          />
        </Box>

        {/* Stats Grid */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 3 }}>
          <Card
            sx={{
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
              border: 1,
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.12),
              textAlign: "center",
            }}
          >
            <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  mb: 0.5,
                }}
              >
                <Target size={12} color="#A78BFA" />
                <Typography variant="caption" color="text.secondary">
                  Applications
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 600, color: "primary.main" }}>
                {activeApplications}
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              bgcolor: (theme) => alpha(theme.palette.success.main, 0.04),
              border: 1,
              borderColor: (theme) => alpha(theme.palette.success.main, 0.12),
              textAlign: "center",
            }}
          >
            <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  mb: 0.5,
                }}
              >
                <TrendingUp size={12} color="#86EFAC" />
                <Typography variant="caption" color="text.secondary">
                  Potential
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 600, color: "success.main" }}>
                High
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Last Updated */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="caption" color="text.secondary">
            Updated {lastUpdated}
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Action Buttons */}
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="text"
            size="small"
            startIcon={<Edit3 size={16} />}
            onClick={onEdit}
            sx={{
              flex: 1,
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
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
              color: "text.secondary",
              "&:hover": {
                color: "error.main",
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
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

export default ProfileCard;
