import { Box, ButtonBase } from '@mui/material';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

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
 * AnimatedDropdown - Dropdown menu with animated panel and staggered items
 *
 * Features:
 * - Click-outside detection to close
 * - Escape key to close
 * - Staggered item entrance animations (50ms delay per item)
 * - Panel scale + fade animation
 * - Supports controlled and uncontrolled modes
 * - Keyboard accessible
 *
 * @example
 * ```tsx
 * const menuItems = [
 *   { label: 'Profile', value: 'profile', icon: <PersonIcon /> },
 *   { label: 'Settings', value: 'settings', icon: <SettingsIcon /> },
 *   { label: 'Logout', value: 'logout', icon: <LogoutIcon /> },
 * ];
 *
 * <AnimatedDropdown
 *   trigger={<Button>Account Menu</Button>}
 *   items={menuItems}
 *   onSelect={(value) => console.log('Selected:', value)}
 * />
 *
 * // Controlled mode
 * const [menuOpen, setMenuOpen] = useState(false);
 * <AnimatedDropdown
 *   trigger={<IconButton><MoreVertIcon /></IconButton>}
 *   items={menuItems}
 *   open={menuOpen}
 *   onOpenChange={setMenuOpen}
 *   onSelect={handleSelect}
 * />
 * ```
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

  // Use controlled open if provided, otherwise use internal state
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

  // Handle item selection
  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  // Determine panel position based on placement
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
    <Box
      ref={dropdownRef}
      className={className}
      sx={{ position: 'relative', display: 'inline-block' }}
    >
      {/* Trigger */}
      <Box
        onClick={() => setIsOpen(!isOpen)}
        sx={{ cursor: 'pointer' }}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
      </Box>

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
              zIndex: 1300,
              ...getPanelPosition(),
            }}
          >
            <Box
              role="menu"
              sx={{
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                py: 1,
                overflow: 'hidden',
              }}
            >
              {/* Staggered Menu Items */}
              {items.map((item, index) => (
                <motion.div
                  key={item.value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ButtonBase
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => !item.disabled && handleSelect(item.value)}
                    sx={{
                      width: '100%',
                      px: 2,
                      py: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      textAlign: 'left',
                      justifyContent: 'flex-start',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                      '&:disabled': {
                        opacity: 0.5,
                        cursor: 'not-allowed',
                      },
                    }}
                  >
                    {item.icon && (
                      <Box sx={{ display: 'flex', fontSize: '20px', color: 'text.secondary' }}>
                        {item.icon}
                      </Box>
                    )}
                    <Box sx={{ fontSize: '0.875rem' }}>{item.label}</Box>
                  </ButtonBase>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
