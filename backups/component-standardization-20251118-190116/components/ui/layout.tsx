import type { BoxProps, ContainerProps, GridProps, StackProps } from '@mui/material';
import { Box, Container, Grid, Stack } from '@mui/material';
import React from 'react';

import type { CardProps } from './card';
import { Card } from './card';

export type LayoutContainerProps = ContainerProps;

export const LayoutContainer = React.forwardRef<HTMLDivElement, LayoutContainerProps>(
  ({ children, ...props }, ref) => {
    return (
      <Container ref={ref} {...props}>
        {children}
      </Container>
    );
  }
);

LayoutContainer.displayName = 'LayoutContainer';

export type LayoutGridProps = GridProps;

export const LayoutGrid = React.forwardRef<HTMLDivElement, LayoutGridProps>(
  ({ children, ...props }, ref) => {
    return (
      <Grid ref={ref} container {...props}>
        {children}
      </Grid>
    );
  }
);

LayoutGrid.displayName = 'LayoutGrid';

export interface LayoutGridItemProps extends Omit<GridProps, 'container'> {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export const LayoutGridItem = React.forwardRef<HTMLDivElement, LayoutGridItemProps>(
  ({ children, xs, sm, md, lg, xl, ...props }, ref) => {
    // Build size object from breakpoint props
    const definedBreakpoints = Object.fromEntries(
      Object.entries({ xs, sm, md, lg, xl }).filter(([, value]) => value !== undefined)
    );

    const size = Object.keys(definedBreakpoints).length > 0 ? definedBreakpoints : undefined;

    return (
      <Grid ref={ref} size={size} {...props}>
        {children}
      </Grid>
    );
  }
);

LayoutGridItem.displayName = 'LayoutGridItem';

export type LayoutStackProps = StackProps;

export const LayoutStack = React.forwardRef<HTMLDivElement, LayoutStackProps>(
  ({ children, ...props }, ref) => {
    return (
      <Stack ref={ref} {...props}>
        {children}
      </Stack>
    );
  }
);

LayoutStack.displayName = 'LayoutStack';

export interface LayoutFlexProps extends BoxProps {
  gap?: number | string;
  justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  align?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
  wrap?: boolean;
}

export const LayoutFlex = React.forwardRef<HTMLDivElement, LayoutFlexProps>(
  ({ children, gap, justify, align, wrap, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          gap,
          justifyContent: justify,
          alignItems: align,
          flexWrap: wrap ? 'wrap' : 'nowrap',
          ...props.sx,
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

LayoutFlex.displayName = 'LayoutFlex';

export type LayoutCardProps = CardProps;

export const LayoutCard = React.forwardRef<HTMLDivElement, LayoutCardProps>(
  ({ children, ...props }, ref) => {
    return (
      <Card ref={ref} {...props}>
        {children}
      </Card>
    );
  }
);

LayoutCard.displayName = 'LayoutCard';
