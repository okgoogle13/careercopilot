/**
 * TemplateSelector — DOC1 Harvest
 * Allows users to choose a resume template and locale (US / UK/AU).
 * KR Solidarity v6.0 compliant — semantic tokens only.
 */
import React from 'react';
import { TemplateStyle, RESUME_TEMPLATES } from '../../../config/resume-constants';

interface TemplateSelectorProps {
  selectedTemplate: TemplateStyle;
  setSelectedTemplate: (template: TemplateStyle) => void;
  locale: 'US' | 'UK/AU';
  setLocale: (locale: 'US' | 'UK/AU') => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  setSelectedTemplate,
  locale,
  setLocale,
}) => {
  return (
    <div
      className="bg-[var(--sys-color-charcoalBackground-steps-1)] p-6 border border-[var(--sys-color-outline-variant)]"
      style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-[var(--sys-color-inkGold-base)] uppercase tracking-widest">
          Select Document Template
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider">
            Locale:
          </span>
          <div
            className="flex bg-[var(--sys-color-charcoalBackground-base)] p-1 border border-[var(--sys-color-outline-variant)]"
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
          >
            <button
              onClick={() => setLocale('US')}
              className={`px-3 py-1 text-xs font-bold transition-colors ${
                locale === 'US'
                  ? 'bg-[var(--sys-color-solidarityRed-base)] text-[var(--sys-color-paperWhite-base)]'
                  : 'text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-paperWhite-base)]'
              }`}
              style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
            >
              US
            </button>
            <button
              onClick={() => setLocale('UK/AU')}
              className={`px-3 py-1 text-xs font-bold transition-colors ${
                locale === 'UK/AU'
                  ? 'bg-[var(--sys-color-solidarityRed-base)] text-[var(--sys-color-paperWhite-base)]'
                  : 'text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-paperWhite-base)]'
              }`}
              style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
            >
              UK/AU
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {RESUME_TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTemplate(t)}
            className={`group flex flex-col items-center gap-2 p-2 border transition-all ${
              selectedTemplate.id === t.id
                ? 'bg-[var(--sys-color-solidarityRed-base)]/20 border-[var(--sys-color-inkGold-base)]'
                : 'bg-[var(--sys-color-charcoalBackground-base)] border-[var(--sys-color-outline-variant)] hover:border-[var(--sys-color-concreteGrey-base)]'
            }`}
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
          >
            <div
              className="w-full aspect-[3/4] shadow-sm border border-[var(--sys-color-paperWhite-base)]/10 overflow-hidden relative"
              style={{ backgroundColor: t.bgLight, borderRadius: 'var(--sys-shape-blockRiot01)' }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-2"
                style={{ backgroundColor: t.primaryColor }}
              />
              <div className="p-1 space-y-1">
                <div
                  className="h-1 w-2/3 mt-2"
                  style={{
                    backgroundColor: t.headingColor,
                    opacity: 0.3,
                    borderRadius: 'var(--sys-shape-blockRiot01)',
                  }}
                />
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-0.5"
                    style={{
                      width: i === 2 ? '80%' : '100%',
                      backgroundColor: t.textColor,
                      opacity: 0.1,
                      borderRadius: 'var(--sys-shape-blockRiot01)',
                    }}
                  />
                ))}
              </div>
            </div>
            <span
              className={`text-[10px] font-bold truncate w-full text-center ${
                selectedTemplate.id === t.id
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
