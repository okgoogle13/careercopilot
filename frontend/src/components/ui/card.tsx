// Create file: src/components/ui/card.tsx
import { styled } from '@mui/material/styles';
import type { CardProps as MuiCardProps } from '@mui/material/Card';

type CardVariant = 'elevation' | 'outlined' | 'selected' | 'interactive';

export interface CardProps extends Omit<MuiCardProps, 'variant'> {
  variant?: CardVariant;
  children?: React.ReactNode;
}

const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: CardVariant }>(({ theme, variant = 'elevation' }) => ({
  transition: theme.transitions.create(['box-shadow', 'transform'], {
    duration: theme.transitions.duration.standard,
  }),
  ...(variant === 'selected' && {
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: theme.shadows[4],
  }),
  ...(variant === 'interactive' && {
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[8],
    },
  }),
}));

export const Card = forwardRef<HTMLDivElement, CardProps>(({ variant, ...rest }, ref) => (
  <StyledCard
    ref={ref}
    variant={variant === 'selected' || variant === 'interactive' ? 'elevation' : variant}
    elevation={variant === 'interactive' ? 4 : undefined}
    {...rest}
  />
));

Card.displayName = 'Card';

// Add missing card components
import { CardContent as MuiCardContent } from '@mui/material';
import { CardHeader as MuiCardHeader } from '@mui/material';
import { CardActions as MuiCardActions } from '@mui/material';
import { Typography } from '@mui/material';
import MuiCard from '@mui/material/Card';
import { forwardRef } from 'react';

export const CardContent = forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiCardContent>>(
  (props, ref) => <MuiCardContent ref={ref} {...props} />
);
CardContent.displayName = 'CardContent';

export const CardHeader = forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiCardHeader>>(
  (props, ref) => <MuiCardHeader ref={ref} {...props} />
);
CardHeader.displayName = 'CardHeader';

export const CardFooter = forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiCardActions>>(
  (props, ref) => <MuiCardActions ref={ref} {...props} />
);
CardFooter.displayName = 'CardFooter';

export const CardTitle = forwardRef<HTMLHeadingElement, React.ComponentProps<typeof Typography>>(
  (props, ref) => <Typography ref={ref} variant="h6" component="h3" {...props} />
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof Typography>
>((props, ref) => <Typography ref={ref} variant="body2" color="text.secondary" {...props} />);
CardDescription.displayName = 'CardDescription';

export const CardAction = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} {...props} />
);
CardAction.displayName = 'CardAction';
