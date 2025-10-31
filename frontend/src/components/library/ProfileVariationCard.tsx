import {
  CalendarMonth,
  ContentCopy as Copy,
  Delete,
  Edit,
  MoreVert,
  Star,
  Tag,
} from '@mui/icons-material';
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
      className={`relative overflow-hidden transition-all duration-300 cursor-pointer group card-surface hover:border-brand-primary ${
        is_default ? 'ring-2 ring-brand-primary/50 bg-brand-primary/5' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Default Badge */}
      {is_default && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-brand-primary text-white gap-1 shadow-lg font-semibold">
            <Star className="w-3 h-3 fill-current" />
            Default
          </Badge>
        </div>
      )}

      {/* Actions Menu */}
      <div className="absolute top-3 right-3 z-10">
        <IconButton
          size="small"
          className={`transition-opacity bg-surface-card/80 backdrop-blur-sm border border-subtle hover:bg-surface-section ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
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
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="font-semibold text-content-primary group-hover:text-brand-light transition-colors text-lg">
            {profile_name}
          </h3>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-content-secondary">
            <Tag className="w-4 h-4 text-brand-primary/70" />
            <div>
              <div className="text-sm font-semibold text-content-primary">{keyword_count}</div>
              <div className="text-xs">Keywords</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-content-secondary">
            <CalendarMonth className="w-4 h-4 text-brand-primary/70" />
            <div>
              <div className="text-sm font-semibold text-content-primary">
                {formatDate(last_modified)}
              </div>
              <div className="text-xs">Modified</div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-content-secondary">Optimization</span>
            <span className="text-content-primary font-semibold">
              {Math.min(100, Math.round((keyword_count / 15) * 100))}%
            </span>
          </div>
          <div className="w-full bg-surface-section rounded-full h-2">
            <div
              className="bg-gradient-to-r from-brand-primary to-brand-light h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((keyword_count / 15) * 100))}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="outlined"
          className="w-full border-brand-primary/30 hover:border-brand-primary hover:bg-brand-primary/10 transition-all font-semibold rounded-3xl py-3"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Hover Effect Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-primary-purple/5 to-transparent transition-opacity duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
