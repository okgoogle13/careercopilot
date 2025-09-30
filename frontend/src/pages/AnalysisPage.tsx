import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Chip,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Badge,
} from '@mui/material';
import Grid from '@mui/material';
import {
  Analytics,
  TrendingUp,
  Assessment,
  Speed,
  Description,
  CheckCircle,
  Warning,
  Error,
  Info,
  Refresh,
  Download,
  Share,
  MoreVert,
  Timeline,
  DonutLarge,
  BarChart,
  ShowChart,
  PieChart,
  InsertChart,
  Visibility,
  ThumbUp,
  ThumbDown,
  Star,
  School,
  Work,
  Build,
} from '@mui/icons-material';

interface AnalysisReport {
  id: string;
  documentName: string;
  type: 'resume' | 'cover-letter' | 'ksc';
  atsScore: number;
  analysisDate: string;
  status: 'completed' | 'pending' | 'failed';
  insights: {
    keywords: number;
    skills: number;
    experience: number;
    education: number;
  };
  recommendations: string[];
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
      id={`analysis-tabpanel-${index}`}
      aria-labelledby={`analysis-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </Box>
  );
}

interface AnalysisPageProps {
  isEmpty?: boolean;
  onRunAnalysis?: () => void;
  onViewReport?: (report: AnalysisReport) => void;
}

export function AnalysisPage({ isEmpty = false, onRunAnalysis, onViewReport }: AnalysisPageProps) {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReport, setSelectedReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, report: AnalysisReport) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRunAnalysis?.();
    }, 2000);
  };

  // Sample data
  const analysisReports: AnalysisReport[] = [
    {
      id: '1',
      documentName: 'Senior Software Developer Resume',
      type: 'resume',
      atsScore: 85,
      analysisDate: '2 hours ago',
      status: 'completed',
      insights: {
        keywords: 12,
        skills: 8,
        experience: 6,
        education: 3,
      },
      recommendations: [
        'Add more industry-specific keywords',
        'Quantify achievements with numbers',
        'Include relevant certifications',
      ],
    },
    {
      id: '2',
      documentName: 'Product Manager Cover Letter',
      type: 'cover-letter',
      atsScore: 92,
      analysisDate: '1 day ago',
      status: 'completed',
      insights: {
        keywords: 15,
        skills: 10,
        experience: 8,
        education: 2,
      },
      recommendations: [
        'Excellent keyword optimization',
        'Strong narrative flow',
        'Well-aligned with job requirements',
      ],
    },
    {
      id: '3',
      documentName: 'UX Designer KSC Response',
      type: 'ksc',
      atsScore: 78,
      analysisDate: '3 days ago',
      status: 'pending',
      insights: {
        keywords: 9,
        skills: 6,
        experience: 4,
        education: 2,
      },
      recommendations: [
        'Expand on specific methodologies',
        'Add portfolio references',
        'Include measurable outcomes',
      ],
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 75) return 'warning';
    return 'error';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'pending':
        return <Warning color="warning" />;
      case 'failed':
        return <Error color="error" />;
      default:
        return <Info />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'resume':
        return <Description color="primary" />;
      case 'cover-letter':
        return <Work color="secondary" />;
      case 'ksc':
        return <School color="info" />;
      default:
        return <Description />;
    }
  };

  if (isEmpty) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 4,
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              maxWidth: 500,
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Analytics
                sx={{
                  fontSize: 80,
                  color: 'primary.main',
                  mb: 2,
                }}
              />
              <Typography variant="h4" gutterBottom fontWeight={600}>
                No Analysis Available
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Upload documents and run ATS analysis to get detailed insights and recommendations
                for your job applications.
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<Assessment />}
              onClick={onRunAnalysis}
              sx={{
                borderRadius: 20,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Run First Analysis
            </Button>

            <Box sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                What gets analyzed:
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                <Chip label="ATS Score" size="small" />
                <Chip label="Keyword Match" size="small" />
                <Chip label="Skills Gap" size="small" />
                <Chip label="Recommendations" size="small" />
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight={600}>
            Document Analysis
          </Typography>
          <Button
            variant="contained"
            startIcon={
              loading ? <CircularProgress sx={{ fontSize: 20 }} color="inherit" /> : <Assessment />
            }
            onClick={handleRunAnalysis}
            disabled={loading}
            sx={{ borderRadius: 20 }}
          >
            {loading ? 'Analyzing...' : 'Run New Analysis'}
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Comprehensive ATS scoring and optimization recommendations for your documents
        </Typography>
      </Box>

      {/* Analysis Summary Cards */}
      <Grid2 container spacing={3} sx={{ mb: 4 }}>
        <Grid2 item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Speed color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  85%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Average ATS Score
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  +12%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Score Improvement
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timeline color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  15
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Documents Analyzed
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle color="info" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  8
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Optimized Documents
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Analysis Tabs */}
      <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="analysis tabs"
            sx={{ px: 3 }}
          >
            <Tab
              label="Recent Analysis"
              icon={<Timeline />}
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
            <Tab
              label="Performance Trends"
              icon={<ShowChart />}
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
            <Tab
              label="Insights"
              icon={<DonutLarge />}
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
          </Tabs>
        </Box>

        {/* Recent Analysis Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ px: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Document</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>ATS Score</TableCell>
                    <TableCell>Analysis Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analysisReports.map((report) => (
                    <TableRow key={report.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getTypeIcon(report.type)}
                          <Box sx={{ ml: 2 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {report.documentName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {report.insights.keywords} keywords • {report.insights.skills} skills
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={report.type.replace('-', ' ')}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 100 }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={report.atsScore}
                              color={getScoreColor(report.atsScore) as any}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                          <Typography variant="body2" fontWeight={600} sx={{ minWidth: 40 }}>
                            {report.atsScore}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {report.analysisDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getStatusIcon(report.status)}
                          <Typography
                            variant="body2"
                            sx={{
                              ml: 1,
                              textTransform: 'capitalize',
                              color:
                                report.status === 'completed'
                                  ? 'success.main'
                                  : report.status === 'pending'
                                    ? 'warning.main'
                                    : 'error.main',
                            }}
                          >
                            {report.status}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, report)}>
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        {/* Performance Trends Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ px: 3 }}>
            <Grid2 container spacing={3}>
              <Grid2 item xs={12} md={6}>
                <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                      Score Trends
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 200,
                      }}
                    >
                      <BarChart sx={{ fontSize: 60, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      Average score improved by 12% over last month
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>

              <Grid2 item xs={12} md={6}>
                <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                      Document Types
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 200,
                      }}
                    >
                      <PieChart sx={{ fontSize: 60, color: 'secondary.main' }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      Resume: 60% • Cover Letters: 30% • KSC: 10%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
            </Grid2>
          </Box>
        </TabPanel>

        {/* Insights Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ px: 3 }}>
            <Grid2 container spacing={3}>
              <Grid2 item xs={12} md={8}>
                <Stack spacing={2}>
                  <Alert severity="success" sx={{ borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Strong Performance Areas
                    </Typography>
                    <Typography variant="body2">
                      Your documents excel in keyword optimization and technical skills
                      presentation.
                    </Typography>
                  </Alert>

                  <Alert severity="warning" sx={{ borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Areas for Improvement
                    </Typography>
                    <Typography variant="body2">
                      Consider adding more quantifiable achievements and industry-specific
                      certifications.
                    </Typography>
                  </Alert>

                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Trending Keywords
                    </Typography>
                    <Typography variant="body2">
                      Current high-value keywords: "cloud computing", "agile methodology", "data
                      analysis"
                    </Typography>
                  </Alert>
                </Stack>
              </Grid2>

              <Grid2 item xs={12} md={4}>
                <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                      Quick Actions
                    </Typography>
                    <Stack spacing={2}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Refresh />}
                        sx={{ borderRadius: 20, justifyContent: 'flex-start' }}
                      >
                        Re-analyze All
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Download />}
                        sx={{ borderRadius: 20, justifyContent: 'flex-start' }}
                      >
                        Export Report
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Share />}
                        sx={{ borderRadius: 20, justifyContent: 'flex-start' }}
                      >
                        Share Insights
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
            </Grid2>
          </Box>
        </TabPanel>
      </Paper>

      {/* Report Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onViewReport?.(selectedReport!);
          }}
        >
          <Visibility sx={{ mr: 1.5 }} />
          View Report
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Refresh sx={{ mr: 1.5 }} />
          Re-analyze
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Download sx={{ mr: 1.5 }} />
          Download
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Share sx={{ mr: 1.5 }} />
          Share
        </MenuItem>
      </Menu>
    </Container>
  );
}
