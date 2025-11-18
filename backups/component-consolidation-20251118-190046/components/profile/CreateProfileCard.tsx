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
      height: "100%"
    }}
    >
      <div sx={{
      borderRadius: "var(--sys-shape-radius-full)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
        <Plus sx={{}} />
      </div>

      <div>
        <h3 sx={{
      fontWeight: 500,
      mb: 2
    }}>Create New Profile</h3>
        <p sx={{
      typography: "body1",}}>
          Build a tailored profile to optimize your resume for specific job applications and track
          your progress.
        </p>
      </div>

      <Button onClick={onCreate} sx={{
      '&:hover': {},}}>
        <Plus sx={{
      mr: 2
    }} />
        Create Profile
      </Button>
    </Card>
  );
}
