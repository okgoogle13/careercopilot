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
  Avatar,
  Chip,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  TextField,
  InputAdornment,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Checkbox,
  Toolbar,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Sort,
  MoreVert,
  Description,
  Work,
  School,
  Edit,
  Download,
  Share,
  Delete,
  Visibility,
  Star,
  StarBorder,
  CloudUpload,
  FileCopy,
  Archive,
  Restore,
  CheckCircle,
  Schedule,
  Warning,
  FolderOpen,
  InsertDriveFile,
  PictureAsPdf,
  Close,
  CloudDownload,
  Print
} from '@mui/icons-material';

interface Document {
  id: string;
  name: string;
  type: 'resume' | 'cover-letter' | 'ksc' | 'portfolio';
  status: 'draft' | 'active' | 'archived';
  lastModified: string;
  size: string;
  atsScore?: number;
  isFavorite: boolean;
  tags: string[];
  thumbnail?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`documents-tabpanel-${index}`}
      aria-labelledby={`documents-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

interface DocumentsPageProps {
  isEmpty?: boolean;
  onCreateDocument?: () => void;
  onEditDocument?: (document: Document) => void;
  onUploadDocument?: () => void;
}

export function DocumentsPage({
  isEmpty = false,
  onCreateDocument,
  onEditDocument,
  onUploadDocument
}: DocumentsPageProps) {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, document: Document) => {
    setAnchorEl(event.currentTarget);
    setSelectedDocument(document);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDocument(null);
  };

  const handleSelectDocument = (documentId: string) => {
    setSelectedDocuments(prev =>
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(documents.map(doc => doc.id));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setUploadDialogOpen(true);
  };

  // Sample data
  const documents: Document[] = [
    {
      id: '1',
      name: 'Senior Software Developer Resume',
      type: 'resume',
      status: 'active',
      lastModified: '2 hours ago',
      size: '2.1 MB',
      atsScore: 85,
      isFavorite: true,
      tags: ['Software', 'React', 'TypeScript']
    },
    {
      id: '2',
      name: 'Product Manager Cover Letter',
      type: 'cover-letter',
      status: 'active',
      lastModified: '1 day ago',
      size: '1.5 MB',
      atsScore: 92,
      isFavorite: false,
      tags: ['Product', 'Management', 'Strategy']
    },
    {
      id: '3',
      name: 'UX Designer Portfolio',
      type: 'portfolio',
      status: 'draft',
      lastModified: '3 days ago',
      size: '15.2 MB',
      isFavorite: true,
      tags: ['Design', 'UX', 'Portfolio']
    },
    {
      id: '4',
      name: 'Key Selection Criteria Response',
      type: 'ksc',
      status: 'archived',
      lastModified: '1 week ago',
      size: '800 KB',
      atsScore: 78,
      isFavorite: false,
      tags: ['Government', 'KSC', 'Public Sector']
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'resume':
        return <Description color="primary" />;
      case 'cover-letter':
        return <Work color="secondary" />;
      case 'ksc':
        return <School color="info" />;
      case 'portfolio':
        return <FolderOpen color="warning" />;
      default:
        return <InsertDriveFile />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const documentsByType = {
    all: filteredDocuments,
    resume: filteredDocuments.filter(doc => doc.type === 'resume'),
    'cover-letter': filteredDocuments.filter(doc => doc.type === 'cover-letter'),
    ksc: filteredDocuments.filter(doc => doc.type === 'ksc'),
    portfolio: filteredDocuments.filter(doc => doc.type === 'portfolio')
  };

  const currentDocuments = tabValue === 0 ? documentsByType.all :
                          tabValue === 1 ? documentsByType.resume :
                          tabValue === 2 ? documentsByType['cover-letter'] :
                          tabValue === 3 ? documentsByType.ksc :
                          documentsByType.portfolio;

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
            textAlign: 'center'
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
              maxWidth: 500
            }}
          >
            <Box sx={{ mb: 4 }}>
              <FolderOpen
                sx={{
                  fontSize: 80,
                  color: 'primary.main',
                  mb: 2
                }}
              />
              <Typography variant="h4" gutterBottom fontWeight={600}>
                No Documents Yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Create your first document or upload existing files to get started with your career toolkit.
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                startIcon={<Add />}
                onClick={onCreateDocument}
                sx={{
                  borderRadius: 20,
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                Create Document
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<CloudUpload />}
                onClick={onUploadDocument}
                sx={{
                  borderRadius: 20,
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                Upload Files
              </Button>
            </Stack>

            <Box sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Supported formats:
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                <Chip label="PDF" size="small" />
                <Chip label="DOCX" size="small" />
                <Chip label="TXT" size="small" />
                <Chip label="HTML" size="small" />
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
            Documents
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<CloudUpload />}
              onClick={() => setUploadDialogOpen(true)}
              sx={{ borderRadius: 20 }}
            >
              Upload
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onCreateDocument}
              sx={{ borderRadius: 20 }}
            >
              Create Document
            </Button>
          </Stack>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Manage your resumes, cover letters, and other career documents
        </Typography>
      </Box>

      {/* Stats and Search */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Description color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  {documents.length}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Documents
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  {documents.filter(d => d.status === 'active').length}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Active Documents
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Star color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  {documents.filter(d => d.isFavorite).length}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Favorites
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Archive color="info" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  {documents.filter(d => d.status === 'archived').length}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Archived
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
            size="small"
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{ borderRadius: 20 }}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            startIcon={<Sort />}
            sx={{ borderRadius: 20 }}
          >
            Sort
          </Button>
        </Stack>

        {selectedDocuments.length > 0 && (
          <Toolbar sx={{ px: 0, mt: 2 }}>
            <Typography variant="subtitle1" sx={{ flex: 1 }}>
              {selectedDocuments.length} selected
            </Typography>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Download">
                <IconButton>
                  <Download />
                </IconButton>
              </Tooltip>
              <Tooltip title="Archive">
                <IconButton>
                  <Archive />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Stack>
          </Toolbar>
        )}
      </Paper>

      {/* Document Tabs */}
      <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="document tabs"
            sx={{ px: 3 }}
          >
            <Tab
              label={`All Documents (${documentsByType.all.length})`}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
            <Tab
              label={`Resumes (${documentsByType.resume.length})`}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
            <Tab
              label={`Cover Letters (${documentsByType['cover-letter'].length})`}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
            <Tab
              label={`KSC (${documentsByType.ksc.length})`}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
            <Tab
              label={`Portfolio (${documentsByType.portfolio.length})`}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
          </Tabs>
        </Box>

        {/* Document Grid */}
        <TabPanel value={tabValue} index={tabValue}>
          <Box sx={{ p: 3 }}>
            {currentDocuments.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <FolderOpen sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No documents found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search or create a new document
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {currentDocuments.map((document) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={document.id}>
                    <Card
                      elevation={0}
                      sx={{
                        border: 1,
                        borderColor: selectedDocuments.includes(document.id) ? 'primary.main' : 'divider',
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'translateY(-2px)',
                          boxShadow: 2
                        }
                      }}
                      onClick={() => handleSelectDocument(document.id)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Checkbox
                              checked={selectedDocuments.includes(document.id)}
                              size="small"
                              onClick={(e) => e.stopPropagation()}
                              onChange={() => handleSelectDocument(document.id)}
                            />
                            {getTypeIcon(document.type)}
                          </Box>
                          <Stack direction="row" spacing={0.5}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Toggle favorite
                              }}
                            >
                              {document.isFavorite ? <Star color="warning" /> : <StarBorder />}
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuOpen(e, document);
                              }}
                            >
                              <MoreVert />
                            </IconButton>
                          </Stack>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="h6" fontWeight={600} noWrap>
                            {document.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {document.size} • {document.lastModified}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Chip
                              label={document.status}
                              size="small"
                              color={getStatusColor(document.status) as any}
                              sx={{ textTransform: 'capitalize' }}
                            />
                            {document.atsScore && (
                              <Chip
                                label={`${document.atsScore}% ATS`}
                                size="small"
                                color={document.atsScore >= 80 ? 'success' : 'warning'}
                              />
                            )}
                          </Stack>
                        </Box>

                        <Box>
                          <Stack direction="row" spacing={0.5} flexWrap="wrap">
                            {document.tags.slice(0, 2).map((tag, index) => (
                              <Chip
                                key={index}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.75rem' }}
                              />
                            ))}
                            {document.tags.length > 2 && (
                              <Chip
                                label={`+${document.tags.length - 2}`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.75rem' }}
                              />
                            )}
                          </Stack>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </TabPanel>
      </Paper>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Upload Documents
          <IconButton
            aria-label="close"
            onClick={() => setUploadDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              border: 2,
              borderColor: dragOver ? 'primary.main' : 'divider',
              borderStyle: 'dashed',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              bgcolor: dragOver ? 'action.hover' : 'background.paper',
              transition: 'all 0.2s'
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Drag & drop files here
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              or click to browse files
            </Typography>
            <Button variant="contained" sx={{ borderRadius: 20 }}>
              Choose Files
            </Button>
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            Supported formats: PDF, DOCX, TXT, HTML (max 10MB each)
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setUploadDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Document Menu */}
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
        <MenuItem onClick={() => { handleMenuClose(); onEditDocument?.(selectedDocument!); }}>
          <Edit sx={{ mr: 1.5 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Visibility sx={{ mr: 1.5 }} />
          Preview
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <FileCopy sx={{ mr: 1.5 }} />
          Duplicate
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Download sx={{ mr: 1.5 }} />
          Download
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Share sx={{ mr: 1.5 }} />
          Share
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <Archive sx={{ mr: 1.5 }} />
          Archive
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1.5 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24
        }}
        onClick={onCreateDocument}
      >
        <Add />
      </Fab>
    </Container>
  );
}