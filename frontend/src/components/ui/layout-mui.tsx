import { Container, Stack, Box, Grid } from '@mui/material';

// Simple Layout Container Component
export function LayoutContainer({ size = 'lg', children, ...props }: any) {
  return (
    <Container
      maxWidth={size}
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Container>
  );
}

// Simple Grid Layout Component
export function LayoutGrid({ spacing = 3, children, ...props }: any) {
  return (
    <Grid
      container
      spacing={spacing}
      sx={{
        width: '100%',
        margin: 0,
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Grid>
  );
}

// Simple Grid Item Component
export function LayoutGridItem({ xs = 12, children, ...props }: any) {
  return (
    <Grid item xs={xs} {...props}>
      {children}
    </Grid>
  );
}

// Simple Stack Layout Component
export function LayoutStack({
  spacing = 2,
  direction = 'column',
  children,
  ...props
}: any) {
  return (
    <Stack
      spacing={spacing}
      direction={direction}
      sx={{
        width: '100%',
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Stack>
  );
}

// Simple Flex Layout Component
export function LayoutFlex({
  direction = 'row',
  align = 'flex-start',
  justify = 'flex-start',
  wrap = false,
  gap = 0,
  children,
  ...props
}: any) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        gap: gap,
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

// Simple Section Component
export function LayoutSection({
  spacing = 4,
  fullWidth = false,
  centered = false,
  children,
  ...props
}: any) {
  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        py: spacing,
        ...(centered && {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }),
        ...props.sx,
      }}
      {...props}
    >
      {fullWidth ? children : <Container maxWidth="lg">{children}</Container>}
    </Box>
  );
}

// Simple Card Component
export function LayoutCard({
  variant = 'default',
  padding = 3,
  children,
  ...props
}: any) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: padding,
        ...(variant === 'outlined' && {
          border: '1px solid',
          borderColor: 'divider',
        }),
        ...(variant === 'elevated' && {
          boxShadow: 3,
        }),
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

// Simple breakpoints
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

// Helper function for responsive values
type ResponsiveValue<T> = {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
};

export function responsive<T>(
  values: ResponsiveValue<T>
): Record<string, T> {
  // Filter out undefined values and return the remaining as a record
  const result: Record<string, T> = {};
  
  (Object.keys(values) as Array<keyof ResponsiveValue<T>>).forEach((key) => {
    if (values[key] !== undefined) {
      result[key] = values[key]!;
    }
  });
  
  return result;
}
