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
      "relative": true,
      overflow: "hidden",
      "transition-all": true,
      "duration-300": true,
      cursor: "pointer",
      "group": true,
      "card-surface": true,
      '&:hover': { "border-brand-primary": true },
      "${": true,
      "is_default": true,
      "?": true,
      "'ring-2": true,
      "ring-brand-primary/50": true,
      "bg-brand-primary/5'": true,
      ":": true,
      "''": true,
      "}": true
    }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Default Badge */}
      {is_default && (
        <div sx={{
      "absolute": true,
      "top-3": true,
      "left-3": true,
      "z-10": true
    }}>
          <Badge sx={{
      "bg-brand-primary": true,
      color: "common.white",
      gap: 1,
      boxShadow: 4,
      fontWeight: 600
    }}>
            <Star sx={{
      "w-3": true,
      "h-3": true,
      fill: "currentColor"
    }} />
            Default
          </Badge>
        </div>
      )}

      {/* Actions Menu */}
      <div sx={{
      "absolute": true,
      "top-3": true,
      "right-3": true,
      "z-10": true
    }}>
        <IconButton
          size="small"
          sx={{
      "transition-opacity": true,
      "bg-surface-card/80": true,
      "backdrop-blur-sm": true,
      border: 1,
      "border-subtle": true,
      '&:hover': { "bg-surface-section": true },
      "${": true,
      "isHovered": true,
      "?": true,
      "'opacity-100'": true,
      ":": true,
      "'opacity-0'": true,
      "}": true
    }}
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
      p: 6,
      "space-y-4": true
    }}>
        {/* Header */}
        <div sx={{
      "space-y-2": true
    }}>
          <h3 sx={{
      fontWeight: 600,
      "text-content-primary": true,
      "group-hover:text-brand-light": true,
      "transition-colors": true,
      typography: h6
    }}>
            {profile_name}
          </h3>
        </div>

        {/* Stats */}
        <div sx={{
      "grid": true,
      "grid-cols-2": true,
      gap: 4
    }}>
          <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      "text-content-secondary": true
    }}>
            <Tag sx={{
      "w-4": true,
      "h-4": true,
      "text-brand-primary/70": true
    }} />
            <div>
              <div sx={{
      typography: body1,
      fontWeight: 600,
      "text-content-primary": true
    }}>{keyword_count}</div>
              <div sx={{
      typography: body2
    }}>Keywords</div>
            </div>
          </div>
          <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      "text-content-secondary": true
    }}>
            <CalendarMonth sx={{
      "w-4": true,
      "h-4": true,
      "text-brand-primary/70": true
    }} />
            <div>
              <div sx={{
      typography: body1,
      fontWeight: 600,
      "text-content-primary": true
    }}>
                {formatDate(last_modified)}
              </div>
              <div sx={{
      typography: body2
    }}>Modified</div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div sx={{
      "space-y-2": true
    }}>
          <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      typography: body1
    }}>
            <span sx={{
      "text-content-secondary": true
    }}>Optimization</span>
            <span sx={{
      "text-content-primary": true,
      fontWeight: 600
    }}>
              {Math.min(100, Math.round((keyword_count / 15) * 100))}%
            </span>
          </div>
          <div sx={{
      width: "100%",
      "bg-surface-section": true,
      borderRadius: 9999px,
      "h-2": true
    }}>
            <div
              sx={{
      "bg-gradient-to-r": true,
      "from-brand-primary": true,
      "to-brand-light": true,
      "h-2": true,
      borderRadius: 9999px,
      "transition-all": true,
      "duration-500": true
    }}
              style={{ width: `${Math.min(100, Math.round((keyword_count / 15) * 100))}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="outlined"
          sx={{
      width: "100%",
      "border-brand-primary/30": true,
      '&:hover': { "border-brand-primary": true },
      '&:hover': { "bg-brand-primary/10": true },
      "transition-all": true,
      fontWeight: 600,
      borderRadius: 1.5rem,
      py: 3
    }}
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
        >
          <Edit sx={{
      "w-4": true,
      "h-4": true,
      mr: 2
    }} />
          Edit Profile
        </Button>
      </div>

      {/* Hover Effect Overlay */}
      <div
        sx={{
      "absolute": true,
      "inset-0": true,
      "bg-gradient-to-r": true,
      "from-primary-purple/5": true,
      "to-transparent": true,
      "transition-opacity": true,
      "duration-300": true,
      "pointer-events-none": true,
      "${": true,
      "isHovered": true,
      "?": true,
      "'opacity-100'": true,
      ":": true,
      "'opacity-0'": true,
      "}": true
    }}
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
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      [theme.breakpoints.up('md')]: { "grid-cols-3": true },
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
