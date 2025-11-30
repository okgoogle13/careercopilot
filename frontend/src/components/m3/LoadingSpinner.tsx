
import { CircularProgress, Box, SxProps, Theme, ThemeProvider } from '@mui/material';
import { m3Theme } from '../../../styles/m3-theme';

export interface M3LoadingSpinnerProps {
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
}

export const M3LoadingSpinner = ({
  size = 40,
  color = 'primary',
  sx = {},
}: M3LoadingSpinnerProps) => {
  return (
    <ThemeProvider theme={m3Theme}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...sx,
        }}
      >
        <CircularProgress size={size} color={color} />
      </Box>
    </ThemeProvider>
  );
};

export default M3LoadingSpinner;
