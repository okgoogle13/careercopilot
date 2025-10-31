/**
 * Asset Library Page
 * View and manage uploaded documents and assets
 */

import { Add, Search, MoreVert, Delete, Download, Edit, CloudUpload } from '@mui/icons-material';
import {
  Container,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  TextField,
  InputAdornment,
  Paper,
  Alert,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

import type { AssetDocument } from '../api/smartIngestionService';
import { smartIngestionService } from '../api/smartIngestionService';
import { SmartUploadModal } from '../components/SmartUploadModal';

interface AssetLibraryPageProps {
  onUpload?: () => void;
}

export const AssetLibraryPage: React.FC<AssetLibraryPageProps> = ({ onUpload }) => {
  const [assets, setAssets] = useState<AssetDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAsset, setSelectedAsset] = useState<AssetDocument | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch assets on mount
  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      try {
        const library = await smartIngestionService.getAssetLibrary();
        setAssets(library.documents || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load asset library');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, asset: AssetDocument) => {
    setAnchorEl(event.currentTarget);
    setSelectedAsset(asset);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAsset(null);
  };

  const handleDelete = async () => {
    if (!selectedAsset) return;

    try {
      await smartIngestionService.deleteAsset(selectedAsset.id);
      setAssets((prev) => prev.filter((a) => a.id !== selectedAsset.id));
      handleMenuClose();
    } catch (err: any) {
      setError('Failed to delete asset');
    }
  };

  const handleDownload = async () => {
    if (!selectedAsset) return;

    try {
      const blob = await smartIngestionService.getAssetById(selectedAsset.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedAsset.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      handleMenuClose();
    } catch (err: any) {
      setError('Failed to download asset');
    }
  };

  const handleUploadComplete = (document: any) => {
    setUploadModalOpen(false);
    onUpload?.();
    // Refresh the asset list
    const fetchAssets = async () => {
      try {
        const library = await smartIngestionService.getAssetLibrary();
        setAssets(library.documents || []);
      } catch (err) {
        console.error('Failed to refresh assets:', err);
      }
    };
    fetchAssets();
  };

  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={600}>
          Asset Library
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setUploadModalOpen(true)}>
          Upload Document
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
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
        sx={{ mb: 4 }}
      />

      {/* Empty State */}
      {filteredAssets.length === 0 && !isLoading && (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No documents yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Upload your first document to get started with AI-powered document analysis
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => setUploadModalOpen(true)}>
            Upload Your First Document
          </Button>
        </Paper>
      )}

      {/* Assets Grid */}
      {filteredAssets.length > 0 && (
        <Grid container spacing={3}>
          {filteredAssets.map((asset: AssetDocument) => (
            <Grid item xs={12} sm={6} md={4} key={asset.id} component="div">
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 2,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      mb: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600} noWrap>
                        {asset.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(asset.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, asset)}>
                      <MoreVert />
                    </IconButton>
                  </Box>

                  {asset.tags && asset.tags.length > 0 && (
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {asset.tags.map((tag: string, index: number) => (
                        <Chip key={`${tag}-${index}`} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                  )}

                  {asset.metadata?.extractedText && (
                    <Typography variant="body2">
                      {asset.metadata.extractedText.substring(0, 100)}...
                    </Typography>
                  )}
                </CardContent>

                <CardActions>
                  <Button size="small" startIcon={<Edit />}>
                    Edit
                  </Button>
                  <Button size="small" startIcon={<Download />} onClick={handleDownload}>
                    Download
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Upload Modal */}
      <SmartUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />

      {/* Asset Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleDownload();
          }}
        >
          <Download sx={{ mr: 1.5 }} />
          Download
        </MenuItem>
        <MenuItem>
          <Edit sx={{ mr: 1.5 }} />
          Edit Tags
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1.5 }} />
          Delete
        </MenuItem>
      </Menu>
    </Container>
  );
};
