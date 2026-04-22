import { ScaffoldInput } from '../ui/ScaffoldInput';
import { Strike } from '../ui/Strike';
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
        <label className="text-[10px] uppercase tracking-widest text-[var(--color-concrete-grey-dark)] mb-2 block">
          {label}
        </label>
        <ScaffoldInput
          className="w-full mb-3"
          value={editValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setEditValue(e.target.value)
          }
          variant="filled"
          {...(multiline ? { rows: 4 } : {})}
        />
        <div className="flex items-center gap-3">
          <Strike
            iconLeft={<Check className="w-4 h-4" />}
            onClick={handleSave}
            size="md"
            className="bg-[var(--color-ink-gold)]/20 text-[var(--color-ink-gold)] hover:bg-[var(--color-ink-gold)] hover:text-white"
            aria-label="save"
          />
          <Strike
            iconLeft={<X className="w-4 h-4" />}
            onClick={handleCancel}
            size="md"
            className="bg-white/5 text-[var(--color-concrete-grey-dark)] hover:bg-white/10"
            aria-label="cancel"
          />

          {suggestion && (
            <button
              onClick={handleApplySuggestion}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-concrete-grey-base)]/10 text-[var(--color-concrete-grey-base)] rounded-march text-xs font-bold hover:bg-[var(--color-concrete-grey-base)] hover:text-white transition-all duration-300 border border-[var(--color-concrete-grey-base)]/20"
            >
              <Sparkles className="w-3 h-3" />
              Seed AI Suggestion
            </button>
          )}
        </div>

        {suggestion && (
          <div className="mt-4 p-3 bg-[var(--color-ink-gold)]/5 border border-[var(--color-ink-gold)]/10 rounded-megaphone">
            <p className="text-xs text-[var(--color-ink-gold)]/70 italic leading-relaxed">
              💡 Concept: {suggestion}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="group mb-4 p-4 rounded-march bg-white/5 border border-white/5 hover:border-[var(--color-ink-gold)]/30 hover:bg-white/10 transition-all duration-300 cursor-pointer"
      onClick={() => setIsEditing(true)}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <span className="text-[9px] uppercase tracking-widest text-[var(--color-concrete-grey-dark)] mb-1 block group-hover:text-[var(--color-ink-gold)] transition-colors">
            {label}
          </span>
          <p
            className={`text-[var(--color-paper-white)]/90 leading-relaxed ${variant === 'h6' ? 'text-lg font-bold' : 'text-base'}`}
          >
            {value || (
              <span className="text-[var(--color-concrete-grey-dark)]/50 italic">
                (Empty Field)
              </span>
            )}
          </p>
        </div>
        <Edit className="w-4 h-4 text-[var(--color-concrete-grey-dark)] opacity-30 group-hover:opacity-100 group-hover:text-[var(--color-ink-gold)] transition-all" />
      </div>
    </div>
  );
};
