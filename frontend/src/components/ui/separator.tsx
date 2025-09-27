import React from 'react';
import { Divider, DividerProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.divider,
}));

export interface SeparatorProps extends DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(
  ({ orientation = 'horizontal', className, ...props }, ref) => {
    return <StyledDivider ref={ref} orientation={orientation} className={className} {...props} />;
  }
);

Separator.displayName = 'Separator';
