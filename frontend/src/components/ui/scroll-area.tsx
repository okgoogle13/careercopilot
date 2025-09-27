import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledScrollArea = styled(Box)(({ theme }) => ({
  overflow: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: `${theme.palette.grey[400]} transparent`,
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[400],
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: theme.palette.grey[500],
    },
  },
}));

export interface ScrollAreaProps extends BoxProps {}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ children, ...props }, ref) => {
    return (
      <StyledScrollArea ref={ref} {...props}>
        {children}
      </StyledScrollArea>
    );
  }
);

ScrollArea.displayName = 'ScrollArea';
