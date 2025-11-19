import { Box, Backdrop, CircularProgress, SxProps, Theme } from '@mui/material';
import { LoadingSpinner, LoadingSpinnerProps } from './LoadingSpinner';

interface FullPageLoadingProps extends Omit<LoadingSpinnerProps, 'sx'> {
  /**
   * Whether the loading overlay is visible
   * @default true
   */
  open?: boolean;
  /**
   * Whether to show a semi-transparent backdrop
   * @default true
   */
  withBackdrop?: boolean;
  /**
   * Additional styles
   */
  sx?: SxProps<Theme>;
  /**
   * Additional backdrop styles
   */
  backdropSx?: SxProps<Theme>;
}

export const FullPageLoading = ({
  open = true,
  withBackdrop = true,
  sx = {},
  backdropSx = {},
  ...spinnerProps
}: FullPageLoadingProps) => {
  if (!open) return null;

  const content = (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: (theme) => theme.zIndex.modal + 1,
        ...sx,
      }}
    >
      <LoadingSpinner {...spinnerProps} />
    </Box>
  );

  if (withBackdrop) {
    return (
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.modal,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          ...backdropSx,
        }}
        open={open}
      >
        {content}
      </Backdrop>
    );
  }

  return content;
};

export default FullPageLoading;
