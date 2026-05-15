/* eslint-disable */
/**
 * Tabbed Generation Panel
 *
 * Steps + Tabbed Generation pattern harvested from:
 * sources/prototype_v2.0/src/pages/LibraryReferencePage.tsx
 * Runtime owner: /generation
 *
 * Patterns extracted:
 * - Tab navigation (Resume, Cover Letter, KSC, Interview, Networking)
 * - 3-step progress header (Tailor → Generate → Review)
 * - AnimatePresence content transitions per tab+step
 *
 * Current convergence note:
 * - Runtime route is canonical at /generation
 * - This harvested panel still carries older token usage and should be migrated
 *   to semantic --kr-* tokens in a dedicated design-system cleanup pass.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  FileText,
  Mail,
  MessageSquare,
  Sparkles,
  Users,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

type TabId = 'resume' | 'cover' | 'ksc' | 'interview' | 'network';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

interface TabbedGenerationPanelProps {
  /** Called when the user completes a generation cycle */
  onDocumentGenerated?: (tabId: TabId) => void;
  /** Which tab to activate initially */
  initialTab?: TabId;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TABS: Tab[] = [
  { id: 'resume', label: 'Resume Builder', icon: <FileText size={16} /> },
  { id: 'cover', label: 'Cover Letter', icon: <Mail size={16} /> },
  { id: 'ksc', label: 'KSC Responses', icon: <CheckSquare size={16} /> },
  { id: 'interview', label: 'Interview Prep', icon: <MessageSquare size={16} /> },
  { id: 'network', label: 'Networking', icon: <Users size={16} /> },
];

const COVER_LETTER_STYLES = ['Professional', 'Creative', 'Concise', 'Impact-Driven'];

// ── Step Indicator ────────────────────────────────────────────────────────────

function StepIndicator({ current, step, label }: { current: number; step: number; label: string }) {
  const isActive = current === step;
  const isCompleted = current > step;

  const dotBackground = isActive
    ? 'var(--sys-color-solidarityRed-base)'
    : isCompleted
      ? 'var(--sys-color-kr-activistSmokeGreen-base)'
      : 'transparent';
  const dotBorder = isActive
    ? 'var(--sys-color-solidarityRed-base)'
    : isCompleted
      ? 'var(--sys-color-kr-activistSmokeGreen-base)'
      : 'var(--kr-color-concrete-grey-steps-0)';

  return (
    <div className="flex items-center gap-2">
      <div
        style={{
          backgroundColor: dotBackground,
          borderColor: dotBorder,
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 'var(--sys-shape-march)',
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isCompleted ? (
          <CheckCircle2
            size={12}
            style={{ color: 'var(--sys-color-charcoalBackground-base)' }}
          />
        ) : (
          <span
            style={{
              color: isActive
                ? 'var(--sys-color-paperWhite-base)'
                : 'var(--sys-color-worker-ash-base)',
              fontSize: 10,
              fontWeight: 'bold',
            }}
          >
            {step}
          </span>
        )}
      </div>
      <span
        style={{
          color: isActive ? 'var(--sys-color-paperWhite-base)' : 'var(--sys-color-worker-ash-base)',
          fontSize: 10,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Stub content areas ────────────────────────────────────────────────────────

function StepContent({
  tab,
  step,
  onNext,
  onGenerate,
  coverStyle,
  setCoverStyle,
}: {
  tab: TabId;
  step: number;
  onNext: () => void;
  onGenerate: () => void;
  coverStyle: string;
  setCoverStyle: (s: string) => void;
}) {
  if (tab === 'interview' || tab === 'network') {
    return (
      <div className="py-20 flex flex-col items-center text-center">
        <Sparkles
          size={48}
          style={{ color: 'var(--sys-color-inkGold-base)' }}
          className="mb-4 opacity-20"
        />
        <h2
          style={{ color: 'var(--sys-color-paperWhite-base)' }}
          className="font-display text-2xl font-bold uppercase tracking-tight mb-2"
        >
          Coming Soon
        </h2>
        <p
          style={{ color: 'var(--sys-color-worker-ash-base)' }}
          className="text-sm"
        >
          This feature is being optimized for maximum impact.
        </p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2
            style={{ color: 'var(--sys-color-paperWhite-base)' }}
            className="font-display text-2xl font-bold uppercase tracking-tight"
          >
            {tab === 'resume'
              ? 'Tailor Your Bullets'
              : tab === 'cover'
                ? 'Select Style'
                : 'Map Selection Criteria'}
          </h2>
          <button
            onClick={onNext}
            style={{
              backgroundColor: 'var(--sys-color-solidarityRed-base)',
              color: 'var(--sys-color-paperWhite-base)',
              borderRadius: 'var(--sys-shape-blockRiot03)',
              padding: '8px 20px',
              fontSize: 10,
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Next Step
          </button>
        </div>

        {tab === 'cover' && (
          <div className="flex flex-wrap gap-3">
            {COVER_LETTER_STYLES.map((style) => (
              <button
                key={style}
                onClick={() => setCoverStyle(style)}
                style={{
                  borderColor:
                    coverStyle === style
                      ? 'var(--sys-color-inkGold-base)'
                      : 'var(--kr-color-concrete-grey-steps-0)',
                  backgroundColor:
                    coverStyle === style
                      ? 'color-mix(in srgb, var(--sys-color-inkGold-base) 10%, transparent)'
                      : 'transparent',
                  color:
                    coverStyle === style
                      ? 'var(--sys-color-inkGold-base)'
                      : 'var(--sys-color-worker-ash-base)',
                  borderRadius: 'var(--sys-shape-blockRiot03)',
                  padding: '6px 16px',
                  fontSize: 10,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  cursor: 'pointer',
                }}
              >
                {style}
              </button>
            ))}
          </div>
        )}

        {/* Placeholder tailoring content */}
        <div
          style={{
            backgroundColor: 'var(--sys-color-charcoalBackground-steps-2)',
            borderColor: 'var(--kr-color-concrete-grey-steps-0)',
            borderRadius: 'var(--sys-shape-placardTorn01)',
            borderWidth: 1,
            borderStyle: 'solid',
            padding: 24,
          }}
        >
          <p
            style={{ color: 'var(--sys-color-worker-ash-base)' }}
            className="text-sm italic"
          >
            Document tailoring inputs will appear here once a job is loaded.
          </p>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-6">
        <h2
          style={{ color: 'var(--sys-color-paperWhite-base)' }}
          className="font-display text-2xl font-bold uppercase tracking-tight"
        >
          Generate Final Draft
        </h2>
        <div
          style={{
            backgroundColor: 'var(--sys-color-charcoalBackground-steps-2)',
            borderColor: 'var(--kr-color-concrete-grey-steps-0)',
            borderRadius: 'var(--sys-shape-placardTorn01)',
            borderWidth: 1,
            borderStyle: 'solid',
            padding: 32,
          }}
        >
          {/* Preview skeleton */}
          <div className="space-y-3 opacity-40 mb-8">
            {[75, 100, 83, 100, 60].map((w, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'var(--sys-color-charcoalBackground-steps-3)',
                  borderRadius: 'var(--sys-shape-blockRiot01)',
                  height: 14,
                  width: `${w}%`,
                }}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={onGenerate}
              style={{
                backgroundColor: 'var(--sys-color-solidarityRed-base)',
                color: 'var(--sys-color-paperWhite-base)',
                borderRadius: 'var(--sys-shape-blockRiot03)',
                padding: '14px 48px',
                fontSize: 11,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Sparkles size={16} />
              Generate Document
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3 — Review
  return (
    <div className="space-y-6">
      <h2
        style={{ color: 'var(--sys-color-paperWhite-base)' }}
        className="font-display text-2xl font-bold uppercase tracking-tight"
      >
        Review &amp; Export
      </h2>
      <div
        style={{
          backgroundColor:
            'color-mix(in srgb, var(--sys-color-kr-activistSmokeGreen-base) 10%, transparent)',
          borderColor:
            'color-mix(in srgb, var(--sys-color-kr-activistSmokeGreen-base) 30%, transparent)',
          borderRadius: 'var(--sys-shape-placardTorn01)',
          borderWidth: 1,
          borderStyle: 'solid',
          padding: 20,
        }}
      >
        <div className="flex items-center gap-3">
          <CheckCircle2
            size={20}
            style={{ color: 'var(--sys-color-kr-activistSmokeGreen-base)', flexShrink: 0 }}
          />
          <p
            style={{ color: 'var(--sys-color-paperWhite-base)' }}
            className="text-sm font-bold uppercase tracking-wide"
          >
            Document generated — ready for review and export.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function TabbedGenerationPanel({
  onDocumentGenerated,
  initialTab = 'resume',
}: TabbedGenerationPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [step, setStep] = useState(1);
  const [coverStyle, setCoverStyle] = useState('Professional');

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    setStep(1);
  };

  const handleGenerate = () => {
    setStep(3);
    onDocumentGenerated?.(activeTab);
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--sys-color-charcoalBackground-steps-1)',
        borderColor: 'var(--kr-color-concrete-grey-steps-0)',
        borderRadius: 'var(--sys-shape-placardTorn01)',
        borderWidth: 1,
        borderStyle: 'solid',
        overflow: 'hidden',
      }}
    >
      <div className="flex flex-col md:flex-row w-full h-full">
        {/* LEFT: Tab navigation */}
        <div
          style={{
            backgroundColor: 'var(--sys-color-charcoalBackground-steps-2)',
            borderRight: '1px solid var(--kr-color-concrete-grey-steps-0)',
            width: 240,
            flexShrink: 0,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <h2
            style={{ color: 'var(--sys-color-paperWhite-base)' }}
            className="font-display text-lg font-bold uppercase tracking-tight mb-4"
          >
            Documents
          </h2>
          <nav className="flex flex-col gap-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    borderRadius: 'var(--sys-shape-blockRiot01)',
                    border: isActive ? '1px solid var(--kr-color-concrete-grey-steps-0)' : 'none',
                    backgroundColor: isActive
                      ? 'var(--sys-color-charcoalBackground-steps-3)'
                      : 'transparent',
                    color: isActive
                      ? 'var(--sys-color-paperWhite-base)'
                      : 'var(--sys-color-worker-ash-base)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  {tab.icon}
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* RIGHT: Step header + content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Step indicator header */}
          <div
            style={{
              backgroundColor: 'var(--sys-color-charcoalBackground-steps-2)',
              borderBottom: '1px solid var(--kr-color-concrete-grey-steps-0)',
              padding: '12px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div className="flex items-center gap-6">
              <StepIndicator
                current={step}
                step={1}
                label="Tailor"
              />
              <ChevronRight
                size={14}
                style={{ color: 'var(--kr-color-concrete-grey-steps-0)' }}
              />
              <StepIndicator
                current={step}
                step={2}
                label="Generate"
              />
              <ChevronRight
                size={14}
                style={{ color: 'var(--kr-color-concrete-grey-steps-0)' }}
              />
              <StepIndicator
                current={step}
                step={3}
                label="Review"
              />
            </div>
            <span
              style={{
                color:
                  step === 3
                    ? 'var(--sys-color-kr-activistSmokeGreen-base)'
                    : 'var(--sys-color-worker-ash-base)',
                fontSize: 10,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
              }}
            >
              {step === 3 ? 'Complete' : 'Ready to Tailor'}
            </span>
          </div>

          {/* Content area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${step}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
              >
                <StepContent
                  tab={activeTab}
                  step={step}
                  onNext={() => setStep(2)}
                  onGenerate={handleGenerate}
                  coverStyle={coverStyle}
                  setCoverStyle={setCoverStyle}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
