import { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import {
  ArrowLeft,
  Download,
  Share2,
  Edit3,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Printer,
  MessageSquare,
  Users,
  Clock,
  Check,
  X,
  MoreVertical,
  Copy,
  History,
  GitBranch,
  FileText,
  Star,
  Eye,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  Filter,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Play,
  Pause,
  FileImage,
  Archive,
  Code,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const handleRestoreVersion = (versionId: string) => {
    if (
      window.confirm(
        'Are you sure you want to restore this version? Any unsaved changes will be lost.'
      )
    ) {
      onVersionRestore(versionId);
      setSelectedVersion(null);
    }
  };

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

  // Get ATS score label
  const getAtsScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
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
      pdf: <FileText className="w-4 h-4" />,
      docx: <FileText className="w-4 h-4" />,
      txt: <Code className="w-4 h-4" />,
      jpg: <FileImage className="w-4 h-4" />,
      png: <FileImage className="w-4 h-4" />,
      zip: <Archive className="w-4 h-4" />,
    };
    return icons[format] || <FileText className="w-4 h-4" />;
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          'flex flex-col bg-gray-50 transition-all duration-300',
          isFullscreen ? 'h-screen fixed inset-0 z-50' : 'h-screen'
        )}
      >
        {/* Enhanced Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="text-gray-500 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{document.title}</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Last modified: {formatDate(document.updatedAt)}</span>
                  <span>•</span>
                  <span>{formatFileSize(document.size)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(trackingTime)} reading time
                  </span>
                  {isTracking && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateAISuggestions}
                    className="flex items-center space-x-1.5"
                  >
                    <Lightbulb className="h-4 w-4" />
                    <span>AI Assist</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Get AI-powered suggestions for improvement</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleReadingMode}
                    className={cn(
                      'flex items-center space-x-1.5',
                      readingMode && 'bg-blue-50 border-blue-200'
                    )}
                  >
                    <Eye className="h-4 w-4" />
                    <span>Reading</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle reading mode for better focus</TooltipContent>
              </Tooltip>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShareDialog(true)}
                className="flex items-center space-x-1.5"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={onEdit}
                className="flex items-center space-x-1.5"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Document</span>
              </Button>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                    {isFullscreen ? <X className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" onClick={onBack} className="hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Templates
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Document Preview</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {mockDocument.title} • Template: {templateName}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onEdit}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Document
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Document Info Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="p-4">
                <h3 className="font-medium mb-3">Document Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="secondary" className="capitalize">
                      {documentType.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Template:</span>
                    <span className="font-medium">{templateName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pages:</span>
                    <span className="font-medium">{mockDocument.pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Modified:</span>
                    <span className="font-medium">{mockDocument.lastModified}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-medium mb-3">View Options</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Zoom Level</span>
                    <span className="text-sm font-medium">{zoomLevel}%</span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={handleZoomOut}>
                      <ZoomOut className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleResetZoom}>
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleZoomIn}>
                      <ZoomIn className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-medium mb-3">Export Options</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="w-3 h-3 mr-2" />
                    PDF (Recommended)
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="w-3 h-3 mr-2" />
                    Word Document
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="w-3 h-3 mr-2" />
                    Plain Text
                  </Button>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-medium mb-3">ATS Score</h3>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-2">87%</div>
                  <div className="text-sm text-muted-foreground">Excellent ATS compatibility</div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    View Details
                  </Button>
                </div>
              </Card>
            </div>

            {/* Document Preview */}
            <div className="lg:col-span-3">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Preview</h3>
                  {mockDocument.pages > 1 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      >
                        Previous
                      </Button>
                      <span>
                        Page {currentPage} of {mockDocument.pages}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
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
                <div className="bg-gray-100 p-8 rounded-lg flex justify-center overflow-auto">
                  <div
                    className="bg-white shadow-lg transition-transform duration-200 max-w-[8.5in]"
                    style={{
                      transform: `scale(${zoomLevel / 100})`,
                      transformOrigin: 'top center',
                      minHeight: '11in',
                      aspectRatio: '8.5 / 11',
                    }}
                  >
                    {/* Mock Resume Content */}
                    <div className="p-12 h-full">
                      <div className="space-y-6">
                        {/* Header */}
                        <div className="text-center border-b border-gray-300 pb-4">
                          <h1 className="text-2xl font-bold text-gray-900 mb-2">Nishant Dougall</h1>
                          <div className="text-gray-600 space-y-1">
                            <p>nishant.dougall@email.com • (555) 123-4567</p>
                            <p>Vancouver, BC • linkedin.com/in/nishantdougall</p>
                          </div>
                        </div>

                        {/* Professional Summary */}
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
                            Professional Summary
                          </h2>
                          <p className="text-gray-700 leading-relaxed">
                            Dedicated Community Support Worker with 3+ years of experience providing
                            client-centered care and advocacy. Proven track record in crisis
                            intervention, case management, and supporting individuals with mental
                            health challenges and addiction recovery.
                          </p>
                        </div>

                        {/* Experience */}
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                            Professional Experience
                          </h2>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-medium text-gray-900">
                                    Community Support Worker
                                  </h3>
                                  <p className="text-gray-600">Community Living BC</p>
                                </div>
                                <span className="text-gray-500 text-sm">2021 - Present</span>
                              </div>
                              <ul className="text-gray-700 space-y-1 text-sm">
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
                                  • Maintain detailed documentation and progress reports for client
                                  files
                                </li>
                              </ul>
                            </div>

                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-medium text-gray-900">
                                    Mental Health Support Assistant
                                  </h3>
                                  <p className="text-gray-600">Fraser Health Authority</p>
                                </div>
                                <span className="text-gray-500 text-sm">2019 - 2021</span>
                              </div>
                              <ul className="text-gray-700 space-y-1 text-sm">
                                <li>
                                  • Assisted mental health professionals in group therapy sessions
                                </li>
                                <li>• Provided crisis intervention and de-escalation support</li>
                                <li>
                                  • Connected clients with community resources and support services
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Skills */}
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
                            Core Competencies
                          </h2>
                          <div className="text-gray-700 text-sm">
                            <p>
                              <strong>Clinical Skills:</strong> Crisis Intervention, Case
                              Management, Mental Health Support, Addiction Counseling
                            </p>
                            <p>
                              <strong>Interpersonal:</strong> Active Listening, Cultural Competency,
                              Team Collaboration, Client Advocacy
                            </p>
                            <p>
                              <strong>Technical:</strong> Documentation, Care Planning, Risk
                              Assessment, Community Resources
                            </p>
                          </div>
                        </div>

                        {/* Education & Certifications */}
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
                            Education & Certifications
                          </h2>
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  Diploma in Community Support Work
                                </h3>
                                <p className="text-gray-600">Douglas College</p>
                              </div>
                              <span className="text-gray-500 text-sm">2019</span>
                            </div>
                            <div className="text-sm text-gray-700">
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
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
