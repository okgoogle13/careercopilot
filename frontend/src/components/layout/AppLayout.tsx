import {
  BarChart as BarChart3,
  ChevronLeft,
  Dashboard,
  Description as FileText,
  Logout as LogOut,
  Menu as MenuIcon,
  Chat as MessageSquare,
  Palette,
  Settings,
  GpsFixed as Target,
  TrendingUp,
  People as Users,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
  currentView?: string;
  onNavigate?: (view: string) => void;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
  showDemoNav?: boolean;
  onToggleDemoNav?: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  description?: string;
  badge?: string | number;
  divider?: boolean;
}

const mainNavigation: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Dashboard,
    description: 'Overview and analytics',
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: FileText,
    description: 'Resumes and cover letters',
    badge: 3,
  },
  {
    id: 'ats-analysis',
    label: 'ATS Analysis',
    icon: BarChart3,
    description: 'Resume scoring and optimization',
  },
  {
    id: 'job-matching',
    label: 'Job Matching',
    icon: Target,
    description: 'AI-powered job recommendations',
    divider: true,
  },
  {
    id: 'career-intelligence',
    label: 'Career Intelligence',
    icon: TrendingUp,
    description: 'Career insights and trends',
  },
  {
    id: 'interview-prep',
    label: 'Interview Prep',
    icon: MessageSquare,
    description: 'Practice and feedback',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: Users,
    description: 'Personal information',
    divider: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    description: 'Preferences and account',
  },
];

const DRAWER_WIDTH = 280;

export function AppLayout({
  children,
  currentView = 'dashboard',
  onNavigate,
  onThemeToggle,
  isDarkMode = true,
  showDemoNav = true,
  onToggleDemoNav,
  user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
}: AppLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleNavigate = (viewId: string) => {
    onNavigate?.(viewId);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const getCurrentViewInfo = () => {
    return mainNavigation.find((item) => item.id === currentView) || mainNavigation[0];
  };

  const currentViewInfo = getCurrentViewInfo();

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            src={user.avatar}
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'primary.main',
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user.name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {user.email}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            startIcon={<Palette sx={{ ...{}, fontSize: 20 }} />}
            onClick={onThemeToggle}
            sx={{ fontSize: '0.75rem' }}
          >
            {isDarkMode ? 'Light' : 'Dark'}
          </Button>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
        <List>
          {mainNavigation.map((item) => {
            const Icon = item.icon;
            const isSelected = currentView === item.id;

            return (
              <React.Fragment key={item.id}>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={isSelected}
                    onClick={() => handleNavigate(item.id)}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                        '& .MuiListItemIcon-root': {
                          color: 'inherit',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Icon sx={{ ...{}, fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      secondary={item.description}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: isSelected ? 600 : 500,
                      }}
                      secondaryTypographyProps={{
                        fontSize: '0.75rem',
                        sx: { mt: 0.5 },
                      }}
                    />
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          bgcolor: isSelected ? 'rgba(255,255,255,0.2)' : 'action.selected',
                          color: isSelected ? 'inherit' : 'text.secondary',
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
                {item.divider && <Divider sx={{ my: 1, mx: 2 }} />}
              </React.Fragment>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <ListItemButton
          onClick={() => {
            // Handle logout
            console.log('Logout');
          }}
          sx={{
            borderRadius: 2,
            color: 'error.main',
            '&:hover': {
              bgcolor: 'error.main',
              color: 'error.contrastText',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <LogOut sx={{ ...{}, fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="Sign Out"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: showDemoNav ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
          ml: { md: showDemoNav ? `${DRAWER_WIDTH}px` : 0 },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          {(!showDemoNav || isMobile) && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: showDemoNav ? 'none' : 'block' } }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Box>
              <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
                {currentViewInfo.label}
              </Typography>
              {currentViewInfo.description && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {currentViewInfo.description}
                </Typography>
              )}
            </Box>
          </Box>

          {showDemoNav && !isMobile && onToggleDemoNav && (
            <Button
              color="inherit"
              onClick={onToggleDemoNav}
              startIcon={<ChevronLeft sx={{ ...{}, fontSize: 20 }} />}
              sx={{ fontSize: '0.75rem' }}
            >
              Hide Navigation
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      {showDemoNav && (
        <Box
          component="nav"
          sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
          aria-label="navigation folders"
        >
          <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={isMobile ? mobileOpen : true}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: DRAWER_WIDTH,
                border: 'none',
                background: theme.palette.background.paper,
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </Box>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: showDemoNav ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <Box sx={{ height: 'calc(100vh - 64px)', overflow: 'auto' }}>{children}</Box>
      </Box>

      {/* Toggle Navigation Button (when hidden) */}
      {!showDemoNav && onToggleDemoNav && (
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
          <Button
            variant="contained"
            onClick={onToggleDemoNav}
            startIcon={<MenuIcon sx={{ fontSize: 'small' }} />}
            sx={{
              borderRadius: 20,
              px: 3,
              py: 1,
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Show Navigation
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default AppLayout;
