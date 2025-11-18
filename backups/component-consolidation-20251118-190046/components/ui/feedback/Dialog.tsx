import React, { ReactNode, forwardRef, useImperativeHandle, useState } from 'react';
import {
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
  Box,
  Typography,
  SxProps,
  Theme,
  Breakpoint,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface DialogProps extends Omit<MuiDialogProps, 'open' | 'onClose' | 'maxWidth'> {
  /**
   * The title of the dialog
   */
  title?: string;
  /**
   * The content of the dialog
   */
  content?: ReactNode;
  /**
   * The text content of the dialog
   */
  contentText?: string;
  /**
   * The actions to display in the dialog
   */
  actions?: ReactNode;
  /**
   * Whether to show the close button
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Whether to show the default cancel button
   * @default true
   */
  showCancelButton?: boolean;
  /**
   * The text of the cancel button
   * @default 'Cancel'
   */
  cancelButtonText?: string;
  /**
   * Whether to show the default confirm button
   * @default true
   */
  showConfirmButton?: boolean;
  /**
   * The text of the confirm button
   * @default 'Confirm'
   */
  confirmButtonText?: string;
  /**
   * The color of the confirm button
   * @default 'primary'
   */
  confirmButtonColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  /**
   * Whether the confirm button is in a loading state
   * @default false
   */
  isConfirmLoading?: boolean;
  /**
   * Whether the dialog is open
   * @default false
   */
  open?: boolean;
  /**
   * Callback when the dialog is closed
   */
  onClose?: (event: {}, reason: 'backdropClick' | 'escapeKeyDown' | 'closeButton' | 'cancelButton') => void;
  /**
   * Callback when the confirm button is clicked
   */
  onConfirm?: () => void | Promise<void>;
  /**
   * The maximum width of the dialog
   * @default 'sm'
   */
  maxWidth?: Breakpoint | false;
  /**
   * Additional styles for the dialog
   */
  sx?: SxProps<Theme>;
  /**
   * Additional styles for the dialog content
   */
  contentSx?: SxProps<Theme>;
  /**
   * Additional styles for the dialog title
   */
  titleSx?: SxProps<Theme>;
  /**
   * Additional styles for the dialog actions
   */
  actionsSx?: SxProps<Theme>;
  /**
   * Whether to disable the backdrop click to close the dialog
   * @default false
   */
  disableBackdropClick?: boolean;
  /**
   * Whether to disable the escape key to close the dialog
   * @default false
   */
  disableEscapeKeyDown?: boolean;
  /**
   * Whether to show a divider between the title and content
   * @default true
   */
  divider?: boolean;
  /**
   * The variant of the dialog
   * @default 'default'
   */
  variant?: 'default' | 'fullscreen' | 'scrollable';
}

export interface DialogRef {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

/**
 * A customizable dialog component built with Material-UI's Dialog.
 * Supports various sizes, fullscreen mode, scrollable content, and custom actions.
 */
const Dialog = forwardRef<DialogRef, DialogProps>(({
  title,
  content,
  contentText,
  actions,
  showCloseButton = true,
  showCancelButton = true,
  cancelButtonText = 'Cancel',
  showConfirmButton = true,
  confirmButtonText = 'Confirm',
  confirmButtonColor = 'primary',
  isConfirmLoading = false,
  open: openProp,
  onClose,
  onConfirm,
  maxWidth = 'sm',
  sx,
  contentSx,
  titleSx,
  actionsSx,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  divider = true,
  variant = 'default',
  children,
  ...rest
}, ref) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const handleOpen = () => {
    if (!isControlled) {
      setInternalOpen(true);
    }
  };

  const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown' | 'closeButton' | 'cancelButton') => {
    if (reason === 'backdropClick' && disableBackdropClick) {
      return;
    }
    
    if (reason === 'escapeKeyDown' && disableEscapeKeyDown) {
      return;
    }
    
    if (!isControlled) {
      setInternalOpen(false);
    }
    
    onClose?.(event, reason);
  };

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    if (!isControlled) {
      setInternalOpen(false);
    }
  };

  useImperativeHandle(ref, () => ({
    open: handleOpen,
    close: () => handleClose({}, 'closeButton'),
    isOpen: open,
  }));

  const dialogProps: MuiDialogProps = {
    open,
    onClose: (event, reason) => handleClose(event, reason as 'backdropClick' | 'escapeKeyDown'),
    maxWidth,
    fullScreen: variant === 'fullscreen',
    scroll: variant === 'scrollable' ? 'paper' : 'body',
    ...rest,
    sx: {
      '& .MuiDialog-paper': {
        width: '100%',
        m: 2,
        ...(variant === 'fullscreen' && {
          m: 0,
          height: '100%',
        }),
        ...(variant === 'scrollable' && {
          maxHeight: 'calc(100% - 64px)',
        }),
      },
      ...sx,
    },
  };

  return (
    <MuiDialog {...dialogProps}>
      <Box sx={{ position: 'relative' }}>
        {title && (
          <>
            <DialogTitle 
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pr: 6,
                ...titleSx,
              }}
            >
              <Typography variant="h6" component="div">
                {title}
              </Typography>
              {showCloseButton && (
                <IconButton
                  aria-label="close"
                  onClick={() => handleClose({}, 'closeButton')}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </DialogTitle>
            {divider && <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}
          </>
        )}
        
        <DialogContent 
          sx={{
            ...(variant === 'scrollable' && { overflowY: 'auto' }),
            ...contentSx,
          }}
        >
          {contentText ? (
            <DialogContentText>{contentText}</DialogContentText>
          ) : (
            content || children
          )}
        </DialogContent>
        
        {(showCancelButton || showConfirmButton || actions) && (
          <DialogActions 
            sx={{
              px: 3,
              py: 2,
              ...(divider && { borderTop: 1, borderColor: 'divider' }),
              ...actionsSx,
            }}
          >
            {actions || (
              <>
                {showCancelButton && (
                  <Button 
                    onClick={() => handleClose({}, 'cancelButton')}
                    disabled={isConfirmLoading}
                  >
                    {cancelButtonText}
                  </Button>
                )}
                {showConfirmButton && (
                  <Button
                    onClick={handleConfirm}
                    color={confirmButtonColor}
                    variant="contained"
                    disabled={isConfirmLoading}
                  >
                    {confirmButtonText}
                    {isConfirmLoading && (
                      <Box 
                        component="span" 
                        sx={{ 
                          display: 'inline-flex', 
                          ml: 1,
                          '& > *': { 
                            width: '1em !important', 
                            height: '1em !important' 
                          } 
                        }}
                      >
                        {/* Add your loading spinner here */}
                      </Box>
                    )}
                  </Button>
                )}
              </>
            )}
          </DialogActions>
        )}
      </Box>
    </MuiDialog>
  );
});

Dialog.displayName = 'Dialog';

export default Dialog;
