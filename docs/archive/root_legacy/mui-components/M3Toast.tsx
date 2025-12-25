import React from "react";
import { Snackbar, Alert, AlertTitle, IconButton, alpha } from "@mui/material";
import { styled } from "@mui/material/styles";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

export type M3ToastSeverity = "success" | "error" | "warning" | "info";

export interface M3ToastProps {
  open: boolean;
  onClose: () => void;
  severity: M3ToastSeverity;
  title?: string;
  message: string;
  duration?: number;
  position?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
}

/**
 * M3Toast - Material 3 Expressive Toast Notification
 *
 * Features:
 * - Based on MUI Snackbar with Alert
 * - Uses Material Theme Builder tokens
 * - Four variants: success, error, warning, info
 * - Backgrounds map to success/error color styles
 * - Text maps to corresponding onSuccess/onError styles
 * - Custom icons from lucide-react
 *
 * Local Styles Used:
 * Success:
 * - Background: success.main (#86EFAC) with alpha
 * - Text: success.contrastText or onSurface
 *
 * Error:
 * - Background: error.main (#FFB4AB) with alpha
 * - Text: error.contrastText (#690005) or onSurface
 *
 * Warning:
 * - Background: warning.main (#FDE047) with alpha
 * - Text: warning.contrastText or onSurface
 *
 * Info:
 * - Background: primary.main (#DAB9FF) with alpha
 * - Text: primary.contrastText (#470084) or onSurface
 */

const getSeverityColors = (severity: M3ToastSeverity, theme: any) => {
  switch (severity) {
    case "success":
      return {
        bg: alpha(theme.palette.success.main, 0.15),
        border: theme.palette.success.main,
        icon: theme.palette.success.main,
        text: theme.palette.text.primary,
      };
    case "error":
      return {
        bg: alpha(theme.palette.error.main, 0.15),
        border: theme.palette.error.main,
        icon: theme.palette.error.main,
        text: theme.palette.text.primary,
      };
    case "warning":
      return {
        bg: alpha(theme.palette.warning.main, 0.15),
        border: theme.palette.warning.main,
        icon: theme.palette.warning.main,
        text: theme.palette.text.primary,
      };
    case "info":
      return {
        bg: alpha(theme.palette.primary.main, 0.15),
        border: theme.palette.primary.main,
        icon: theme.palette.primary.main,
        text: theme.palette.text.primary,
      };
  }
};

const StyledAlert = styled(Alert, {
  shouldForwardProp: (prop) => prop !== "severity",
})<{ severity: M3ToastSeverity }>(({ theme, severity }) => {
  const colors = getSeverityColors(severity, theme);

  return {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    backgroundColor: colors.bg,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    padding: "12px 16px",
    minWidth: 300,
    maxWidth: 500,
    boxShadow: `0 4px 12px ${alpha(theme.palette.background.default, 0.4)}`,
    backdropFilter: "blur(8px)",
    "& .MuiAlert-icon": {
      color: colors.icon,
      marginRight: 12,
      padding: 0,
      opacity: 1,
    },
    "& .MuiAlert-message": {
      padding: 0,
      color: colors.text,
    },
    "& .MuiAlert-action": {
      padding: 0,
      marginRight: 0,
      marginLeft: 12,
    },
    "& .MuiAlertTitle-root": {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      fontSize: "0.875rem",
      marginBottom: 4,
      color: colors.text,
    },
  };
});

const iconMapping = {
  success: <CheckCircle size={20} />,
  error: <AlertCircle size={20} />,
  warning: <AlertTriangle size={20} />,
  info: <Info size={20} />,
};

export const M3Toast: React.FC<M3ToastProps> = ({
  open,
  onClose,
  severity,
  title,
  message,
  duration = 6000,
  position = { vertical: "bottom", horizontal: "right" },
}) => {
  return (
    <Snackbar open={open} autoHideDuration={duration} onClose={onClose} anchorOrigin={position}>
      <StyledAlert
        severity={severity}
        icon={iconMapping[severity]}
        action={
          <IconButton
            size="small"
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.text.secondary,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.08),
              },
            }}
          >
            <X size={18} />
          </IconButton>
        }
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        <span
          style={{
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontSize: "0.875rem",
          }}
        >
          {message}
        </span>
      </StyledAlert>
    </Snackbar>
  );
};

// Helper hook for managing toast state
export const useM3Toast = () => {
  const [toastState, setToastState] = React.useState<{
    open: boolean;
    severity: M3ToastSeverity;
    title?: string;
    message: string;
  }>({
    open: false,
    severity: "info",
    message: "",
  });

  const showToast = (severity: M3ToastSeverity, message: string, title?: string) => {
    setToastState({ open: true, severity, message, title });
  };

  const closeToast = () => {
    setToastState((prev) => ({ ...prev, open: false }));
  };

  return {
    toastState,
    showToast,
    closeToast,
    showSuccess: (message: string, title?: string) => showToast("success", message, title),
    showError: (message: string, title?: string) => showToast("error", message, title),
    showWarning: (message: string, title?: string) => showToast("warning", message, title),
    showInfo: (message: string, title?: string) => showToast("info", message, title),
  };
};

export default M3Toast;
