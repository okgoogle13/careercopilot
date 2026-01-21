import React, { useState } from 'react';
import {
    M3TextField,
    M3IconButton
} from '@/components/ui';
import { Edit, Check, X, Sparkles } from 'lucide-react';

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
                <label className="font-annotation text-[10px] uppercase tracking-widest text-[var(--color-flannel-flower-dark)] mb-2 block">
                    {label}
                </label>
                <M3TextField
                    fullWidth
                    multiline={multiline}
                    rows={multiline ? 4 : 1}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    variant="filled"
                    className="mb-3"
                />
                <div className="flex items-center gap-3">
                    <M3IconButton
                        icon={<Check className="w-4 h-4" />}
                        ariaLabel="save"
                        onClick={handleSave}
                        variant="standard"
                        size="medium"
                        className="bg-[var(--color-wattle-gold)]/20 text-[var(--color-wattle-gold)] hover:bg-[var(--color-wattle-gold)] hover:text-white"
                    />
                    <M3IconButton
                        icon={<X className="w-4 h-4" />}
                        ariaLabel="cancel"
                        onClick={handleCancel}
                        variant="standard"
                        size="medium"
                        className="bg-white/5 text-[var(--color-flannel-flower-dark)] hover:bg-white/10"
                    />

                    {suggestion && (
                        <button
                            onClick={handleApplySuggestion}
                            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-eucalypt-smoke-base)]/10 text-[var(--color-eucalypt-smoke-base)] rounded-full text-xs font-bold hover:bg-[var(--color-eucalypt-smoke-base)] hover:text-white transition-all duration-300 border border-[var(--color-eucalypt-smoke-base)]/20"
                        >
                            <Sparkles className="w-3 h-3" />
                            Seed AI Suggestion
                        </button>
                    )}
                </div>

                {suggestion && (
                    <div className="mt-4 p-3 bg-[var(--color-wattle-gold)]/5 border border-[var(--color-wattle-gold)]/10 rounded-[var(--radius-stone)]">
                        <p className="font-field-note text-xs text-[var(--color-wattle-gold)]/70 italic leading-relaxed">
                            💡 Concept: {suggestion}
                        </p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className="group mb-4 p-4 rounded-[var(--radius-pebble)] bg-white/5 border border-white/5 hover:border-[var(--color-wattle-gold)]/30 hover:bg-white/10 transition-all duration-300 cursor-pointer"
            onClick={() => setIsEditing(true)}
        >
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <span className="font-annotation text-[9px] uppercase tracking-widest text-[var(--color-flannel-flower-dark)] mb-1 block group-hover:text-[var(--color-wattle-gold)] transition-colors">
                        {label}
                    </span>
                    <p className={`font-field-note text-[var(--color-parchment)]/90 leading-relaxed ${variant === 'h6' ? 'text-lg font-bold' : 'text-base'}`}>
                        {value || <span className="text-[var(--color-flannel-flower-dark)]/50 italic">(Empty Field)</span>}
                    </p>
                </div>
                <Edit className="w-4 h-4 text-[var(--color-flannel-flower-dark)] opacity-30 group-hover:opacity-100 group-hover:text-[var(--color-wattle-gold)] transition-all" />
            </div>
        </div>
    );
};
