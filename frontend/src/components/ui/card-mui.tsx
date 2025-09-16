import React from 'react';
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader as MuiCardHeader,
  CardActions as MuiCardActions,
  Typography,
  Box,
  SxProps,
  Theme,
  CardProps as MuiCardProps,
} from '@mui/material';

type CardVariant = 'default' | 'interactive' | 'selected' | 'loading' | 'error';

interface CardProps extends Omit<MuiCardProps, 'variant'> {
  variant?: CardVariant;
}

interface CardHeaderProps {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

interface CardTitleProps {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

interface CardDescriptionProps {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

interface CardContentProps {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

interface CardFooterProps {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

interface CardActionProps {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const getCardVariantSx = (variant: CardVariant = 'default'): SxProps<Theme> => {
  const baseSx: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    borderRadius: 3,
    transition: 'all 0.2s ease-in-out',
  };

  switch (variant) {
    case 'interactive':
      return {
        ...baseSx,
        cursor: 'pointer',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: (theme) => `0 4px 12px ${theme.palette.primary.main}10`,
        },
      };
    case 'selected':
      return {
        ...baseSx,
        border: 2,
        borderColor: 'primary.main',
        boxShadow: (theme) => `0 4px 12px ${theme.palette.primary.main}20`,
      };
    case 'loading':
      return {
        ...baseSx,
        opacity: 0.7,
      };
    case 'error':
      return {
        ...baseSx,
        borderColor: 'error.main',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? 'rgba(244, 67, 54, 0.05)'
            : 'rgba(244, 67, 54, 0.1)',
      };
    case 'default':
    default:
      return baseSx;
  }
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', sx, children, ...props }, ref) => {
    const variantSx = getCardVariantSx(variant);

    return (
      <MuiCard
        ref={ref}
        sx={{
          ...variantSx,
          ...sx,
        }}
        {...props}
      >
        {children}
      </MuiCard>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, sx, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        sx={{
          display: 'grid',
          gridTemplateRows: 'auto auto',
          gridTemplateColumns: '1fr auto',
          alignItems: 'start',
          gap: 1.5,
          px: 3,
          pt: 3,
          ...sx,
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, sx, ...props }, ref) => {
    return (
      <Typography
        ref={ref}
        variant="h6"
        component="h4"
        sx={{
          lineHeight: 1,
          fontWeight: 600,
          ...sx,
        }}
        {...props}
      >
        {children}
      </Typography>
    );
  }
);

CardTitle.displayName = 'CardTitle';

const CardDescription: React.FC<CardDescriptionProps> = ({ children, sx, ...props }) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

const CardAction: React.FC<CardActionProps> = ({ children, sx, ...props }) => {
  return (
    <Box
      sx={{
        gridColumn: 2,
        gridRow: '1 / 3',
        justifySelf: 'end',
        alignSelf: 'start',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, sx, ...props }, ref) => {
    return (
      <MuiCardContent
        ref={ref}
        sx={{
          px: 3,
          '&:last-child': {
            pb: 3,
          },
          ...sx,
        }}
        {...props}
      >
        {children}
      </MuiCardContent>
    );
  }
);

CardContent.displayName = 'CardContent';

const CardFooter: React.FC<CardFooterProps> = ({ children, sx, ...props }) => {
  return (
    <MuiCardActions
      sx={{
        px: 3,
        pb: 3,
        pt: 0,
        justifyContent: 'flex-start',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiCardActions>
  );
};

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
export type { CardProps };