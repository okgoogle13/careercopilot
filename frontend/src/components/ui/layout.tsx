import React from 'react';
import {
  Box,
  Container,
  Stack,
  SxProps,
  Theme,
  BoxProps,
  ContainerProps,
  StackProps,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Grid2Props } from '@mui/material/Unstable_Grid2';

// Layout Container Component
interface LayoutContainerProps extends Omit<ContainerProps, 'maxWidth'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export function LayoutContainer({ size = 'lg', sx, children, ...props }: LayoutContainerProps) {
  return (
    <Container
      maxWidth={size}
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Container>
  );
}

// Grid Layout Components
interface LayoutGridProps extends Grid2Props {
  spacing?: number;
}

export function LayoutGrid({ spacing = 3, sx, children, ...props }: LayoutGridProps) {
  return (
    <Grid
      container
      spacing={spacing}
      sx={{
        width: '100%',
        margin: 0,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Grid>
  );
}

interface LayoutGridItemProps extends Grid2Props {
  xs?: number | 'auto';
  sm?: number | 'auto';
  md?: number | 'auto';
  lg?: number | 'auto';
  xl?: number | 'auto';
}

export function LayoutGridItem({
  xs = 12,
  sm,
  md,
  lg,
  xl,
  sx,
  children,
  ...props
}: LayoutGridItemProps) {
  return (
    <Grid
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      xl={xl}
      sx={{
        ...sx,
      }}
      {...props}
    >
      {children}
    </Grid>
  );
}

// Stack Layout Components
interface LayoutStackProps extends StackProps {
  spacing?: number;
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justify?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
}

export function LayoutStack({
  spacing = 2,
  direction = 'column',
  align,
  justify,
  sx,
  children,
  ...props
}: LayoutStackProps) {
  return (
    <Stack
      direction={direction}
      spacing={spacing}
      alignItems={align}
      justifyContent={justify}
      sx={{
        width: '100%',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Stack>
  );
}

// Flexbox Layout Component
interface LayoutFlexProps extends BoxProps {
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justify?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  wrap?: boolean;
  gap?: number;
}

export function LayoutFlex({
  direction = 'row',
  align = 'flex-start',
  justify = 'flex-start',
  wrap = false,
  gap = 0,
  sx,
  children,
  ...props
}: LayoutFlexProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        gap: gap,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

// Section Layout Component
interface LayoutSectionProps extends BoxProps {
  spacing?: number;
  fullWidth?: boolean;
  centered?: boolean;
}

export function LayoutSection({
  spacing = 4,
  fullWidth = false,
  centered = false,
  sx,
  children,
  ...props
}: LayoutSectionProps) {
  return (
    <Box
      component="section"
      sx={{
        py: spacing,
        width: fullWidth ? '100%' : 'auto',
        maxWidth: fullWidth ? 'none' : '100%',
        mx: centered ? 'auto' : 0,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

// Card Layout Component
interface LayoutCardProps extends BoxProps {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: number;
}

export function LayoutCard({
  variant = 'default',
  padding = 3,
  sx,
  children,
  ...props
}: LayoutCardProps) {
  const getVariantStyles = (): SxProps<Theme> => {
    switch (variant) {
      case 'outlined':
        return {
          border: 1,
          borderColor: 'divider',
        };
      case 'elevated':
        return {
          boxShadow: 2,
        };
      case 'default':
      default:
        return {
          border: 1,
          borderColor: 'divider',
          boxShadow: 1,
        };
    }
  };

  return (
    <Box
      sx={{
        borderRadius: 2,
        backgroundColor: 'background.paper',
        p: padding,
        ...getVariantStyles(),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

// Responsive utilities
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

// Helper function for responsive values
export function responsive<T>(values: { xs?: T; sm?: T; md?: T; lg?: T; xl?: T }): SxProps<Theme> {
  return values as SxProps<Theme>;
}
