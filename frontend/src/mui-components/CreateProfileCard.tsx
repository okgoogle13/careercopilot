import React from 'react';
import { Box, Typography, Button, Card, CardContent, alpha } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export interface CreateProfileCardProps { onCreate: () => void; }

export const CreateProfileCard: React.FC<CreateProfileCardProps> = ({ onCreate }) => {
  return (
    <Card onClick={onCreate} sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', borderStyle: 'dashed', borderWidth: 2, borderColor: alpha('#A78BFA', 0.3), bgcolor: alpha('#A78BFA', 0.04), '&:hover': { borderColor: 'primary.main', bgcolor: alpha('#A78BFA', 0.08) } }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 3, p: 4 }}>
        <Box sx={{ position: 'relative' }}>
          <Box sx={{ width: 64, height: 64, borderRadius: 3, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s' }}>
            <AddIcon sx={{ fontSize: 32, color: '#A78BFA' }} />
          </Box>
          <Box sx={{ position: 'absolute', top: -4, right: -4, width: 24, height: 24, borderRadius: '50%', background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.tertiary.main})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AutoAwesomeIcon sx={{ fontSize: 12, color: 'white' }} />
          </Box>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontFamily: '"Roboto Flex", "Roboto", serif', fontWeight: 700, mb: 1 }}>Create New Document</Typography>
          <Typography variant="body2" color="text.secondary">Build an AI-optimized resume or cover letter from scratch.</Typography>
        </Box>
        <Button variant="text" onClick={(e) => { e.stopPropagation(); onCreate(); }}>Get Started</Button>
      </CardContent>
    </Card>
  );
};
