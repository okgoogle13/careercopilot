import { Box, Button, Typography, SvgIcon, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

export interface EmptyStateProps {
  /**
   * The main title of the empty state
   */
  title: string;
  /**
   * Optional description providing more context
   */
  description?: string | ReactNode;
  /**
   * Optional icon to display
   */
  icon?: ReactNode;
  /**
   * Optional action button
   */
  action?: {
    label: string;
    onClick: () => void;
    startIcon?: ReactNode;
    variant?: 'text' | 'outlined' | 'contained';
    color?: 'primary' | 'secondary' | 'inherit' | 'success' | 'error' | 'info' | 'warning';
  };
  /**
   * Additional content to display below the action button
   */
  children?: ReactNode;
  /**
   * Custom styles
   */
  sx?: SxProps<Theme>;
  /**
   * Maximum width of the content
   */
  maxWidth?: number | string;
  /**
   * Whether to show a border around the empty state
   */
  variant?: 'plain' | 'outlined' | 'contained';
}

export const EmptyState = ({
  title,
  description,
  icon,
  action,
  children,
  sx,
  maxWidth = 400,
  variant = 'plain',
}: EmptyStateProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
        mx: 'auto',
        maxWidth,
        ...(variant === 'outlined' && {
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          p: 6,
        }),
        ...(variant === 'contained' && {
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
          borderRadius: 2,
          p: 6,
        }),
        ...sx,
      }}
    >
      {icon && (
        <Box
          sx={{
            color: 'text.secondary',
            mb: 2,
            '& svg': {
              fontSize: 64,
            },
          }}
        >
          {icon}
        </Box>
      )}
      
      <Typography variant="h6" component="h2" gutterBottom>
        {title}
      </Typography>
      
      {description && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3, maxWidth: '80%' }}
        >
          {description}
        </Typography>
      )}
      
      {action && (
        <Button
          variant={action.variant || 'contained'}
          color={action.color || 'primary'}
          onClick={action.onClick}
          startIcon={action.startIcon}
          sx={{ mb: 3 }}
        >
          {action.label}
        </Button>
      )}
      
      {children}
    </Box>
  );
};

// Common empty state variants
export const NoResultsFound = ({
  searchQuery,
  onClearSearch,
  ...props
}: Omit<EmptyStateProps, 'title' | 'description' | 'action'> & {
  searchQuery?: string;
  onClearSearch?: () => void;
}) => (
  <EmptyState
    title={searchQuery ? 'No results found' : 'No items found'}
    description={
      searchQuery
        ? `No items match "${searchQuery}". Try adjusting your search or filter criteria.`
        : 'There are no items to display. Check back later or add a new item.'
    }
    action={
      onClearSearch
        ? {
            label: 'Clear search',
            onClick: onClearSearch,
            variant: 'outlined',
          }
        : undefined
    }
    variant="outlined"
    {...props}
  />
);

export const ErrorState = ({
  error,
  onRetry,
  ...props
}: Omit<EmptyStateProps, 'title' | 'description' | 'icon' | 'action'> & {
  error?: Error | string;
  onRetry?: () => void;
}) => {
  const errorMessage =
    typeof error === 'string' ? error : error?.message || 'An unknown error occurred';

  return (
    <EmptyState
      title="Something went wrong"
      description={
        <>
          We couldn't load this content. {errorMessage}
          {process.env.NODE_ENV === 'development' && error instanceof Error && (
            <Box
              component="pre"
              sx={{
                mt: 2,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                textAlign: 'left',
                fontSize: '0.75rem',
                overflow: 'auto',
                maxHeight: 200,
              }}
            >
              {error.stack}
            </Box>
          )}
        </>
      }
      icon={
        <SvgIcon color="error" fontSize="large">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </SvgIcon>
      }
      action={
        onRetry
          ? {
              label: 'Retry',
              onClick: onRetry,
              variant: 'outlined',
              color: 'error',
            }
          : undefined
      }
      variant="outlined"
      {...props}
    />
  );
};
