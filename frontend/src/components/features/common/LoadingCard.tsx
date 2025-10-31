import { Card, CardContent, CardHeader, CardActions, Typography, Box } from '@mui/material';

import { Skeleton } from '../../ui/skeleton';

export function LoadingCard() {
  return (
    <Card sx={{ p: 3 }}>
      {/* Profile Header Section */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Profile Stats Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-8" />
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-4 w-12" />
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="flex gap-2 pt-2">
        <Skeleton className="flex-1 h-8" />
        <Skeleton className="flex-1 h-8" />
      </div>
    </Card>
  );
}

export function LoadingProfileCard() {
  return <LoadingCard />;
}
