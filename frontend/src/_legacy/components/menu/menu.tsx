import React from 'react';
import styles from './menu.module.css';

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const MenuContext = React.createContext({ onClose: () => {} });

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  ({ open = false, onOpenChange, children, className, ...props }, ref) => (
    <MenuContext.Provider value={{ onClose: () => onOpenChange?.(false) }}>
      <div className={styles.menu + (className ? ' ' + className : '')} ref={ref} {...props}>
        {open && <div className={styles['menu-content']}>{children}</div>}
      </div>
    </MenuContext.Provider>
  )
);

Menu.displayName = 'Menu';

export const MenuItem = ({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a className={styles['menu-item'] + (className ? ' ' + className : '')} {...props} />
);
