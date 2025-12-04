/**
 * ELECTRIC ALCHEMIST: MENU COMPONENT
 *
 * Dropdown menu with design system tokens.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from '@/components/electric';

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const MenuContext = React.createContext({ onClose: () => {} });

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  ({ open = false, onOpenChange, children, className, ...props }, ref) => {
    return (
      <MenuContext.Provider value={{ onClose: () => onOpenChange?.(false) }}>
        <AnimatePresence>
          {open && (
            <motion.div
              ref={ref}
              className={cn('relative z-[60]', className)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              {...props}
            >
              <Card className="p-2 min-w-[200px]">{children}</Card>
            </motion.div>
          )}
        </AnimatePresence>
      </MenuContext.Provider>
    );
  }
);

Menu.displayName = 'Menu';

export const MenuItem = ({
  className,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const { onClose } = React.useContext(MenuContext);
  return (
    <a
      className={cn(
        'block px-3 py-2 rounded-[16px] text-human text-sm text-on-surface',
        'hover:bg-surface-container-low transition-colors cursor-pointer',
        className
      )}
      onClick={(e) => {
        onClose();
        props.onClick?.(e);
      }}
      {...props}
    >
      {children}
    </a>
  );
};

export default Menu;

