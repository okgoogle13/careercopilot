import { Button, ButtonProps, Card, CardProps, styled } from '@mui/material';
import { Theme } from '@mui/material/styles';

declare module '@mui/material/Card' {
  interface CardPropsVariantOverrides {
    glass: true;
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    glass: true;
  }
}

interface StyledButtonProps extends ButtonProps {
  glow?: 'primary' | 'secondary' | 'tertiary' | 'aurora';
  variant?: 'contained' | 'outlined' | 'text' | 'glass';
}

export const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'glow',
})<StyledButtonProps>(({ theme, glow, variant = 'contained' }) => ({
  // Base button styles
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 500,
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  
  // Variant styles
  ...(variant === 'contained' && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      transform: 'translateY(-1px)',
      boxShadow: theme.customShadows.glowPrimary,
    },
  }),
  
  ...(variant === 'outlined' && {
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: 'transparent',
      borderColor: theme.palette.primary.light,
      color: theme.palette.primary.light,
    },
  }),
  
  ...(variant === 'glass' && {
    backgroundColor: theme.glass.background,
    backdropFilter: theme.glass.blur,
    border: `1px solid ${theme.glass.border}`,
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.glass.backgroundHover,
      borderColor: theme.glass.borderHover,
      boxShadow: theme.customShadows.glassHover,
    },
  }),
  
  // Glow effects based on prop
  ...(glow === 'primary' && {
    boxShadow: theme.customShadows.glowPrimary,
    '&:hover': {
      boxShadow: `${theme.customShadows.glowPrimary}, 0 0 20px ${theme.palette.primary.main}40`,
    },
  }),
  
  ...(glow === 'secondary' && {
    '&:hover': {
      boxShadow: theme.customShadows.glowSecondary,
    },
  }),
  
  ...(glow === 'tertiary' && {
    '&:hover': {
      boxShadow: theme.customShadows.glowTertiary,
    },
  }),
  
  ...(glow === 'aurora' && {
    '&:hover': {
      boxShadow: theme.customShadows.glowAurora,
    },
  }),
  
  // Disabled state
  '&.Mui-disabled': {
    opacity: 0.7,
  },
  
  // Focus visible state for better accessibility
  '&.Mui-focusVisible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
}));

export const GlassCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'elevation',
})<CardProps>(({ theme }) => ({
  backgroundColor: theme.glass.background,
  backdropFilter: theme.glass.blur,
  border: `1px solid ${theme.glass.border}`,
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'all 0.3s ease-in-out',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: theme.glass.backgroundHover,
    borderColor: theme.glass.borderHover,
    boxShadow: theme.customShadows.glassHover,
  },
  '&.MuiCard-root': {
    backgroundImage: 'none',
  },
}));

// Set up variants for the Card component
export const StyledCard = styled(Card)(({ theme, variant = 'elevation' }) => ({
  ...(variant === 'glass' && {
    backgroundColor: theme.glass.background,
    backdropFilter: theme.glass.blur,
    border: `1px solid ${theme.glass.border}`,
    '&:hover': {
      backgroundColor: theme.glass.backgroundHover,
      borderColor: theme.glass.borderHover,
      boxShadow: theme.customShadows.glassHover,
    },
  }),
}));

// Example usage in your component:
/*
import { StyledButton } from './features/common/StyledComponents';

<StyledButton 
  variant="contained" 
  glow="primary"
  onClick={handleClick}
>
  Click Me
</StyledButton>

<StyledButton 
  variant="glass" 
  glow="aurora"
  onClick={handleClick}
>
  Glass Button
</StyledButton>
*/
