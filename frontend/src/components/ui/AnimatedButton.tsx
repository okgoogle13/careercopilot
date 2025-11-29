import React from 'react';
import { motion, MotionProps } from 'motion/react';
import styles from './AnimatedButton.module.css';

export interface AnimatedButtonProps 
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'ref'>,
    MotionProps {
  /**
   * Animation style to apply to the button
   * - scale: Scales up on hover, down on tap
   * - lift: Raises button slightly on hover
   * - glow: Adds primary glow effect on hover
   * - shimmer: Gradient overlay slides across on hover
   */
  animation?: 'scale' | 'lift' | 'glow' | 'shimmer';
  /**
   * Button variant
   */
  variant?: 'contained' | 'outlined' | 'text';
  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Button content
   */
  children: React.ReactNode;
}

/**
 * AnimatedButton - Native Button with motion animations and M3 design tokens
 *
 * Provides 4 animation styles:
 * - **scale**: Button scales up on hover (1.05x) and down on tap (0.95x)
 * - **lift**: Button lifts up on hover with shadow increase
 * - **glow**: Primary glow effect appears on hover
 * - **shimmer**: Gradient overlay slides across button on hover
 */
export const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps
>(
  ({
    animation = 'scale',
    variant = 'contained',
    size = 'md',
    children,
    disabled,
    className,
    ...rest
  }, ref) => {
    // Animation configurations
    const animations: Record<string, Partial<MotionProps>> = {
      scale: {
        whileHover: disabled ? {} : { scale: 1.05 },
        whileTap: disabled ? {} : { scale: 0.95 },
        transition: { type: 'spring', stiffness: 300 },
      },
      lift: {
        whileHover: disabled ? {} : { y: -2 },
        whileTap: disabled ? {} : { y: 0 },
        transition: { type: 'spring', stiffness: 300 },
      },
      glow: {
        whileHover: disabled
          ? {}
          : {
              boxShadow: '0 0 0 8px rgba(103, 80, 164, 0.1)',
            },
        transition: { duration: 0.2 },
      },
      shimmer: {
        transition: { duration: 0.6 },
      },
    };

    const variantClass = `button--${variant}`;
    const sizeClass = `button--${size}`;
    const animationClass = `animation--${animation}`;

    const buttonClassNames = [
      styles.button,
      styles[variantClass],
      styles[sizeClass],
      styles[animationClass],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Shimmer implementation requires special structure
    if (animation === 'shimmer') {
      return (
        <motion.button
          ref={ref}
          className={buttonClassNames}
          disabled={disabled}
          {...rest}
        >
          {/* Shimmer overlay */}
          {!disabled && (
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                pointerEvents: 'none',
              }}
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          )}
          {/* Button content */}
          <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
        </motion.button>
      );
    }

    // Standard animations (scale, lift, glow)
    return (
      <motion.button
        ref={ref}
        className={buttonClassNames}
        disabled={disabled}
        {...animations[animation]}
        {...rest}
      >
        {children}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
