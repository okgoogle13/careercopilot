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
<<<<<<< HEAD
        <label className="text-[10px] uppercase tracking-widest text-[var(--color-flannel-flower-dark)] mb-2 block">
=======
        <label className="text-[10px] uppercase tracking-widest text-[var(--color-concrete-grey-dark)] mb-2 block">
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
            className="bg-[var(--color-wattle-gold)]/20 text-[var(--color-wattle-gold)] hover:bg-[var(--color-wattle-gold)] hover:text-white"
=======
            className="bg-[var(--color-ink-gold)]/20 text-[var(--color-ink-gold)] hover:bg-[var(--color-ink-gold)] hover:text-white"
>>>>>>> restoration-KR-Rage-Figma-v2.0
            aria-label="save"
          />
          <Pebble
            iconLeft={<X className="w-4 h-4" />}
            onClick={handleCancel}
            size="md"
<<<<<<< HEAD
            className="bg-white/5 text-[var(--color-flannel-flower-dark)] hover:bg-white/10"
=======
            className="bg-white/5 text-[var(--color-concrete-grey-dark)] hover:bg-white/10"
>>>>>>> restoration-KR-Rage-Figma-v2.0
            aria-label="cancel"
          />

          {suggestion && (
            <button
              onClick={handleApplySuggestion}
<<<<<<< HEAD
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-eucalypt-smoke-base)]/10 text-[var(--color-eucalypt-smoke-base)] rounded-full text-xs font-bold hover:bg-[var(--color-eucalypt-smoke-base)] hover:text-white transition-all duration-300 border border-[var(--color-eucalypt-smoke-base)]/20"
=======
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-concrete-grey-base)]/10 text-[var(--color-concrete-grey-base)] rounded-full text-xs font-bold hover:bg-[var(--color-concrete-grey-base)] hover:text-white transition-all duration-300 border border-[var(--color-concrete-grey-base)]/20"
>>>>>>> restoration-KR-Rage-Figma-v2.0
            >
              <Sparkles className="w-3 h-3" />
              Seed AI Suggestion
            </button>
          )}
        </div>

        {suggestion && (
<<<<<<< HEAD
          <div className="mt-4 p-3 bg-[var(--color-wattle-gold)]/5 border border-[var(--color-wattle-gold)]/10 rounded-stone">
            <p className="text-xs text-[var(--color-wattle-gold)]/70 italic leading-relaxed">
=======
          <div className="mt-4 p-3 bg-[var(--color-ink-gold)]/5 border border-[var(--color-ink-gold)]/10 rounded-stone">
            <p className="text-xs text-[var(--color-ink-gold)]/70 italic leading-relaxed">
>>>>>>> restoration-KR-Rage-Figma-v2.0
              💡 Concept: {suggestion}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
<<<<<<< HEAD
      className="group mb-4 p-4 rounded-pebble bg-white/5 border border-white/5 hover:border-[var(--color-wattle-gold)]/30 hover:bg-white/10 transition-all duration-300 cursor-pointer"
=======
      className="group mb-4 p-4 rounded-pebble bg-white/5 border border-white/5 hover:border-[var(--color-ink-gold)]/30 hover:bg-white/10 transition-all duration-300 cursor-pointer"
>>>>>>> restoration-KR-Rage-Figma-v2.0
      onClick={() => setIsEditing(true)}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
<<<<<<< HEAD
          <span className="text-[9px] uppercase tracking-widest text-[var(--color-flannel-flower-dark)] mb-1 block group-hover:text-[var(--color-wattle-gold)] transition-colors">
            {label}
          </span>
          <p
            className={`text-[var(--color-parchment)]/90 leading-relaxed ${variant === 'h6' ? 'text-lg font-bold' : 'text-base'}`}
          >
            {value || (
              <span className="text-[var(--color-flannel-flower-dark)]/50 italic">
=======
          <span className="text-[9px] uppercase tracking-widest text-[var(--color-concrete-grey-dark)] mb-1 block group-hover:text-[var(--color-ink-gold)] transition-colors">
            {label}
          </span>
          <p
            className={`text-[var(--color-paper-white)]/90 leading-relaxed ${variant === 'h6' ? 'text-lg font-bold' : 'text-base'}`}
          >
            {value || (
              <span className="text-[var(--color-concrete-grey-dark)]/50 italic">
>>>>>>> restoration-KR-Rage-Figma-v2.0
                (Empty Field)
              </span>
            )}
          </p>
        </div>
<<<<<<< HEAD
        <Edit className="w-4 h-4 text-[var(--color-flannel-flower-dark)] opacity-30 group-hover:opacity-100 group-hover:text-[var(--color-wattle-gold)] transition-all" />
      </div>
    </div>
  );
};
=======
        <Edit className="w-4 h-4 text-[var(--color-concrete-grey-dark)] opacity-30 group-hover:opacity-100 group-hover:text-[var(--color-ink-gold)] transition-all" />
      </div>
    </div>
  );
};
>>>>>>> restoration-KR-Rage-Figma-v2.0
