import { Card, CardContent, CardHeader, CardActions, Typography, Box } from '@mui/material';
import { Box } from '@mui/material';

import { Skeleton } from '../../ui/skeleton';

export function LoadingCard() {
  return (
    <Card sx={{ p: 3 }}>
      {/* Profile Header Section */}
      <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
        <Skeleton sx={{
      "w-12": true,
      "h-12": true,
      borderRadius: 9999px
    }} />
        <div sx={{
      "space-y-2": true
    }}>
          <Skeleton sx={{
      "h-4": true,
      "w-32": true
    }} />
          <Skeleton sx={{
      "h-3": true,
      "w-24": true
    }} />
        </div>
      </div>

      {/* Profile Stats Section */}
      <div sx={{
      "space-y-3": true
    }}>
        <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
          <Skeleton sx={{
      "h-3": true,
      "w-24": true
    }} />
          <Skeleton sx={{
      "h-4": true,
      "w-8": true
    }} />
        </div>

        <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
          <Skeleton sx={{
      "h-3": true,
      "w-28": true
    }} />
          <Skeleton sx={{
      "h-4": true,
      "w-12": true
    }} />
        </div>

        <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
          <Skeleton sx={{
      "h-3": true,
      "w-20": true
    }} />
          <Skeleton sx={{
      "h-3": true,
      "w-16": true
    }} />
        </div>
      </div>

      {/* Action Buttons Section */}
      <div sx={{
      display: "flex",
      gap: 2,
      pt: 2
    }}>
        <Skeleton sx={{
      flex: 1,
      "h-8": true
    }} />
        <Skeleton sx={{
      flex: 1,
      "h-8": true
    }} />
      </div>
    </Card>
  );
}

export function LoadingProfileCard() {
  return <LoadingCard />;
}
