import {
  Close as X,
  ContentCopy as Copy,
  Check,
  Search,
  PersonAdd as UserPlus,
  Mail,
  Public as Globe,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import React, { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Share "{documentTitle}"</DialogTitle>
      </DialogHeader>
      <DialogContent sx={{
      "max-w-2xl": true
    }}>
        <div sx={{
      "space-y-6": true,
      py: 4
    }}>
          {/* Share Link Section */}
          <div sx={{
      "space-y-3": true
    }}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
              <div sx={{
      display: "flex",
      alignItems: "center",
      "space-x-2": true
    }}>
                <Globe sx={{
      "h-5": true,
      "w-5": true,
      "text-muted-foreground": true
    }} />
                <span sx={{
      typography: body1,
      fontWeight: 500
    }}>Share with link</span>
              </div>
              <Button
                variant={shareLink ? 'default' : 'outline'}
                size="small"
                onClick={handleCopyLink}
                disabled={!shareLink}
                sx={{
      "h-8": true
    }}
              >
                {copied ? (
                  <>
                    <Check sx={{
      "h-4": true,
      "w-4": true,
      mr: 1
    }} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy sx={{
      "h-4": true,
      "w-4": true,
      mr: 1
    }} />
                    Copy link
                  </>
                )}
              </Button>
            </div>
            {!shareLink && (
              <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>
                Enable link sharing to generate a shareable link
              </p>
            )}
          </div>

          {/* Invite Section */}
          <div sx={{
      "space-y-3": true
    }}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
              <div sx={{
      display: "flex",
      alignItems: "center",
      "space-x-2": true
    }}>
                <UserPlus sx={{
      "h-5": true,
      "w-5": true,
      "text-muted-foreground": true
    }} />
                <span sx={{
      typography: body1,
      fontWeight: 500
    }}>Invite people</span>
              </div>
              <Button
                variant="outline"
                size="small"
                onClick={() => setInviteSectionOpen(!inviteSectionOpen)}
                sx={{
      "h-8": true
    }}
              >
                {inviteSectionOpen ? 'Cancel' : 'Add people'}
              </Button>
            </div>

            {inviteSectionOpen && (
              <div sx={{
      "space-y-3": true,
      p: 3,
      "bg-muted/30": true,
      borderRadius: 0.5rem
    }}>
                <div sx={{
      display: "flex",
      "space-x-2": true
    }}>
                  <div sx={{
      flex: 1,
      "relative": true
    }}>
                    <Mail sx={{
      "absolute": true,
      "left-3": true,
      "top-1/2": true,
      "-translate-y-1/2": true,
      "h-4": true,
      "w-4": true,
      "text-muted-foreground": true
    }} />
                    <Input
                      type="email"
                      placeholder="Enter email addresses, separated by commas"
                      sx={{
      pl: 9
    }}
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                    />
                  </div>
                  <select
                    value={selectedPermission}
                    onChange={(e) => setSelectedPermission(e.target.value as PermissionLevel)}
                    sx={{
      typography: body1,
      borderRadius: 0.375rem,
      border: 1,
      "border-input": true,
      "bg-background": true,
      px: 3,
      py: 2,
      '&:focus': { outline: 'none' },
      '&:focus': { outline: 'none', boxShadow: '0 0 0 2px currentColor' },
      "focus:ring-primary/50": true
    }}
                  >
                    <option value="view">Can view</option>
                    <option value="comment">Can comment</option>
                    <option value="edit">Can edit</option>
                  </select>
                  <Button onClick={handleInvite} disabled={!emailInput.includes('@')}>
                    Invite
                  </Button>
                </div>
                <p sx={{
      typography: body2,
      "text-muted-foreground": true
    }}>
                  People with access can view and edit this document
                </p>
              </div>
            )}
          </div>

          {/* Collaborators List */}
          <div sx={{
      "space-y-3": true
    }}>
            <div sx={{
      "relative": true
    }}>
              <Search sx={{
      "absolute": true,
      "left-3": true,
      "top-1/2": true,
      "-translate-y-1/2": true,
      "h-4": true,
      "w-4": true,
      "text-muted-foreground": true
    }} />
              <Input
                placeholder="Search people"
                sx={{
      pl: 9
    }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div sx={{
      border: 1,
      borderRadius: 0.5rem,
      "divide-y": true
    }}>
              {filteredCollaborators.length > 0 ? (
                filteredCollaborators.map((collab) => (
                  <div key={collab.id} sx={{
      p: 3,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
                    <div sx={{
      display: "flex",
      alignItems: "center",
      "space-x-3": true
    }}>
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
                        <p sx={{
      typography: body1,
      fontWeight: 500
    }}>{collab.name}</p>
                        <p sx={{
      typography: body2,
      "text-muted-foreground": true
    }}>{collab.email}</p>
                      </div>
                    </div>
                    <div sx={{
      display: "flex",
      alignItems: "center",
      "space-x-2": true
    }}>
                      {collab.status === 'pending' && (
                        <Badge variant="outline" sx={{
      typography: body2
    }}>
                          Pending
                        </Badge>
                      )}
                      <select
                        value={collab.permission}
                        onChange={(e) =>
                          onUpdatePermission?.(collab.id, e.target.value as PermissionLevel)
                        }
                        sx={{
      typography: body1,
      borderRadius: 0.375rem,
      border: 1,
      "border-input": true,
      "bg-background": true,
      px: 2,
      py: 1,
      '&:focus': { outline: 'none' },
      '&:focus': { outline: 'none', boxShadow: '0 0 0 2px currentColor' },
      "focus:ring-primary/50": true
    }}
                      >
                        <option value="view">Can view</option>
                        <option value="comment">Can comment</option>
                        <option value="edit">Can edit</option>
                      </select>
                      <Button
                        variant="link"
                        size="small"
                        sx={{
      "h-8": true,
      "w-8": true
    }}
                        onClick={() => onRemoveCollaborator?.(collab.id)}
                      >
                        <X sx={{
      "h-4": true,
      "w-4": true
    }} />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div sx={{
      p: 6,
      textAlign: "center",
      "text-muted-foreground": true
    }}>
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
