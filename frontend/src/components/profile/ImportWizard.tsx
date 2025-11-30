import { LinkedIn, Check, Error, Person, Work, School } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import React, { useState } from 'react';

interface ImportWizardProps {
  open: boolean;
  onClose: () => void;
  onImportComplete?: (data: any) => void;
}

interface LinkedInData {
  profile: {
    name: string;
    headline: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    year: string;
  }>;
  skills: string[];
}

const sampleLinkedInData: LinkedInData = {
  profile: {
    name: 'John Doe',
    headline: 'Senior Software Engineer at TechCorp',
    location: 'San Francisco, CA',
    summary: 'Experienced software engineer with 5+ years developing scalable web applications...',
  },
  experience: [
    {
      company: 'TechCorp',
      position: 'Senior Software Engineer',
      duration: '2021 - Present',
      description: 'Led development of scalable web applications using React and Node.js...',
    },
    {
      company: 'StartupInc',
      position: 'Full Stack Developer',
      duration: '2019 - 2021',
      description: 'Built MVP from scratch and implemented CI/CD pipeline...',
    },
  ],
  education: [
    {
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      year: '2019',
    },
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'AWS'],
};

const steps = [
  { label: 'Connect', description: 'Connect to LinkedIn' },
  { label: 'Preview Data', description: 'Review imported information' },
  { label: 'Confirm Import', description: 'Confirm and import data' },
];

export function ImportWizard({ open, onClose, onImportComplete }: ImportWizardProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [linkedInData, setLinkedInData] = useState<LinkedInData | null>(null);
  const [selectedSections, setSelectedSections] = useState({
    profile: true,
    experience: true,
    education: true,
    skills: true,
  });

  const handleNext = () => {
    if (activeStep === 0 && !isConnected) {
      // Simulate LinkedIn connection
      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
        setLinkedInData(sampleLinkedInData);
        setActiveStep(1);
      }, 2000);
    } else if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      // Complete import
      handleImportComplete();
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleImportComplete = () => {
    const importData = {
      ...linkedInData,
      selectedSections,
    };
    onImportComplete?.(importData);
    onClose();
    // Reset state
    setActiveStep(0);
    setIsConnected(false);
    setLinkedInData(null);
  };

  const handleSectionToggle = (section: keyof typeof selectedSections) => {
    setSelectedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ textAlign: 'center', py: 'var(--sys-space-8)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 'var(--sys-space-6)' }}>
              <Box sx={{ p: 'var(--sys-space-6)', backgroundColor: 'var(--sys-color-primary-container)', borderRadius: 'var(--sys-shape-corner-full)' }}>
                <LinkedIn sx={{ fontSize: 'var(--sys-icon-size-xlarge)', color: 'var(--sys-color-on-primary-container)' }} />
              </Box>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 'var(--sys-type-weight-medium)', mb: 'var(--sys-space-4)', color: 'var(--sys-color-on-surface)' }}>
              Connect to LinkedIn
            </Typography>

            <Typography variant="body1" sx={{ mb: 'var(--sys-space-6)', maxWidth: 'md', color: 'var(--sys-color-on-surface-variant)' }}>
              We'll securely import your professional information from LinkedIn to help build your
              profile.
            </Typography>

            {isConnecting && (
              <Box sx={{ mb: 'var(--sys-space-6)' }}>
                <LinearProgress sx={{ mb: 'var(--sys-space-2)' }} />
                <Typography variant="body2" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>
                  Connecting to LinkedIn...
                </Typography>
              </Box>
            )}

            {isConnected && (
              <Alert severity="success" sx={{ mb: 'var(--sys-space-4)' }}>
                Successfully connected to LinkedIn!
              </Alert>
            )}

            <Alert severity="info" sx={{ mb: 'var(--sys-space-6)' }}>
              Your LinkedIn data is processed securely and never stored on our servers.
            </Alert>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ py: 'var(--sys-space-4)' }}>
            <Typography variant="h6" sx={{ fontWeight: 'var(--sys-type-weight-medium)', mb: 'var(--sys-space-4)', color: 'var(--sys-color-on-surface)' }}>
              Preview Imported Data
            </Typography>

            <Typography variant="body2" sx={{ mb: 'var(--sys-space-6)', color: 'var(--sys-color-on-surface-variant)' }}>
              Review the information we found and select what you'd like to import.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--sys-space-4)' }}>
              {/* Profile Section */}
              <Card variant="outlined" sx={{ borderRadius: 'var(--sys-shape-corner-medium)' }}>
                <CardContent sx={{ p: 'var(--sys-space-4)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 'var(--sys-space-3)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-space-2)' }}>
                      <Person sx={{ fontSize: 'var(--sys-icon-size-medium)', color: 'var(--sys-color-primary)' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 'var(--sys-type-weight-medium)', color: 'var(--sys-color-on-surface)' }}>
                        Profile Information
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedSections.profile}
                          onChange={() => handleSectionToggle('profile')}
                        />
                      }
                      label="Import"
                    />
                  </Box>
                  <Box sx={{ color: 'var(--sys-color-on-surface-variant)' }}>
                    <Box>
                      <strong>Name:</strong> {linkedInData?.profile.name}
                    </Box>
                    <Box>
                      <strong>Headline:</strong> {linkedInData?.profile.headline}
                    </Box>
                    <Box>
                      <strong>Location:</strong> {linkedInData?.profile.location}
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Experience Section */}
              <Card variant="outlined" sx={{ borderRadius: 'var(--sys-shape-corner-medium)' }}>
                <CardContent sx={{ p: 'var(--sys-space-4)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 'var(--sys-space-3)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-space-2)' }}>
                      <Work sx={{ fontSize: 'var(--sys-icon-size-medium)', color: 'var(--sys-color-secondary)' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 'var(--sys-type-weight-medium)', color: 'var(--sys-color-on-surface)' }}>
                        Work Experience ({linkedInData?.experience.length} positions)
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedSections.experience}
                          onChange={() => handleSectionToggle('experience')}
                        />
                      }
                      label="Import"
                    />
                  </Box>
                  <List dense>
                    {linkedInData?.experience.slice(0, 2).map((exp, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemText
                          primary={`${exp.position} at ${exp.company}`}
                          secondary={exp.duration}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Education Section */}
              <Card variant="outlined" sx={{ borderRadius: 'var(--sys-shape-corner-medium)' }}>
                <CardContent sx={{ p: 'var(--sys-space-4)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 'var(--sys-space-3)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-space-2)' }}>
                      <School sx={{ fontSize: 'var(--sys-icon-size-medium)', color: 'var(--sys-color-tertiary)' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 'var(--sys-type-weight-medium)', color: 'var(--sys-color-on-surface)' }}>
                        Education ({linkedInData?.education.length} entries)
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedSections.education}
                          onChange={() => handleSectionToggle('education')}
                        />
                      }
                      label="Import"
                    />
                  </Box>
                  <List dense>
                    {linkedInData?.education.map((edu, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemText
                          primary={`${edu.degree} in ${edu.field}`}
                          secondary={`${edu.institution} • ${edu.year}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Skills Section */}
              <Card variant="outlined" sx={{ borderRadius: 'var(--sys-shape-corner-medium)' }}>
                <CardContent sx={{ p: 'var(--sys-space-4)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 'var(--sys-space-3)' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'var(--sys-type-weight-medium)', color: 'var(--sys-color-on-surface)' }}>
                      Skills ({linkedInData?.skills.length} skills)
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedSections.skills}
                          onChange={() => handleSectionToggle('skills')}
                        />
                      }
                      label="Import"
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>
                    {linkedInData?.skills.join(', ')}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 'var(--sys-space-8)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 'var(--sys-space-6)' }}>
              <Box sx={{ p: 'var(--sys-space-6)', backgroundColor: 'var(--sys-color-tertiary-container)', borderRadius: 'var(--sys-shape-corner-full)' }}>
                <Check sx={{ fontSize: 'var(--sys-icon-size-xlarge)', color: 'var(--sys-color-on-tertiary-container)' }} />
              </Box>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 'var(--sys-type-weight-medium)', mb: 'var(--sys-space-4)', color: 'var(--sys-color-on-surface)' }}>
              Ready to Import
            </Typography>

            <Typography variant="body1" sx={{ mb: 'var(--sys-space-6)', color: 'var(--sys-color-on-surface-variant)' }}>
              We're ready to import your selected LinkedIn data to create your profile.
            </Typography>

            <Card variant="outlined" sx={{ mb: 'var(--sys-space-6)', borderRadius: 'var(--sys-shape-corner-medium)' }}>
              <CardContent sx={{ p: 'var(--sys-space-4)' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'var(--sys-type-weight-medium)', mb: 'var(--sys-space-3)', color: 'var(--sys-color-on-surface)' }}>
                  Import Summary
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Check
                        sx={{ fontSize: 'var(--sys-icon-size-medium)', color: selectedSections.profile ? 'var(--sys-color-tertiary)' : 'var(--sys-color-outline)' }}
                      />
                    </ListItemIcon>
                    <ListItemText primary="Profile Information" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Check
                        sx={{ fontSize: 'var(--sys-icon-size-medium)', color: selectedSections.experience ? 'var(--sys-color-tertiary)' : 'var(--sys-color-outline)' }}
                      />
                    </ListItemIcon>
                    <ListItemText primary="Work Experience" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Check
                        sx={{ fontSize: 'var(--sys-icon-size-medium)', color: selectedSections.education ? 'var(--sys-color-tertiary)' : 'var(--sys-color-outline)' }}
                      />
                    </ListItemIcon>
                    <ListItemText primary="Education" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Check
                        sx={{ fontSize: 'var(--sys-icon-size-medium)', color: selectedSections.skills ? 'var(--sys-color-tertiary)' : 'var(--sys-color-outline)' }}
                      />
                    </ListItemIcon>
                    <ListItemText primary="Skills" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Alert severity="info">
              This will create a new profile with your imported LinkedIn data.
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 'var(--sys-shape-corner-large)' } }}>
      <DialogTitle sx={{ p: 'var(--sys-space-6)' }}>
        <Typography variant="h5" sx={{ fontWeight: 'var(--sys-type-weight-medium)', color: 'var(--sys-color-on-surface)' }}>
          Import from LinkedIn
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 'var(--sys-space-6)' }}>
        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 'var(--sys-space-8)' }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'var(--sys-type-weight-medium)' }}>
                    {step.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>
                    {step.description}
                  </Typography>
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        {renderStepContent()}
      </DialogContent>

      <DialogActions sx={{ p: 'var(--sys-space-6)' }}>
        <Button onClick={onClose} disabled={isConnecting} sx={{ color: 'var(--sys-color-primary)' }}>
          Cancel
        </Button>
        <Button onClick={handleBack} disabled={activeStep === 0 || isConnecting} sx={{ color: 'var(--sys-color-primary)' }}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={isConnecting || (activeStep === 0 && !isConnected)}
          sx={{ backgroundColor: 'var(--sys-color-primary)', color: 'var(--sys-color-on-primary)', '&:hover': { backgroundColor: 'var(--sys-color-primary-dark)' } }}
        >
          {isConnecting
            ? 'Connecting...'
            : activeStep === steps.length - 1
              ? 'Import Data'
              : activeStep === 0 && !isConnected
                ? 'Connect to LinkedIn'
                : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
