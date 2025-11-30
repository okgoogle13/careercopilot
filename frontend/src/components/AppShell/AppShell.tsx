import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Settings,
  FileText,
  Briefcase,
  Target,
  BarChart3,
  Layout,
  ChevronLeft,
} from 'lucide-react';

type TabValue = 'dashboard' | 'documents' | 'opportunities' | 'applications' | 'analysis';

export interface AppShellProps {
  children?: React.ReactNode;
  activeTab?: TabValue;
  onTabChange?: (tab: TabValue) => void;
  onSettingsClick?: () => void;
}

const drawerWidth = 280;

const menuItems = [
  { id: 'dashboard' as TabValue, label: 'Dashboard', icon: Layout },
  { id: 'documents' as TabValue, label: 'Documents', icon: FileText },
  { id: 'opportunities' as TabValue, label: 'Opportunities', icon: Briefcase },
  { id: 'applications' as TabValue, label: 'Applications', icon: Target },
  { id: 'analysis' as TabValue, label: 'Analysis', icon: BarChart3 },
];

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeTab = 'dashboard',
  onTabChange,
  onSettingsClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabClick = (tab: TabValue) => {
    onTabChange?.(tab);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: 1,
          borderColor: 'outline.variant',
        }}
      >
        <Box
          component="img"
          alt="Angry Unicorn"
          sx={{
            width: 48,
            height: 48,
            objectFit: 'contain',
          }}
        /> */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Roboto Flex", "Roboto", serif',
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            Angry Unicorn
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Career Copilot
          </Typography>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flex: 1, px: 2, py: 2 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => handleTabClick(item.id)}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                  '&.Mui-selected': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                    },
                  },
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.text.primary, 0.04),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? 'primary.main' : 'text.secondary',
                  }}
                >
                  <Icon size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Settings */}
      <List sx={{ px: 2, py: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={onSettingsClick}
            sx={{
              borderRadius: 2,
              px: 2,
              py: 1.5,
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.text.primary, 0.04),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
              <Settings size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'surface.container',
          borderBottom: 1,
          borderColor: 'outline.variant',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon size={24} />
          </IconButton>

          {/* Mobile Logo */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              gap: 2,
              flex: 1,
            }}
          >
            <Box
              component="img"
              alt="Angry Unicorn"
              sx={{
                width: 32,
                height: 32,
                objectFit: 'contain',
              }}
            /> */}
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Roboto Flex", "Roboto", serif',
                fontWeight: 700,
              }}
            >
              Angry Unicorn
            </Typography>
          </Box>

          <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }} />

          <IconButton
            onClick={onSettingsClick}
            sx={{
              color: 'text.secondary',
              display: { xs: 'flex', md: 'none' },
            }}
          >
            <Settings size={20} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
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
              width: drawerWidth,
              bgcolor: 'background.paper',
              borderRight: 1,
              borderColor: 'outline.variant',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: 'background.paper',
              borderRight: 1,
              borderColor: 'outline.variant',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          bgcolor: 'background.default',
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default AppShell;