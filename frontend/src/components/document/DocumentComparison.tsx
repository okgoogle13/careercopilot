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
    <Card sx={{
      height: "100%"
    }}>
      <CardContent sx={{
      p: 4
    }}>
        {/* Header */}
        <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 4
    }}>
          <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
            <FileText sx={{ fontSize: 20 }} sx={{
      "text-primary": true
    }} />
            <Typography variant="h6" sx={{
      fontWeight: 600,
      [object Object]
    }}>
              {document.title}
            </Typography>
          </Box>
          <Button size="small" variant="outlined" onClick={() => onDocumentSelect?.(position)}>
            Change
          </Button>
        </Box>

        {/* Metadata */}
        <Box sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2,
      mb: 4
    }}>
          <Chip label={document.type.replace('-', ' ')} size="small" variant="outlined" />
          <Chip label={`${document.wordCount} words`} size="small" variant="outlined" />
          <Chip label={`Modified: ${document.lastModified}`} size="small" variant="outlined" />
        </Box>

        {/* Content */}
        <Box sx={{
      bgcolor: "gray.50",
      p: 4,
      borderRadius: 0.5rem,
      "max-h-96": true,
      overflowY: "auto"
    }}>
          <Box sx={{
      "space-y-1": true,
      "font-mono": true,
      typography: body1
    }}>
            {getHighlightedContent(document.content, isLeft).map((line, index) => (
              <Box
                key={index}
                sx={{
      p: 1,
      borderRadius: 0.25rem,
      "${": true,
      "typeof": true,
      "line": true,
      "===": true,
      "'object'": true,
      "&&": true,
      "line.isDifferent": true,
      "?": true,
      "isLeft": true,
      "?": true,
      "'bg-red-100": true,
      "border-l-2": true,
      "border-red-400'": true,
      ":": true,
      "'bg-green-100": true,
      "border-l-2": true,
      "border-green-400'": true,
      ":": true,
      "''": true,
      "}": true
    }}
              >
                {typeof line === 'object' ? line.text : line}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{
      display: "flex",
      gap: 2,
      mt: 4
    }}>
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
    <Box sx={{
      width: "100%"
    }}>
      {/* Header */}
      <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 6
    }}>
        <Box>
          <Typography variant="h4" sx={{
      typography: h4,
      fontWeight: 700,
      mb: 2
    }}>
            Document Comparison
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Compare different versions of your documents side by side
          </Typography>
        </Box>

        <Box sx={{
      display: "flex",
      gap: 2
    }}>
          <Button
            variant="outlined"
            onClick={() => setShowFullContent(!showFullContent)}
            startIcon={<RotateCcw sx={{ fontSize: 16 }} />}
          >
            {showFullContent ? 'Compact View' : 'Full View'}
          </Button>
          <Button variant="contained" sx={{
      "bg-primary": true,
      '&:hover': { "bg-primary/90": true }
    }}>
            Merge Changes
          </Button>
        </Box>
      </Box>

      {/* Legend */}
      {highlightDifferences && (
        <Box sx={{
      display: "flex",
      gap: 4,
      mb: 4,
      p: 3,
      bgcolor: "gray.50",
      borderRadius: 0.5rem
    }}>
          <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
            <Box sx={{
      "w-4": true,
      "h-4": true,
      bgcolor: "red.100",
      "border-l-2": true,
      "border-red-400": true,
      borderRadius: 0.25rem
    }}></Box>
            <Typography variant="caption">Removed/Modified (Left)</Typography>
          </Box>
          <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
            <Box sx={{
      "w-4": true,
      "h-4": true,
      bgcolor: "green.100",
      "border-l-2": true,
      "border-green-400": true,
      borderRadius: 0.25rem
    }}></Box>
            <Typography variant="caption">Added/New (Right)</Typography>
          </Box>
        </Box>
      )}

      {/* Comparison Panels */}
      <Box sx={{
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('md')]: { "grid-cols-2": true },
      gap: 6
    }}>
        <DocumentPanel document={leftDocument} position="left" isLeft={true} />
        <DocumentPanel document={rightDocument} position="right" isLeft={false} />
      </Box>

      {/* Summary */}
      <Card sx={{
      mt: 6
    }}>
        <CardContent sx={{
      p: 4
    }}>
          <Typography variant="h6" sx={{
      fontWeight: 600,
      mb: 3
    }}>
            Comparison Summary
          </Typography>
          <Box sx={{
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-3": true },
      gap: 4
    }}>
            <Box sx={{
      textAlign: "center"
    }}>
              <Typography variant="h4" sx={{
      fontWeight: 700,
      color: "red.600"
    }}>
                5
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Lines Modified
              </Typography>
            </Box>
            <Box sx={{
      textAlign: "center"
    }}>
              <Typography variant="h4" sx={{
      fontWeight: 700,
      color: "green.600"
    }}>
                2
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Lines Added
              </Typography>
            </Box>
            <Box sx={{
      textAlign: "center"
    }}>
              <Typography variant="h4" sx={{
      fontWeight: 700,
      color: "blue.600"
    }}>
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
