import * as React from 'react';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box,
  BreadcrumbsProps as MuiBreadcrumbsProps
} from '@mui/material';
import { ChevronRight, MoreHoriz } from '@mui/icons-material';
import { Slot } from '@radix-ui/react-slot';

interface BreadcrumbProps extends Omit<MuiBreadcrumbsProps, 'children'> {
  children?: React.ReactNode;
}

function Breadcrumb({ children, ...props }: BreadcrumbProps) {
  return (
    <MuiBreadcrumbs
      aria-label="breadcrumb"
      separator={<ChevronRight fontSize="small" />}
      sx={{
        '& .MuiBreadcrumbs-ol': {
          flexWrap: 'wrap',
          alignItems: 'center'
        },
        '& .MuiBreadcrumbs-li': {
          color: 'text.secondary',
          fontSize: '0.875rem'
        }
      }}
      {...props}
    >
      {children}
    </MuiBreadcrumbs>
  );
}

interface BreadcrumbListProps {
  children: React.ReactNode;
}

function BreadcrumbList({ children, ...props }: BreadcrumbListProps) {
  return (
    <Box
      component="ol"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: { xs: 1.5, sm: 2.5 },
        fontSize: '0.875rem',
        color: 'text.secondary',
        wordBreak: 'break-words'
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

interface BreadcrumbItemProps {
  children: React.ReactNode;
}

function BreadcrumbItem({ children, ...props }: BreadcrumbItemProps) {
  return (
    <Box
      component="li"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.5
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

interface BreadcrumbLinkProps {
  asChild?: boolean;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

function BreadcrumbLink({ asChild, children, href, onClick, ...props }: BreadcrumbLinkProps) {
  const Comp = asChild ? Slot : Link;

  return (
    <Comp
      href={href}
      onClick={onClick}
      sx={{
        color: 'text.secondary',
        textDecoration: 'none',
        transition: 'color 0.2s ease-in-out',
        '&:hover': {
          color: 'text.primary',
          textDecoration: 'underline'
        }
      }}
      {...props}
    >
      {children}
    </Comp>
  );
}

interface BreadcrumbPageProps {
  children: React.ReactNode;
}

function BreadcrumbPage({ children, ...props }: BreadcrumbPageProps) {
  return (
    <Typography
      component="span"
      role="link"
      aria-disabled="true"
      aria-current="page"
      sx={{
        color: 'text.primary',
        fontWeight: 'normal'
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

interface BreadcrumbSeparatorProps {
  children?: React.ReactNode;
}

function BreadcrumbSeparator({ children, ...props }: BreadcrumbSeparatorProps) {
  return (
    <Box
      component="li"
      role="presentation"
      aria-hidden="true"
      sx={{
        '& svg': {
          width: '0.875rem',
          height: '0.875rem'
        }
      }}
      {...props}
    >
      {children ?? <ChevronRight fontSize="small" />}
    </Box>
  );
}

interface BreadcrumbEllipsisProps {}

function BreadcrumbEllipsis({ ...props }: BreadcrumbEllipsisProps) {
  return (
    <Box
      component="span"
      role="presentation"
      aria-hidden="true"
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
      <Box component="span" sx={{ position: 'absolute', width: 1, height: 1, p: 0, m: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
        More
      </Box>
    </Box>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
