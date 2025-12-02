import React, { useState } from 'react';
import { Box, Typography, Button, Container, alpha, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PsychologyIcon from '@mui/icons-material/Psychology';
import type { Profile } from './types';
import { ProfileCard } from './ProfileCardMUI';
import { CreateProfileCard } from './CreateProfileCard';

const mockProfiles: Profile[] = [
  { id: '1', name: 'Nishant Dougall', role: 'Community Support Worker', activeApplications: 8, atsScore: 87, lastUpdated: '2 days ago', avatarColor: 'primary.light' },
  { id: '2', name: 'Senior Developer', role: 'React & TypeScript', activeApplications: 5, atsScore: 92, lastUpdated: '1 week ago', avatarColor: 'secondary.light' },
];

export interface DashboardProps {
  onCreateProfile: () => void;
  onEditProfile: (profile: Profile) => void;
  onNavigateToCareerGrowth?: () => void;
  onNavigateToSettings?: () => void;
  isEmpty?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ onCreateProfile, onEditProfile, onNavigateToCareerGrowth, onNavigateToSettings, isEmpty = false }) => {
  const [profiles, setProfiles] = useState(isEmpty ? [] : mockProfiles);

  const handleDeleteProfile = (id: string) => setProfiles(profiles.filter((p) => p.id !== id));

  if (isEmpty || profiles.length === 0) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 15, borderRadius: 3, border: 2, borderStyle: 'dashed', borderColor: (theme) => alpha(theme.palette.primary.main, 0.3), bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04), textAlign: 'center' }}>
          <Box sx={{ p: 3, borderRadius: '50%', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12), mb: 3 }}>
            <PsychologyIcon sx={{ fontSize: 48, color: (theme) => theme.palette.primary.light }} />
          </Box>
          <Typography variant="h4" sx={{ fontFamily: '"Roboto Flex", "Roboto", serif', fontWeight: 700, mb: 2, background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Ready to Launch Your Career?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mb: 4 }}>
            Create your first AI-optimized resume or cover letter to start landing more interviews.
          </Typography>
          <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={onCreateProfile} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', px: 4, py: 1.5, fontWeight: 600 }}>
            Create Your First Document
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 6 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: '"Roboto Flex", "Roboto", serif', fontWeight: 700, mb: 1 }}>
            Career Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">Manage your job search with AI-powered insights</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3, mb: 6 }}>
        {/* Stat cards could go here */}
      </Box>

      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontFamily: '"Roboto Flex", "Roboto", serif', fontWeight: 700 }}>
            Your Profiles
          </Typography>
        </Box>
        <Box sx={{
          display: 'grid',
          gap: 24,
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)'
          }
        }}>
          {profiles.map((profile, index) => {
            // Alternate between different plant images for variety
            const plantImages = [
              '/assets/decor/plant_vines.png',
              '/assets/decor/plant_tall.png',
              '/assets/decor/plant_leafy.png'
            ];
            const decorImage = plantImages[index % plantImages.length];
            
            return (
              <Box key={profile.id}>
                <ProfileCard 
                  {...profile} 
                  onEdit={() => onEditProfile(profile)} 
                  onDelete={() => handleDeleteProfile(profile.id)}
                  decorImage={decorImage} // Add decorative plant image
                />
              </Box>
            );
          })}
          <Box>
            <CreateProfileCard onCreate={onCreateProfile} />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
