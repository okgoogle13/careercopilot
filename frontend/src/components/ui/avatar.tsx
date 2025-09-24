import React from 'react';
import {
  Avatar as MuiAvatar,
  AvatarProps as MuiAvatarProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAvatar = styled(MuiAvatar)(({ theme }) => ({
  width: 40,
  height: 40,
  fontSize: '1rem',
}));

export interface AvatarProps extends MuiAvatarProps {}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ children, ...props }, ref) => {
    return (
      <StyledAvatar ref={ref} {...props}>
        {children}
      </StyledAvatar>
    );
  }
);

Avatar.displayName = 'Avatar';

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ src, alt, ...props }, ref) => {
    return (
      <Avatar>
        <img ref={ref} src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} {...props} />
      </Avatar>
    );
  }
);

AvatarImage.displayName = 'AvatarImage';

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ children, ...props }, ref) => {
    return (
      <Avatar ref={ref} {...props}>
        {children}
      </Avatar>
    );
  }
);

AvatarFallback.displayName = 'AvatarFallback';