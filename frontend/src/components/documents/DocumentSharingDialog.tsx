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
      <DialogContent sx={{}}>
        <div sx={{
      py: 4
    }}>
          {/* Share Link Section */}
          <div sx={{}}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
              <div sx={{
      display: "flex",
      alignItems: "center",}}>
                <Globe sx={{}} />
                <span sx={{
      typography: "body1",
      fontWeight: 500
    }}>Share with link</span>
              </div>
              <Button
                variant={shareLink ? 'default' : 'outline'}
                size="small"
                onClick={handleCopyLink}
                disabled={!shareLink}
                sx={{}}
              >
                {copied ? (
                  <>
                    <Check sx={{
      mr: 1
    }} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy sx={{
      mr: 1
    }} />
                    Copy link
                  </>
                )}
              </Button>
            </div>
            {!shareLink && (
              <p sx={{
      typography: "body1",}}>
                Enable link sharing to generate a shareable link
              </p>
            )}
          </div>

          {/* Invite Section */}
          <div sx={{}}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
              <div sx={{
      display: "flex",
      alignItems: "center",}}>
                <UserPlus sx={{}} />
                <span sx={{
      typography: "body1",
      fontWeight: 500
    }}>Invite people</span>
              </div>
              <Button
                variant="outline"
                size="small"
                onClick={() => setInviteSectionOpen(!inviteSectionOpen)}
                sx={{}}
              >
                {inviteSectionOpen ? 'Cancel' : 'Add people'}
              </Button>
            </div>

            {inviteSectionOpen && (
              <div sx={{
      p: 3,
      borderRadius: "0.5rem"
    }}>
                <div sx={{
      display: "flex",}}>
                  <div sx={{
      flex: 1,}}>
                    <Mail sx={{}} />
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
      typography: "body1",
      borderRadius: "0.375rem",
      border: 1,
      px: 3,
      py: 2,
      '&:focus': { outline: 'none' },
      '&:focus': { outline: 'none', boxShadow: '0 0 0 2px currentColor' },}}
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
      typography: "body2",}}>
                  People with access can view and edit this document
                </p>
              </div>
            )}
          </div>

          {/* Collaborators List */}
          <div sx={{}}>
            <div sx={{}}>
              <Search sx={{}} />
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
      borderRadius: "0.5rem",}}>
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
      alignItems: "center",}}>
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
      typography: "body1",
      fontWeight: 500
    }}>{collab.name}</p>
                        <p sx={{
      typography: "body2",}}>{collab.email}</p>
                      </div>
                    </div>
                    <div sx={{
      display: "flex",
      alignItems: "center",}}>
                      {collab.status === 'pending' && (
                        <Badge variant="outline" sx={{
      typography: "body2"
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
      typography: "body1",
      borderRadius: "0.375rem",
      border: 1,
      px: 2,
      py: 1,
      '&:focus': { outline: 'none' },
      '&:focus': { outline: 'none', boxShadow: '0 0 0 2px currentColor' },}}
                      >
                        <option value="view">Can view</option>
                        <option value="comment">Can comment</option>
                        <option value="edit">Can edit</option>
                      </select>
                      <Button
                        variant="link"
                        size="small"
                        sx={{}}
                        onClick={() => onRemoveCollaborator?.(collab.id)}
                      >
                        <X sx={{}} />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div sx={{
      p: 6,
      textAlign: "center",}}>
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
