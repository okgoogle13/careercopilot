import React from 'react';
import {
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(MuiDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    minWidth: '400px',
    maxWidth: '600px',
  },
}));

const StyledDialogTitle = styled(MuiDialogTitle)(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(2),
  '& .MuiTypography-root': {
    fontSize: '1.25rem',
    fontWeight: 600,
  },
}));

export interface DialogProps extends MuiDialogProps {
  onOpenChange?: (open: boolean) => void;
}

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  ({ children, onClose, onOpenChange, ...props }, ref) => {
    const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
      if (onClose) {
        onClose(event, reason);
      }
      if (onOpenChange) {
        onOpenChange(false);
      }
    };

    return (
      <StyledDialog ref={ref} onClose={handleClose} {...props}>
        {children}
      </StyledDialog>
    );
  }
);

Dialog.displayName = 'Dialog';

export interface DialogContentProps extends React.ComponentProps<typeof MuiDialogContent> {}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, ...props }, ref) => {
    return (
      <MuiDialogContent ref={ref} {...props}>
        {children}
      </MuiDialogContent>
    );
  }
);

DialogContent.displayName = 'DialogContent';

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ children, ...props }, ref) => {
    return (
      <Box ref={ref} {...props}>
        {children}
      </Box>
    );
  }
);

DialogHeader.displayName = 'DialogHeader';

export interface DialogTitleProps extends React.ComponentProps<typeof Typography> {}

export const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ children, ...props }, ref) => {
    return (
      <StyledDialogTitle>
        <Typography ref={ref} component="h2" {...props}>
          {children}
        </Typography>
      </StyledDialogTitle>
    );
  }
);

DialogTitle.displayName = 'DialogTitle';

export interface DialogFooterProps extends React.ComponentProps<typeof MuiDialogActions> {}

export const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ children, ...props }, ref) => {
    return (
      <MuiDialogActions ref={ref} {...props}>
        {children}
      </MuiDialogActions>
    );
  }
);

DialogFooter.displayName = 'DialogFooter';

export interface DialogDescriptionProps extends React.ComponentProps<typeof Typography> {}

export const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ children, ...props }, ref) => {
    return (
      <Typography
        ref={ref}
        variant="body2"
        color="text.secondary"
        sx={{ mt: 1 }}
        {...props}
      >
        {children}
      </Typography>
    );
  }
);

DialogDescription.displayName = 'DialogDescription';

export interface DialogCloseProps extends React.ComponentProps<typeof IconButton> {}

export const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ onClick, ...props }, ref) => {
    return (
      <IconButton
        ref={ref}
        onClick={onClick}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
        {...props}
      >
        <CloseIcon />
      </IconButton>
    );
  }
);

DialogClose.displayName = 'DialogClose';