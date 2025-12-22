/**
 * M3 Expressive Accordion Component
 * Implements Material Design 3 Accordion for CareerCopilot
 *
 * Collapsible content sections. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Accordion.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useState, useCallback } from 'react';
import './M3Accordion.css';

export interface M3AccordionItemProps {
  /**
   * Item ID (required for controlled mode)
   */
  id?: string;

  /**
   * If true, item is expanded
   */
  expanded?: boolean;

  /**
   * Callback fired when item expand state changes
   */
  onChange?: (expanded: boolean) => void;

  /**
   * Header content
   */
  header: React.ReactNode;

  /**
   * Content shown when expanded
   */
  children?: React.ReactNode;

  /**
   * If true, shows expand/collapse icon
   * @default true
   */
  showIcon?: boolean;

  /**
   * Custom icon element
   */
  icon?: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;
}

export interface M3AccordionProps {
  /**
   * If true, only one item can be open at a time
   * @default false
   */
  singleOpen?: boolean;

  /**
   * Accordion items
   */
  children: React.ReactElement<M3AccordionItemProps>[];

  /**
   * Custom className
   */
  className?: string;
}

/**
 * Accordion Item Component
 */
export const M3AccordionItem: React.FC<M3AccordionItemProps> = ({
  id,
  expanded: controlledExpanded,
  onChange,
  header,
  children,
  showIcon = true,
  icon,
  className = '',
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isControlled = controlledExpanded !== undefined;
  const expanded = isControlled ? controlledExpanded : internalExpanded;

  const handleToggle = useCallback(() => {
    const newExpanded = !expanded;
    if (!isControlled) {
      setInternalExpanded(newExpanded);
    }
    onChange?.(newExpanded);
  }, [expanded, isControlled, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
    },
    [handleToggle]
  );

  const itemId = id || `accordion-item-${Math.random().toString(36).substr(2, 9)}`;
  const contentId = `${itemId}-content`;

  const classNames = [
    'm3-accordion-item',
    expanded && 'm3-accordion-item--expanded',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const defaultIcon = (
    <svg
      className="m3-accordion-item__icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 10L12 15L17 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className={classNames}>
      <button
        className="m3-accordion-item__header"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={expanded}
        aria-controls={contentId}
        id={`${itemId}-header`}
      >
        <span className="m3-accordion-item__header-content">{header}</span>
        {showIcon && (
          <span className="m3-accordion-item__icon-wrapper">
            {icon || defaultIcon}
          </span>
        )}
      </button>
      <div
        id={contentId}
        className="m3-accordion-item__content"
        role="region"
        aria-labelledby={`${itemId}-header`}
        hidden={!expanded}
      >
        <div className="m3-accordion-item__content-inner">{children}</div>
      </div>
    </div>
  );
};

/**
 * M3 Expressive Accordion component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Accordion>
 *   <M3Accordion.Item header="Section 1">Content 1</M3Accordion.Item>
 *   <M3Accordion.Item header="Section 2">Content 2</M3Accordion.Item>
 * </M3Accordion>
 * ```
 */
export const M3Accordion: React.FC<M3AccordionProps> & {
  Item: React.FC<M3AccordionItemProps>;
} = ({ singleOpen = false, children, className = '' }) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const handleItemChange = useCallback(
    (itemId: string, expanded: boolean) => {
      setOpenItems((prev) => {
        const next = new Set(prev);
        if (expanded) {
          if (singleOpen) {
            next.clear();
          }
          next.add(itemId);
        } else {
          next.delete(itemId);
        }
        return next;
      });
    },
    [singleOpen]
  );

  const classNames = [
    'm3-accordion',
    singleOpen && 'm3-accordion--single-open',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement<M3AccordionItemProps>(child)) {
          return child;
        }

        const itemId = child.props.id || `accordion-item-${index}`;
        const isExpanded = openItems.has(itemId);

        return React.cloneElement(child, {
          id: itemId,
          expanded: isExpanded,
          onChange: (expanded: boolean) => handleItemChange(itemId, expanded),
        });
      })}
    </div>
  );
};

M3Accordion.Item = M3AccordionItem;
M3Accordion.displayName = 'M3Accordion';
M3AccordionItem.displayName = 'M3AccordionItem';

export default M3Accordion;
