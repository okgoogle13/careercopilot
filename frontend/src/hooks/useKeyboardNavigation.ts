// Keyboard navigation utilities for enhanced accessibility
import React, { useEffect, useCallback } from 'react';

interface KeyboardNavigationOptions {
  onEnter?: () => void;
  onSpace?: () => void;
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  preventDefaultKeys?: string[];
}

/**
 * Hook for handling keyboard navigation on interactive elements
 * Useful for custom components that need keyboard interaction
 */
export const useKeyboardNavigation = (
  ref: React.RefObject<HTMLElement>,
  options: KeyboardNavigationOptions = {}
) => {
  const {
    onEnter,
    onSpace,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    preventDefaultKeys = [],
  } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key } = event;

      // Prevent default for specified keys
      if (preventDefaultKeys.includes(key)) {
        event.preventDefault();
      }

      switch (key) {
        case 'Enter':
          if (onEnter) {
            event.preventDefault();
            onEnter();
          }
          break;
        case ' ':
          if (onSpace) {
            event.preventDefault();
            onSpace();
          }
          break;
        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
        case 'ArrowUp':
          if (onArrowUp) {
            event.preventDefault();
            onArrowUp();
          }
          break;
        case 'ArrowDown':
          if (onArrowDown) {
            event.preventDefault();
            onArrowDown();
          }
          break;
        case 'ArrowLeft':
          if (onArrowLeft) {
            event.preventDefault();
            onArrowLeft();
          }
          break;
        case 'ArrowRight':
          if (onArrowRight) {
            event.preventDefault();
            onArrowRight();
          }
          break;
      }
    },
    [
      onEnter,
      onSpace,
      onEscape,
      onArrowUp,
      onArrowDown,
      onArrowLeft,
      onArrowRight,
      preventDefaultKeys,
    ]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('keydown', handleKeyDown);
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, ref]);
};

/**
 * Hook for managing roving tabindex in lists
 * Useful for custom dropdown menus, grids, etc.
 */
export const useRovingTabIndex = (
  containerRef: React.RefObject<HTMLElement>,
  itemSelector: string = '[role="option"], [role="menuitem"], [role="gridcell"]'
) => {
  const setActiveItem = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container) return;

      const items = container.querySelectorAll(itemSelector) as NodeListOf<HTMLElement>;
      
      items.forEach((item, i) => {
        item.tabIndex = i === index ? 0 : -1;
        if (i === index) {
          item.focus();
        }
      });
    },
    [containerRef, itemSelector]
  );

  const getActiveIndex = useCallback(() => {
    const container = containerRef.current;
    if (!container) return 0;

    const items = container.querySelectorAll(itemSelector) as NodeListOf<HTMLElement>;
    return Array.from(items).findIndex(item => item.tabIndex === 0);
  }, [containerRef, itemSelector]);

  const moveToNext = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll(itemSelector) as NodeListOf<HTMLElement>;
    const currentIndex = getActiveIndex();
    const nextIndex = (currentIndex + 1) % items.length;
    setActiveItem(nextIndex);
  }, [containerRef, itemSelector, getActiveIndex, setActiveItem]);

  const moveToPrevious = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll(itemSelector) as NodeListOf<HTMLElement>;
    const currentIndex = getActiveIndex();
    const previousIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    setActiveItem(previousIndex);
  }, [containerRef, itemSelector, getActiveIndex, setActiveItem]);

  const moveToFirst = useCallback(() => {
    setActiveItem(0);
  }, [setActiveItem]);

  const moveToLast = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll(itemSelector) as NodeListOf<HTMLElement>;
    setActiveItem(items.length - 1);
  }, [containerRef, itemSelector, setActiveItem]);

  return {
    setActiveItem,
    getActiveIndex,
    moveToNext,
    moveToPrevious,
    moveToFirst,
    moveToLast,
  };
};