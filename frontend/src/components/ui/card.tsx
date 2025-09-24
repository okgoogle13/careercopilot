import React from 'react';
import {
  Card as MuiCard,
  CardProps as MuiCardProps,
  CardContent as MuiCardContent,
  CardHeader as MuiCardHeader,
  CardActions as MuiCardActions,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
}));

export interface CardProps extends MuiCardProps {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ children, ...props }, ref) => {
  return (
    <StyledCard ref={ref} {...props}>
      {children}
    </StyledCard>
  );
});

Card.displayName = 'Card';

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, title, description, ...props }, ref) => {
    if (title || description) {
      return <MuiCardHeader ref={ref} title={title} subheader={description} {...props} />;
    }

    return (
      <div ref={ref} {...props} style={{ padding: '16px 16px 0 16px' }}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.ComponentProps<typeof Typography> {}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, ...props }, ref) => {
    return (
      <Typography ref={ref} variant="h6" component="h3" fontWeight={600} {...props}>
        {children}
      </Typography>
    );
  }
);

CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends React.ComponentProps<typeof Typography> {}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, ...props }, ref) => {
    return (
      <Typography ref={ref} variant="body2" color="text.secondary" {...props}>
        {children}
      </Typography>
    );
  }
);

CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends React.ComponentProps<typeof MuiCardContent> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, ...props }, ref) => {
    return (
      <MuiCardContent ref={ref} {...props}>
        {children}
      </MuiCardContent>
    );
  }
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.ComponentProps<typeof MuiCardActions> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, ...props }, ref) => {
    return (
      <MuiCardActions ref={ref} {...props}>
        {children}
      </MuiCardActions>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export interface CardActionProps extends React.ComponentProps<'div'> {}

export const CardAction = React.forwardRef<HTMLDivElement, CardActionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`inline-flex items-center justify-center ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardAction.displayName = 'CardAction';
