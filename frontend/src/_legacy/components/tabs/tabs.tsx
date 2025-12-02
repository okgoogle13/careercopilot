import React from 'react';
import styles from './tabs.module.css';

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

const TabsContext = React.createContext<{ value?: string; onValueChange?: (v: string) => void }>({});

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ value, onValueChange, children, className, ...props }, ref) => (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div
        ref={ref}
        className={styles.tabs + (className ? ' ' + className : '')}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
);

Tabs.displayName = 'Tabs';

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={styles['tabs-list'] + (className ? ' ' + className : '')}
      role="tablist"
      {...props}
    />
  )
);

TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value = '', className, onClick, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = React.useContext(TabsContext);
    const isSelected = value === selectedValue;

    return (
      <button
        ref={ref}
        className={styles['tabs-trigger'] + ' ' + (isSelected ? styles['tabs-trigger--active'] : '') + (className ? ' ' + className : '')}
        role="tab"
        aria-selected={isSelected}
        onClick={(e) => {
          onValueChange?.(value);
          onClick?.(e);
        }}
        {...props}
      />
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value = '', className, ...props }, ref) => {
    const { value: selectedValue } = React.useContext(TabsContext);

    if (value !== selectedValue) return null;

    return (
      <div
        ref={ref}
        className={styles['tabs-content'] + (className ? ' ' + className : '')}
        role="tabpanel"
        {...props}
      />
    );
  }
);

TabsContent.displayName = 'TabsContent';
