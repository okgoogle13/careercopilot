import {
  ArrowBack as ArrowLeft,
  BookmarkBorder as Bookmark,
  ChevronRight,
  Download,
  Edit,
  Home,
  MoreVert as MoreVertical,
  Share as Share2,
  Delete as Trash2,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface ActionButton {
  id: string;
  label: string;
  icon?: React.ComponentType;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

interface MenuAction {
  id: string;
  label: string;
  icon?: React.ComponentType;
  onClick: () => void;
  disabled?: boolean;
  divider?: boolean;
  color?: 'error' | 'warning';
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  status?: {
    label: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    variant?: 'filled' | 'outlined';
  };
  avatar?: {
    src?: string;
    alt: string;
    fallback?: string;
  };
  onBack?: () => void;
  backLabel?: string;
  actions?: ActionButton[];
  menuActions?: MenuAction[];
  children?: React.ReactNode;
  variant?: 'default' | 'compact' | 'detailed';
}

export function PageHeader({
  title,
  subtitle,
  description,
  breadcrumbs,
  status,
  avatar,
  onBack,
  backLabel = 'Back',
  actions = [],
  menuActions = [],
  children,
  variant = 'default',
}: PageHeaderProps) {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuAction = (action: MenuAction) => {
    action.onClick();
    handleMenuClose();
  };

  const isCompact = variant === 'compact';
  const isDetailed = variant === 'detailed';

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <Box sx={{ p: isCompact ? 2 : 3 }}>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs
            separator={<ChevronRight sx={{ fontSize: 20 }} />}
            sx={{ mb: 2 }}
            aria-label="breadcrumb"
          >
            {breadcrumbs.map((crumb, index) => (
              <Link
                key={index}
                color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
                href={crumb.href}
                onClick={(e) => {
                  if (crumb.onClick) {
                    e.preventDefault();
                    crumb.onClick();
                  }
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    textDecoration: index === breadcrumbs.length - 1 ? 'none' : 'underline',
                  },
                }}
              >
                {index === 0 && <Home sx={{ fontSize: 20 }} />}
                {crumb.label}
              </Link>
            ))}
          </Breadcrumbs>
        )}

        {/* Main Header Content */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* Back Button */}
          {onBack && (
            <Tooltip title={backLabel}>
              <IconButton
                onClick={onBack}
                sx={{
                  mt: isCompact ? 0 : 0.5,
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <ArrowLeft />
              </IconButton>
            </Tooltip>
          )}

          {/* Avatar */}
          {avatar && (
            <Avatar
              src={avatar.src}
              alt={avatar.alt}
              sx={{
                width: isCompact ? 40 : 48,
                height: isCompact ? 40 : 48,
                mt: 0.5,
                bgcolor: 'primary.main',
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              {avatar.fallback}
            </Avatar>
          )}

          {/* Title and Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1 }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant={isCompact ? 'h6' : isDetailed ? 'h4' : 'h5'}
                  sx={{
                    fontWeight: 600,
                    mb: subtitle || status ? 0.5 : 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {title}
                </Typography>

                {subtitle && (
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>

              {/* Status */}
              {status && (
                <Chip
                  label={status.label}
                  color={status.color || 'default'}
                  variant={status.variant || 'filled'}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              )}
            </Box>

            {/* Description */}
            {description && !isCompact && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  maxWidth: '600px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {description}
              </Typography>
            )}

            {/* Custom Content */}
            {children && <Box sx={{ mt: isCompact ? 1 : 2 }}>{children}</Box>}
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            {/* Primary Actions */}
            {actions.slice(0, isCompact ? 1 : 3).map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant={action.variant || 'outlined'}
                  color={action.color || 'primary'}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  startIcon={Icon && <Icon />}
                  size={isCompact ? 'small' : 'medium'}
                  sx={{
                    whiteSpace: 'nowrap',
                    display: { xs: Icon ? 'none' : 'flex', sm: 'flex' },
                  }}
                >
                  {action.label}
                </Button>
              );
            })}

            {/* Icon-only actions for mobile */}
            {actions.slice(0, isCompact ? 1 : 3).map((action) => {
              const Icon = action.icon;
              if (!Icon) return null;

              return (
                <Tooltip key={`${action.id}-icon`} title={action.label}>
                  <span>
                    <IconButton
                      onClick={action.onClick}
                      disabled={action.disabled}
                      color={action.color || 'default'}
                      sx={{ display: { xs: 'flex', sm: 'none' } }}
                    >
                      <Icon />
                    </IconButton>
                  </span>
                </Tooltip>
              );
            })}

            {/* Overflow Menu */}
            {(actions.length > (isCompact ? 1 : 3) || menuActions.length > 0) && (
              <>
                <IconButton
                  onClick={handleMenuClick}
                  sx={{ color: 'text.secondary' }}
                  aria-label="more actions"
                >
                  <MoreVertical />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={menuOpen}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {/* Overflow actions */}
                  {actions.slice(isCompact ? 1 : 3).map((action) => {
                    const Icon = action.icon;
                    return (
                      <MenuItem
                        key={action.id}
                        onClick={() => {
                          action.onClick();
                          handleMenuClose();
                        }}
                        disabled={action.disabled}
                      >
                        {Icon && (
                          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center', fontSize: 20 }}>
                            <Icon />
                          </Box>
                        )}
                        {action.label}
                      </MenuItem>
                    );
                  })}

                  {/* Divider if both types exist */}
                  {actions.length > (isCompact ? 1 : 3) && menuActions.length > 0 && <Divider />}

                  {/* Menu actions */}
                  {menuActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <React.Fragment key={action.id}>
                        <MenuItem
                          onClick={() => handleMenuAction(action)}
                          disabled={action.disabled}
                          sx={{
                            color:
                              action.color === 'error'
                                ? 'error.main'
                                : action.color === 'warning'
                                  ? 'warning.main'
                                  : 'inherit',
                          }}
                        >
                          {Icon && (
                            <Box
                              sx={{ mr: 1, display: 'flex', alignItems: 'center', fontSize: 20 }}
                            >
                              <Icon />
                            </Box>
                          )}
                          {action.label}
                        </MenuItem>
                        {action.divider && <Divider />}
                      </React.Fragment>
                    );
                  })}
                </Menu>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// Preset configurations for common use cases
export const PageHeaderPresets = {
  documentPage: (title: string, onBack: () => void, onEdit: () => void, onDelete: () => void) => ({
    title,
    onBack,
    backLabel: 'Back to Documents',
    actions: [
      {
        id: 'edit',
        label: 'Edit',
        icon: Edit,
        variant: 'outlined' as const,
        onClick: onEdit,
      },
      {
        id: 'share',
        label: 'Share',
        icon: Share2,
        variant: 'outlined' as const,
        onClick: () => console.log('Share'),
      },
    ],
    menuActions: [
      {
        id: 'download',
        label: 'Download',
        icon: Download,
        onClick: () => console.log('Download'),
      },
      {
        id: 'bookmark',
        label: 'Bookmark',
        icon: Bookmark,
        onClick: () => console.log('Bookmark'),
        divider: true,
      },
      {
        id: 'delete',
        label: 'Delete',
        icon: Trash2,
        onClick: onDelete,
        color: 'error' as const,
      },
    ],
  }),

  dashboardPage: (title: string, subtitle?: string) => ({
    title,
    subtitle,
    variant: 'detailed' as const,
    actions: [
      {
        id: 'create',
        label: 'Create Document',
        variant: 'contained' as const,
        onClick: () => console.log('Create'),
      },
    ],
  }),

  settingsPage: (title: string, onBack: () => void) => ({
    title,
    onBack,
    variant: 'compact' as const,
    backLabel: 'Back to Dashboard',
  }),
};

export default PageHeader;
