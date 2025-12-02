
import { Card, CardContent, CardHeader, CardActions, Box, ThemeProvider } from '@mui/material';
import { M3LoadingSkeleton } from './LoadingSkeleton';
import { m3Theme } from '../../../styles/m3-theme';

export function M3LoadingCard() {
  return (
    <ThemeProvider theme={m3Theme}>
        <Card sx={{ p: 3 }}>
        {/* Profile Header Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <M3LoadingSkeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
            <M3LoadingSkeleton variant="text" width="80%" />
            <M3LoadingSkeleton variant="text" width="60%" />
            </Box>
        </Box>

        {/* Profile Stats Section */}
        <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <M3LoadingSkeleton variant="text" width="30%" />
            <M3LoadingSkeleton variant="text" width="20%" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <M3LoadingSkeleton variant="text" width="40%" />
            <M3LoadingSkeleton variant="text" width="25%" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <M3LoadingSkeleton variant="text" width="35%" />
            <M3LoadingSkeleton variant="text" width="15%" />
            </Box>
        </Box>

        {/* Action Buttons Section */}
        <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
            <M3LoadingSkeleton variant="rectangular" height={36} sx={{ flex: 1, borderRadius: '20px' }} />
            <M3LoadingSkeleton variant="rectangular" height={36} sx={{ flex: 1, borderRadius: '20px' }} />
        </Box>
        </Card>
    </ThemeProvider>
  );
}

export function M3LoadingProfileCard() {
  return <M3LoadingCard />;
}
