import React from 'react';
import { TemplateStyle } from '../../constants';

interface TemplateSelectorProps {
  templates: TemplateStyle[];
  selected: TemplateStyle;
  onSelect: (t: TemplateStyle) => void;
  locale: 'US' | 'UK/AU';
  onLocaleChange: (l: 'US' | 'UK/AU') => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selected,
  onSelect,
  locale,
  onLocaleChange,
}) => {
  return (
    <div className="bg-[var(--sys-color-charcoalBackground-steps-1)] p-6 rounded-[var(--sys-shape-radius-xl)] border border-[var(--sys-color-concreteGrey-steps-0)]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-[var(--sys-color-inkGold-base)] uppercase tracking-widest">
          Select Document Template
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider">
            Locale:
          </span>
          <div className="flex bg-[var(--sys-color-charcoalBackground-base)] rounded-[var(--sys-shape-radius-lg)] p-1 border border-[var(--sys-color-concreteGrey-steps-0)]">
            <button
              onClick={() => onLocaleChange('US')}
              className={`px-3 py-1 rounded-[var(--sys-shape-radius-lg)] text-xs font-bold transition-colors ${
                locale === 'US'
                  ? 'bg-[var(--sys-color-solidarityRed-base)] text-[var(--sys-color-paperWhite-base)]'
                  : 'text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-paperWhite-base)]'
              }`}
            >
              US
            </button>
            <button
              onClick={() => onLocaleChange('UK/AU')}
              className={`px-3 py-1 rounded-[var(--sys-shape-radius-lg)] text-xs font-bold transition-colors ${
                locale === 'UK/AU'
                  ? 'bg-[var(--sys-color-solidarityRed-base)] text-[var(--sys-color-paperWhite-base)]'
                  : 'text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-paperWhite-base)]'
              }`}
            >
              UK/AU
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            className={`group flex flex-col items-center gap-2 p-2 rounded-[var(--sys-shape-radius-lg)] border transition-all ${
              selected.id === t.id
                ? 'bg-[var(--sys-color-solidarityRed-steps-0)]/20 border-[var(--sys-color-inkGold-base)]'
                : 'bg-[var(--sys-color-charcoalBackground-base)] border-[var(--sys-color-concreteGrey-steps-0)] hover:border-[var(--sys-color-concreteGrey-steps-0)]'
            }`}
          >
            <div
              className="w-full aspect-[3/4] rounded shadow-sm border border-[var(--sys-color-paperWhite-base)]/10 overflow-hidden relative"
              style={{ backgroundColor: t.bgLight }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-2"
                style={{ backgroundColor: t.primaryColor }}
              />
              <div className="p-1 space-y-1">
                <div
                  className="h-1 w-2/3 rounded-[var(--sys-shape-radius-full)] mt-2"
                  style={{ backgroundColor: t.headingColor, opacity: 0.3 }}
                />
                <div
                  className="h-0.5 w-full rounded-[var(--sys-shape-radius-full)]"
                  style={{ backgroundColor: t.textColor, opacity: 0.1 }}
                />
                <div
                  className="h-0.5 w-full rounded-[var(--sys-shape-radius-full)]"
                  style={{ backgroundColor: t.textColor, opacity: 0.1 }}
                />
                <div
                  className="h-0.5 w-4/5 rounded-[var(--sys-shape-radius-full)]"
                  style={{ backgroundColor: t.textColor, opacity: 0.1 }}
                />
              </div>
            </div>
            <span
              className={`text-[10px] font-bold truncate w-full text-center ${
                selected.id === t.id
                  ? 'text-[var(--sys-color-inkGold-base)]'
                  : 'text-[var(--sys-color-worker-ash-base)] group-hover:text-[var(--sys-color-paperWhite-base)]'
              }`}
            >
              {t.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
