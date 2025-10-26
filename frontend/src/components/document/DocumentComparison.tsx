import {
  Description as FileText,
  Download,
  Visibility as Eye,
  Refresh as RotateCcw,
} from '@mui/icons-material';
import { Box, Typography, Card, CardContent, Button, Divider, Chip } from '@mui/material';
import React, { useState } from 'react';

interface Document {
  id: string;
  title: string;
  content: string[];
  lastModified: string;
  type: 'resume' | 'cover-letter' | 'other';
  wordCount: number;
}

interface DocumentComparisonProps {
  leftDocument?: Document;
  rightDocument?: Document;
  onDocumentSelect?: (po_ition: 'left' | 'right') => void;
  highlightDifferences?: boolean;
}

const sampleDocuments: Document[] = [
  {
    id: '1',
    title: 'Software Engineer Resume - Version 1',
    content: [
      'John Doe - Software Engineer',
      'Email: john.doe@email.com | Phone: (555) 123-4567',
      '',
      'EXPERIENCE',
      'Senior Software Engineer at TechCorp (2021-2023)',
      '• Developed scalable web applications using React and Node.js',
      '• Led a team of 5 developers on critical projects',
      '• Improved application performance by 40%',
      '',
      'SKILLS',
      'JavaScript, React, Node.js, Python, PostgreSQL',
    ],
    lastModified: '2024-01-15',
    type: 'resume',
    wordCount: 85,
  },
  {
    id: '2',
    title: 'Software Engineer Resume - Version 2',
    content: [
      'John Doe - Senior Software Engineer',
      'Email: john.doe@email.com | Phone: (555) 123-4567',
      '',
      'EXPERIENCE',
      'Senior Software Engineer at TechCorp (2021-2023)',
      '• Developed scalable web applications using React and Node.js',
      '• Led a cross-functional team of 5 developers on critical projects',
      '• Improved application performance by 40% through optimization',
      '• Implemented CI/CD pipeline reducing deployment time by 60%',
      '',
      'SKILLS',
      'JavaScript, TypeScript, React, Node.js, Python, PostgreSQL, AWS',
    ],
    lastModified: '2024-01-20',
    type: 'resume',
    wordCount: 95,
  },
];

export function DocumentComparison({
  leftDocument = sampleDocuments[0],
  rightDocument = sampleDocuments[1],
  onDocumentSelect,
  highlightDifferences = true,
}: DocumentComparisonProps) {
  const [showFullContent, setShowFullContent] = useState(false);

  const getHighlightedContent = (content: string[], isLeft: boolean) => {
    if (!highlightDifferences) return content;

    const otherContent = isLeft ? rightDocument?.content || [] : leftDocument?.content || [];

    return content.map((line, index) => {
      const otherLine = otherContent[index];
      if (!otherLine || otherLine !== line) {
        return { text: line, isDifferent: true };
      }
      return { text: line, isDifferent: false };
    });
  };

  const DocumentPanel = ({
    document,
    position,
    isLeft,
  }: {
    document: Document;
    position: 'left' | 'right';
    isLeft: boolean;
  }) => (
    <Card className="h-full">
      <CardContent className="p-4">
        {/* Header */}
        <Box className="flex items-center justify-between mb-4">
          <Box className="flex items-center gap-2">
            <FileText sx={{ fontSize: 20 }} className="text-primary" />
            <Typography variant="h6" className="font-semibold truncate">
              {document.title}
            </Typography>
          </Box>
          <Button size="small" variant="outlined" onClick={() => onDocumentSelect?.(position)}>
            Change
          </Button>
        </Box>

        {/* Metadata */}
        <Box className="flex flex-wrap gap-2 mb-4">
          <Chip label={document.type.replace('-', ' ')} size="small" variant="outlined" />
          <Chip label={`${document.wordCount} words`} size="small" variant="outlined" />
          <Chip label={`Modified: ${document.lastModified}`} size="small" variant="outlined" />
        </Box>

        {/* Content */}
        <Box className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
          <Box className="space-y-1 font-mono text-sm">
            {getHighlightedContent(document.content, isLeft).map((line, index) => (
              <Box
                key={index}
                className={`p-1 rounded ${
                  typeof line === 'object' && line.isDifferent
                    ? isLeft
                      ? 'bg-red-100 border-l-2 border-red-400'
                      : 'bg-green-100 border-l-2 border-green-400'
                    : ''
                }`}
              >
                {typeof line === 'object' ? line.text : line}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Actions */}
        <Box className="flex gap-2 mt-4">
          <Button size="small" variant="outlined" startIcon={<Eye sx={{ fontSize: 16 }} />}>
            Preview
          </Button>
          <Button size="small" variant="outlined" startIcon={<Download sx={{ fontSize: 16 }} />}>
            Download
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box className="w-full">
      {/* Header */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <Typography variant="h4" className="text-2xl font-bold mb-2">
            Document Comparison
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Compare different versions of your documents side by side
          </Typography>
        </Box>

        <Box className="flex gap-2">
          <Button
            variant="outlined"
            onClick={() => setShowFullContent(!showFullContent)}
            startIcon={<RotateCcw sx={{ fontSize: 16 }} />}
          >
            {showFullContent ? 'Compact View' : 'Full View'}
          </Button>
          <Button variant="contained" className="bg-primary hover:bg-primary/90">
            Merge Changes
          </Button>
        </Box>
      </Box>

      {/* Legend */}
      {highlightDifferences && (
        <Box className="flex gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <Box className="flex items-center gap-2">
            <Box className="w-4 h-4 bg-red-100 border-l-2 border-red-400 rounded"></Box>
            <Typography variant="caption">Removed/Modified (Left)</Typography>
          </Box>
          <Box className="flex items-center gap-2">
            <Box className="w-4 h-4 bg-green-100 border-l-2 border-green-400 rounded"></Box>
            <Typography variant="caption">Added/New (Right)</Typography>
          </Box>
        </Box>
      )}

      {/* Comparison Panels */}
      <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DocumentPanel document={leftDocument} position="left" isLeft={true} />
        <DocumentPanel document={rightDocument} position="right" isLeft={false} />
      </Box>

      {/* Summary */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <Typography variant="h6" className="font-semibold mb-3">
            Comparison Summary
          </Typography>
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Box className="text-center">
              <Typography variant="h4" className="font-bold text-red-600">
                5
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Lines Modified
              </Typography>
            </Box>
            <Box className="text-center">
              <Typography variant="h4" className="font-bold text-green-600">
                2
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Lines Added
              </Typography>
            </Box>
            <Box className="text-center">
              <Typography variant="h4" className="font-bold text-blue-600">
                10
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Words Difference
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
