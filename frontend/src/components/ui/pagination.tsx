import * as React from 'react';
import {
  Pagination as MuiPagination,
  PaginationItem as MuiPaginationItem,
  Button,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import { ChevronLeft, ChevronRight, MoreHoriz } from '@mui/icons-material';

interface PaginationProps {
  children?: React.ReactNode;
  count?: number;
  page?: number;
  onChange?: (event: React.ChangeEvent<unknown>, value: number) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

function Pagination({ children, count, page, onChange, disabled, size = 'medium', ...props }: PaginationProps) {
  if (count && page && onChange) {
    return (
      <Box
        component="nav"
        role="navigation"
        aria-label="pagination"
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          mx: 'auto'
        }}
        {...props}
      >
        <MuiPagination
          count={count}
          page={page}
          onChange={onChange}
          disabled={disabled}
          size={size}
          renderItem={(item) => (
            <MuiPaginationItem
              {...item}
              components={{
                previous: ChevronLeft,
                next: ChevronRight
              }}
            />
          )}
        />
      </Box>
    );
  }

  return (
    <Box
      component="nav"
      role="navigation"
      aria-label="pagination"
      sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        mx: 'auto'
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

interface PaginationContentProps {
  children: React.ReactNode;
}

function PaginationContent({ children, ...props }: PaginationContentProps) {
  return (
    <Box
      component="ul"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.5,
        listStyle: 'none',
        m: 0,
        p: 0
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

interface PaginationItemProps {
  children: React.ReactNode;
}

function PaginationItem({ children, ...props }: PaginationItemProps) {
  return (
    <Box component="li" {...props}>
      {children}
    </Box>
  );
}

interface PaginationLinkProps {
  isActive?: boolean;
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

function PaginationLink({ isActive, size = 'medium', children, href, onClick, disabled, ...props }: PaginationLinkProps) {
  const Component = href ? 'a' : Button;

  return (
    <Component
      aria-current={isActive ? 'page' : undefined}
      href={href}
      onClick={onClick}
      disabled={disabled}
      variant={isActive ? 'outlined' : 'text'}
      size={size === 'icon' ? 'small' : size}
      sx={{
        minWidth: size === 'icon' ? 36 : 'auto',
        width: size === 'icon' ? 36 : 'auto',
        height: size === 'icon' ? 36 : 'auto',
        color: isActive ? 'primary.main' : 'text.primary',
        borderColor: isActive ? 'primary.main' : 'transparent',
        '&:hover': {
          backgroundColor: isActive ? 'primary.light' : 'action.hover',
          opacity: 0.8
        }
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

interface PaginationPreviousProps {
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
}

function PaginationPrevious({ onClick, disabled, href, ...props }: PaginationPreviousProps) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="medium"
      onClick={onClick}
      disabled={disabled}
      href={href}
      {...props}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1.25 }}>
        <ChevronLeft fontSize="small" />
        <Typography
          variant="body2"
          sx={{
            display: { xs: 'none', sm: 'block' }
          }}
        >
          Previous
        </Typography>
      </Box>
    </PaginationLink>
  );
}

interface PaginationNextProps {
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
}

function PaginationNext({ onClick, disabled, href, ...props }: PaginationNextProps) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="medium"
      onClick={onClick}
      disabled={disabled}
      href={href}
      {...props}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1.25 }}>
        <Typography
          variant="body2"
          sx={{
            display: { xs: 'none', sm: 'block' }
          }}
        >
          Next
        </Typography>
        <ChevronRight fontSize="small" />
      </Box>
    </PaginationLink>
  );
}

interface PaginationEllipsisProps {}

function PaginationEllipsis({ ...props }: PaginationEllipsisProps) {
  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        display: 'flex',
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center'
      }}
      {...props}
    >
      <MoreHoriz fontSize="small" />
      <Box
        component="span"
        sx={{
          position: 'absolute',
          width: 1,
          height: 1,
          p: 0,
          m: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0
        }}
      >
        More pages
      </Box>
    </Box>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
