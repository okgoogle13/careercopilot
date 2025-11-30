
import { Box, Backdrop, SxProps, Theme, ThemeProvider } from '@mui/material';
import { M3LoadingSpinner, M3LoadingSpinnerProps } from './LoadingSpinner';
import { m3Theme } from '../../../styles/m3-theme';

interface M3FullPageLoadingProps extends Omit<M3LoadingSpinnerProps, 'sx'> {
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

export const M3FullPageLoading = ({
  open = true,
  withBackdrop = true,
  sx = {},
  backdropSx = {},
  ...spinnerProps
}: M3FullPageLoadingProps) => {
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
      <M3LoadingSpinner {...spinnerProps} />
    </Box>
  );

  if (withBackdrop) {
    return (
      <ThemeProvider theme={m3Theme}>
        <Backdrop
          sx={{
            zIndex: (theme) => theme.zIndex.modal,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            ...backdropSx,
          }}
          open={open}
        >
          {content}
        </Backdrop>
      </ThemeProvider>
    );
  }

  return <ThemeProvider theme={m3Theme}>{content}</ThemeProvider>;
};

export default M3FullPageLoading;
