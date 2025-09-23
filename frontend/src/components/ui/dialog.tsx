import React from 'react';
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps as MuiDialogProps,
  IconButton,
  Box,
  Typography,
  SxProps,
  Theme,
  Backdrop,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface DialogProps extends Omit<MuiDialogProps, 'children'> {
  children?: React.ReactNode;
}

interface DialogTriggerProps {
  children: React.ReactNode;
  onClick?: () => void;
}

interface DialogContentProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

interface DialogTitleProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

interface DialogFooterProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

interface DialogCloseProps {
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

function Dialog({ children, ...props }: DialogProps) {
  return (
    <MuiDialog
      {...props}
      PaperProps={{
        sx: {
          borderRadius: 3,
          minWidth: '400px',
          maxWidth: '600px',
          position: 'relative',
          ...props.PaperProps?.sx,
        },
        ...props.PaperProps,
      }}
      BackdropComponent={Backdrop}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      {children}
    </MuiDialog>
  );
}

function DialogTrigger({ children, onClick }: DialogTriggerProps) {
  return (
    <Box component="span" onClick={onClick} sx={{ cursor: 'pointer' }}>
      {children}
    </Box>
  );
}

function DialogContent({ children, sx }: DialogContentProps) {
  return (
    <DialogContent
      sx={{
        px: 3,
        py: 2,
        '&.MuiDialogContent-root': {
          paddingTop: 2,
        },
        ...sx,
      }}
    >
      {children}
    </DialogContent>
  );
}

function DialogHeader({ children, sx }: DialogHeaderProps) {
  return (
    <Box
      sx={{
        px: 3,
        pt: 3,
        pb: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

function DialogTitleComponent({ children, sx }: DialogTitleProps) {
  return (
    <DialogTitle
      sx={{
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.2,
        padding: 0,
        color: 'text.primary',
        ...sx,
      }}
    >
      {children}
    </DialogTitle>
  );
}

function DialogDescription({ children, sx }: DialogDescriptionProps) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        lineHeight: 1.5,
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}

function DialogFooter({ children, sx }: DialogFooterProps) {
  return (
    <DialogActions
      sx={{
        px: 3,
        pb: 3,
        pt: 2,
        gap: 1,
        justifyContent: 'flex-end',
        ...sx,
      }}
    >
      {children}
    </DialogActions>
  );
}

function DialogClose({ onClick, sx }: DialogCloseProps) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        right: 12,
        top: 12,
        color: 'text.secondary',
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'action.hover',
          color: 'text.primary',
        },
        ...sx,
      }}
    >
      <Close fontSize="small" />
    </IconButton>
  );
}

// Export with proper naming
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitleComponent as DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
};
