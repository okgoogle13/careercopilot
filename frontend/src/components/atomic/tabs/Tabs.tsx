/**
 * KERALA-RAGE SOLIDARITY: TABS COMPONENT
 * Tabs with sliding pill animation (layoutId="active-pill")
 */

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/cn';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab, onChange, className }) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={cn('w-full', className)}>
      {/* Tab List */}
      <div className="flex gap-1 border-b border-outline-variant mb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                'relative px-6 py-3',
                'text-ai font-ai',
                'transition-colors duration-150',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                isActive ? 'text-primary' : 'text-outline hover:text-primary'
              )}
            >
              {/* Sliding Pill */}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-primary-container/20 rounded-t-button"
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 27,
                  }}
                />
              )}

              {/* Label */}
              <span className="relative z-10">{tab.label}</span>

              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-tertiary"
                  layoutId="active-indicator"
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 27,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="text-human">{activeContent}</div>
    </div>
  );
};

Tabs.displayName = 'Tabs';
