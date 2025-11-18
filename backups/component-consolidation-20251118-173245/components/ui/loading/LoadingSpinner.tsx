import { CircularProgress, Box, SxProps, Theme } from '@mui/material';

export interface LoadingSpinnerProps {
  /**
   * Size of the spinner
   * @default 40
   */
  size?: number;
  /**
   * Color of the spinner
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'inherit' | 'success' | 'error' | 'info' | 'warning';
  /**
   * Additional styles
   */
  sx?: SxProps<Theme>;
  /**
   * Whether to show a message below the spinner
   */
  message?: string;
}

export const LoadingSpinner = ({
  size = 40,
  color = 'primary',
  sx = {},
  message,
}: LoadingSpinnerProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...sx,
      }}
    >
      <CircularProgress size={size} color={color} />
      {message && (
        <Box sx={{ mt: 1, textAlign: 'center' }}>
          {typeof message === 'string' ? (
            <span style={{ color: 'text.secondary' }}>{message}</span>
          ) : (
            message
          )}
        </Box>
      )}
    </Box>
  );
};

export default LoadingSpinner;
