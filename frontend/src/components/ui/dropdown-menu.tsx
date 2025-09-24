import React from 'react';
import {
  Menu,
  MenuItem,
  MenuProps,
  MenuItemProps,
  IconButton,
  Divider,
} from '@mui/material';

export interface DropdownMenuProps extends Omit<MenuProps, 'open'> {
  open: boolean;
}

export const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ children, ...props }, ref) => {
    return (
      <Menu
        ref={ref}
        {...props}
      >
        {children}
      </Menu>
    );
  }
);

DropdownMenu.displayName = 'DropdownMenu';

export interface DropdownMenuTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ children, asChild, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, { ref, ...props });
    }

    return (
      <IconButton
        ref={ref}
        {...(props as any)}
      >
        {children}
      </IconButton>
    );
  }
);

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

export interface DropdownMenuContentProps extends MenuProps {}

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ children, ...props }, ref) => {
    return (
      <Menu
        ref={ref}
        {...props}
      >
        {children}
      </Menu>
    );
  }
);

DropdownMenuContent.displayName = 'DropdownMenuContent';

export interface DropdownMenuItemProps extends MenuItemProps {}

export const DropdownMenuItem = React.forwardRef<HTMLLIElement, DropdownMenuItemProps>(
  ({ children, ...props }, ref) => {
    return (
      <MenuItem
        ref={ref}
        {...props}
      >
        {children}
      </MenuItem>
    );
  }
);

DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuSeparator = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  (props, ref) => {
    return <Divider {...props} />;
  }
);

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';