import { Schedule, AccessTime, Person, Download, Delete } from '@mui/icons-material';
import { Button, Stack, Box, Typography, Chip, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';

export interface DocumentVersion {
  id: string;
  version: number;
  createdAt: Date;
  modifiedBy: string;
  size: number;
  downloadUrl?: string;
  isCurrent?: boolean;
  changes?: string[];
}

interface DocumentVersionHistoryProps {
  versions: DocumentVersion[];
  onRestore?: (version: DocumentVersion) => void;
  onDownload?: (version: DocumentVersion) => void;
  onDelete?: (version: DocumentVersion) => void;
  className?: string;
}

const VersionCard = styled(Box)<{ isCurrent?: boolean }>(({ theme, isCurrent }) => ({
  border: `1px solid ${isCurrent ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: isCurrent ? theme.palette.primary.light : 'transparent',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  transition: theme.transitions.create(['border-color', 'background-color']),
}));

export const DocumentVersionHistory: React.FC<DocumentVersionHistoryProps> = ({
  versions,
  onRestore,
  onDownload,
  onDelete,
  className,
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))  } ${  sizes[i]}`;
  };

  return (
    <Stack spacing={2} className={className}>
      <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
        <Schedule fontSize="small" />
        <Typography variant="h6" component="h3">
          Version History
        </Typography>
      </Stack>

      {versions.length === 0 ? (
        <Box
          sx={{ textAlign: 'center', py: 4, border: 1, borderColor: 'divider', borderRadius: 1 }}
        >
          <AccessTime sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
          <Typography color="text.secondary">No version history available</Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {versions.map((version) => (
            <VersionCard key={version.id} isCurrent={version.isCurrent}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack spacing={0.5}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Version {version.version}
                    </Typography>
                    {version.isCurrent && <Chip label="Current" color="primary" size="small" />}
                  </Stack>

                  <Stack direction="row" alignItems="center" color="text.secondary" spacing={1}>
                    <Person sx={{ fontSize: 16 }} />
                    <Typography variant="caption">{version.modifiedBy}</Typography>
                    <Typography variant="caption">•</Typography>
                    <Typography variant="caption">
                      {formatDistanceToNow(version.createdAt, { addSuffix: true })}
                    </Typography>
                    <Typography variant="caption">•</Typography>
                    <Typography variant="caption">{formatFileSize(version.size)}</Typography>
                  </Stack>

                  {version.changes && version.changes.length > 0 && (
                    <Box component="ul" sx={{ pl: 2.5, mt: 1, color: 'text.secondary' }}>
                      {version.changes.map((change, i) => (
                        <li key={i}>
                          <Typography variant="caption">{change}</Typography>
                        </li>
                      ))}
                    </Box>
                  )}
                </Stack>

                <Stack direction="row" spacing={0.5}>
                  {onDownload && (
                    <IconButton
                      size="small"
                      onClick={() => onDownload(version)}
                      title="Download this version"
                    >
                      <Download fontSize="small" />
                    </IconButton>
                  )}

                  {onRestore && !version.isCurrent && (
                    <Button size="small" variant="outlined" onClick={() => onRestore(version)}>
                      Restore
                    </Button>
                  )}

                  {onDelete && !version.isCurrent && (
                    <IconButton
                      size="small"
                      onClick={() => onDelete(version)}
                      title="Delete this version"
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
              </Stack>
            </VersionCard>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
