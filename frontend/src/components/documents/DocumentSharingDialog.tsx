import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import {
  Close as X,
  ContentCopy as Copy,
  Check,
  Search,
  PersonAdd as UserPlus,
  Mail,
  Lock,
  Public as Globe,
} from '@mui/icons-material';

type PermissionLevel = 'view' | 'comment' | 'edit';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  permission: PermissionLevel;
  status: 'pending' | 'active';
}

interface DocumentSharingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentTitle: string;
  onInvite: (emails: string[], permis_ion: PermissionLevel) => void;
  collaborators?: Collaborator[];
  onUpdatePermission?: (collaboratorId: string, permis_ion: PermissionLevel) => void;
  onRemoveCollaborator?: (collaboratorId: string) => void;
  shareLink?: string;
  onShareLinkCopy?: () => void;
}

export const DocumentSharingDialog: React.FC<DocumentSharingDialogProps> = ({
  open,
  onOpenChange,
  documentTitle,
  onInvite,
  collaborators = [],
  onUpdatePermission,
  onRemoveCollaborator,
  shareLink = '',
  onShareLinkCopy,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [selectedPermission, setSelectedPermission] = useState<PermissionLevel>('view');
  const [copied, setCopied] = useState(false);
  const [inviteSectionOpen, setInviteSectionOpen] = useState(false);

  const handleInvite = () => {
    const emails = emailInput
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e.includes('@'));

    if (emails.length > 0) {
      onInvite(emails, selectedPermission);
      setEmailInput('');
      setInviteSectionOpen(false);
    }
  };

  const handleCopyLink = () => {
    if (!shareLink) return;

    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    onShareLinkCopy?.();

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const filteredCollaborators = collaborators.filter(
    (collab) =>
      collab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collab.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPermissionColor = (permission: PermissionLevel) => {
    switch (permission) {
      case 'view':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'comment':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'edit':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Share "{documentTitle}"</DialogTitle>
      </DialogHeader>
      <DialogContent className="max-w-2xl">
        <div className="space-y-6 py-4">
          {/* Share Link Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Share with link</span>
              </div>
              <Button
                variant={shareLink ? 'default' : 'outline'}
                size="small"
                onClick={handleCopyLink}
                disabled={!shareLink}
                className="h-8"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy link
                  </>
                )}
              </Button>
            </div>
            {!shareLink && (
              <p className="text-sm text-muted-foreground">
                Enable link sharing to generate a shareable link
              </p>
            )}
          </div>

          {/* Invite Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Invite people</span>
              </div>
              <Button
                variant="outline"
                size="small"
                onClick={() => setInviteSectionOpen(!inviteSectionOpen)}
                className="h-8"
              >
                {inviteSectionOpen ? 'Cancel' : 'Add people'}
              </Button>
            </div>

            {inviteSectionOpen && (
              <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter email addresses, separated by commas"
                      className="pl-9"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                    />
                  </div>
                  <select
                    value={selectedPermission}
                    onChange={(e) => setSelectedPermission(e.target.value as PermissionLevel)}
                    className="text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="view">Can view</option>
                    <option value="comment">Can comment</option>
                    <option value="edit">Can edit</option>
                  </select>
                  <Button onClick={handleInvite} disabled={!emailInput.includes('@')}>
                    Invite
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  People with access can view and edit this document
                </p>
              </div>
            )}
          </div>

          {/* Collaborators List */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search people"
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="border rounded-lg divide-y">
              {filteredCollaborators.length > 0 ? (
                filteredCollaborators.map((collab) => (
                  <div key={collab.id} className="p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={collab.avatar} />
                        <AvatarFallback>
                          {collab.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{collab.name}</p>
                        <p className="text-xs text-muted-foreground">{collab.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {collab.status === 'pending' && (
                        <Badge variant="outline" className="text-xs">
                          Pending
                        </Badge>
                      )}
                      <select
                        value={collab.permission}
                        onChange={(e) =>
                          onUpdatePermission?.(collab.id, e.target.value as PermissionLevel)
                        }
                        className="text-sm rounded-md border border-input bg-background px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="view">Can view</option>
                        <option value="comment">Can comment</option>
                        <option value="edit">Can edit</option>
                      </select>
                      <Button
                        variant="link"
                        size="small"
                        className="h-8 w-8"
                        onClick={() => onRemoveCollaborator?.(collab.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <p>No collaborators found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button onClick={() => onOpenChange(false)}>Done</Button>
      </DialogFooter>
    </Dialog>
  );
};
