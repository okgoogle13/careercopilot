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
      p: 6,}}>
      <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
        <Avatar sx={{}}>
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
      fontWeight: 500,}}>{name}</h3>
          <p sx={{
      typography: "body1",}}>{role}</p>
        </div>
      </div>

      <div sx={{}}>
        <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
          <span sx={{
      typography: "body1",}}>Active Applications:</span>
          <span sx={{
      fontWeight: 500,}}>{activeApplications}</span>
        </div>

        <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
          <span sx={{
      typography: "body1",}}>ATS Score Average:</span>
          <span sx={{
      fontWeight: 500,}}>{atsScore}%</span>
        </div>

        <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
          <span sx={{
      typography: "body1",}}>Last Updated:</span>
          <span sx={{
      typography: "body1",}}>{lastUpdated}</span>
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
      '&:hover': {}
    }}
          onClick={onEdit}
        >
          <Edit sx={{}} />
        </Button>
        <Button
          variant="text"
          size="small"
          sx={{
      flex: 1,
      '&:hover': {}
    }}
          onClick={onDelete}
        >
          <Trash2 sx={{}} />
        </Button>
      </div>
    </Card>
  );
}
