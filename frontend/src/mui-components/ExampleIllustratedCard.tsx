import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  minHeight: 200,
  display: 'flex',
  flexDirection: 'column',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '45%',
    height: '55%',
    backgroundImage: 'var(--illustration-url, none)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'bottom right',
    backgroundSize: 'contain',
    opacity: 0.8,
    pointerEvents: 'none',
    zIndex: 1,
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 24px ${theme.palette.primary.main}1a`,
  },
  transition: 'all 0.3s ease-in-out',
}));

interface ExampleIllustratedCardProps {
  title: string;
  description: string;
  illustration: string;
  actionText?: string;
  onAction?: () => void;
}

export const ExampleIllustratedCard: React.FC<ExampleIllustratedCardProps> = ({
  title,
  description,
  illustration,
  actionText = 'Learn More',
  onAction,
}) => {
  return (
    <StyledCard 
      variant="outlined"
      sx={{ '--illustration-url': `url(${illustration})` }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {description}
        </Typography>
        {onAction && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="small" onClick={onAction}>
              {actionText}
            </Button>
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default ExampleIllustratedCard;
