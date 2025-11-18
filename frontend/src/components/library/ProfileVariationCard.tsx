import {
  CalendarMonth,
  ContentCopy as Copy,
  Delete,
  Edit,
  MoreVert,
  Star,
  Tag,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import { Button, Card, IconButton, Menu, MenuItem } from '@mui/material';
import { format } from 'date-fns';
import { useState } from 'react';

import { Badge } from '../ui/badge';

interface ProfileVariationCardProps {
  profile_name: string;
  keyword_count: number;
  last_modified: Date;
  is_default?: boolean;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
  onClick?: () => void;
}

export function ProfileVariationCard({
  profile_name,
  keyword_count,
  last_modified,
  is_default = false,
  onEdit,
  onDuplicate,
  onDelete,
  onSetDefault,
  onClick,
}: ProfileVariationCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return 'Today';
    } else if (diffInHours < 48) {
      return 'Yesterday';
    }
    return format(date, 'MMM d');
  };

  return (
    <Card
      sx={{
      overflow: "hidden",
      cursor: "pointer",
      '&:hover': {},}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Default Badge */}
      {is_default && (
        <div sx={{}}>
          <Badge sx={{
      color: "common.white",
      gap: 1,
      boxShadow: 4,
      fontWeight: 600
    }}>
            <Star sx={{
      fill: "currentColor"
    }} />
            Default
          </Badge>
        </div>
      )}

      {/* Actions Menu */}
      <div sx={{}}>
        <IconButton
          size="small"
          sx={{
      border: 1,
      '&:hover': {},}}
          onClick={handleMenuClick}
          sx={{
            width: 32,
            height: 32,
            opacity: isHovered ? 1 : 0,
          }}
        >
          <MoreVert sx={{ fontSize: 16 }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{ minWidth: 192 }}
        >
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClose();
              onEdit?.();
            }}
          >
            <Edit sx={{ fontSize: 16, mr: 1 }} />
            Edit Profile
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClose();
              onDuplicate?.();
            }}
          >
            <Copy sx={{ fontSize: 16, mr: 1 }} />
            Duplicate
          </MenuItem>
          {!is_default && (
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleMenuClose();
                onSetDefault?.();
              }}
            >
              <Star sx={{ fontSize: 16, mr: 1 }} />
              Set as Default
            </MenuItem>
          )}
          {!is_default && (
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleMenuClose();
                onDelete?.();
              }}
              sx={{ color: 'error.main' }}
            >
              <Delete sx={{ fontSize: 16, mr: 1 }} />
              Delete
            </MenuItem>
          )}
        </Menu>
      </div>

      {/* Content */}
      <div sx={{
      p: 6,}}>
        {/* Header */}
        <div sx={{}}>
          <h3 sx={{
      fontWeight: 600,
      typography: "h6"
    }}>
            {profile_name}
          </h3>
        </div>

        {/* Stats */}
        <div sx={{
      gap: 4
    }}>
          <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,}}>
            <Tag sx={{}} />
            <div>
              <div sx={{
      typography: "body1",
      fontWeight: 600,}}>{keyword_count}</div>
              <div sx={{
      typography: "body2"
    }}>Keywords</div>
            </div>
          </div>
          <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,}}>
            <CalendarMonth sx={{}} />
            <div>
              <div sx={{
      typography: "body1",
      fontWeight: 600,}}>
                {formatDate(last_modified)}
              </div>
              <div sx={{
      typography: "body2"
    }}>Modified</div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div sx={{}}>
          <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      typography: "body1"
    }}>
            <span sx={{}}>Optimization</span>
            <span sx={{
      fontWeight: 600
    }}>
              {Math.min(100, Math.round((keyword_count / 15) * 100))}%
            </span>
          </div>
          <div sx={{
      width: "100%",
      borderRadius: "var(--sys-shape-radius-full)",}}>
            <div
              sx={{
      borderRadius: "var(--sys-shape-radius-full)",}}
              style={{ width: `${Math.min(100, Math.round((keyword_count / 15) * 100))}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="outlined"
          sx={{
      width: "100%",
      '&:hover': {},
      '&:hover': {},
      fontWeight: 600,
      borderRadius: "1.5rem",
      py: 3
    }}
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
        >
          <Edit sx={{
      mr: 2
    }} />
          Edit Profile
        </Button>
      </div>

      {/* Hover Effect Overlay */}
      <div
        sx={{}}
      />
    </Card>
  );
}

interface ProfileVariationGridProps {
  profiles: Array<{
    id: string;
    profile_name: string;
    keyword_count: number;
    last_modified: Date;
    is_default?: boolean;
  }>;
  onProfileEdit?: (id: string) => void;
  onProfileDuplicate?: (id: string) => void;
  onProfileDelete?: (id: string) => void;
  onProfileSetDefault?: (id: string) => void;
  onProfileClick?: (id: string) => void;
  emptyState?: React.ReactNode;
}

export function ProfileVariationGrid({
  profiles,
  onProfileEdit,
  onProfileDuplicate,
  onProfileDelete,
  onProfileSetDefault,
  onProfileClick,
  emptyState,
}: ProfileVariationGridProps) {
  if (profiles.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div sx={{
      [theme.breakpoints.up('sm')]: {},
      [theme.breakpoints.up('md')]: {},
      gap: 6
    }}>
      {profiles.map((profile) => (
        <ProfileVariationCard
          key={profile.id}
          profile_name={profile.profile_name}
          keyword_count={profile.keyword_count}
          last_modified={profile.last_modified}
          is_default={profile.is_default}
          onEdit={() => onProfileEdit?.(profile.id)}
          onDuplicate={() => onProfileDuplicate?.(profile.id)}
          onDelete={() => onProfileDelete?.(profile.id)}
          onSetDefault={() => onProfileSetDefault?.(profile.id)}
          onClick={() => onProfileClick?.(profile.id)}
        />
      ))}
    </div>
  );
}
