/**
 * ELECTRIC ALCHEMIST: ANIMATED DROPDOWN
 *
 * Dropdown menu with animated panel and staggered items.
 * Uses Electric Alchemist design system tokens.
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface AnimatedDropdownProps {
  /**
   * Trigger element (button or component to open dropdown)
   */
  trigger: React.ReactNode;
  /**
   * Array of dropdown menu items
   */
  items: DropdownItem[];
  /**
   * Callback when an item is selected
   */
  onSelect: (value: string) => void;
  /**
   * Controlled open state (optional)
   */
  open?: boolean;
  /**
   * Callback for controlled mode (optional)
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Placement of the dropdown panel
   */
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  /**
   * Additional className
   */
  className?: string;
  /**
   * Width of dropdown panel in pixels
   */
  width?: number;
}

/**
 * AnimatedDropdown Component
 *
 * Dropdown menu with animated panel and staggered items.
 */
export function AnimatedDropdown({
  trigger,
  items,
  onSelect,
  open: controlledOpen,
  onOpenChange,
  placement = 'bottom-start',
  className,
  width = 200,
}: AnimatedDropdownProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = (value: boolean) => {
    if (controlledOpen !== undefined) {
      onOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }
  };

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const getPanelPosition = () => {
    const positions = {
      'bottom-start': { top: '100%', left: 0, marginTop: '8px' },
      'bottom-end': { top: '100%', right: 0, marginTop: '8px' },
      'top-start': { bottom: '100%', left: 0, marginBottom: '8px' },
      'top-end': { bottom: '100%', right: 0, marginBottom: '8px' },
    };
    return positions[placement];
  };

  return (
    <div ref={dropdownRef} className={cn('relative inline-block', className)}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'absolute',
              width: `${width}px`,
              zIndex: 60, // tooltip z-index
              ...getPanelPosition(),
            }}
          >
            <div
              role="menu"
              className="bg-surface-container border border-outline-variant rounded-[8px] shadow-2xl py-1 overflow-hidden"
            >
              {/* Staggered Menu Items */}
              {items.map((item, index) => (
                <motion.div
                  key={item.value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => !item.disabled && handleSelect(item.value)}
                    className={cn(
                      'w-full px-4 py-3 flex items-center gap-3 text-left text-human text-sm',
                      'hover:bg-surface-container-high transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      item.disabled && 'opacity-50 cursor-not-allowed',
                      'text-on-surface'
                    )}
                  >
                    {item.icon && (
                      <div className="flex text-on-surface-variant">{item.icon}</div>
                    )}
                    <div>{item.label}</div>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

