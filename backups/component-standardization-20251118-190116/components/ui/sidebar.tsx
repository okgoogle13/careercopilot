import MenuIcon from '@mui/icons-material/Menu';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { createContext, useContext, useState } from 'react';

const SIDEBAR_WIDTH = 280;
const SIDEBAR_WIDTH_COLLAPSED = 64;

// Sidebar Context
interface SidebarContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  collapsible: string;
}

const SidebarContext = createContext<SidebarContextType>({
  open: true,
  setOpen: () => {},
  collapsible: 'icon',
});

// Styled components
const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'collapsible',
})<{ open?: boolean; collapsible?: string }>(({ theme, open, collapsible }) => ({
  width: open ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_COLLAPSED,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: open ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_COLLAPSED,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  },
}));

const StyledSidebarContent = styled(Box)({
  flex: 1,
  overflow: 'auto',
});

// Provider component
export interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  defaultOpen = true,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <SidebarContext.Provider value={{ open, setOpen, collapsible: 'icon' }}>
      <Box sx={{ display: 'flex' }}>{children}</Box>
    </SidebarContext.Provider>
  );
};

// Main Sidebar component
export interface SidebarProps {
  children: React.ReactNode;
  collapsible?: 'icon' | 'offcanvas' | 'none';
  variant?: 'sidebar' | 'floating' | 'inset';
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  collapsible = 'icon',
  variant = 'sidebar',
  className,
}) => {
  const { open } = useContext(SidebarContext);

  return (
    <StyledDrawer variant="permanent" open={open} collapsible={collapsible} className={className}>
      {children}
    </StyledDrawer>
  );
};

// Sidebar Header
export interface SidebarHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ children, className }) => {
  return (
    <Box
      className={className}
      sx={{
        p: 2,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      {children}
    </Box>
  );
};

// Sidebar Content (wrapper for menu items)
export interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({ children, className }) => {
  return <StyledSidebarContent className={className}>{children}</StyledSidebarContent>;
};

// Sidebar Footer
export interface SidebarFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ children, className }) => {
  return (
    <Box
      className={className}
      sx={{
        p: 2,
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      {children}
    </Box>
  );
};

// Sidebar Menu
export interface SidebarMenuProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ children, className }) => {
  return <List className={className}>{children}</List>;
};

// Sidebar Menu Item
export interface SidebarMenuItemProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ children, className }) => {
  return (
    <ListItem className={className} disablePadding>
      {children}
    </ListItem>
  );
};

// Sidebar Menu Button
export interface SidebarMenuButtonProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  tooltip?: string;
  className?: string;
}

export const SidebarMenuButton: React.FC<SidebarMenuButtonProps> = ({
  children,
  isActive = false,
  onClick,
  tooltip,
  className,
}) => {
  const { open } = useContext(SidebarContext);

  const button = (
    <ListItemButton
      onClick={onClick}
      className={className}
      selected={isActive}
      sx={{
        minHeight: 48,
        justifyContent: open ? 'initial' : 'center',
        px: 2.5,
      }}
    >
      {React.Children.map(children, (child, index) => {
        if (index === 0) {
          // First child is the icon
          return (
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              {child}
            </ListItemIcon>
          );
        }
        // Remaining children are text
        return <ListItemText primary={child} sx={{ opacity: open ? 1 : 0 }} />;
      })}
    </ListItemButton>
  );

  if (!open && tooltip) {
    return (
      <Tooltip title={tooltip} placement="right">
        {button}
      </Tooltip>
    );
  }

  return button;
};

// Sidebar Trigger (toggle button)
export interface SidebarTriggerProps {
  className?: string;
}

export const SidebarTrigger: React.FC<SidebarTriggerProps> = ({ className }) => {
  const { open, setOpen } = useContext(SidebarContext);

  return (
    <IconButton onClick={() => setOpen(!open)} className={className} size="small">
      <MenuIcon />
    </IconButton>
  );
};

// Sidebar Inset (main content area)
export interface SidebarInsetProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarInset: React.FC<SidebarInsetProps> = ({ children, className }) => {
  const { open } = useContext(SidebarContext);

  return (
    <Box
      component="main"
      className={className}
      sx={{
        flexGrow: 1,
        transition: (theme) =>
          theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
      }}
    >
      {children}
    </Box>
  );
};
