import { Edit, Delete as Trash2 } from '@mui/icons-material';
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

import { Avatar, AvatarFallback } from '../../ui/avatar';

interface ProfileCardProps {
  name: string;
  role: string;
  activeApplications: number;
  atsScore: number;
  lastUpdated: string;
  avatarColor: string;
  onEdit: () => void;
  onDelete: () => void;
  isSelected?: boolean;
}

export function ProfileCard({
  name,
  role,
  activeApplications,
  atsScore,
  lastUpdated,
  avatarColor,
  onEdit,
  onDelete,
  isSelected = false,
}: ProfileCardProps) {
  return (
    <Card variant={isSelected ? 'selected' : 'interactive'} sx={{
      p: 6,
      "space-y-4": true
    }}>
      <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
        <Avatar sx={{
      "w-12": true,
      "h-12": true
    }}>
          <AvatarFallback
            sx={{
      color: "common.black",
      fontWeight: 500
    }}
            style={{ backgroundColor: avatarColor }}
          >
            {name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 sx={{
      fontWeight: 500,
      "text-card-foreground": true
    }}>{name}</h3>
          <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>{role}</p>
        </div>
      </div>

      <div sx={{
      "space-y-3": true
    }}>
        <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
          <span sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Active Applications:</span>
          <span sx={{
      fontWeight: 500,
      "text-card-foreground": true
    }}>{activeApplications}</span>
        </div>

        <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
          <span sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>ATS Score Average:</span>
          <span sx={{
      fontWeight: 500,
      "text-primary": true
    }}>{atsScore}%</span>
        </div>

        <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
          <span sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Last Updated:</span>
          <span sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>{lastUpdated}</span>
        </div>
      </div>

      <div sx={{
      display: "flex",
      gap: 2,
      pt: 2
    }}>
        <Button
          variant="text"
          size="small"
          sx={{
      flex: 1,
      "text-muted-foreground": true,
      '&:hover': { "text-card-foreground": true }
    }}
          onClick={onEdit}
        >
          <Edit sx={{
      "w-4": true,
      "h-4": true
    }} />
        </Button>
        <Button
          variant="text"
          size="small"
          sx={{
      flex: 1,
      "text-destructive": true,
      '&:hover': { "text-destructive": true }
    }}
          onClick={onDelete}
        >
          <Trash2 sx={{
      "w-4": true,
      "h-4": true
    }} />
        </Button>
      </div>
    </Card>
  );
}
