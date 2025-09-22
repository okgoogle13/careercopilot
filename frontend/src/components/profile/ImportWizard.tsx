import React, { useState } from 'react';
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
  ListItemIcon
} from '@mui/material';
import { Linkedin, Check, AlertCircle, User, Briefcase, GraduationCap } from 'lucide-react';

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
    summary: 'Experienced software engineer with 5+ years developing scalable web applications...'
  },
  experience: [
    {
      company: 'TechCorp',
      position: 'Senior Software Engineer',
      duration: '2021 - Present',
      description: 'Led development of scalable web applications using React and Node.js...'
    },
    {
      company: 'StartupInc',
      position: 'Full Stack Developer',
      duration: '2019 - 2021',
      description: 'Built MVP from scratch and implemented CI/CD pipeline...'
    }
  ],
  education: [
    {
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      year: '2019'
    }
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'AWS']
};

const steps = [
  { label: 'Connect', description: 'Connect to LinkedIn' },
  { label: 'Preview Data', description: 'Review imported information' },
  { label: 'Confirm Import', description: 'Confirm and import data' }
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
    skills: true
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
      selectedSections
    };
    onImportComplete?.(importData);
    onClose();
    // Reset state
    setActiveStep(0);
    setIsConnected(false);
    setLinkedInData(null);
  };

  const handleSectionToggle = (section: keyof typeof selectedSections) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box className="text-center py-8">
            <Box className="flex justify-center mb-6">
              <Box className="p-6 bg-blue-100 rounded-full">
                <Linkedin size={48} className="text-blue-600" />
              </Box>
            </Box>

            <Typography variant="h5" className="font-semibold mb-4">
              Connect to LinkedIn
            </Typography>

            <Typography variant="body1" color="text.secondary" className="mb-6 max-w-md mx-auto">
              We'll securely import your professional information from LinkedIn to help build your profile.
            </Typography>

            {isConnecting && (
              <Box className="mb-6">
                <LinearProgress className="mb-2" />
                <Typography variant="body2" color="text.secondary">
                  Connecting to LinkedIn...
                </Typography>
              </Box>
            )}

            {isConnected && (
              <Alert severity="success" className="mb-4">
                Successfully connected to LinkedIn!
              </Alert>
            )}

            <Alert severity="info" className="mb-6">
              Your LinkedIn data is processed securely and never stored on our servers.
            </Alert>
          </Box>
        );

      case 1:
        return (
          <Box className="py-4">
            <Typography variant="h6" className="font-semibold mb-4">
              Preview Imported Data
            </Typography>

            <Typography variant="body2" color="text.secondary" className="mb-6">
              Review the information we found and select what you'd like to import.
            </Typography>

            <Box className="space-y-4">
              {/* Profile Section */}
              <Card variant="outlined">
                <CardContent className="p-4">
                  <Box className="flex items-center justify-between mb-3">
                    <Box className="flex items-center gap-2">
                      <User size={20} className="text-blue-600" />
                      <Typography variant="subtitle1" className="font-semibold">
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
                  <Box className="space-y-2 text-sm">
                    <Box><strong>Name:</strong> {linkedInData?.profile.name}</Box>
                    <Box><strong>Headline:</strong> {linkedInData?.profile.headline}</Box>
                    <Box><strong>Location:</strong> {linkedInData?.profile.location}</Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Experience Section */}
              <Card variant="outlined">
                <CardContent className="p-4">
                  <Box className="flex items-center justify-between mb-3">
                    <Box className="flex items-center gap-2">
                      <Briefcase size={20} className="text-green-600" />
                      <Typography variant="subtitle1" className="font-semibold">
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
                      <ListItem key={index} className="px-0">
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
              <Card variant="outlined">
                <CardContent className="p-4">
                  <Box className="flex items-center justify-between mb-3">
                    <Box className="flex items-center gap-2">
                      <GraduationCap size={20} className="text-purple-600" />
                      <Typography variant="subtitle1" className="font-semibold">
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
                      <ListItem key={index} className="px-0">
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
              <Card variant="outlined">
                <CardContent className="p-4">
                  <Box className="flex items-center justify-between mb-3">
                    <Typography variant="subtitle1" className="font-semibold">
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
                  <Typography variant="body2" color="text.secondary">
                    {linkedInData?.skills.join(', ')}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box className="text-center py-8">
            <Box className="flex justify-center mb-6">
              <Box className="p-6 bg-green-100 rounded-full">
                <Check size={48} className="text-green-600" />
              </Box>
            </Box>

            <Typography variant="h5" className="font-semibold mb-4">
              Ready to Import
            </Typography>

            <Typography variant="body1" color="text.secondary" className="mb-6">
              We're ready to import your selected LinkedIn data to create your profile.
            </Typography>

            <Card variant="outlined" className="mb-6">
              <CardContent className="p-4">
                <Typography variant="subtitle1" className="font-semibold mb-3">
                  Import Summary
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Check size={16} className={selectedSections.profile ? 'text-green-600' : 'text-gray-400'} />
                    </ListItemIcon>
                    <ListItemText primary="Profile Information" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Check size={16} className={selectedSections.experience ? 'text-green-600' : 'text-gray-400'} />
                    </ListItemIcon>
                    <ListItemText primary="Work Experience" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Check size={16} className={selectedSections.education ? 'text-green-600' : 'text-gray-400'} />
                    </ListItemIcon>
                    <ListItemText primary="Education" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Check size={16} className={selectedSections.skills ? 'text-green-600' : 'text-gray-400'} />
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" className="font-semibold">
          Import from LinkedIn
        </Typography>
      </DialogTitle>

      <DialogContent>
        {/* Stepper */}
        <Stepper activeStep={activeStep} className="mb-8">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Box>
                  <Typography variant="body2" className="font-medium">
                    {step.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
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

      <DialogActions className="p-6">
        <Button onClick={onClose} disabled={isConnecting}>
          Cancel
        </Button>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || isConnecting}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={isConnecting || (activeStep === 0 && !isConnected)}
          className="bg-primary hover:bg-primary/90"
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