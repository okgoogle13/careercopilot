/**
 * M3 Expressive ProfileCard Component
 * Implements Material Design 3 card for user profiles
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Elevation: --md-sys-elevation-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 */
import React from 'react';
import './M3ProfileCard.css';

export interface M3ProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Card variant
   * @default 'elevated'
   */
  variant?: 'elevated' | 'filled' | 'outlined';

  /**
   * User avatar (image URL or element)
   */
  avatar?: string | React.ReactNode;

  /**
   * User name
   */
  name: string;

  /**
   * User title/role
   */
  title?: string;

  /**
   * User bio/description
   */
  bio?: string;

  /**
   * Stats to display (followers, posts, etc.)
   */
  stats?: Array<{ label: string; value: string | number }>;

  /**
   * Action buttons
   */
  actions?: React.ReactNode;

  /**
   * Additional content
   */
  children?: React.ReactNode;

  /**
   * Cover/banner image
   */
  coverImage?: string;

  /**
   * If true, card is clickable
   * @default false
   */
  clickable?: boolean;

  /**
   * Click handler for clickable cards
   */
  onCardClick?: () => void;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive ProfileCard component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3ProfileCard
 *   avatar="https://..."
 *   name="John Doe"
 *   title="Software Engineer"
 *   bio="Building great products"
 *   stats={[
 *     { label: 'Followers', value: 1234 },
 *     { label: 'Following', value: 567 }
 *   ]}
 *   actions={<button>Follow</button>}
 * />
 * ```
 */
export const M3ProfileCard = React.forwardRef<HTMLDivElement, M3ProfileCardProps>(
  (
    {
      variant = 'elevated',
      avatar,
      name,
      title,
      bio,
      stats,
      actions,
      children,
      coverImage,
      clickable = false,
      onCardClick,
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-profile-card',
      `m3-profile-card--${variant}`,
      clickable && 'm3-profile-card--clickable',
      coverImage && 'm3-profile-card--with-cover',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handleClick = () => {
      if (clickable && onCardClick) {
        onCardClick();
      }
    };

    const renderAvatar = () => {
      if (typeof avatar === 'string') {
        return <img src={avatar} alt={name} className="m3-profile-card__avatar-img" />;
      }
      return avatar;
    };

    return (
      <div
        ref={ref}
        className={classNames}
        onClick={handleClick}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={
          clickable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClick();
                }
              }
            : undefined
        }
        data-testid="m3-profile-card"
        {...props}
      >
        {coverImage && (
          <div className="m3-profile-card__cover">
            <img src={coverImage} alt="" className="m3-profile-card__cover-img" />
          </div>
        )}

        <div className="m3-profile-card__content">
          <div className="m3-profile-card__header">
            {avatar && <div className="m3-profile-card__avatar">{renderAvatar()}</div>}

            <div className="m3-profile-card__info">
              <h3 className="m3-profile-card__name">{name}</h3>
              {title && <p className="m3-profile-card__title">{title}</p>}
            </div>
          </div>

          {bio && <p className="m3-profile-card__bio">{bio}</p>}

          {stats && stats.length > 0 && (
            <div className="m3-profile-card__stats">
              {stats.map((stat, index) => (
                <div key={index} className="m3-profile-card__stat">
                  <div className="m3-profile-card__stat-value">{stat.value}</div>
                  <div className="m3-profile-card__stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {children && <div className="m3-profile-card__body">{children}</div>}

          {actions && <div className="m3-profile-card__actions">{actions}</div>}
        </div>
      </div>
    );
  }
);

M3ProfileCard.displayName = 'M3ProfileCard';

export default M3ProfileCard;
