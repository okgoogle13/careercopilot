import { Warning, Refresh } from '@mui/icons-material';
import { Card as MuiCard, CardContent, CardHeader, Typography, Box } from '@mui/material';

import { Button } from '../../ui/button';
import { CardTitle, CardFooter } from '../../ui/card';

interface ErrorCardProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
}

export function ErrorCard({
  title = 'Failed to Load',
  message = 'Unable to load profile data. Please check your connection and try again.',
  onRetry,
  showRetryButton = true,
}: ErrorCardProps) {
  return (
    <MuiCard sx={{ p: 3 }}>
      <CardHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1, backgroundColor: 'error.light', borderRadius: 1 }}>
            <Warning sx={{ fontSize: 20, color: 'error.main' }} />
          </Box>
          <CardTitle sx={{ color: 'error.main' }}>{title}</CardTitle>
        </Box>
      </CardHeader>

      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {message}
        </Typography>
      </CardContent>

      {showRetryButton && (
        <CardFooter>
          <Button
            variant="outline"
            size="small"
            onClick={onRetry}
            sx={{
              width: '100%',
              borderColor: 'error.light',
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light',
                opacity: 0.1,
              },
            }}
          >
            <Refresh sx={{ fontSize: 16, mr: 1 }} />
            Try Again
          </Button>
        </CardFooter>
      )}
    </MuiCard>
  );
}

export function ErrorProfileCard(props: ErrorCardProps) {
  return (
    <ErrorCard
      title="Profile Load Error"
      message="Unable to load this profile. There may be a connection issue or the profile data is corrupted."
      {...props}
    />
  );
}
