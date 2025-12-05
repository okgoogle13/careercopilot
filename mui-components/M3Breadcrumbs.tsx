import React from 'react';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChevronRight, Home } from 'lucide-react';

export interface M3BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export interface M3BreadcrumbsProps {
  items: M3BreadcrumbItem[];
  showHomeIcon?: boolean;
  maxItems?: number;
  separator?: React.ReactNode;
}

/**
 * M3Breadcrumbs - Material 3 Expressive Breadcrumbs
 * 
 * Features:
 * - Based on MUI Breadcrumbs
 * - Uses Material Theme Builder tokens
 * - Links use onSurfaceVariant style
 * - Current page (last item) uses onSurface style
 * - Hover states use primary color
 * 
 * Local Styles Used:
 * - onSurfaceVariant (#CEC3D4) - Breadcrumb links
 * - onSurface (#E9E0EB) - Current page (active)
 * - primary (#DAB9FF) - Hover state
 * - Roboto font family
 */

const StyledBreadcrumbs = styled(MuiBreadcrumbs)(({ theme }) => ({
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  '& .MuiBreadcrumbs-separator': {
    color: theme.palette.text.secondary,
    margin: '0 8px',
  },
  '& .MuiBreadcrumbs-ol': {
    flexWrap: 'wrap',
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: theme.palette.text.secondary, // onSurfaceVariant
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 8px',
  borderRadius: 8,
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    textDecoration: 'none',
  },
  '&:active': {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
  },
}));

const CurrentPageText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.palette.text.primary, // onSurface
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 8px',
}));

export const M3Breadcrumbs: React.FC<M3BreadcrumbsProps> = ({
  items,
  showHomeIcon = true,
  maxItems = 8,
  separator,
}) => {
  const renderBreadcrumb = (item: M3BreadcrumbItem, index: number) => {
    const isLast = index === items.length - 1;
    const icon = item.icon || (index === 0 && showHomeIcon ? <Home size={16} /> : null);

    if (isLast) {
      // Current page - not clickable
      return (
        <CurrentPageText key={index}>
          {icon}
          {item.label}
        </CurrentPageText>
      );
    }

    // Clickable link
    return (
      <StyledLink
        key={index}
        href={item.href}
        onClick={(e) => {
          if (item.onClick) {
            e.preventDefault();
            item.onClick();
          }
        }}
      >
        {icon}
        {item.label}
      </StyledLink>
    );
  };

  return (
    <Box sx={{ py: 1 }}>
      <StyledBreadcrumbs
        maxItems={maxItems}
        separator={
          separator || <ChevronRight size={16} style={{ marginTop: 2 }} />
        }
        aria-label="breadcrumb"
      >
        {items.map((item, index) => renderBreadcrumb(item, index))}
      </StyledBreadcrumbs>
    </Box>
  );
};

export default M3Breadcrumbs;
