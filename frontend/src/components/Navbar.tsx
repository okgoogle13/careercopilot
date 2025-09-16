import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Badge,
  Tooltip,
  Stack,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search,
  Notifications,
  Settings,
  Help,
  Logout,
  Person,
  Dashboard,
  Description,
  Analytics,
  Work
} from '@mui/icons-material';

interface NavbarProps {
  onMenuClick?: () => void;
  currentPage?: string;
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
}

export function Navbar({
  onMenuClick,
  currentPage = 'Dashboard',
  userName = 'John Doe',
  userAvatar,
  notificationCount = 0
}: NavbarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const navigationItems = [
    { label: 'Dashboard', icon: Dashboard, path: '/dashboard' },
    { label: 'Documents', icon: Description, path: '/documents' },
    { label: 'Analysis', icon: Analytics, path: '/analysis' },
    { label: 'Opportunities', icon: Work, path: '/opportunities' },
  ];

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left side - Menu and Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{ color: 'text.primary' }}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              display: { xs: 'none', md: 'block' }
            }}
          >
            CareerCopilot
          </Typography>

          {/* Current Page Indicator */}
          <Chip
            label={currentPage}
            size="small"
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontWeight: 500,
              display: { xs: 'none', sm: 'block' }
            }}
          />
        </Box>

        {/* Center - Navigation (Desktop) */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flex: 1,
            justifyContent: 'center',
            maxWidth: 600
          }}
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === currentPage;

            return (
              <Button
                key={item.label}
                startIcon={<Icon />}
                variant={isActive ? 'contained' : 'text'}
                size="small"
                sx={{
                  minWidth: 120,
                  borderRadius: 20,
                  textTransform: 'none',
                  ...(isActive ? {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark'
                    }
                  } : {
                    color: 'text.secondary',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  })
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Stack>

        {/* Right side - Actions and User */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search Button */}
          <Tooltip title="Search">
            <IconButton sx={{ color: 'text.secondary' }}>
              <Search />
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={handleNotificationsOpen}
              sx={{ color: 'text.secondary' }}
            >
              <Badge badgeContent={notificationCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Help */}
          <Tooltip title="Help">
            <IconButton sx={{ color: 'text.secondary' }}>
              <Help />
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Button
            onClick={handleMenuOpen}
            sx={{
              minWidth: 'auto',
              borderRadius: 20,
              color: 'text.primary',
              textTransform: 'none',
              gap: 1,
              px: 1.5,
              py: 0.5
            }}
          >
            <Avatar
              src={userAvatar}
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main',
                fontSize: '0.875rem'
              }}
            >
              {userName.charAt(0)}
            </Avatar>
            <Typography
              variant="body2"
              sx={{
                display: { xs: 'none', sm: 'block' },
                fontWeight: 500
              }}
            >
              {userName.split(' ')[0]}
            </Typography>
          </Button>
        </Box>

        {/* User Menu Dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
            '& .MuiPaper-root': {
              borderRadius: 2,
              minWidth: 200,
              mt: 1
            }
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <Person sx={{ mr: 1.5 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Settings sx={{ mr: 1.5 }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Help sx={{ mr: 1.5 }} />
            Help & Support
          </MenuItem>
          <MenuItem
            onClick={handleMenuClose}
            sx={{ color: 'error.main' }}
          >
            <Logout sx={{ mr: 1.5 }} />
            Sign Out
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsAnchorEl}
          open={Boolean(notificationsAnchorEl)}
          onClose={handleNotificationsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
            '& .MuiPaper-root': {
              borderRadius: 2,
              minWidth: 300,
              mt: 1
            }
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Notifications
            </Typography>
            {notificationCount === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No new notifications
              </Typography>
            ) : (
              <Stack spacing={1}>
                <Box sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    New job opportunity found
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    2 minutes ago
                  </Typography>
                </Box>
                <Box sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    Resume analysis complete
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    1 hour ago
                  </Typography>
                </Box>
              </Stack>
            )}
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}