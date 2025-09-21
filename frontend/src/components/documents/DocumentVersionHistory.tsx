import React from 'react';
import { FileClock, Clock, CheckCircle2, User, Download, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../lib/utils';

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
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center space-x-2 text-muted-foreground">
        <FileClock className="h-5 w-5" />
        <h3 className="font-medium">Version History</h3>
      </div>

      {versions.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No version history available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {versions.map((version) => (
            <div
              key={version.id}
              className={cn(
                'border rounded-lg p-4 transition-colors',
                version.isCurrent ? 'border-primary/50 bg-primary/5' : 'border-border'
              )}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">
                      Version {version.version}
                      {version.isCurrent && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </h4>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-3.5 w-3.5 mr-1" />
                    <span>{version.modifiedBy}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDistanceToNow(version.createdAt, { addSuffix: true })}</span>
                    <span className="mx-2">•</span>
                    <span>{formatFileSize(version.size)}</span>
                  </div>

                  {version.changes && version.changes.length > 0 && (
                    <ul className="text-sm text-muted-foreground list-disc list-inside mt-1">
                      {version.changes.map((change, i) => (
                        <li key={i} className="text-sm">
                          {change}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  {onDownload && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDownload(version)}
                      className="h-8 w-8"
                      title="Download this version"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {onRestore && !version.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRestore(version)}
                      className="h-8"
                    >
                      Restore
                    </Button>
                  )}
                  
                  {onDelete && !version.isCurrent && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(version)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      title="Delete this version"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
