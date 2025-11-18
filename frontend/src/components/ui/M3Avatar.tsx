/**
 * M3 Expressive Avatar Component
 * Implements Material Design 3 avatar with image, initials, or icon
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 */
import React from 'react';
import './M3Avatar.css';

export interface M3AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Image source URL
   */
  src?: string;

  /**
   * Alt text for image
   */
  alt?: string;

  /**
   * Size of the avatar
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large' | 'xlarge';

  /**
   * Avatar variant
   * @default 'circular'
   */
  variant?: 'circular' | 'rounded' | 'square';

  /**
   * Color variant
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';

  /**
   * Children (icon or initials)
   */
  children?: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Avatar component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Avatar src="/user.jpg" alt="User Name" />
 * <M3Avatar>JD</M3Avatar>
 * <M3Avatar><UserIcon /></M3Avatar>
 * ```
 */
export const M3Avatar = React.forwardRef<HTMLDivElement, M3AvatarProps>(
  (
    {
      src,
      alt = '',
      size = 'medium',
      variant = 'circular',
      color = 'primary',
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false);

    const handleImageError = () => {
      setImageError(true);
    };

    const classNames = [
      'm3-avatar',
      `m3-avatar--${size}`,
      `m3-avatar--${variant}`,
      `m3-avatar--${color}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const showImage = src && !imageError;

    return (
      <div
        ref={ref}
        className={classNames}
        data-testid="m3-avatar"
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt}
            className="m3-avatar__image"
            onError={handleImageError}
          />
        ) : (
          <div className="m3-avatar__fallback">
            {children || (
              <svg
                className="m3-avatar__icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            )}
          </div>
        )}
      </div>
    );
  }
);

M3Avatar.displayName = 'M3Avatar';

export default M3Avatar;
