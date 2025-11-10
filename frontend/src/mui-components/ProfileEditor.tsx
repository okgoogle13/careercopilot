import React from 'react';
import { Box, Typography, Button, Container, Card, CardContent, TextField, CircularProgress, alpha } from '@mui/material';
import Grid from '@mui/material/Grid';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export interface ProfileEditorProps { profile?: any; onNext: () => void; onBack: () => void; }

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onNext, onBack }) => {
  const [isGenerating, setIsGenerating] = React.useState(false);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" sx={{ fontFamily: '"Roboto Flex", "Roboto", serif', fontWeight: 700, mb: 1 }}>Review Your Profile</Typography>
          <Typography variant="body1" color="text.secondary">AI-extracted information from your uploaded documents. Review and enhance below.</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ p: 1.5, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12), borderRadius: 2 }}>
                    <PersonIcon sx={{ fontSize: 20, color: '#A78BFA' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontFamily: '"Roboto Flex", "Roboto", serif', fontWeight: 700 }}>Personal Information</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}><TextField fullWidth label="Full Name" defaultValue="Nishant Dougall" /></Grid>
                  <Grid item xs={12}><TextField fullWidth label="Email" defaultValue="nishant.dougall@email.com" /></Grid>
                  <Grid item xs={12}><TextField fullWidth label="Phone" defaultValue="+61 4XX XXX XXX" /></Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ p: 1.5, bgcolor: (theme) => alpha(theme.palette.tertiary.main, 0.12), borderRadius: 2 }}>
                    <WorkIcon sx={{ fontSize: 20, color: '#F472B6' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontFamily: '"Roboto Flex", "Roboto", serif', fontWeight: 700 }}>Experience</Typography>
                </Box>
                <TextField fullWidth label="Professional Summary" multiline rows={4} placeholder="Your summary..." />
                <Button variant="outlined" size="small" startIcon={isGenerating ? <CircularProgress size={14} /> : <AutoAwesomeIcon sx={{ fontSize: 14 }} />} sx={{ mt: 2 }}>
                  Generate with AI
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBack}>Back</Button>
          <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={onNext}>Save & Continue</Button>
        </Box>
      </Container>
    </Box>
  );
};
