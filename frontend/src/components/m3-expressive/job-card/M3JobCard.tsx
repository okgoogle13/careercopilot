/**
 * M3 Expressive JobCard Component
 * Implements Material Design 3 card for job listings
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Elevation: --md-sys-elevation-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 */
import React from 'react';
import './M3JobCard.css';

export interface M3JobCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Card variant
   * @default 'elevated'
   */
  variant?: 'elevated' | 'filled' | 'outlined';

  /**
   * Company logo (URL or element)
   */
  logo?: string | React.ReactNode;

  /**
   * Job title
   */
  title: string;

  /**
   * Company name
   */
  company: string;

  /**
   * Job location
   */
  location?: string;

  /**
   * Job type (e.g., Full-time, Part-time, Contract)
   */
  jobType?: string;

  /**
   * Salary range or info
   */
  salary?: string;

  /**
   * Job description/summary
   */
  description?: string;

  /**
   * Job tags (skills, categories, etc.)
   */
  tags?: string[];

  /**
   * Posted date
   */
  postedDate?: string;

  /**
   * If true, shows as featured/highlighted
   * @default false
   */
  featured?: boolean;

  /**
   * Action buttons
   */
  actions?: React.ReactNode;

  /**
   * Additional content
   */
  children?: React.ReactNode;

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
 * M3 Expressive JobCard component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3JobCard
 *   logo="https://..."
 *   title="Senior Frontend Developer"
 *   company="Tech Corp"
 *   location="San Francisco, CA"
 *   jobType="Full-time"
 *   salary="$120k - $180k"
 *   tags={['React', 'TypeScript', 'Node.js']}
 *   actions={<button>Apply Now</button>}
 * />
 * ```
 */
export const M3JobCard = React.forwardRef<HTMLDivElement, M3JobCardProps>(
  (
    {
      variant = 'elevated',
      logo,
      title,
      company,
      location,
      jobType,
      salary,
      description,
      tags,
      postedDate,
      featured = false,
      actions,
      children,
      clickable = false,
      onCardClick,
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-job-card',
      `m3-job-card--${variant}`,
      featured && 'm3-job-card--featured',
      clickable && 'm3-job-card--clickable',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handleClick = () => {
      if (clickable && onCardClick) {
        onCardClick();
      }
    };

    const renderLogo = () => {
      if (typeof logo === 'string') {
        return <img src={logo} alt={company} className="m3-job-card__logo-img" />;
      }
      return logo;
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
        data-testid="m3-job-card"
        {...props}
      >
        {featured && <div className="m3-job-card__featured-badge">Featured</div>}

        <div className="m3-job-card__content">
          <div className="m3-job-card__header">
            {logo && <div className="m3-job-card__logo">{renderLogo()}</div>}

            <div className="m3-job-card__info">
              <h3 className="m3-job-card__title">{title}</h3>
              <p className="m3-job-card__company">{company}</p>
            </div>
          </div>

          {(location || jobType || salary) && (
            <div className="m3-job-card__meta">
              {location && (
                <span className="m3-job-card__meta-item">
                  <svg className="m3-job-card__meta-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  {location}
                </span>
              )}
              {jobType && (
                <span className="m3-job-card__meta-item">
                  <svg className="m3-job-card__meta-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
                  </svg>
                  {jobType}
                </span>
              )}
              {salary && (
                <span className="m3-job-card__meta-item">
                  <svg className="m3-job-card__meta-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                  </svg>
                  {salary}
                </span>
              )}
            </div>
          )}

          {description && <p className="m3-job-card__description">{description}</p>}

          {tags && tags.length > 0 && (
            <div className="m3-job-card__tags">
              {tags.map((tag, index) => (
                <span key={index} className="m3-job-card__tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {children && <div className="m3-job-card__body">{children}</div>}
        </div>

        {(actions || postedDate) && (
          <div className="m3-job-card__footer">
            {postedDate && <span className="m3-job-card__posted-date">{postedDate}</span>}
            {actions && <div className="m3-job-card__actions">{actions}</div>}
          </div>
        )}
      </div>
    );
  }
);

M3JobCard.displayName = 'M3JobCard';

export default M3JobCard;
