'use client';

import * as React from 'react';
import {
  Menu,
  MenuItem,
  MenuList,
  Divider,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Checkbox,
  Radio,
  Portal,
  MenuProps
} from '@mui/material';
import { Check, ChevronRight, RadioButtonUnchecked } from '@mui/icons-material';

interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function DropdownMenu({ children, open, onOpenChange, ...props }: DropdownMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
    onOpenChange?.(false);
  };

  return (
    <Box {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { anchorEl, setAnchorEl, handleClose, open: Boolean(anchorEl) });
        }
        return child;
      })}
    </Box>
  );
}

interface DropdownMenuPortalProps {
  children: React.ReactNode;
}

function DropdownMenuPortal({ children, ...props }: DropdownMenuPortalProps) {
  return <Portal {...props}>{children}</Portal>;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  [key: string]: any;
}

function DropdownMenuTrigger({ children, asChild, anchorEl, setAnchorEl, ...props }: DropdownMenuTriggerProps & any) {
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl?.(event.currentTarget);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      ...props
    });
  }

  return (
    <Box onClick={handleClick} sx={{ cursor: 'pointer' }} {...props}>
      {children}
    </Box>
  );
}

interface DropdownMenuContentProps extends Omit<MenuProps, 'open'> {
  children: React.ReactNode;
  sideOffset?: number;
}

function DropdownMenuContent({ children, sideOffset = 4, anchorEl, handleClose, open, ...props }: DropdownMenuContentProps & any) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          minWidth: '8rem',
          maxHeight: 'calc(100vh - 96px)',
          overflow: 'auto',
          mt: sideOffset / 8,
          boxShadow: 3
        }
      }}
      {...props}
    >
      {children}
    </Menu>
  );
}

interface DropdownMenuGroupProps {
  children: React.ReactNode;
}

function DropdownMenuGroup({ children, ...props }: DropdownMenuGroupProps) {
  return <MenuList {...props}>{children}</MenuList>;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  inset?: boolean;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
  onClick?: () => void;
}

function DropdownMenuItem({ children, inset, variant = 'default', disabled, onClick, ...props }: DropdownMenuItemProps) {
  return (
    <MenuItem
      disabled={disabled}
      onClick={onClick}
      sx={{
        pl: inset ? 4 : 2,
        pr: 2,
        py: 1.5,
        fontSize: '0.875rem',
        gap: 1,
        color: variant === 'destructive' ? 'error.main' : 'text.primary',
        '&:hover': {
          backgroundColor: variant === 'destructive' ? 'error.light' : 'action.hover',
          color: variant === 'destructive' ? 'error.dark' : 'text.primary'
        },
        '& svg': {
          fontSize: '1rem',
          flexShrink: 0,
          color: variant === 'destructive' ? 'error.main' : 'text.secondary'
        }
      }}
      {...props}
    >
      {children}
    </MenuItem>
  );
}

interface DropdownMenuCheckboxItemProps {
  children: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

function DropdownMenuCheckboxItem({ children, checked, disabled, onCheckedChange, ...props }: DropdownMenuCheckboxItemProps) {
  return (
    <MenuItem
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      sx={{
        pl: 4,
        pr: 2,
        py: 1.5,
        fontSize: '0.875rem',
        gap: 1
      }}
      {...props}
    >
      <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
        <Checkbox
          checked={checked}
          size="small"
          sx={{ p: 0 }}
          icon={<Box sx={{ width: 16, height: 16 }} />}
          checkedIcon={<Check fontSize="small" />}
        />
      </ListItemIcon>
      <ListItemText primary={children} />
    </MenuItem>
  );
}

interface DropdownMenuRadioGroupProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}

function DropdownMenuRadioGroup({ children, value, onValueChange, ...props }: DropdownMenuRadioGroupProps) {
  return (
    <Box {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { groupValue: value, onValueChange });
        }
        return child;
      })}
    </Box>
  );
}

interface DropdownMenuRadioItemProps {
  children: React.ReactNode;
  value: string;
  disabled?: boolean;
  groupValue?: string;
  onValueChange?: (value: string) => void;
}

function DropdownMenuRadioItem({ children, value, disabled, groupValue, onValueChange, ...props }: DropdownMenuRadioItemProps) {
  const checked = groupValue === value;

  return (
    <MenuItem
      disabled={disabled}
      onClick={() => onValueChange?.(value)}
      sx={{
        pl: 4,
        pr: 2,
        py: 1.5,
        fontSize: '0.875rem',
        gap: 1
      }}
      {...props}
    >
      <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
        <Radio
          checked={checked}
          size="small"
          sx={{ p: 0 }}
          icon={<RadioButtonUnchecked fontSize="small" />}
          checkedIcon={<RadioButtonUnchecked fontSize="small" sx={{ color: 'primary.main' }} />}
        />
      </ListItemIcon>
      <ListItemText primary={children} />
    </MenuItem>
  );
}

interface DropdownMenuLabelProps {
  children: React.ReactNode;
  inset?: boolean;
}

function DropdownMenuLabel({ children, inset, ...props }: DropdownMenuLabelProps) {
  return (
    <Typography
      variant="body2"
      sx={{
        px: 2,
        py: 1.5,
        pl: inset ? 4 : 2,
        fontSize: '0.875rem',
        fontWeight: 500,
        color: 'text.secondary'
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

interface DropdownMenuSeparatorProps {}

function DropdownMenuSeparator({ ...props }: DropdownMenuSeparatorProps) {
  return (
    <Divider
      sx={{
        mx: -1,
        my: 1
      }}
      {...props}
    />
  );
}

interface DropdownMenuShortcutProps {
  children: React.ReactNode;
}

function DropdownMenuShortcut({ children, ...props }: DropdownMenuShortcutProps) {
  return (
    <Typography
      variant="caption"
      component="span"
      sx={{
        ml: 'auto',
        fontSize: '0.75rem',
        letterSpacing: '0.1em',
        color: 'text.secondary'
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

interface DropdownMenuSubProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function DropdownMenuSub({ children, open, onOpenChange, ...props }: DropdownMenuSubProps) {
  const [subAnchorEl, setSubAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleSubClose = () => {
    setSubAnchorEl(null);
    onOpenChange?.(false);
  };

  return (
    <Box {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { subAnchorEl, setSubAnchorEl, handleSubClose, subOpen: Boolean(subAnchorEl) });
        }
        return child;
      })}
    </Box>
  );
}

interface DropdownMenuSubTriggerProps {
  children: React.ReactNode;
  inset?: boolean;
  disabled?: boolean;
  subAnchorEl?: HTMLElement | null;
  setSubAnchorEl?: (el: HTMLElement | null) => void;
}

function DropdownMenuSubTrigger({ children, inset, disabled, subAnchorEl, setSubAnchorEl, ...props }: DropdownMenuSubTriggerProps) {
  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setSubAnchorEl?.(event.currentTarget);
  };

  return (
    <MenuItem
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      sx={{
        pl: inset ? 4 : 2,
        pr: 2,
        py: 1.5,
        fontSize: '0.875rem',
        gap: 1,
        justifyContent: 'space-between'
      }}
      {...props}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        {children}
      </Box>
      <ChevronRight fontSize="small" sx={{ ml: 'auto' }} />
    </MenuItem>
  );
}

interface DropdownMenuSubContentProps {
  children: React.ReactNode;
  subAnchorEl?: HTMLElement | null;
  handleSubClose?: () => void;
  subOpen?: boolean;
}

function DropdownMenuSubContent({ children, subAnchorEl, handleSubClose, subOpen, ...props }: DropdownMenuSubContentProps) {
  return (
    <Menu
      anchorEl={subAnchorEl}
      open={subOpen || false}
      onClose={handleSubClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          minWidth: '8rem',
          maxHeight: 'calc(100vh - 96px)',
          overflow: 'hidden',
          boxShadow: 4
        }
      }}
      {...props}
    >
      {children}
    </Menu>
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
