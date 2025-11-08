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
      borderRadius: "9999px"
    }} />
        <div sx={{}}>
          <Skeleton sx={{}} />
          <Skeleton sx={{}} />
        </div>
      </div>

      {/* Profile Stats Section */}
      <div sx={{}}>
        <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
          <Skeleton sx={{}} />
          <Skeleton sx={{}} />
        </div>

        <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
          <Skeleton sx={{}} />
          <Skeleton sx={{}} />
        </div>

        <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
          <Skeleton sx={{}} />
          <Skeleton sx={{}} />
        </div>
      </div>

      {/* Action Buttons Section */}
      <div sx={{
      display: "flex",
      gap: 2,
      pt: 2
    }}>
        <Skeleton sx={{
      flex: 1,}} />
        <Skeleton sx={{
      flex: 1,}} />
      </div>
    </Card>
  );
}

export function LoadingProfileCard() {
  return <LoadingCard />;
}
