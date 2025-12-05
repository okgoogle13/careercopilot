import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import plant1Image from 'figma:asset/60d51d4687ffa46328cf1da59f22ae280f5aee59.png';
import plant2Image from 'figma:asset/dd72311acb2ef67d2e9a16466295ef751105effb.png';
import plant3Image from 'figma:asset/073e6da465537443f6088e9489a67af4ed8c7605.png';

export interface PlantTask {
  id: string;
  taskName: string;
  plantName: string;
  checked: boolean;
}

export type PlantIllustration = 'plant1' | 'plant2' | 'plant3';

export interface M3PlantCareCardProps {
  title: string;
  tasks: PlantTask[];
  onTaskChange: (taskId: string, checked: boolean) => void;
  illustration?: PlantIllustration;
}

/**
 * M3PlantCareCard - Material 3 Expressive Plant Care Card
 * 
 * Features:
 * - Custom card component with botanical theme
 * - Base: surfaceContainer fill with outlineVariant stroke
 * - Corner radius: 16px
 * - Title uses primary color and h5 typography
 * - Task list with checkboxes (checked state uses primary)
 * - Illustration variants (plant1, plant2, plant3) - actual Figma images
 * - Illustration is layered behind content, bottom-right, 90% opacity
 * 
 * Local Styles Used:
 * - surfaceContainer (#221E26) - Card background
 * - outlineVariant (#4B4452) - Card border
 * - primary (#DAB9FF) - Title color, checkbox checked state
 * - onSurface (#E9E0EB) - Task name color
 * - onSurfaceVariant (#CEC3D4) - Plant name color
 * - Roboto Flex for title (h5)
 * - Roboto for body text
 * 
 * Images:
 * - plant1: figma:asset/60d51d4687ffa46328cf1da59f22ae280f5aee59.png
 * - plant2: figma:asset/dd72311acb2ef67d2e9a16466295ef751105effb.png
 * - plant3: figma:asset/073e6da465537443f6088e9489a67af4ed8c7605.png
 */

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: theme.palette.surface.container,
  border: `1px solid ${theme.palette.outline.variant}`,
  borderRadius: 16,
  boxShadow: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    borderColor: theme.palette.outline.main,
  },
}));

const IllustrationContainer = styled(Box)({
  position: 'absolute',
  bottom: -20,
  right: -20,
  width: 200,
  height: 200,
  opacity: 0.9,
  zIndex: 1,
  pointerEvents: 'none',
});

const ContentContainer = styled(CardContent)({
  position: 'relative',
  zIndex: 2,
  padding: 24,
  '&:last-child': {
    paddingBottom: 24,
  },
});

const TitleText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Roboto Flex", "Roboto", sans-serif',
  fontWeight: 600,
  fontSize: '1.25rem', // h5
  color: theme.palette.primary.main,
  marginBottom: 20,
}));

const TaskCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.outline.main,
  padding: 8,
  '&.Mui-checked': {
    color: theme.palette.primary.main,
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

const TaskNameText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: '1rem', // body1
  fontWeight: 500,
  color: theme.palette.text.primary, // onSurface
}));

const PlantNameText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: '0.875rem', // body2
  fontWeight: 400,
  color: theme.palette.text.secondary, // onSurfaceVariant
  fontStyle: 'italic',
}));

// Botanical illustrations from Figma - actual plant images
const PlantIllustrations = {
  plant1: plant1Image, // Wavy curved leaves
  plant2: plant2Image, // Potted plant with broad leaves
  plant3: plant3Image, // Sharp angular leaves
};

export const M3PlantCareCard: React.FC<M3PlantCareCardProps> = ({
  title,
  tasks,
  onTaskChange,
  illustration = 'plant1',
}) => {
  return (
    <StyledCard>
      {/* Media Layer (z-index: 1) - Botanical Illustration */}
      <IllustrationContainer>
        <img
          src={PlantIllustrations[illustration]}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </IllustrationContainer>

      {/* Content Layer (z-index: 2) */}
      <ContentContainer>
        {/* Title */}
        <TitleText>{title}</TitleText>

        {/* Task List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {tasks.map((task) => (
            <FormControlLabel
              key={task.id}
              control={
                <TaskCheckbox
                  checked={task.checked}
                  onChange={(e) => onTaskChange(task.id, e.target.checked)}
                />
              }
              label={
                <Box sx={{ ml: 1 }}>
                  <TaskNameText>{task.taskName}</TaskNameText>
                  <PlantNameText>{task.plantName}</PlantNameText>
                </Box>
              }
              sx={{
                margin: 0,
                alignItems: 'flex-start',
                '& .MuiFormControlLabel-label': {
                  marginTop: '8px',
                },
              }}
            />
          ))}
        </Box>
      </ContentContainer>
    </StyledCard>
  );
};

export default M3PlantCareCard;
