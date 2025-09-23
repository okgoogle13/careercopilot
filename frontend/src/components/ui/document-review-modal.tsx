import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Badge } from './badge';
import { Textarea } from './textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { KeywordTagGroup } from './keyword-tag-group';
import { Progress } from './progress';
import { cn } from '@/lib/utils';
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Download,
  Send,
  Clock,
  User,
  Building,
  MapPin,
} from 'lucide-react';
import {
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
} from '@mui/material';

interface DocumentData {
  type: 'resume' | 'cover_letter' | 'ksc_response';
  title: string;
  content: string;
  metadata: {
    wordCount?: number;
    lastModified?: Date;
    targetJob?: {
      title: string;
      company: string;
      location: string;
    };
    matchScore?: number;
  };
  keywords?: Array<{
    keyword: string;
    status: 'matched' | 'missing' | 'suggested' | 'accepted' | 'rejected';
    id?: string;
  }>;
  aiSuggestions?: string[];
  issues?: Array<{
    type: 'warning' | 'error' | 'suggestion';
    message: string;
  }>;
}

interface DocumentReviewModalProps {
  document: DocumentData;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: (document: DocumentData) => void;
  onEdit?: (document: DocumentData) => void;
  onDownload?: (document: DocumentData) => void;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}

export function DocumentReviewModal({
  document,
  isOpen,
  onOpenChange,
  onConfirm,
  onEdit,
  onDownload,
  trigger,
  children,
}: DocumentReviewModalProps) {
  const [activeTab, setActiveTab] = useState('preview');
  const [editedContent, setEditedContent] = useState(document.content);
  const [keywords, setKeywords] = useState(document.keywords || []);

  const handleKeywordAccept = (keyword: string) => {
    setKeywords((prev) =>
      prev.map((k) => (k.keyword === keyword ? { ...k, status: 'accepted' as const } : k))
    );
  };

  const handleKeywordReject = (keyword: string) => {
    setKeywords((prev) =>
      prev.map((k) => (k.keyword === keyword ? { ...k, status: 'rejected' as const } : k))
    );
  };

  const handleKeywordRemove = (keyword: string) => {
    setKeywords((prev) => prev.filter((k) => k.keyword !== keyword));
  };

  const getDocumentIcon = () => {
    switch (document.type) {
      case 'resume':
        return <FileText className="w-5 h-5" />;
      case 'cover_letter':
        return <FileText className="w-5 h-5" />;
      case 'ksc_response':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getDocumentTypeLabel = () => {
    switch (document.type) {
      case 'resume':
        return 'Resume';
      case 'cover_letter':
        return 'Cover Letter';
      case 'ksc_response':
        return 'KSC Response';
      default:
        return 'Document';
    }
  };

  const matchScore = document.metadata.matchScore || 0;
  const matchScoreColor =
    matchScore >= 80
      ? 'text-brand-green'
      : matchScore >= 60
        ? 'text-brand-yellow'
        : 'text-destructive';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getDocumentIcon()}
            Review and Confirm {getDocumentTypeLabel()}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Document Metadata */}
          <Card className="mb-4 p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{document.title}</h3>
                {document.metadata.targetJob && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {document.metadata.targetJob.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {document.metadata.targetJob.title}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {document.metadata.targetJob.location}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {document.metadata.wordCount && <span>{document.metadata.wordCount} words</span>}
                  {document.metadata.lastModified && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {document.metadata.lastModified.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-muted-foreground">Match Score:</span>
                  <span className={cn('font-bold text-lg', matchScoreColor)}>{matchScore}%</span>
                </div>
                <Progress value={matchScore} className="w-24 h-2" />
              </div>
            </div>

            {/* Issues */}
            {document.issues && document.issues.length > 0 && (
              <div className="mt-4 space-y-2">
                {document.issues.map((issue, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-2 p-2 rounded text-sm',
                      issue.type === 'error' &&
                        'bg-destructive/10 text-destructive border border-destructive/20',
                      issue.type === 'warning' &&
                        'bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20',
                      issue.type === 'suggestion' &&
                        'bg-primary/10 text-primary border border-primary/20'
                    )}
                  >
                    {issue.type === 'error' && (
                      <AlertTriangle className="w-4 h-4 mt-0.5 text-destructive" />
                    )}
                    {issue.type === 'warning' && (
                      <AlertTriangle className="w-4 h-4 mt-0.5 text-brand-yellow" />
                    )}
                    {issue.type === 'suggestion' && (
                      <CheckCircle className="w-4 h-4 mt-0.5 text-primary" />
                    )}
                    <span>{issue.message}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="keywords" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Keywords
              </TabsTrigger>
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 mt-4">
              <TabsContent value="preview" className="h-full">
                <Card className="p-6 h-full overflow-y-auto">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(document.content) }}
                  />
                </Card>
              </TabsContent>

              <TabsContent value="keywords" className="h-full">
                <div className="space-y-4 h-full overflow-y-auto">
                  {keywords.length > 0 ? (
                    <KeywordTagGroup
                      keywords={keywords}
                      title="Job-Relevant Keywords"
                      description="Review and manage keywords found in your document"
                      onTagAccept={handleKeywordAccept}
                      onTagReject={handleKeywordReject}
                      onTagRemove={handleKeywordRemove}
                      showAcceptRejectAll={true}
                    />
                  ) : (
                    <Card className="p-8 text-center text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No keywords detected in this document</p>
                    </Card>
                  )}

                  {document.aiSuggestions && document.aiSuggestions.length > 0 && (
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">AI Suggestions</h4>
                      <ul className="space-y-2">
                        {document.aiSuggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="edit" className="h-full">
                <Card className="p-4 h-full">
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="h-full min-h-[400px] resize-none"
                    placeholder="Edit your document content..."
                  />
                </Card>
              </TabsContent>
            </div>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t">
            <div className="flex gap-2">
              <Button
                variant="outlined"
                onClick={() => onEdit?.({ ...document, content: editedContent })}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Continue Editing
              </Button>
              <Button
                variant="outlined"
                onClick={() => onDownload?.(document)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outlined" onClick={() => onOpenChange?.(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onConfirm?.({ ...document, content: editedContent, keywords });
                  onOpenChange?.(false);
                }}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Confirm & Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      {children}
    </Dialog>
  );
}
