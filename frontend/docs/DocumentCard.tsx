import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  alpha,
} from '@mui/material';
import {
  FileText,
  Download,
  Edit3,
  MoreHorizontal,
  Share2,
  Copy,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export interface DocumentCardProps {
  document: {
    id: string;
    title: string;
    type: 'resume' | 'cover-letter' | 'selection-criteria' | 'portfolio';
    status: 'draft' | 'completed' | 'in-review' | 'published';
    version: string;
    lastModified: Date | string;
    createdDate: Date | string;
    fileSize?: string;
    pageCount?: number;
    thumbnail?: string;
    tags?: string[];
    atsScore?: number;
    sharedWith?: Array<{
      id: string;
      name: string;
      avatar?: string;
      role: 'viewer' | 'editor' | 'owner';
    }>;
    metrics?: {
      views: number;
      downloads: number;
      applications: number;
    };
    template?: string;
    aiGenerated?: boolean;
  };
  variant?: 'default' | 'compact' | 'grid';
  selected?: boolean;
  onSelect?: (documentId: string) => void;
  onEdit?: (documentId: string) => void;
  onView?: (documentId: string) => void;
  onDownload?: (documentId: string) => void;
  onShare?: (documentId: string) => void;
  onDuplicate?: (documentId: string) => void;
  onDelete?: (documentId: string) => void;
}

const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  return `${Math.floor(diffDays / 7)} weeks ago`;
};

const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  variant = 'default',
  selected = false,
  onSelect,
  onEdit,
  onView,
  onDownload,
  onShare,
  onDuplicate,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = () => {
    switch (document.status) {
      case 'completed':
        return { bg: alpha('#86EFAC', 0.1), text: '#86EFAC', border: alpha('#86EFAC', 0.2) };
      case 'in-review':
        return { bg: alpha('#FDE047', 0.1), text: '#FDE047', border: alpha('#FDE047', 0.2) };
      case 'published':
        return { bg: alpha('#60a5fa', 0.1), text: '#60a5fa', border: alpha('#60a5fa', 0.2) };
      case 'draft':
      default:
        return { bg: alpha('#928F99', 0.1), text: '#928F99', border: alpha('#928F99', 0.2) };
    }
  };

  const getStatusIcon = () => {
    switch (document.status) {
      case 'completed':
        return <CheckCircle size={12} />;
      case 'in-review':
        return <Clock size={12} />;
      case 'published':
        return <CheckCircle size={12} />;
      case 'draft':
      default:
        return <Edit3 size={12} />;
    }
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(document.id);
    } else if (onView) {
      onView(document.id);
    }
  };

  const statusColor = getStatusColor();

  if (variant === 'compact') {
    return (
      <Card
        variant={selected ? 'interactive' : undefined}
        sx={{
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: (theme) => theme.customShadows.glowPrimary,
          },
        }}
        onClick={handleCardClick}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Document Icon */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: 'surface.containerHigh',
              }}
            >
              <FileText size={20} />
            </Box>

            {/* Document Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {document.title}
                </Typography>
                <Chip
                  icon={getStatusIcon()}
                  label={document.status}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.675rem',
                    bgcolor: statusColor.bg,
                    color: statusColor.text,
                    border: 1,
                    borderColor: statusColor.border,
                    '& .MuiChip-icon': {
                      color: statusColor.text,
                    },
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Modified {formatRelativeTime(document.lastModified)} • v{document.version}
              </Typography>
            </Box>

            {/* ATS Score */}
            {document.atsScore && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color:
                      document.atsScore >= 80
                        ? 'success.main'
                        : document.atsScore >= 60
                          ? 'warning.main'
                          : 'error.main',
                  }}
                >
                  {document.atsScore}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  ATS
                </Typography>
              </Box>
            )}

            {/* Actions Menu */}
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ color: 'text.secondary' }}
            >
              <MoreHorizontal size={16} />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card
        variant={selected ? 'interactive' : 'glass'}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: (theme) => theme.customShadows.glowPrimary,
            borderColor: 'primary.main',
          },
        }}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent sx={{ flex: 1, p: 3 }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <FileText size={24} />
              </Box>
              {document.aiGenerated && (
                <Chip
                  label="AI Generated"
                  size="small"
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>

            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.3s',
                color: 'text.secondary',
              }}
            >
              <MoreHorizontal size={16} />
            </IconButton>
          </Box>

          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 1.5 }}
          >
            {document.title}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip
              icon={getStatusIcon()}
              label={document.status.replace('-', ' ')}
              size="small"
              sx={{
                bgcolor: statusColor.bg,
                color: statusColor.text,
                border: 1,
                borderColor: statusColor.border,
                '& .MuiChip-icon': {
                  color: statusColor.text,
                },
              }}
            />
            <Chip
              label={`v${document.version}`}
              size="small"
              variant="outlined"
            />
            {document.template && (
              <Chip
                label={document.template}
                size="small"
                variant="outlined"
              />
            )}
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mb: 2 }}
          >
            {document.type.replace('-', ' ').toUpperCase()} • Created{' '}
            {formatDate(document.createdDate)}
            {document.fileSize && ` • ${document.fileSize}`}
            {document.pageCount &&
              ` • ${document.pageCount} page${document.pageCount > 1 ? 's' : ''}`}
          </Typography>

          {/* Document Thumbnail/Preview */}
          <Box
            sx={{
              aspectRatio: '3/4',
              bgcolor: 'surface.containerLow',
              borderRadius: 2,
              mb: 2,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {document.thumbnail ? (
              <img
                src={document.thumbnail}
                alt={document.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <FileText
                  size={48}
                  style={{ opacity: 0.3 }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {document.type.replace('-', ' ')}
                </Typography>
              </Box>
            )}
          </Box>

          {/* ATS Score */}
          {document.atsScore && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                bgcolor: 'surface.containerLow',
                borderRadius: 2,
                mb: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600 }}
              >
                ATS Score
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor: (theme) =>
                    alpha(
                      document.atsScore! >= 80
                        ? theme.palette.success.main
                        : document.atsScore! >= 60
                          ? theme.palette.warning.main
                          : theme.palette.error.main,
                      0.1
                    ),
                  color:
                    document.atsScore >= 80
                      ? 'success.main'
                      : document.atsScore >= 60
                        ? 'warning.main'
                        : 'error.main',
                }}
              >
                {document.atsScore}%
              </Typography>
            </Box>
          )}

          {/* Tags */}
          {document.tags && document.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {document.tags.slice(0, 3).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                />
              ))}
              {document.tags.length > 3 && (
                <Chip
                  label={`+${document.tags.length - 3} more`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          )}

          {/* Metrics */}
          {document.metrics && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 1,
                textAlign: 'center',
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  {document.metrics.views}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Views
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  {document.metrics.downloads}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Downloads
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  {document.metrics.applications}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Applications
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Edit3 size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(document.id);
            }}
            sx={{ flex: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<Eye size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              onView?.(document.id);
            }}
            sx={{ flex: 1 }}
          >
            View
          </Button>
        </CardActions>
      </Card>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onView?.(document.id);
          }}
        >
          <Eye
            size={16}
            style={{ marginRight: 8 }}
          />
          View
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onEdit?.(document.id);
          }}
        >
          <Edit3
            size={16}
            style={{ marginRight: 8 }}
          />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onDownload?.(document.id);
          }}
        >
          <Download
            size={16}
            style={{ marginRight: 8 }}
          />
          Download
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onShare?.(document.id);
          }}
        >
          <Share2
            size={16}
            style={{ marginRight: 8 }}
          />
          Share
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onDuplicate?.(document.id);
          }}
        >
          <Copy
            size={16}
            style={{ marginRight: 8 }}
          />
          Duplicate
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onDelete?.(document.id);
          }}
          sx={{ color: 'error.main' }}
        >
          <Trash2
            size={16}
            style={{ marginRight: 8 }}
          />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default DocumentCard;
