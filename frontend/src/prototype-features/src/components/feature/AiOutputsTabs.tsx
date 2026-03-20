/* eslint-disable */
/**
 * CLASSIFICATION: Support Component Only
 * Prototype-only component.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export function AiOutputsTabs() {
  // Prototype-only navigation state
  const [activeTab, setActiveTab] = useState('ksc');
  const [ignoredCriteria, setIgnoredCriteria] = useState<number[]>([]);

  const toggleCriteria = (id: number) => {
    setIgnoredCriteria((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const criteria = [
    { id: 1, title: '5+ years experience in React and TypeScript', required: true },
    { id: 2, title: 'Experience with GraphQL and Node.js', required: false },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="mt-12">
      <div className="flex gap-4 mb-8 border-b border-[var(--sys-color-outline-variant)] pb-4 relative overflow-x-auto">
        <TabButton
          label="Resume"
          active={activeTab === 'resume'}
          onClick={() => setActiveTab('resume')}
          id="resume"
        />
        <TabButton
          label="Cover Letter"
          active={activeTab === 'cover'}
          onClick={() => setActiveTab('cover')}
          id="cover"
        />
        <TabButton
          label="KSC"
          active={activeTab === 'ksc'}
          onClick={() => setActiveTab('ksc')}
          id="ksc"
        />
      </div>

      <Card className="p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {activeTab === 'ksc' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-3xl type-solidarityProtest text-[var(--sys-color-paperWhite-base)] uppercase tracking-tight">
                      Key Selection Criteria
                    </h3>
                    <p className="type-melancholyLonging text-lg text-[var(--sys-color-worker-ash-base)]">
                      The following criteria were extracted from the job description.
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(criteria.map((c) => c.title).join('\n'))}
                    className="px-6 py-3 border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-paperWhite-base)] font-bold uppercase tracking-wider text-sm hover:bg-[var(--sys-color-charcoalBackground-steps-2)] transition-colors whitespace-nowrap"
                    style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
                  >
                    Copy to Clipboard for ATS
                  </button>
                </div>
                {criteria.map((c) => (
                  <motion.div
                    key={c.id}
                    whileHover={{
                      scale: 1.01,
                      rotate: ignoredCriteria.includes(c.id) ? 0 : c.id % 2 === 0 ? -0.5 : 0.5,
                    }}
                    className={`p-6 border border-[var(--sys-color-outline-variant)] cursor-default transition-opacity ${ignoredCriteria.includes(c.id) ? 'opacity-40 bg-[var(--sys-color-charcoalBackground-steps-1)]' : 'bg-[var(--sys-color-charcoalBackground-steps-2)]'}`}
                    style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <p className="font-mono text-sm text-[var(--sys-color-stencilYellow-base)] uppercase tracking-widest">
                        Criteria 0{c.id}
                      </p>
                      <div className="flex items-center gap-4">
                        <Badge
                          label={c.required ? 'Required' : 'Nice to have'}
                          variant={c.required ? 'danger' : 'success'}
                        />
                        <div
                          className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors flex items-center ${!ignoredCriteria.includes(c.id) ? 'bg-[var(--sys-color-solidarityRed-base)]' : 'bg-[var(--sys-color-charcoalBackground-steps-3)]'}`}
                          onClick={() => toggleCriteria(c.id)}
                        >
                          <motion.div
                            className="w-4 h-4 rounded-full bg-[var(--sys-color-paperWhite-base)] shadow-sm"
                            animate={{ x: !ignoredCriteria.includes(c.id) ? 24 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </div>
                      </div>
                    </div>
                    <p
                      className={`text-xl font-bold ${ignoredCriteria.includes(c.id) ? 'text-[var(--sys-color-worker-ash-base)] line-through' : 'text-[var(--sys-color-paperWhite-base)]'}`}
                    >
                      {c.title}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
            {activeTab === 'resume' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h3 className="text-3xl type-solidarityProtest text-[var(--sys-color-paperWhite-base)] uppercase tracking-tight">
                    Resume Tailoring
                  </h3>
                  <button
                    onClick={() => handleCopy('React & TypeScript\nGraphQL')}
                    className="px-6 py-3 border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-paperWhite-base)] font-bold uppercase tracking-wider text-sm hover:bg-[var(--sys-color-charcoalBackground-steps-2)] transition-colors whitespace-nowrap"
                    style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
                  >
                    Copy to Clipboard for ATS
                  </button>
                </div>
                <div className="space-y-4">
                  <div
                    className="flex items-center justify-between p-4 border border-[var(--sys-color-outline-variant)] bg-[var(--sys-color-charcoalBackground-steps-2)]"
                    style={{ borderRadius: 'var(--sys-shape-blockRiot02)' }}
                  >
                    <span className="text-lg text-[var(--sys-color-paperWhite-base)] font-bold">
                      React & TypeScript
                    </span>
                    <Badge
                      label="Strong Match"
                      variant="success"
                    />
                  </div>
                  <div
                    className="flex items-center justify-between p-4 border border-[var(--sys-color-outline-variant)] bg-[var(--sys-color-charcoalBackground-steps-2)]"
                    style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
                  >
                    <span className="text-lg text-[var(--sys-color-paperWhite-base)] font-bold">
                      GraphQL
                    </span>
                    <Badge
                      label="Missing"
                      variant="danger"
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'cover' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h3 className="text-3xl type-solidarityProtest text-[var(--sys-color-paperWhite-base)] uppercase tracking-tight">
                    Cover Letter Draft
                  </h3>
                  <button
                    onClick={() => handleCopy('Dear Hiring Manager...')}
                    className="px-6 py-3 border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-paperWhite-base)] font-bold uppercase tracking-wider text-sm hover:bg-[var(--sys-color-charcoalBackground-steps-2)] transition-colors whitespace-nowrap"
                    style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
                  >
                    Copy to Clipboard for ATS
                  </button>
                </div>
                <div
                  className="p-6 bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--sys-color-outline-variant)]"
                  style={{ borderRadius: 'var(--sys-shape-blockRiot03)' }}
                >
                  <p className="type-melancholyLonging text-[var(--sys-color-worker-ash-base)] whitespace-pre-line">
                    Dear Hiring Manager,
                    {'\n\n'}I am writing to express my strong interest in the Senior Frontend
                    Engineer position at TechCorp Inc. With over 6 years of experience building
                    scalable web applications using React and TypeScript, I am confident in my
                    ability to contribute effectively to your team.
                    {'\n\n'}
                    While I don't have direct production experience with GraphQL, my solid
                    foundation in REST APIs and Node.js allows me to quickly adapt to new data
                    fetching paradigms.
                    {'\n\n'}
                    Sincerely,
                    {'\n'}
                    [Your Name]
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
  id,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  id: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-6 py-3 font-bold uppercase tracking-wider text-sm transition-colors z-10 ${
        active
          ? 'text-[var(--sys-color-paperWhite-base)]'
          : 'text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-paperWhite-base)]'
      }`}
    >
      {active && (
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute inset-0 bg-[var(--sys-color-solidarityRed-base)] border border-[var(--sys-color-solidarityRed-base)] -z-10"
          style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
      )}
      {label}
    </button>
  );
}
