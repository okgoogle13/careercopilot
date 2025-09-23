import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Chip,
  Stack,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Badge,
  Avatar,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Add,
  Upload,
  Download,
  Share,
  Edit,
  Delete,
  Save,
  Refresh,
  CheckCircle,
  Warning,
  Info,
  School,
  Work,
  Build,
  Star,
  AutoAwesome,
  Psychology,
  TipsAndUpdates,
  Assignment,
  AssignmentTurnedIn,
  ExpandMore,
  ContentCopy,
  Visibility,
  VisibilityOff,
  SendTimeExtension,
  Schedule,
  Timer,
  Analytics,
  Lightbulb,
  QuestionAnswer,
  SmartToy,
} from '@mui/icons-material';

interface KscCriterion {
  id: string;
  title: string;
  description: string;
  category: 'essential' | 'desirable';
  isCompleted: boolean;
  response?: string;
  wordCount?: number;
  suggestedLength: number;
  examples?: string[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`ksc-tabpanel-${index}`}
      aria-labelledby={`ksc-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

interface KscGeneratorPageProps {
  onSave?: (responses: any) => void;
  onExport?: () => void;
  onImport?: () => void;
}

export function KscGeneratorPage({ onSave, onExport, onImport }: KscGeneratorPageProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [jobDescription, setJobDescription] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedCriterion, setSelectedCriterion] = useState<string | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [showGuidance, setShowGuidance] = useState(true);

  // Sample KSC criteria
  const [criteria, setCriteria] = useState<KscCriterion[]>([
    {
      id: '1',
      title: 'Demonstrated experience in software development',
      description: 'Minimum 3 years experience in full-stack development with modern frameworks',
      category: 'essential',
      isCompleted: false,
      suggestedLength: 300,
      examples: [
        'Developed web applications using React and Node.js',
        'Built REST APIs with Express.js',
        'Implemented database designs with PostgreSQL',
      ],
    },
    {
      id: '2',
      title: 'Strong communication and collaboration skills',
      description:
        'Ability to work effectively in cross-functional teams and communicate technical concepts',
      category: 'essential',
      isCompleted: false,
      suggestedLength: 250,
      examples: [
        'Led technical presentations to stakeholders',
        'Mentored junior developers',
        'Collaborated with UX/UI designers',
      ],
    },
    {
      id: '3',
      title: 'Experience with cloud platforms and DevOps',
      description: 'Knowledge of AWS, Docker, and CI/CD pipelines',
      category: 'desirable',
      isCompleted: false,
      suggestedLength: 200,
      examples: [
        'Deployed applications on AWS EC2',
        'Set up Docker containers for development',
        'Configured GitHub Actions for CI/CD',
      ],
    },
    {
      id: '4',
      title: 'Agile methodology and project management experience',
      description: 'Experience working in Agile/Scrum environments',
      category: 'desirable',
      isCompleted: false,
      suggestedLength: 200,
      examples: [
        'Participated in daily standups and sprint planning',
        'Used Jira for project tracking',
        'Contributed to retrospectives and process improvements',
      ],
    },
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleExtractCriteria = async () => {
    setExtracting(true);
    // Simulate API call
    setTimeout(() => {
      setExtracting(false);
      setActiveStep(1);
    }, 2000);
  };

  const handleGenerateResponse = async (criterionId: string) => {
    setGenerating(true);
    setSelectedCriterion(criterionId);

    // Simulate AI generation
    setTimeout(() => {
      setCriteria((prev) =>
        prev.map((c) =>
          c.id === criterionId
            ? {
                ...c,
                response:
                  'Generated response based on your profile and the job requirements. This response demonstrates relevant experience and skills that align with the specified criterion.',
                wordCount: 280,
                isCompleted: true,
              }
            : c
        )
      );
      setGenerating(false);
      setSelectedCriterion(null);
    }, 3000);
  };

  const handleUpdateResponse = (criterionId: string, response: string) => {
    setCriteria((prev) =>
      prev.map((c) =>
        c.id === criterionId
          ? {
              ...c,
              response,
              wordCount: response.split(' ').length,
              isCompleted: response.trim().length > 0,
            }
          : c
      )
    );
  };

  const getCompletionPercentage = () => {
    const completed = criteria.filter((c) => c.isCompleted).length;
    return Math.round((completed / criteria.length) * 100);
  };

  const getWordCountColor = (wordCount: number, suggested: number) => {
    const ratio = wordCount / suggested;
    if (ratio < 0.7) return 'error';
    if (ratio > 1.3) return 'warning';
    return 'success';
  };

  const steps = [
    {
      label: 'Upload Job Description',
      description: 'Paste or upload the job description to extract KSC criteria',
    },
    {
      label: 'Review Criteria',
      description: 'Review and customize the extracted selection criteria',
    },
    {
      label: 'Generate Responses',
      description: 'Use AI to generate responses or write your own',
    },
    {
      label: 'Review & Export',
      description: 'Review all responses and export your completed KSC document',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight={600}>
            KSC Generator
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<Upload />} onClick={onImport}>
              Import
            </Button>
            <Button variant="contained" startIcon={<Download />} onClick={onExport}>
              Export
            </Button>
          </Stack>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Generate professional Key Selection Criteria responses with AI assistance
        </Typography>
      </Box>

      {/* Progress Overview */}
      <Card elevation={0} sx={{ border: 1, borderColor: 'divider', mb: 4 }}>
        <CardContent>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h6" fontWeight={600}>
              Progress Overview
            </Typography>
            <Chip
              label={`${getCompletionPercentage()}% Complete`}
              color={getCompletionPercentage() === 100 ? 'success' : 'primary'}
              icon={<Assignment />}
            />
          </Box>

          <LinearProgress
            variant="determinate"
            value={getCompletionPercentage()}
            sx={{ height: 8, borderRadius: 4, mb: 2 }}
          />

          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={600} color="primary.main">
                  {criteria.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Criteria
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={600} color="success.main">
                  {criteria.filter((c) => c.isCompleted).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={600} color="warning.main">
                  {criteria.filter((c) => c.category === 'essential').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Essential
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={600} color="info.main">
                  {criteria.filter((c) => c.category === 'desirable').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Desirable
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          {/* Step Navigation */}
          <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, mb: 4 }}>
            <Box sx={{ p: 3 }}>
              <Stepper activeStep={activeStep} orientation="horizontal" alternativeLabel>
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel>{step.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Paper>

          {/* Step Content */}
          {activeStep === 0 && (
            <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
              <Box sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Job Description Analysis
                </Typography>

                <TextField
                  fullWidth
                  multiline
                  rows={12}
                  label="Paste Job Description"
                  placeholder="Paste the complete job description here to automatically extract Key Selection Criteria..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  sx={{ mb: 3 }}
                />

                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {jobDescription.length} characters
                  </Typography>

                  <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<Upload />}>
                      Upload File
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={
                        extracting ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <AutoAwesome />
                        )
                      }
                      onClick={handleExtractCriteria}
                      disabled={!jobDescription.trim() || extracting}
                    >
                      {extracting ? 'Extracting...' : 'Extract Criteria'}
                    </Button>
                  </Stack>
                </Box>

                {extracting && (
                  <Alert severity="info" sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Analyzing Job Description
                    </Typography>
                    <Typography variant="body2">
                      AI is extracting Key Selection Criteria from the job description...
                    </Typography>
                  </Alert>
                )}
              </Box>
            </Paper>
          )}

          {activeStep >= 1 && (
            <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
              {/* Criteria Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 3 }}>
                  <Tab
                    label={`All Criteria (${criteria.length})`}
                    sx={{ textTransform: 'none', fontWeight: 500 }}
                  />
                  <Tab
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        Essential
                        <Chip
                          size="small"
                          label={criteria.filter((c) => c.category === 'essential').length}
                          color="warning"
                        />
                      </Box>
                    }
                    sx={{ textTransform: 'none', fontWeight: 500 }}
                  />
                  <Tab
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        Desirable
                        <Chip
                          size="small"
                          label={criteria.filter((c) => c.category === 'desirable').length}
                          color="info"
                        />
                      </Box>
                    }
                    sx={{ textTransform: 'none', fontWeight: 500 }}
                  />
                </Tabs>
              </Box>

              {/* Criteria Content */}
              <TabPanel value={tabValue} index={0}>
                <Box sx={{ p: 3 }}>
                  {criteria.map((criterion, index) => (
                    <Accordion key={criterion.id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', pr: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Typography variant="h6" fontWeight={600}>
                                {criterion.title}
                              </Typography>
                              <Chip
                                size="small"
                                label={criterion.category}
                                color={criterion.category === 'essential' ? 'warning' : 'info'}
                              />
                              {criterion.isCompleted && (
                                <CheckCircle color="success" fontSize="small" />
                              )}
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {criterion.description}
                            </Typography>
                          </Box>
                        </Box>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Grid container spacing={3}>
                          {/* Response Editor */}
                          <Grid item xs={12} md={8}>
                            <Box sx={{ mb: 2 }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  mb: 2,
                                }}
                              >
                                <Typography variant="subtitle2">Your Response</Typography>
                                <Stack direction="row" spacing={1}>
                                  <Button
                                    size="small"
                                    startIcon={
                                      generating && selectedCriterion === criterion.id ? (
                                        <CircularProgress size={16} color="inherit" />
                                      ) : (
                                        <SmartToy />
                                      )
                                    }
                                    onClick={() => handleGenerateResponse(criterion.id)}
                                    disabled={generating}
                                  >
                                    {generating && selectedCriterion === criterion.id
                                      ? 'Generating...'
                                      : 'AI Generate'}
                                  </Button>
                                  <IconButton size="small">
                                    <ContentCopy />
                                  </IconButton>
                                </Stack>
                              </Box>

                              <TextField
                                fullWidth
                                multiline
                                rows={8}
                                placeholder="Write your response here or use AI generation..."
                                value={criterion.response || ''}
                                onChange={(e) => handleUpdateResponse(criterion.id, e.target.value)}
                              />

                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  mt: 1,
                                }}
                              >
                                <Typography variant="caption" color="text.secondary">
                                  Suggested: {criterion.suggestedLength} words
                                </Typography>
                                {criterion.wordCount && (
                                  <Chip
                                    size="small"
                                    label={`${criterion.wordCount} words`}
                                    color={
                                      getWordCountColor(
                                        criterion.wordCount,
                                        criterion.suggestedLength
                                      ) as any
                                    }
                                  />
                                )}
                              </Box>
                            </Box>
                          </Grid>

                          {/* Guidance and Examples */}
                          <Grid item xs={12} md={4}>
                            <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                              <CardContent>
                                <Typography variant="subtitle2" gutterBottom>
                                  <Lightbulb sx={{ mr: 1, fontSize: 16 }} />
                                  Writing Tips
                                </Typography>
                                <List dense>
                                  <ListItem>
                                    <ListItemText
                                      primary="Use STAR method"
                                      secondary="Situation, Task, Action, Result"
                                    />
                                  </ListItem>
                                  <ListItem>
                                    <ListItemText
                                      primary="Be specific"
                                      secondary="Include concrete examples and metrics"
                                    />
                                  </ListItem>
                                  <ListItem>
                                    <ListItemText
                                      primary="Stay relevant"
                                      secondary="Focus on experiences that match the criterion"
                                    />
                                  </ListItem>
                                </List>

                                {criterion.examples && (
                                  <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                      Example Points:
                                    </Typography>
                                    {criterion.examples.map((example, idx) => (
                                      <Chip
                                        key={idx}
                                        label={example}
                                        size="small"
                                        variant="outlined"
                                        sx={{ mr: 1, mb: 1 }}
                                      />
                                    ))}
                                  </Box>
                                )}
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Box sx={{ p: 3 }}>
                  {criteria
                    .filter((c) => c.category === 'essential')
                    .map((criterion) => (
                      // Same accordion structure as above
                      <Typography key={criterion.id}>Essential criteria content...</Typography>
                    ))}
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Box sx={{ p: 3 }}>
                  {criteria
                    .filter((c) => c.category === 'desirable')
                    .map((criterion) => (
                      // Same accordion structure as above
                      <Typography key={criterion.id}>Desirable criteria content...</Typography>
                    ))}
                </Box>
              </TabPanel>

              {/* Action Bar */}
              <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Button
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={() => setPreviewDialogOpen(true)}
                  >
                    Preview Document
                  </Button>

                  <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<Save />} onClick={onSave}>
                      Save Draft
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      onClick={onExport}
                      disabled={getCompletionPercentage() < 100}
                    >
                      Export Completed KSC
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Paper>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Quick Stats */}
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quick Stats
              </Typography>

              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Completion Rate</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {getCompletionPercentage()}%
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Total Word Count</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {criteria.reduce((sum, c) => sum + (c.wordCount || 0), 0)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Estimated Time</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {Math.max(
                      1,
                      Math.ceil(
                        (criteria.length - criteria.filter((c) => c.isCompleted).length) * 15
                      )
                    )}{' '}
                    min
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* AI Assistant */}
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                AI Assistant
              </Typography>

              <Stack spacing={2}>
                <Button fullWidth variant="outlined" startIcon={<Psychology />} size="small">
                  Analyze All Criteria
                </Button>
                <Button fullWidth variant="outlined" startIcon={<TipsAndUpdates />} size="small">
                  Get Writing Tips
                </Button>
                <Button fullWidth variant="outlined" startIcon={<Analytics />} size="small">
                  Check Quality
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Activity
              </Typography>

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Completed criteria 1" secondary="2 minutes ago" />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Edit color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Edited response for criteria 2"
                    secondary="5 minutes ago"
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <AutoAwesome color="warning" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Generated AI response" secondary="10 minutes ago" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>KSC Document Preview</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Preview of your completed Key Selection Criteria responses
          </Typography>

          {criteria.map((criterion) => (
            <Box key={criterion.id} sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {criterion.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {criterion.description}
              </Typography>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2">
                  {criterion.response || 'No response written yet.'}
                </Typography>
              </Paper>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<Download />}>
            Export PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
