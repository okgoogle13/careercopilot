import React from 'react';
import {
  Tabs as MuiTabs,
  Tab as MuiTab,
  TabsProps as MuiTabsProps,
  TabProps as MuiTabProps,
  Box,
} from '@mui/material';

export interface TabsProps extends Omit<MuiTabsProps, 'onChange'> {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ children, defaultValue, onValueChange, orientation = 'horizontal', ...props }, ref) => {
    const [value, setValue] = React.useState(defaultValue || '');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
      setValue(newValue);
      if (onValueChange) {
        onValueChange(newValue);
      }
    };

    return (
      <MuiTabs
        ref={ref}
        value={value}
        onChange={handleChange}
        orientation={orientation}
        {...props}
      >
        {children}
      </MuiTabs>
    );
  }
);

Tabs.displayName = 'Tabs';

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ children, ...props }, ref) => {
    return (
      <Box ref={ref} {...props}>
        {children}
      </Box>
    );
  }
);

TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends MuiTabProps {
  value: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ children, value, ...props }, ref) => {
    return (
      <MuiTab
        ref={ref}
        value={value}
        label={children}
        {...props}
      />
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ children, value, ...props }, ref) => {
    return (
      <div ref={ref} role="tabpanel" {...props}>
        {children}
      </div>
    );
  }
);

TabsContent.displayName = 'TabsContent';