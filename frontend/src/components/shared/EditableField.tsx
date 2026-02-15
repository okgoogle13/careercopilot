import { Lens, Pebble } from '@/components/ui';
import { Check, Edit, Sparkles, X } from 'lucide-react';
import React, { useState } from 'react';

interface EditableFieldProps {
  label: string;
  value: string;
  suggestion?: string;
  onSave: (newValue: string) => void;
  multiline?: boolean;
  variant?: 'body1' | 'body2' | 'h6';
}

export const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  suggestion,
  onSave,
  multiline = false,
  variant = 'body1',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleApplySuggestion = () => {
    if (suggestion) {
      setEditValue(suggestion);
      onSave(suggestion);
    }
  };

  if (isEditing) {
    return (
      <div className="mb-6 animate-in fade-in slide-in-from-top-1 duration-300">
        <label className="text-[10px] uppercase tracking-widest text-[var(--sys-color-worker-ash-steps-2)] mb-2 block">
          {label}
        </label>
        <Lens
          className="w-full mb-3"
          value={editValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setEditValue(e.target.value)
          }
          variant="filled"
          {...(multiline ? { rows: 4 } : {})}
        />
        <div className="flex items-center gap-3">
          <Pebble
            iconLeft={<Check className="w-4 h-4" />}
            onClick={handleSave}
            size="md"
            className="bg-[var(--sys-color-inkGold-base)]/20 text-[var(--sys-color-inkGold-base)] hover:bg-[var(--sys-color-inkGold-base)] hover:text-white"
            aria-label="save"
          />
          <Pebble
            iconLeft={<X className="w-4 h-4" />}
            onClick={handleCancel}
            size="md"
            className="bg-white/5 text-[var(--sys-color-worker-ash-steps-2)] hover:bg-white/10"
            aria-label="cancel"
          />

          {suggestion && (
            <button
              onClick={handleApplySuggestion}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--sys-color-worker-ash-base)]/10 text-[var(--sys-color-worker-ash-base)] rounded-full text-xs font-bold hover:bg-[var(--sys-color-worker-ash-base)] hover:text-white transition-all duration-300 border border-[var(--sys-color-worker-ash-base)]/20"
            >
              <Sparkles className="w-3 h-3" />
              Seed AI Suggestion
            </button>
          )}
        </div>

        {suggestion && (
          <div className="mt-4 p-3 bg-[var(--sys-color-inkGold-base)]/5 border border-[var(--sys-color-inkGold-base)]/10 rounded-stone">
            <p className="text-xs text-[var(--sys-color-inkGold-base)]/70 italic leading-relaxed">
              💡 Concept: {suggestion}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="group mb-4 p-4 rounded-pebble bg-white/5 border border-white/5 hover:border-[var(--sys-color-inkGold-base)]/30 hover:bg-white/10 transition-all duration-300 cursor-pointer"
      onClick={() => setIsEditing(true)}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <span className="text-[9px] uppercase tracking-widest text-[var(--sys-color-worker-ash-steps-2)] mb-1 block group-hover:text-[var(--sys-color-inkGold-base)] transition-colors">
            {label}
          </span>
          <p
            className={`text-[var(--sys-color-worker-ash-steps-6)]/90 leading-relaxed ${variant === 'h6' ? 'text-lg font-bold' : 'text-base'}`}
          >
            {value || (
              <span className="text-[var(--sys-color-worker-ash-steps-2)]/50 italic">
                (Empty Field)
              </span>
            )}
          </p>
        </div>
        <Edit className="w-4 h-4 text-[var(--sys-color-worker-ash-steps-2)] opacity-30 group-hover:opacity-100 group-hover:text-[var(--sys-color-inkGold-base)] transition-all" />
      </div>
    </div>
  );
};