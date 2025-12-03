/**
 * ELECTRIC ALCHEMIST: CONFIRM TAGS MODAL COMPONENT
 *
 * A modal for confirming and editing document tags before processing.
 */

import React, { useState } from 'react';
import { X, Check, Tag } from 'lucide-react';
import { ElectricButton as Button } from '@/components/electric/button';
import { ElectricInput as Input } from '@/components/electric/input';
import { ElectricBadge as Badge } from '@/components/electric/badge';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

export interface ConfirmTagsModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (tags: string[]) => void;
  initialTags?: string[];
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  className?: string;
}

export function ConfirmTagsModal({
  open,
  onClose,
  onConfirm,
  initialTags = [],
  title = 'Confirm Document Tags',
  description = 'Review and edit the tags for this document',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  className,
}: ConfirmTagsModalProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      const trimmedTag = newTag.trim();
      if (!tags.includes(trimmedTag)) {
        setTags([...tags, trimmedTag]);
        setNewTag('');
      }
    }
  };

  const removeTag = (tagToRemove: string): void => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleConfirm = (): void => {
    onConfirm(tags);
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className={cn(
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          'bg-surface-container-highest rounded-lg p-6 w-full max-w-md',
          'shadow-lg z-50 focus:outline-none',
          className
        )}>
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-full p-1 hover:bg-surface-variant/20" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          
          <Dialog.Description className="text-on-surface-variant mb-4">
            {description}
          </Dialog.Description>

          <div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-4 min-h-12 p-2 border border-outline-variant rounded-lg">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full text-sm"
                  >
                    <Tag className="h-3.5 w-3.5" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 rounded-full p-0.5 hover:bg-surface-variant/20"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-on-surface-variant/70 italic">No tags added yet</p>
              )}
            </div>

            <div className="relative">
              <Input
                type="text"
                value={newTag}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add a tag and press Enter"
                className="pl-9"
              />
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Dialog.Close asChild>
              <Button variant="outline" onClick={onClose} className="px-4">
                {cancelText}
              </Button>
            </Dialog.Close>
            <Button onClick={handleConfirm} className="px-4">
              <Check className="mr-2 h-4 w-4" />
              {confirmText}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ConfirmTagsModal;
