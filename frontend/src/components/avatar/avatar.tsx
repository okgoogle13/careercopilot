import React from 'react';
import styles from './avatar.module.css';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  initials?: string;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, size = 'md', initials, className, ...props }, ref) => {
    const sizeClass = styles['avatar--' + size];

    return (
      <div
        ref={ref}
        className={styles.avatar + ' ' + sizeClass + (className ? ' ' + className : '')}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt || 'avatar'} className={styles['avatar-image']} />
        ) : initials ? (
          <span className={styles['avatar-initials']}>{initials}</span>
        ) : (
          <svg className={styles['avatar-icon']} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
