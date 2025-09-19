import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Button } from './button';
import { Card } from './card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { KeywordTagGroup } from './keyword-tag-group';
import { Progress } from './progress';
import { FileText, CheckCircle, Edit, Download, Send } from 'lucide-react';

type KeywordTagGroupProps = {
  keywords: Array<{
    keyword: string;
    status: 'matched' | 'missing' | 'suggested' | 'accepted' | 'rejected';
    id?: string;
  }>;
  onStatusChange?: (keyword: string, status: 'accepted' | 'rejected') => void;
};

interface ApplicationDocument {
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
  aiSuggestions?: string[];
  issues?: Array<{
    type: 'warning' | 'error' | 'suggestion';
    message: string;
  }>;
  keywords?: Array<{
    keyword: string;
    status: 'matched' | 'missing' | 'suggested' | 'accepted' | 'rejected';
    id?: string;
  }>;
}

interface DocumentReviewModalProps {
  document: ApplicationDocument;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: (document: ApplicationDocument) => void;
  onEdit?: (document: ApplicationDocument) => void;
  onDownload?: (document: ApplicationDocument) => void;
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
  const [editedContent, setEditedContent] = useState(document.content);
  const [activeTab, setActiveTab] = useState('preview');
  type KeywordType = {
    keyword: string;
    status: 'matched' | 'missing' | 'suggested' | 'accepted' | 'rejected';
    id?: string;
  };

  const [keywords, setKeywords] = useState<KeywordType[]>(
    document.keywords || [
      { keyword: 'React', status: 'matched' as const },
      { keyword: 'TypeScript', status: 'suggested' as const },
      { keyword: 'Node.js', status: 'missing' as const },
    ]
  );

  const handleKeywordStatusChange = (keyword: string, status: 'accepted' | 'rejected') => {
    setKeywords(
      keywords.map((k) => (k.keyword === keyword ? { ...k, status } : k))
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Review {document.type.replace('_', ' ')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Document</p>
                <p className="font-medium">{document.title}</p>
              </div>
            </div>
            {document.metadata?.wordCount && (
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Word Count</p>
                  <p className="font-medium">{document.metadata.wordCount}</p>
                </div>
              </div>
            )}
            {document.metadata?.matchScore !== undefined && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Match Score</p>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={document.metadata.matchScore}
                      className="h-2 w-24"
                    />
                    <span className="font-medium">
                      {Math.round(document.metadata.matchScore)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="mt-4">
              <Card className="p-6 min-h-[400px] overflow-auto">
                <div
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: editedContent }}
                />
              </Card>
            </TabsContent>

            <TabsContent value="keywords" className="mt-4">
              <KeywordTagGroup
                keywords={keywords}
                onStatusChange={handleKeywordStatusChange}
              />
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onEdit?.({ ...document, content: editedContent })}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Continue Editing
              </Button>
              <Button
                variant="outline"
                onClick={() => onDownload?.(document)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange?.(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onConfirm?.({ ...document, content: editedContent, keywords });
                  onOpenChange?.(false);
                }}
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Application
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      {children}
    </Dialog>
  );
}
