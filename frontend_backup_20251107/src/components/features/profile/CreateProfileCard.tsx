import { Add as Plus } from '@mui/icons-material';
import { Box } from '@mui/material';
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

interface CreateProfileCardProps {
  onCreate: () => void;
}

export function CreateProfileCard({ onCreate }: CreateProfileCardProps) {
  return (
    <Card
      variant="elevation"
      sx={{
      p: 6,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      "space-y-4": true,
      height: "100%"
    }}
    >
      <div sx={{
      "w-12": true,
      "h-12": true,
      "bg-primary": true,
      borderRadius: 9999px,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
        <Plus sx={{
      "w-6": true,
      "h-6": true,
      "text-primary-foreground": true
    }} />
      </div>

      <div>
        <h3 sx={{
      fontWeight: 500,
      "text-card-foreground": true,
      mb: 2
    }}>Create New Profile</h3>
        <p sx={{
      typography: body1,
      "text-muted-foreground": true,
      "leading-relaxed": true
    }}>
          Build a tailored profile to optimize your resume for specific job applications and track
          your progress.
        </p>
      </div>

      <Button onClick={onCreate} sx={{
      "bg-primary": true,
      '&:hover': { "bg-primary/90": true },
      "text-primary-foreground": true
    }}>
        <Plus sx={{
      "w-4": true,
      "h-4": true,
      mr: 2
    }} />
        Create Profile
      </Button>
    </Card>
  );
}
