import {
  Menu as MenuIcon,
  NotificationsNone as NotificationsIcon,
  Close as CloseIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Badge,
  Tooltip,
  Stack,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Drawer,
  useTheme,
  useMediaQuery,
  InputBase,
} from '@mui/material';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { mainNavigation, userNavigation } from '../../config/navigation';

import { NavigationItem } from './NavigationItem';
import { NotificationCenter } from '../NotificationCenter';

interface NavbarProps {
  onMenuClick?: () => void;
  currentPage?: string;
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
  onSearch?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onMenuClick,
  currentPage = 'Dashboard',
  userName = 'User',
  userAvatar,
  notificationCount = 0,
  onSearch,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  const handleItemClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const drawer = (
    <Box
      sx={{
        width: 280,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" color="primary" fontWeight="bold">
          CareerCopilot
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ display: { md: 'none' } }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        <List>
          {mainNavigation.map((item, index) => (
            <NavigationItem
              key={index}
              item={item}
              onItemClick={() => handleItemClick(item.path)}
            />
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          color: 'text.primary',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: 'text.primary', display: { md: 'none' } }}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'primary.main',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              CareerCopilot
            </Typography>
          </Box>

          {/* Search Bar - Desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, maxWidth: 600, mx: 3 }}>
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                position: 'relative',
                borderRadius: 2,
                backgroundColor: 'action.hover',
                '&:hover': {
                  backgroundColor: 'action.selected',
                },
                width: '100%',
                maxWidth: 600,
              }}
            >
              <Box
                sx={{
                  padding: theme.spacing(0, 2),
                  height: '100%',
                  position: 'absolute',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SearchIcon color="action" />
              </Box>
              <InputBase
                placeholder="Search jobs, documents, tools..."
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  color: 'inherit',
                  width: '100%',
                  '& .MuiInputBase-input': {
                    padding: theme.spacing(1, 1, 1, 5),
                    width: '100%',
                    transition: theme.transitions.create('width'),
                  },
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Box>
          </Box>

          {/* Right side - Actions */}
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Search Button - Mobile */}
            <IconButton size="large" color="inherit" sx={{ display: { xs: 'flex', md: 'none' } }}>
              <SearchIcon />
            </IconButton>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                size="large"
                color="inherit"
                onClick={handleNotificationsOpen}
                aria-label={`Show ${notificationCount} notifications`}
              >
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* User Menu */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleMenuOpen}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={anchorEl ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={anchorEl ? 'true' : undefined}
                >
                  <Avatar
                    alt={userName}
                    src={userAvatar}
                    sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                  >
                    {!userAvatar && userName.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>

          {/* User Menu Dropdown */}
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {userName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View profile
              </Typography>
            </Box>
            <Divider />
            {userNavigation.map((item) => (
              <MenuItem key={item.path} onClick={() => handleItemClick(item.path)}>
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                {item.label}
              </MenuItem>
            ))}
          </Menu>

          {/* Notifications Center */}
          <NotificationCenter />
        </Toolbar>
      </AppBar>

      {/* Desktop Drawer */}
      <Box
        component="nav"
        sx={{
          width: { md: 280 },
          flexShrink: { md: 0 },
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: theme.zIndex.drawer,
          display: { xs: 'none', md: 'block' },
          pt: 8, // Height of the AppBar
        }}
      >
        {drawer}
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            pt: 8,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
