import {
  Archive,
  ArrowLeft,
  Schedule as Clock,
  Code,
  Download,
  Edit,
  Visibility as Eye,
  Image as FileImage,
  Description as FileText,
  Lightbulb,
  Print as Printer,
  RotateLeft as RotateCcw,
  Settings,
  Share,
  Close as X,
  ZoomIn,
  ZoomOut,
} from '@mui/icons-material';
import { Box, Button, Card } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '../../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';

type DocumentType = 'resume' | 'cover-letter' | 'portfolio' | 'selection-criteria' | 'other';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  lastActive?: string;
}

interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  resolved: boolean;
  position?: { x: number; y: number };
  replies?: Array<{
    id: string;
    userId: string;
    content: string;
    createdAt: string;
  }>;
}

interface Version {
  id: string;
  version: string;
  timestamp: string;
  user: Pick<User, 'id' | 'name' | 'avatar'>;
  changes: string[];
}

interface ATSIssue {
  id: string;
  type: 'keyword' | 'format' | 'length' | 'contact' | 'other';
  message: string;
  severity: 'low' | 'medium' | 'high';
  location?: string;
  suggestion?: string;
  autoFixable: boolean;
}

interface DocumentData {
  id: string;
  title: string;
  type: DocumentType;
  lastModified: string;
  pages: number;
  templateName: string;
  wordCount: number;
  characterCount: number;
  atsScore: number;
  atsIssues: ATSIssue[];
  sharedWith: User[];
  versions: Version[];
  comments: Comment[];
  content: string;
  isShared: boolean;
  isTemplate: boolean;
  tags: string[];
  size: number;
  createdAt: string;
  updatedAt: string;
}

interface DocumentPreviewProps {
  documentId: string;
  onBack: () => void;
  onEdit: () => void;
  onSave?: () => void;
  documentType: DocumentType;
  templateName: string;
  onExport?: (format: string) => void;
  onShare?: (documentId: string) => void;
  onCommentAdd?: (comment: Omit<Comment, 'id' | 'createdAt' | 'resolved' | 'replies'>) => void;
  onCommentResolve?: (commentId: string) => void;
  onCommentReply?: (commentId: string, content: string) => void;
  onVersionRestore?: (versionId: string) => void;
}

// Mock data
const mockDocument: DocumentData = {
  id: 'doc_123',
  title: 'Nishant Dougall - Community Support Worker Resume',
  type: 'resume',
  lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  pages: 1,
  templateName: 'Modern Minimal',
  wordCount: 478,
  characterCount: 2875,
  atsScore: 87,
  isShared: true,
  isTemplate: false,
  tags: ['resume', 'ats-optimized', 'professional'],
  size: 24576, // bytes
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  content: '...',
  atsIssues: [
    {
      id: 'issue_1',
      type: 'keyword',
      message: 'Missing common industry keywords',
      severity: 'medium',
      suggestion: 'Add keywords: trauma-informed, crisis intervention, case management',
      autoFixable: true,
    },
    {
      id: 'issue_2',
      type: 'length',
      message: 'Resume is longer than recommended 2 pages',
      severity: 'low',
      suggestion: 'Consider condensing to 1-2 pages',
      autoFixable: false,
    },
  ],
  sharedWith: [
    {
      id: 'user_1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      role: 'editor',
      lastActive: '2 minutes ago',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    {
      id: 'user_2',
      name: 'Taylor Smith',
      email: 'taylor@example.com',
      role: 'viewer',
      lastActive: '1 hour ago',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
    },
  ],
  versions: [
    {
      id: 'v3',
      version: 'v3',
      timestamp: new Date().toISOString(),
      user: {
        id: 'user_1',
        name: 'Alex Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      },
      changes: ['Updated work experience', 'Fixed typos'],
    },
    {
      id: 'v2',
      version: 'v2',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 'user_3',
        name: 'Nishant Dougall',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nishant',
      },
      changes: ['Added skills section', 'Updated contact information'],
    },
  ],
  comments: [
    {
      id: 'comment_1',
      userId: 'user_1',
      content: 'Consider adding more metrics to quantify your achievements',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      resolved: false,
      position: { x: 120, y: 450 },
      replies: [
        {
          id: 'reply_1',
          userId: 'user_3',
          content: "Good suggestion! I'll add some metrics.",
          createdAt: new Date(Date.now() - 1800000).toISOString(),
        },
      ],
    },
  ],
};

export function DocumentPreview({
  documentId,
  onBack,
  onEdit,
  onSave = () => {},
  documentType,
  templateName,
  onExport = () => {},
  onShare = () => {},
  onCommentAdd = () => {},
  onCommentResolve = () => {},
  onCommentReply = () => {},
  onVersionRestore = () => {},
}: DocumentPreviewProps) {
  // State management
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('preview');
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareRole, setShareRole] = useState<'editor' | 'viewer'>('viewer');
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [compareVersion, setCompareVersion] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Enhanced features
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<string[]>([]);
  const [readingMode, setReadingMode] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [trackingTime, setTrackingTime] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [annotations, setAnnotations] = useState<
    Array<{ id: string; text: string; position: { x: number; y: number } }>
  >([]);
  const [selectedText, setSelectedText] = useState<string>('');
  const [showTextAnalysis, setShowTextAnalysis] = useState(false);

  // Refs
  const documentContainerRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  // Document data - in a real app, this would come from an API
  const [document, setDocument] = useState<DocumentData>(mockDocument);

  // Time tracking effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        setTrackingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  // Auto-start tracking when component mounts
  useEffect(() => {
    setIsTracking(true);
    return () => setIsTracking(false);
  }, []);

  // Handle zoom controls
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoomLevel(100);
  const handleFitToWidth = () => setZoomLevel(85);

  // Enhanced view controls
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      window.document.body.style.overflow = 'hidden';
    } else {
      window.document.body.style.overflow = 'unset';
    }
  };

  const toggleReadingMode = () => {
    setReadingMode(!readingMode);
    if (!readingMode) {
      setZoomLevel(120);
    } else {
      setZoomLevel(100);
    }
  };

  // AI Assistant functions
  const generateAISuggestions = () => {
    setShowAIAssistant(true);
    // Simulate AI suggestions
    const suggestions = [
      'Consider adding quantifiable achievements to your work experience',
      'Your skills section could benefit from industry-specific keywords',
      'The summary could be more impactful with a stronger opening statement',
      'Consider adding relevant certifications to strengthen your profile',
    ];
    setAISuggestions(suggestions);
  };

  // Text analysis functions
  const analyzeSelectedText = (text: string) => {
    setSelectedText(text);
    setShowTextAnalysis(true);
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle document navigation
  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(document.pages, prev + 1));

  // Handle comments
  const handleAddComment = () => {
    if (commentContent.trim()) {
      onCommentAdd({
        userId: 'current_user_id', // In a real app, this would come from auth context
        content: commentContent,
        position: { x: 100, y: 100 }, // In a real app, this would be the click position
      });
      setCommentContent('');
      setIsCommenting(false);
    }
  };

  const handleResolveComment = (commentId: string) => {
    onCommentResolve(commentId);
  };

  const handleAddReply = (commentId: string) => {
    if (replyContent.trim()) {
      onCommentReply(commentId, replyContent);
      setReplyContent('');
      setActiveComment(null);
    }
  };

  // Handle sharing
  const handleShareDocument = () => {
    if (shareEmail) {
      // In a real app, this would call an API to share the document
      setDocument((prev) => ({
        ...prev,
        sharedWith: [
          ...prev.sharedWith,
          {
            id: `user_${Date.now()}`,
            name: shareEmail.split('@')[0],
            email: shareEmail,
            role: shareRole,
            lastActive: 'Just now',
          },
        ],
      }));
      setShareEmail('');
      setShowShareDialog(false);
    }
  };

  // Handle version control

  // Handle export
  const handleExport = (format: string) => {
    onExport(format);
    // In a real app, this would trigger a download or open a save dialog
    console.log(`Exporting document as ${format}`);
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Get user initials
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  // Get ATS score color
  const getAtsScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Get severity color
  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    return {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    }[severity];
  };

  // Get file icon based on export format
  const getFileIcon = (format: string) => {
    const icons: Record<string, React.ReactNode> = {
      pdf: <FileText sx={{
      "w-4": true,
      "h-4": true
    }} />,
      docx: <FileText sx={{
      "w-4": true,
      "h-4": true
    }} />,
      txt: <Code sx={{
      "w-4": true,
      "h-4": true
    }} />,
      jpg: <FileImage sx={{
      "w-4": true,
      "h-4": true
    }} />,
      png: <FileImage sx={{
      "w-4": true,
      "h-4": true
    }} />,
      zip: <Archive sx={{
      "w-4": true,
      "h-4": true
    }} />,
    };
    return icons[format] || <FileText sx={{
      "w-4": true,
      "h-4": true
    }} />;
  };

  return (
    <TooltipProvider>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'grey.50',
          transition: 'all 300ms',
          height: '100vh',
          ...(isFullscreen && {
            position: 'fixed',
            inset: 0,
            zIndex: 50,
          }),
        }}
      >
        {/* Enhanced Header */}
        <header sx={{
      bgcolor: "common.white",
      borderBottom: 1,
      borderColor: "gray.200",
      px: 6,
      py: 4
    }}>
          <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      "space-x-4": true
    }}>
              <Button
                variant="text"
                size="small"
                onClick={onBack}
                sx={{
      color: "gray.500",
      '&:hover': { bgcolor: "gray.100" },
      borderRadius: 9999px
    }}
              >
                <ArrowLeft sx={{
      "h-5": true,
      "w-5": true
    }} />
                <span sx={{
      [object Object]
    }}>Back</span>
              </Button>
              <div>
                <h1 sx={{
      typography: h6,
      fontWeight: 600,
      "text-gray-900": true
    }}>{document.title}</h1>
                <div sx={{
      display: "flex",
      alignItems: "center",
      "space-x-2": true,
      typography: body1,
      color: "gray.500"
    }}>
                  <span>Last modified: {formatDate(document.updatedAt)}</span>
                  <span>•</span>
                  <span>{formatFileSize(document.size)}</span>
                  <span>•</span>
                  <span sx={{
      display: "flex",
      alignItems: "center",
      gap: 1
    }}>
                    <Clock sx={{
      "w-3": true,
      "h-3": true
    }} />
                    {formatTime(trackingTime)} reading time
                  </span>
                  {isTracking && (
                    <div sx={{
      "w-2": true,
      "h-2": true,
      bgcolor: "green.500",
      borderRadius: 9999px,
      "animate-pulse": true
    }} />
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div sx={{
      display: "flex",
      alignItems: "center",
      "space-x-2": true
    }}>
              <Tooltip title="Get AI-powered suggestions for improvement">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={generateAISuggestions}
                  sx={{
      display: "flex",
      alignItems: "center",
      "space-x-1.5": true
    }}
                >
                  <Lightbulb sx={{
      "h-4": true,
      "w-4": true
    }} />
                  <span>AI Assist</span>
                </Button>
              </Tooltip>

              <Tooltip title="Toggle reading mode for better focus">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={toggleReadingMode}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    ...(readingMode && {
                      backgroundColor: 'blue.50',
                      borderColor: 'blue.200',
                    }),
                  }}
                >
                  <Eye sx={{
      "h-4": true,
      "w-4": true
    }} />
                  <span>Reading</span>
                </Button>
              </Tooltip>

              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowShareDialog(true)}
                sx={{
      display: "flex",
      alignItems: "center",
      "space-x-1.5": true
    }}
              >
                <Share sx={{
      "h-4": true,
      "w-4": true
    }} />
                <span>Share</span>
              </Button>

              <Button
                variant="contained"
                size="small"
                onClick={onEdit}
                sx={{
      display: "flex",
      alignItems: "center",
      "space-x-1.5": true
    }}
              >
                <Edit sx={{
      "h-4": true,
      "w-4": true
    }} />
                <span>Edit Document</span>
              </Button>

              <Tooltip title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
                <Button variant="text" size="small" onClick={toggleFullscreen}>
                  {isFullscreen ? <X sx={{
      "h-4": true,
      "w-4": true
    }} /> : <Settings sx={{
      "h-4": true,
      "w-4": true
    }} />}
                </Button>
              </Tooltip>
            </div>
          </div>
        </header>

        <div sx={{
      display: "flex",
      flex: 1,
      overflow: "hidden"
    }}>
          {/* Main Content Area */}
          <div sx={{
      flex: 1,
      p: 6
    }}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 6
    }}>
              <Button variant="text" onClick={onBack} sx={{
      '&:hover': { bgcolor: "gray.100" }
    }}>
                <ArrowLeft sx={{
      "w-4": true,
      "h-4": true,
      mr: 2
    }} />
                Back to Templates
              </Button>
              <div>
                <h1 sx={{
      typography: h4,
      fontWeight: 700,
      "text-foreground": true
    }}>Document Preview</h1>
                <p sx={{
      typography: body1,
      "text-muted-foreground": true,
      mt: 1
    }}>
                  {mockDocument.title} • Template: {templateName}
                </p>
              </div>
            </div>
            <div sx={{
      display: "flex",
      gap: 2
    }}>
              <Button variant="outlined" onClick={onEdit}>
                <Edit sx={{
      "w-4": true,
      "h-4": true,
      mr: 2
    }} />
                Edit Document
              </Button>
              <Button variant="outlined">
                <Share sx={{
      "w-4": true,
      "h-4": true,
      mr: 2
    }} />
                Share
              </Button>
              <Button variant="outlined">
                <Printer sx={{
      "w-4": true,
      "h-4": true,
      mr: 2
    }} />
                Print
              </Button>
              <Button sx={{
      "bg-primary": true,
      '&:hover': { "bg-primary/90": true }
    }}>
                <Download sx={{
      "w-4": true,
      "h-4": true,
      mr: 2
    }} />
                Download PDF
              </Button>
            </div>
          </div>

          <div sx={{
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('md')]: { "grid-cols-4": true },
      gap: 6
    }}>
            {/* Document Info Sidebar */}
            <div sx={{
      [theme.breakpoints.up('md')]: { "col-span-1": true },
      "space-y-4": true
    }}>
              <Card sx={{
      p: 4
    }}>
                <h3 sx={{
      fontWeight: 500,
      mb: 3
    }}>Document Info</h3>
                <div sx={{
      "space-y-2": true,
      typography: body1
    }}>
                  <div sx={{
      display: "flex",
      justifyContent: "space-between"
    }}>
                    <span sx={{
      "text-muted-foreground": true
    }}>Type:</span>
                    <Badge variant="secondary" sx={{
      textTransform: "capitalize"
    }}>
                      {documentType.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div sx={{
      display: "flex",
      justifyContent: "space-between"
    }}>
                    <span sx={{
      "text-muted-foreground": true
    }}>Template:</span>
                    <span sx={{
      fontWeight: 500
    }}>{templateName}</span>
                  </div>
                  <div sx={{
      display: "flex",
      justifyContent: "space-between"
    }}>
                    <span sx={{
      "text-muted-foreground": true
    }}>Pages:</span>
                    <span sx={{
      fontWeight: 500
    }}>{mockDocument.pages}</span>
                  </div>
                  <div sx={{
      display: "flex",
      justifyContent: "space-between"
    }}>
                    <span sx={{
      "text-muted-foreground": true
    }}>Modified:</span>
                    <span sx={{
      fontWeight: 500
    }}>{mockDocument.lastModified}</span>
                  </div>
                </div>
              </Card>

              <Card sx={{
      p: 4
    }}>
                <h3 sx={{
      fontWeight: 500,
      mb: 3
    }}>View Options</h3>
                <div sx={{
      "space-y-3": true
    }}>
                  <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
                    <span sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Zoom Level</span>
                    <span sx={{
      typography: body1,
      fontWeight: 500
    }}>{zoomLevel}%</span>
                  </div>
                  <div sx={{
      display: "flex",
      gap: 1
    }}>
                    <Button size="small" variant="outlined" onClick={handleZoomOut}>
                      <ZoomOut sx={{
      "w-3": true,
      "h-3": true
    }} />
                    </Button>
                    <Button size="small" variant="outlined" onClick={handleResetZoom}>
                      <RotateCcw sx={{
      "w-3": true,
      "h-3": true
    }} />
                    </Button>
                    <Button size="small" variant="outlined" onClick={handleZoomIn}>
                      <ZoomIn sx={{
      "w-3": true,
      "h-3": true
    }} />
                    </Button>
                  </div>
                </div>
              </Card>

              <Card sx={{
      p: 4
    }}>
                <h3 sx={{
      fontWeight: 500,
      mb: 3
    }}>Export Options</h3>
                <div sx={{
      "space-y-2": true
    }}>
                  <Button variant="outlined" size="small" sx={{
      width: "100%",
      justifyContent: "flex-start"
    }}>
                    <Download sx={{
      "w-3": true,
      "h-3": true,
      mr: 2
    }} />
                    PDF (Recommended)
                  </Button>
                  <Button variant="outlined" size="small" sx={{
      width: "100%",
      justifyContent: "flex-start"
    }}>
                    <Download sx={{
      "w-3": true,
      "h-3": true,
      mr: 2
    }} />
                    Word Document
                  </Button>
                  <Button variant="outlined" size="small" sx={{
      width: "100%",
      justifyContent: "flex-start"
    }}>
                    <Download sx={{
      "w-3": true,
      "h-3": true,
      mr: 2
    }} />
                    Plain Text
                  </Button>
                </div>
              </Card>

              <Card sx={{
      p: 4
    }}>
                <h3 sx={{
      fontWeight: 500,
      mb: 3
    }}>ATS Score</h3>
                <div sx={{
      textAlign: "center"
    }}>
                  <div sx={{
      typography: h4,
      fontWeight: 700,
      "text-green-400": true,
      mb: 2
    }}>87%</div>
                  <div sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Excellent ATS compatibility</div>
                  <Button variant="outlined" size="small" sx={{
      width: "100%",
      mt: 3
    }}>
                    View Details
                  </Button>
                </div>
              </Card>
            </div>

            {/* Document Preview */}
            <div sx={{
      [theme.breakpoints.up('md')]: { "col-span-3": true }
    }}>
              <Card sx={{
      p: 6
    }}>
                <>
                  <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 4
    }}>
                    <h3 sx={{
      fontWeight: 500
    }}>Preview</h3>
                    {mockDocument.pages > 1 && (
                      <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      typography: body1,
      "text-muted-foreground": true
    }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        >
                          Previous
                        </Button>
                        <span>
                          Page {currentPage} of {mockDocument.pages}
                        </span>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            setCurrentPage(Math.min(mockDocument.pages, currentPage + 1))
                          }
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Document Preview Container */}
                  <div sx={{
      bgcolor: "gray.100",
      p: 8,
      borderRadius: 0.5rem,
      display: "flex",
      justifyContent: "center",
      overflow: "auto"
    }}>
                    <div
                      sx={{
      bgcolor: "common.white",
      boxShadow: 4,
      "transition-transform": true,
      "duration-200": true,
      w: "8.5in"
    }}
                      style={{
                        transform: `scale(${zoomLevel / 100})`,
                        transformOrigin: 'top center',
                        minHeight: '11in',
                        aspectRatio: '8.5 / 11',
                      }}
                    >
                      {/* Mock Resume Content */}
                      <div sx={{
      p: 12,
      height: "100%"
    }}>
                        <div sx={{
      "space-y-6": true
    }}>
                          {/* Header */}
                          <div sx={{
      textAlign: "center",
      borderBottom: 1,
      borderColor: "gray.300",
      pb: 4
    }}>
                            <h1 sx={{
      typography: h4,
      fontWeight: 700,
      "text-gray-900": true,
      mb: 2
    }}>
                              Nishant Dougall
                            </h1>
                            <div sx={{
      color: "gray.600",
      "space-y-1": true
    }}>
                              <p>nishant.dougall@email.com • (555) 123-4567</p>
                              <p>Vancouver, BC • linkedin.com/in/nishantdougall</p>
                            </div>
                          </div>

                          {/* Professional Summary */}
                          <div>
                            <h2 sx={{
      typography: h6,
      fontWeight: 600,
      "text-gray-900": true,
      mb: 2,
      borderBottom: 1,
      borderColor: "gray.200",
      pb: 1
    }}>
                              Professional Summary
                            </h2>
                            <p sx={{
      color: "gray.700",
      "leading-relaxed": true
    }}>
                              Dedicated Community Support Worker with 3+ years of experience
                              providing client-centered care and advocacy. Proven track record in
                              crisis intervention, case management, and supporting individuals with
                              mental health challenges and addiction recovery.
                            </p>
                          </div>

                          {/* Experience */}
                          <div>
                            <h2 sx={{
      typography: h6,
      fontWeight: 600,
      "text-gray-900": true,
      mb: 3,
      borderBottom: 1,
      borderColor: "gray.200",
      pb: 1
    }}>
                              Professional Experience
                            </h2>
                            <div sx={{
      "space-y-4": true
    }}>
                              <div>
                                <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      mb: 2
    }}>
                                  <div>
                                    <h3 sx={{
      fontWeight: 500,
      "text-gray-900": true
    }}>
                                      Community Support Worker
                                    </h3>
                                    <p sx={{
      color: "gray.600"
    }}>Community Living BC</p>
                                  </div>
                                  <span sx={{
      color: "gray.500",
      typography: body1
    }}>2021 - Present</span>
                                </div>
                                <ul sx={{
      color: "gray.700",
      "space-y-1": true,
      typography: body1
    }}>
                                  <li>
                                    • Provide support to 25+ individuals with developmental
                                    disabilities and mental health challenges
                                  </li>
                                  <li>
                                    • Facilitate life skills training and community integration
                                    programs
                                  </li>
                                  <li>
                                    • Collaborate with multidisciplinary teams to develop and
                                    implement care plans
                                  </li>
                                  <li>
                                    • Maintain detailed documentation and progress reports for
                                    client files
                                  </li>
                                </ul>
                              </div>

                              <div>
                                <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      mb: 2
    }}>
                                  <div>
                                    <h3 sx={{
      fontWeight: 500,
      "text-gray-900": true
    }}>
                                      Mental Health Support Assistant
                                    </h3>
                                    <p sx={{
      color: "gray.600"
    }}>Fraser Health Authority</p>
                                  </div>
                                  <span sx={{
      color: "gray.500",
      typography: body1
    }}>2019 - 2021</span>
                                </div>
                                <ul sx={{
      color: "gray.700",
      "space-y-1": true,
      typography: body1
    }}>
                                  <li>
                                    • Assisted mental health professionals in group therapy sessions
                                  </li>
                                  <li>• Provided crisis intervention and de-escalation support</li>
                                  <li>
                                    • Connected clients with community resources and support
                                    services
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Skills */}
                          <div>
                            <h2 sx={{
      typography: h6,
      fontWeight: 600,
      "text-gray-900": true,
      mb: 2,
      borderBottom: 1,
      borderColor: "gray.200",
      pb: 1
    }}>
                              Core Competencies
                            </h2>
                            <div sx={{
      color: "gray.700",
      typography: body1
    }}>
                              <p>
                                <strong>Clinical Skills:</strong> Crisis Intervention, Case
                                Management, Mental Health Support, Addiction Counseling
                              </p>
                              <p>
                                <strong>Interpersonal:</strong> Active Listening, Cultural
                                Competency, Team Collaboration, Client Advocacy
                              </p>
                              <p>
                                <strong>Technical:</strong> Documentation, Care Planning, Risk
                                Assessment, Community Resources
                              </p>
                            </div>
                          </div>

                          {/* Education & Certifications */}
                          <div>
                            <h2 sx={{
      typography: h6,
      fontWeight: 600,
      "text-gray-900": true,
      mb: 2,
      borderBottom: 1,
      borderColor: "gray.200",
      pb: 1
    }}>
                              Education & Certifications
                            </h2>
                            <div sx={{
      "space-y-2": true
    }}>
                              <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }}>
                                <div>
                                  <h3 sx={{
      fontWeight: 500,
      "text-gray-900": true
    }}>
                                    Diploma in Community Support Work
                                  </h3>
                                  <p sx={{
      color: "gray.600"
    }}>Douglas College</p>
                                </div>
                                <span sx={{
      color: "gray.500",
      typography: body1
    }}>2019</span>
                              </div>
                              <div sx={{
      typography: body1,
      color: "gray.700"
    }}>
                                <p>
                                  <strong>Certifications:</strong> Mental Health First Aid, Crisis
                                  Prevention Institute (CPI), CPR/AED
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              </Card>
            </div>
          </div>
        </div>
      </Box>
    </TooltipProvider>
  );
}
