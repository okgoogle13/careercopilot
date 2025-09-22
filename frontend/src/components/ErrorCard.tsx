import { AlertTriangle, RefreshCw } from 'lucide-react';
import {
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
} from '@mui/material';

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
    <Card variant="error" className="p-6">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-destructive/10 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <CardTitle className="text-destructive">{title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-muted-foreground text-sm leading-relaxed">{message}</p>
      </CardContent>

      {showRetryButton && (
        <CardFooter className="pt-2">
          <Button
            variant="outlined"
            size="small"
            onClick={onRetry}
            className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardFooter>
      )}
    </Card>
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
