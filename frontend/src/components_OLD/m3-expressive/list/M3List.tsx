/**
 * M3 Expressive List Component
 * Implements Material Design 3 List for CareerCopilot
 *
 * Container for list items. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3List.css) must be imported in the application root
 * or in pages that use this component.
 */

import React from 'react';
import './M3List.css';

export interface M3ListProps {
  /**
   * List items (typically M3ListItem components)
   */
  children: React.ReactNode;

  /**
   * If true, list has dividers between items
   * @default true
   */
  dividers?: boolean;

  /**
   * If true, list items are dense (smaller padding)
   * @default false
   */
  dense?: boolean;

  /**
   * If true, list is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive List component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3List>
 *   <M3ListItem>Item 1</M3ListItem>
 *   <M3ListItem>Item 2</M3ListItem>
 * </M3List>
 * ```
 */
export const M3List: React.FC<M3ListProps> = ({
  children,
  dividers = true,
  dense = false,
  disabled = false,
  className = '',
}) => {
  const classNames = [
    'm3-list',
    dividers && 'm3-list--dividers',
    dense && 'm3-list--dense',
    disabled && 'm3-list--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <ul className={classNames} role="list">
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
          return child;
        }

        return React.cloneElement(child, {
          key: child.key || index,
          isLast: index === React.Children.count(children) - 1,
        });
      })}
    </ul>
  );
};

M3List.displayName = 'M3List';

export default M3List;
