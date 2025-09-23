'use client';

import * as React from 'react';
import {
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  AccordionProps as MuiAccordionProps
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

interface AccordionProps extends Omit<MuiAccordionProps, 'children'> {
  children?: React.ReactNode;
  type?: 'single' | 'multiple';
  collapsible?: boolean;
}

function Accordion({ children, type = 'single', collapsible = false, ...props }: AccordionProps) {
  const commonProps = {
    disableGutters: true,
    elevation: 0,
    square: true,
    sx: {
      '&:not(:last-child)': {
        borderBottom: 1,
        borderColor: 'divider'
      },
      '&::before': {
        display: 'none'
      }
    }
  };

  if (type === 'multiple') {
    return (
      <Box {...props}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement, commonProps);
          }
          return child;
        })}
      </Box>
    );
  }

  return (
    <Box {...props}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement, {
            ...commonProps,
            key: index
          });
        }
        return child;
      })}
    </Box>
  );
}

interface AccordionItemProps extends MuiAccordionProps {
  value?: string;
}

function AccordionItem({ children, value, ...props }: AccordionItemProps) {
  return (
    <MuiAccordion
      disableGutters
      elevation={0}
      square
      sx={{
        '&:not(:last-child)': {
          borderBottom: 1,
          borderColor: 'divider'
        },
        '&::before': {
          display: 'none'
        }
      }}
      {...props}
    >
      {children}
    </MuiAccordion>
  );
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  expandIcon?: React.ReactNode;
}

function AccordionTrigger({ children, expandIcon = <ExpandMore />, ...props }: AccordionTriggerProps) {
  return (
    <AccordionSummary
      expandIcon={expandIcon}
      sx={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 2,
        py: 2,
        '&:hover': {
          textDecoration: 'underline'
        },
        '&.Mui-focusVisible': {
          outline: '3px solid',
          outlineColor: 'primary.main',
          outlineOffset: 1
        },
        '& .MuiAccordionSummary-content': {
          margin: 0,
          flexGrow: 1
        }
      }}
      {...props}
    >
      <Typography
        component="div"
        sx={{
          fontSize: '0.875rem',
          fontWeight: 500,
          textAlign: 'left'
        }}
      >
        {children}
      </Typography>
    </AccordionSummary>
  );
}

interface AccordionContentProps {
  children: React.ReactNode;
}

function AccordionContent({ children, ...props }: AccordionContentProps) {
  return (
    <AccordionDetails
      sx={{
        pt: 0,
        pb: 2,
        fontSize: '0.875rem',
        overflow: 'hidden'
      }}
      {...props}
    >
      {children}
    </AccordionDetails>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
