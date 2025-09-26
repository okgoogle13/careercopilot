import * as React from 'react';
import MuiTabs from '@mui/material/Tabs';
import MuiTab, { TabProps as MuiTabProps } from '@mui/material/Tab';
import { Box, styled } from '@mui/material';

// Tabs container component
export const Tabs = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof MuiTabs>
>(({ children, ...props }, ref) => (
  <MuiTabs ref={ref} {...props}>
    {children}
  </MuiTabs>
));

Tabs.displayName = 'Tabs';

// TabsList component (wrapper for individual tabs)
export const TabsList = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof MuiTabs>
>(({ children, ...props }, ref) => (
  <MuiTabs ref={ref} {...props}>
    {children}
  </MuiTabs>
));

TabsList.displayName = 'TabsList';

// TabsTrigger component (individual tab)
interface TabsTriggerProps extends Omit<MuiTabProps, 'component'> {
  value: string;
  children: React.ReactNode;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ children, ...props }, ref) => (
    <MuiTab ref={ref} label={children} {...props} />
  )
);

TabsTrigger.displayName = 'TabsTrigger';

// TabsContent component (content panel)
interface TabsContentProps {
  value: string;
  currentValue: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, currentValue, children, className, ...props }, ref) => (
    <Box
      ref={ref}
      role="tabpanel"
      hidden={value !== currentValue}
      className={className}
      {...props}
    >
      {value === currentValue && children}
    </Box>
  )
);

TabsContent.displayName = 'TabsContent';

// Legacy single Tab export for backwards compatibility
interface TabProps extends Omit<MuiTabProps, 'component'> {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactElement | string;
}

const StyledTab = styled(MuiTab)(({ theme }) => ({
  minHeight: 48,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}));

const Tab = React.forwardRef<HTMLDivElement, TabProps>((props, ref) => (
  <StyledTab ref={ref} component="div" {...props} />
));

Tab.displayName = 'Tab';

export default Tab;