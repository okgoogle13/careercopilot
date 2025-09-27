import React from "react";
import { LucideIcon, ArrowRight, Clock, CheckCircle, AlertCircle, Zap } from "lucide-react";
import { M3Card, M3CardHeader, M3CardTitle, M3CardDescription, M3CardContent } from "../ui/m3-card";
import { M3Button } from "../ui/m3-button";
import { Badge } from "../ui/badge";
import { cn } from "../ui/utils";

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
  className?: string;
  aiPowered?: boolean;
}

export function ActionCard({
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
  className,
  aiPowered = false,
}: ActionCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10";
      case "secondary":
        return "border-secondary/30 bg-gradient-to-br from-secondary/5 to-secondary/10";
      case "tertiary":
        return "border-tertiary/30 bg-gradient-to-br from-tertiary/5 to-tertiary/10";
      case "urgent":
        return "border-error/30 bg-gradient-to-br from-error/5 to-error/10";
      default:
        return "";
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case "high":
        return "text-error";
      case "urgent":
        return "text-error animate-pulse";
      case "medium":
        return "text-tertiary";
      case "low":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-tertiary" />;
      case "blocked":
        return <AlertCircle className="w-4 h-4 text-error" />;
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
    <M3Card
      variant={isInteractive ? "interactive" : "default"}
      className={cn(
        "transition-all duration-300",
        getVariantStyles(),
        disabled && "opacity-60 cursor-not-allowed",
        className,
      )}
      onClick={isInteractive ? onClick : undefined}
    >
      <M3CardHeader>
        <div className="flex items-start justify-between mb-3">
          {/* Icon and AI Badge */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-xl",
                variant === "primary" && "bg-primary/10 text-primary",
                variant === "secondary" && "bg-secondary/10 text-secondary",
                variant === "tertiary" && "bg-tertiary/10 text-tertiary",
                variant === "urgent" && "bg-error/10 text-error",
                variant === "default" && "bg-surface-container-high text-foreground",
              )}
            >
              <Icon className="w-6 h-6" />
            </div>

            {aiPowered && (
              <Badge variant="secondary" className="bg-primary/10 text-primary text-xs px-2 py-1">
                <Zap className="w-3 h-3 mr-1" />
                AI
              </Badge>
            )}
          </div>

          {/* Status and Priority */}
          <div className="flex flex-col items-end gap-2">
            {badge && (
              <Badge variant={badge.variant || "default"} className="text-xs">
                {badge.text}
              </Badge>
            )}

            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className={cn("text-xs font-medium", getPriorityColor())}>
                {getStatusText()}
              </span>
            </div>
          </div>
        </div>

        <M3CardTitle className="text-lg mb-2">{title}</M3CardTitle>

        <M3CardDescription className="text-sm leading-relaxed">{description}</M3CardDescription>
      </M3CardHeader>

      <M3CardContent>
        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-medium text-foreground">{progress}%</span>
            </div>
            <div className="w-full bg-surface-container-low rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  variant === "primary" && "bg-primary",
                  variant === "secondary" && "bg-secondary",
                  variant === "tertiary" && "bg-tertiary",
                  variant === "urgent" && "bg-error",
                  variant === "default" && "bg-primary",
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Metadata */}
        {metadata && metadata.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {metadata.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-semibold text-foreground">{item.value}</div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Estimated Time */}
        {estimatedTime && (
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Estimated time: {estimatedTime}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          {status !== "completed" && (
            <M3Button
              variant={variant === "urgent" ? "filled" : "outlined"}
              size="medium"
              onClick={onClick}
              disabled={disabled || status === "blocked"}
              trailingIcon={<ArrowRight className="w-4 h-4" />}
              className={cn("flex-1", variant === "urgent" && "bg-error hover:bg-error/90")}
            >
              {actionText}
            </M3Button>
          )}

          {secondaryActionText && onSecondaryAction && (
            <M3Button
              variant="text"
              size="medium"
              onClick={onSecondaryAction}
              disabled={disabled}
              className="text-muted-foreground"
            >
              {secondaryActionText}
            </M3Button>
          )}
        </div>

        {/* Blocked Message */}
        {status === "blocked" && (
          <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-error">
              <AlertCircle className="w-4 h-4" />
              <span>This action is currently unavailable. Complete prerequisites first.</span>
            </div>
          </div>
        )}

        {/* Completed Message */}
        {status === "completed" && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>Task completed successfully!</span>
            </div>
          </div>
        )}
      </M3CardContent>
    </M3Card>
  );
}
