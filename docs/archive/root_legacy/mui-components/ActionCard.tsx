import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  LinearProgress,
  alpha,
} from "@mui/material";
import { LucideIcon, ArrowRight, Clock, CheckCircle, AlertCircle, Zap } from "lucide-react";

export interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant?: "default" | "primary" | "secondary" | "tertiary" | "urgent";
  status?: "available" | "in-progress" | "completed" | "blocked";
  priority?: "low" | "medium" | "high" | "urgent";
  estimatedTime?: string;
  progress?: number;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "outline" | "destructive";
  };
  metadata?: {
    label: string;
    value: string | number;
  }[];
  actionText?: string;
  secondaryActionText?: string;
  onClick?: () => void;
  onSecondaryAction?: () => void;
  disabled?: boolean;
  aiPowered?: boolean;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon: Icon,
  variant = "default",
  status = "available",
  priority = "medium",
  estimatedTime,
  progress,
  badge,
  metadata,
  actionText = "Get Started",
  secondaryActionText,
  onClick,
  onSecondaryAction,
  disabled = false,
  aiPowered = false,
}) => {
  const getVariantColor = () => {
    switch (variant) {
      case "primary":
        return "primary.main";
      case "secondary":
        return "secondary.main";
      case "tertiary":
        return "tertiary.main";
      case "urgent":
        return "error.main";
      default:
        return "text.primary";
    }
  };

  const getVariantBg = () => {
    const variantColor = getVariantColor();
    return (theme: any) =>
      alpha(
        theme.palette[variant as keyof typeof theme.palette]?.main || theme.palette.primary.main,
        0.1,
      );
  };

  const getPriorityColor = () => {
    switch (priority) {
      case "high":
        return "error.main";
      case "urgent":
        return "error.main";
      case "medium":
        return "tertiary.main";
      case "low":
        return "text.secondary";
      default:
        return "text.secondary";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} color="#86EFAC" />;
      case "in-progress":
        return <Clock size={16} color="#F472B6" />;
      case "blocked":
        return <AlertCircle size={16} color="#FFB4AB" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "blocked":
        return "Blocked";
      case "available":
        return "Available";
      default:
        return "";
    }
  };

  const isInteractive = !disabled && onClick && status !== "completed" && status !== "blocked";

  return (
    <Card
      variant={isInteractive ? "interactive" : undefined}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: (theme) =>
          variant !== "default"
            ? `linear-gradient(135deg, ${alpha(
                (
                  theme.palette[variant as "primary" | "secondary" | "tertiary" | "error"] ||
                  theme.palette.primary
                ).main,
                0.05,
              )}, ${alpha(
                (
                  theme.palette[variant as "primary" | "secondary" | "tertiary" | "error"] ||
                  theme.palette.primary
                ).main,
                0.1,
              )})`
            : theme.palette.surface.container,
        borderColor:
          variant !== "default"
            ? (theme) =>
                alpha(
                  (
                    theme.palette[variant as "primary" | "secondary" | "tertiary" | "error"] ||
                    theme.palette.primary
                  ).main,
                  0.3,
                )
            : "outline.variant",
        opacity: disabled ? 0.6 : 1,
        cursor: isInteractive ? "pointer" : "default",
        "&:hover": isInteractive
          ? {
              transform: "translateY(-4px)",
              boxShadow: (theme) => theme.customShadows.glowPrimary,
            }
          : {},
      }}
      onClick={isInteractive ? onClick : undefined}
    >
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            {/* Icon and AI Badge */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  bgcolor: getVariantBg(),
                  color: getVariantColor(),
                }}
              >
                <Icon size={24} />
              </Box>

              {aiPowered && (
                <Chip
                  icon={<Zap size={12} />}
                  label="AI"
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: "0.75rem",
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                    fontWeight: 600,
                    "& .MuiChip-icon": {
                      color: "primary.main",
                    },
                  }}
                />
              )}
            </Box>

            {/* Status and Priority */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
              {badge && (
                <Chip
                  label={badge.text}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: "0.75rem",
                  }}
                />
              )}

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {getStatusIcon()}
                <Typography variant="caption" sx={{ color: getPriorityColor(), fontWeight: 600 }}>
                  {getStatusText()}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {description}
          </Typography>
        </Box>

        {/* Progress Bar */}
        {progress !== undefined && (
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                "& .MuiLinearProgress-bar": {
                  background: (theme) =>
                    `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.tertiary.main})`,
                },
              }}
            />
          </Box>
        )}

        {/* Metadata */}
        {metadata && metadata.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
              mb: 3,
            }}
          >
            {metadata.map((item, index) => (
              <Box key={index} sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {item.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Estimated Time */}
        {estimatedTime && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <Clock size={16} />
            <Typography variant="body2" color="text.secondary">
              Estimated time: {estimatedTime}
            </Typography>
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, mt: "auto" }}>
          {status !== "completed" && (
            <Button
              variant={variant === "urgent" ? "aurora" : "outlined"}
              fullWidth
              endIcon={<ArrowRight size={16} />}
              onClick={onClick}
              disabled={disabled || status === "blocked"}
              sx={{
                py: 1.25,
                fontWeight: 600,
              }}
            >
              {actionText}
            </Button>
          )}

          {secondaryActionText && onSecondaryAction && (
            <Button
              variant="text"
              onClick={onSecondaryAction}
              disabled={disabled}
              sx={{
                color: "text.secondary",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {secondaryActionText}
            </Button>
          )}
        </Box>

        {/* Blocked Message */}
        {status === "blocked" && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
              border: 1,
              borderColor: (theme) => alpha(theme.palette.error.main, 0.2),
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AlertCircle size={16} color="#FFB4AB" />
              <Typography variant="body2" color="error.main">
                This action is currently unavailable. Complete prerequisites first.
              </Typography>
            </Box>
          </Box>
        )}

        {/* Completed Message */}
        {status === "completed" && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
              border: 1,
              borderColor: (theme) => alpha(theme.palette.success.main, 0.2),
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CheckCircle size={16} color="#86EFAC" />
              <Typography variant="body2" sx={{ color: "success.main" }}>
                Task completed successfully!
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ActionCard;
