import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Button as MuiButton,
  useTheme,
} from '@mui/material';
import { BarChart3, FileText, Plus } from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const theme = useTheme();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'ats-analysis', label: 'ATS Analysis', icon: FileText },
  ];

  const drawerWidth = 256; // 64 * 4 = 256px equivalent to w-64

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : '#1a1a1a',
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Logo Section */}
        <Box sx={{ p: 3 }}>
          <Logo showText={true} />
        </Box>

        {/* Navigation Section */}
        <Box sx={{ flexGrow: 1, px: 2 }}>
          <List sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}>
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;

              return (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton
                    onClick={() => onTabChange(item.id)}
                    sx={{
                      borderRadius: 2,
                      minHeight: 48,
                      px: 2,
                      py: 1.5,
                      backgroundColor: isActive ? theme.palette.action.selected : 'transparent',
                      color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: 'inherit',
                      }}
                    >
                      <IconComponent size={20} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontSize: '0.875rem',
                          fontWeight: isActive ? 600 : 400,
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Bottom Action Section */}
        <Box sx={{ p: 2 }}>
          <MuiButton
            variant="contained"
            fullWidth
            startIcon={<Plus size={16} />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            New Application
          </MuiButton>
        </Box>
      </Box>
    </Drawer>
  );
}
