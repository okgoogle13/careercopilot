import React, { useState } from 'react';
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
  Star,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { M3Card, M3CardHeader, M3CardTitle, M3CardDescription, M3CardContent, M3CardFooter } from '../ui/m3-card';
import { M3Button } from '../ui/m3-button';
import { Badge } from '../ui/badge';
import { Avatar } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { cn, formatDate, formatRelativeTime } from '../ui/utils';

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
  className?: string;
}

export function DocumentCard({
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
  className
}: DocumentCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = () => {
    switch (document.status) {
      case 'completed':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'in-review':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'published':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'draft':
      default:
        return 'bg-outline-variant/10 text-muted-foreground border-outline-variant/20';
    }
  };

  const getStatusIcon = () => {
    switch (document.status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      case 'in-review':
        return <Clock className="w-3 h-3" />;
      case 'published':
        return <Star className="w-3 h-3" />;
      case 'draft':
      default:
        return <Edit3 className="w-3 h-3" />;
    }
  };

  const getTypeIcon = () => {
    switch (document.type) {
      case 'resume':
        return <FileText className="w-5 h-5" />;
      case 'cover-letter':
        return <FileText className="w-5 h-5" />;
      case 'selection-criteria':
        return <FileText className="w-5 h-5" />;
      case 'portfolio':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(document.id);
    } else if (onView) {
      onView(document.id);
    }
  };

  if (variant === 'compact') {
    return (
      <M3Card
        variant={selected ? 'selected' : 'interactive'}
        className={cn(
          'transition-all duration-300 cursor-pointer',
          className
        )}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <M3CardContent className="p-4">
          <div className="flex items-center gap-3">
            {/* Document Icon */}
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface-container-high">
              {getTypeIcon()}
            </div>

            {/* Document Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-foreground truncate">{document.title}</h3>
                <Badge variant="outline" className={cn('text-xs', getStatusColor())}>
                  {getStatusIcon()}
                  <span className="ml-1">{document.status}</span>
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Modified {formatRelativeTime(document.lastModified)} • v{document.version}
              </div>
            </div>

            {/* ATS Score */}
            {document.atsScore && (
              <div className="text-center">
                <div className={cn(
                  'text-lg font-semibold px-2 py-1 rounded-lg',
                  document.atsScore >= 80 ? 'text-green-600 bg-green-500/10' :
                  document.atsScore >= 60 ? 'text-yellow-600 bg-yellow-500/10' :
                  'text-red-600 bg-red-500/10'
                )}>
                  {document.atsScore}
                </div>
                <div className="text-xs text-muted-foreground">ATS</div>
              </div>
            )}

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <M3Button
                  variant="text"
                  size="small"
                  icon={<MoreHorizontal className="w-4 h-4" />}
                  className="p-2"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView?.(document.id)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(document.id)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload?.(document.id)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onShare?.(document.id)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate?.(document.id)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete?.(document.id)} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </M3CardContent>
      </M3Card>
    );
  }

  return (
    <M3Card
      variant={selected ? 'selected' : 'interactive'}
      className={cn(
        'card-aurora transition-all duration-300 cursor-pointer group',
        variant === 'grid' && 'h-full',
        className
      )}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <M3CardHeader>
        <div className="flex items-start justify-between mb-4">
          {/* Document Type & AI Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 transition-transform duration-300 hover:scale-110">
              <div className="icon-interactive">
                {getTypeIcon()}
              </div>
            </div>
            {document.aiGenerated && (
              <Badge variant="secondary" className="bg-primary/10 text-primary text-xs transition-transform duration-300 hover:scale-105">
                AI Generated
              </Badge>
            )}
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <M3Button
                variant="text"
                size="small"
                icon={<MoreHorizontal className="w-4 h-4" />}
                className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(document.id)}>
                <Eye className="w-4 h-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(document.id)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload?.(document.id)}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onShare?.(document.id)}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate?.(document.id)}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete?.(document.id)} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <M3CardTitle className="text-lg mb-2">
          {document.title}
        </M3CardTitle>

        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className={cn('text-xs', getStatusColor())}>
            {getStatusIcon()}
            <span className="ml-1">{document.status.replace('-', ' ')}</span>
          </Badge>
          
          <Badge variant="secondary" className="text-xs">
            v{document.version}
          </Badge>

          {document.template && (
            <Badge variant="outline" className="text-xs">
              {document.template}
            </Badge>
          )}
        </div>

        <M3CardDescription className="text-sm">
          {document.type.replace('-', ' ').toUpperCase()} • 
          Created {formatDate(document.createdDate)} • 
          {document.fileSize && `${document.fileSize} • `}
          {document.pageCount && `${document.pageCount} page${document.pageCount > 1 ? 's' : ''}`}
        </M3CardDescription>
      </M3CardHeader>

      <M3CardContent>
        {/* Document Thumbnail/Preview */}
        {document.thumbnail ? (
          <div className="aspect-[3/4] bg-surface-container-low rounded-lg mb-4 overflow-hidden">
            <img 
              src={document.thumbnail} 
              alt={document.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-[3/4] bg-surface-container-low rounded-lg mb-4 flex items-center justify-center">
            <div className="text-center">
              {getTypeIcon()}
              <p className="text-sm text-muted-foreground mt-2">
                {document.type.replace('-', ' ')}
              </p>
            </div>
          </div>
        )}

        {/* ATS Score */}
        {document.atsScore && (
          <div className="flex items-center justify-between mb-4 p-3 bg-surface-container-low rounded-lg">
            <span className="text-sm font-medium text-foreground">ATS Score</span>
            <div className={cn(
              'text-lg font-semibold px-3 py-1 rounded-lg',
              document.atsScore >= 80 ? 'text-green-600 bg-green-500/10' :
              document.atsScore >= 60 ? 'text-yellow-600 bg-yellow-500/10' :
              'text-red-600 bg-red-500/10'
            )}>
              {document.atsScore}%
            </div>
          </div>
        )}

        {/* Tags */}
        {document.tags && document.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {document.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {document.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{document.tags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Shared With */}
        {document.sharedWith && document.sharedWith.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Shared with:</span>
              <div className="flex -space-x-2">
                {document.sharedWith.slice(0, 3).map((user, index) => (
                  <div key={user.id} className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center border-2 border-background">
                    {user.name.charAt(0)}
                  </div>
                ))}
                {document.sharedWith.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs flex items-center justify-center border-2 border-background">
                    +{document.sharedWith.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Metrics */}
        {document.metrics && (
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="font-semibold text-foreground">{document.metrics.views}</div>
              <div className="text-muted-foreground">Views</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">{document.metrics.downloads}</div>
              <div className="text-muted-foreground">Downloads</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">{document.metrics.applications}</div>
              <div className="text-muted-foreground">Applications</div>
            </div>
          </div>
        )}
      </M3CardContent>

      <M3CardFooter className="flex gap-3">
        <M3Button
          variant="outlined"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(document.id);
          }}
          icon={<Edit3 className="w-4 h-4 icon-interactive" />}
          className="flex-1"
        >
          Edit
        </M3Button>
        
        <M3Button
          variant="filled"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onView?.(document.id);
          }}
          icon={<Eye className="w-4 h-4 icon-interactive" />}
          className="flex-1"
        >
          View
        </M3Button>
      </M3CardFooter>
    </M3Card>
  );
}