/**
 * ELECTRIC ALCHEMIST: POP-OUT GRAPHIC COMPONENT
 *
 * Floating element with parallax motion (y: -15, rotate: 5, scale: 1.1 on hover)
 * Designed to physically break the card boundary.
 */

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../../lib/cn';
import { popOut } from '../../../lib/motion';

export interface PopOutGraphicProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  /**
   * Content to render (typically an icon, emoji, or SVG)
   */
  children: React.ReactNode;
}

/**
 * Pop-Out Graphic Component
 *
 * @example
 * <Card popOutGraphic={
 *   <PopOutGraphic>
 *     <svg width="80" height="80">...</svg>
 *   </PopOutGraphic>
 * }>
 *   Card content here
 * </Card>
 */
export const PopOutGraphic = React.forwardRef<HTMLDivElement, PopOutGraphicProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn('inline-block', className)}
        variants={popOut}
        initial="rest"
        whileHover="hover"
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

PopOutGraphic.displayName = 'PopOutGraphic';
