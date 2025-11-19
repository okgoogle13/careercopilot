import { Work } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

interface CareerCopilotLogoProps {
  className?: string;
  size?: number;
  variant?: 'full' | 'compact';
  sx?: SxProps<Theme>;
}

export function CareerCopilotLogo({
  className = '',
  size = 32,
  variant = 'full',
  sx,
}: CareerCopilotLogoProps) {
  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        ...sx,
      }}
    >
      <Work sx={{ fontSize: size, color: 'primary.main' }} />
      {variant === 'full' && (
        <Typography
          variant="h6"
          component="span"
          sx={{
            fontWeight: 600,
            color: 'primary.main',
            fontSize: size / 2,
          }}
        >
          Career Copilot
        </Typography>
      )}
    </Box>
  );
}
