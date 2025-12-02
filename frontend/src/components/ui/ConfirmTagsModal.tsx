/**
 * ELECTRIC ALCHEMIST: CONFIRM TAGS MODAL COMPONENT
 *
 * Modal for confirming tags with design system tokens.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button/Button';
import { Card } from './Card';

interface ConfirmTagsModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  tags?: string[];
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmTagsModal({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Tags',
  message = 'Are you sure you want to proceed?',
  tags = [],
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}: ConfirmTagsModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-hero text-xl font-semibold text-on-surface">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-surface-container-low transition-colors"
                  >
                    <X className="h-5 w-5 text-on-surface-variant" />
                  </button>
                </div>

                <p className="text-human text-base text-on-surface-variant mb-4">{message}</p>

                {tags.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-[8px] bg-surface-container text-on-surface text-data text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={onClose} className="flex-1">
                    {cancelLabel}
                  </Button>
                  <Button onClick={onConfirm} className="flex-1">
                    {confirmLabel}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ConfirmTagsModal;

