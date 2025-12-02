
import { Warning, Refresh } from '@mui/icons-material';
import { Card as MuiCard, CardContent, CardHeader, Typography, Box, ThemeProvider, Button } from '@mui/material';
import { m3Theme } from '../../../styles/m3-theme';

interface M3ErrorCardProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
}

export function M3ErrorCard({
  title = 'Failed to Load',
  message = 'Unable to load profile data. Please check your connection and try again.',
  onRetry,
  showRetryButton = true,
}: M3ErrorCardProps) {
  return (
    <ThemeProvider theme={m3Theme}>
        <MuiCard sx={{ p: 2 }}>
        <CardHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ p: 1, backgroundColor: 'error.light', borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Warning sx={{ fontSize: 20, color: 'error.main' }} />
            </Box>
            <Typography variant="h6" sx={{ color: 'error.main' }}>{title}</Typography>
            </Box>
        </CardHeader>

        <CardContent>
            <Typography variant="body2" color="text.secondary">
            {message}
            </Typography>
        </CardContent>

        {showRetryButton && (
            <Box sx={{ p: 2, pt: 0 }}>
            <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={onRetry}
                startIcon={<Refresh />}
            >
                Try Again
            </Button>
            </Box>
        )}
        </MuiCard>
    </ThemeProvider>
  );
}

export function M3ErrorProfileCard(props: M3ErrorCardProps) {
  return (
    <M3ErrorCard
      title="Profile Load Error"
      message="Unable to load this profile. There may be a connection issue or the profile data is corrupted."
      {...props}
    />
  );
}
