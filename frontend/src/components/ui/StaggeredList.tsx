import { motion, Variants } from 'motion/react';
import React from 'react';

export interface StaggeredListProps<T> {
  /**
   * Array of items to render
   */
  items: T[];
  /**
   * Function to render each item
   */
  renderItem: (item: T, index: number) => React.ReactNode;
  /**
   * Delay between each item animation in seconds (default: 0.1)
   */
  staggerDelay?: number;
  /**
   * Additional className for the container
   */
  className?: string;
  /**
   * Whether to animate on mount (default: true)
   */
  animateOnMount?: boolean;
  /**
   * Direction of entrance animation
   */
  direction?: 'up' | 'down' | 'left' | 'right';
}

/**
 * StaggeredList - Renders a list of items with sequential entrance animations
 *
 * Uses framer-motion's variants API to orchestrate parent-child animations.
 * Each item animates in sequence with a configurable delay.
 *
 * @example
 * ```tsx
 * const tasks = [
 *   { id: 1, title: 'Task 1', desc: 'Description 1' },
 *   { id: 2, title: 'Task 2', desc: 'Description 2' },
 *   { id: 3, title: 'Task 3', desc: 'Description 3' },
 * ];
 *
 * <StaggeredList
 *   items={tasks}
 *   renderItem={(task) => (
 *     <Card sx={{ p: 2, mb: 2 }}>
 *       <Typography variant="h6">{task.title}</Typography>
 *       <Typography variant="body2">{task.desc}</Typography>
 *     </Card>
 *   )}
 * />
 *
 * // Custom stagger delay and direction
 * <StaggeredList
 *   items={users}
 *   staggerDelay={0.05}
 *   direction="up"
 *   renderItem={(user) => <UserCard user={user} />}
 * />
 * ```
 */
export function StaggeredList<T>({
  items,
  renderItem,
  staggerDelay = 0.1,
  className,
  animateOnMount = true,
  direction = 'left',
}: StaggeredListProps<T>) {
  // Container variants for orchestrating child animations
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  // Item variants based on direction
  const getItemVariants = (): Variants => {
    const offset = 20;
    const directionOffsets = {
      left: { x: -offset, y: 0 },
      right: { x: offset, y: 0 },
      up: { x: 0, y: -offset },
      down: { x: 0, y: offset },
    };

    return {
      hidden: {
        opacity: 0,
        ...directionOffsets[direction],
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1], // cubic-bezier easing
        },
      },
    };
  };

  const itemVariants = getItemVariants();

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial={animateOnMount ? 'hidden' : 'visible'}
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.div key={index} variants={itemVariants}>
          {renderItem(item, index)}
        </motion.div>
      ))}
    </motion.div>
  );
}

/**
 * StaggeredGrid - Same as StaggeredList but uses CSS Grid layout
 *
 * @example
 * ```tsx
 * <StaggeredGrid
 *   items={products}
 *   columns={3}
 *   gap={3}
 *   renderItem={(product) => <ProductCard product={product} />}
 * />
 * ```
 */
export function StaggeredGrid<T>({
  items,
  renderItem,
  staggerDelay = 0.1,
  className,
  animateOnMount = true,
  direction = 'left',
  columns = 3,
  gap = 2,
}: StaggeredListProps<T> & { columns?: number; gap?: number }) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const getItemVariants = (): Variants => {
    const offset = 20;
    const directionOffsets = {
      left: { x: -offset, y: 0 },
      right: { x: offset, y: 0 },
      up: { x: 0, y: -offset },
      down: { x: 0, y: offset },
    };

    return {
      hidden: {
        opacity: 0,
        ...directionOffsets[direction],
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
        },
      },
    };
  };

  const itemVariants = getItemVariants();

  return (
    <motion.div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap * 8}px`, // 8px grid
      }}
      variants={containerVariants}
      initial={animateOnMount ? 'hidden' : 'visible'}
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.div key={index} variants={itemVariants}>
          {renderItem(item, index)}
        </motion.div>
      ))}
    </motion.div>
  );
}
