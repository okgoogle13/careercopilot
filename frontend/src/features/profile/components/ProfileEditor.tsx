import { Lens, LensArea } from '@/components/ui/Lens';
import { Pebble } from '@/components/ui/Pebble';
import { Stone } from '@/components/ui/Stone';
import { Archive, Award, Box, Briefcase, Loader2, Plus, Sparkles, User } from 'lucide-react';
import React, { useState } from 'react';

// Lab Assets
import starfishCage from '../../assets/specimens/starfish-cage.jpg';
import paperGrain from '../../assets/textures/paper-grain.png';

export interface ProfileEditorProps {
  onNext: () => void;
  onBack: () => void;
}

const skillsList = [
  'Crisis Intervention',
  'Case Management',
  'Client Support',
  'Peer Support',
  'Mental Health',
  'Community Outreach',
];

/**
 * CareerCopilot Profile Editor ("The Specimen Archive")
 *
 * V3.1 Laboratory Mode Implementation:
 * ✓ ASSET-07 Starfish Cage (Glass Specimen Case backdrop)
 * ✓ Clinical Typography (Monospace metadata, Serif descriptors)
 * ✓ Paper Texture & Grid Overlays
 */
export const ProfileEditor: React.FC<ProfileEditorProps> = ({ onNext, onBack }) => {
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      setSummary(
        'Dedicated and compassionate Community Support Worker with over 5 years of experience in providing client-centered care. Skilled in crisis intervention, case management, and developing support plans that empower individuals to achieve their goals.'
      );
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-paper-white-base relative overflow-hidden py-12 px-6">
      {/* Texture Overlays */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: `url(${paperGrain})` }}
      />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Lab Header */}
        <header className="mb-16 border-b border-bark-base/10 pb-8 flex justify-between items-end">
          <div>
            <p className="font-mono text-[10px] text-bark-base opacity-40 uppercase tracking-[0.5em] mb-2">
              [ BIOMETRIC_ARCHIVE.v3 ]
            </p>
            <h1 className="font-serif text-5xl text-bark-base tracking-tight italic">
              The Specimen <span className="text-leaf-dark">Archive</span>
            </h1>
            <p className="font-field-note text-lg text-bark-base/60 mt-2 max-w-2xl">
              Review and recalibrate the extracted metadata from your career specimens. Precision is
              mandatory for successful synthesis.
            </p>
          </div>
          <div className="flex items-center gap-4 text-bark-base/40 font-mono text-[10px] uppercase tracking-widest pb-2">
            <Archive size={14} />
            <span>Vault Status: SECURE</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - The "Glass Case" Visual (ASSET-07) */}
          <div className="lg:col-span-4 space-y-8">
            <Stone
              mode="laboratory"
              elevation="floating"
              className="aspect-[4/5] overflow-hidden relative border-bark-base/20 group"
            >
              <div className="absolute inset-0 bg-bark-dark/10 mix-blend-multiply opacity-40 z-10 pointer-events-none" />
              <img
                src={starfishCage}
                alt="Specimen Container"
                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[5s] ease-out brightness-90 saturate-[0.8]"
              />
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-bark-dark/80 to-transparent z-20">
                <div className="flex items-center gap-3 text-white/90 mb-2">
                  <Box
                    size={18}
                    className="text-leaf-base"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
                    ASSET-07 | CASE_GLASS
                  </span>
                </div>
                <p className="font-field-note text-white/60 text-sm italic">
                  "Protective encasement for sensitive career filaments."
                </p>
              </div>
              {/* Forensic Overlay */}
              <div className="absolute inset-0 border-[20px] border-bark-dark/5 pointer-events-none z-30" />
            </Stone>

            <div className="p-6 bg-bark-light/5 border border-bark-base/10 rounded-sm">
              <h4 className="font-mono text-[10px] text-bark-base font-bold uppercase tracking-widest mb-4">
                Metadata Integrity
              </h4>
              <div className="space-y-3">
                {[
                  { l: 'Extraction Depth', v: 'High (0.98)' },
                  { l: 'Taxonomic Match', v: 'Verbatim' },
                  { l: 'Integrity Check', v: 'PASSED' },
                ].map((m, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-[10px] font-mono"
                  >
                    <span className="text-bark-base/40 uppercase">{m.l}</span>
                    <span className="text-bark-base font-bold">{m.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Lab Forms */}
          <div className="lg:col-span-8 space-y-12">
            {/* Personal Records */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-bark-base/5 pb-2">
                <User
                  size={18}
                  className="text-bark-base opacity-40"
                />
                <h3 className="font-mono text-xs font-bold text-bark-base uppercase tracking-widest">
                  Personal Identification
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Lens
                  label="IDENTIFIER (NAME)"
                  defaultValue="Nishant Dougall"
                  className="w-full font-mono text-sm"
                />
                <Lens
                  label="COMM_NODE (EMAIL)"
                  defaultValue="nishant.dougall@email.com"
                  type="email"
                  className="w-full font-mono text-sm"
                />
              </div>
            </section>

            {/* Professional Summary - The "Synthesis" */}
            <section className="space-y-6">
              <div className="flex justify-between items-center border-b border-bark-base/5 pb-2">
                <div className="flex items-center gap-3">
                  <Briefcase
                    size={18}
                    className="text-bark-base opacity-40"
                  />
                  <h3 className="font-mono text-xs font-bold text-bark-base uppercase tracking-widest">
                    Synthesis Descriptor
                  </h3>
                </div>
                <button
                  onClick={handleGenerateSummary}
                  disabled={isGenerating}
                  className="flex items-center gap-2 font-mono text-[10px] text-leaf-dark uppercase tracking-widest hover:text-leaf-base disabled:opacity-50 transition-colors"
                >
                  {isGenerating ? (
                    <Loader2
                      size={12}
                      className="animate-spin"
                    />
                  ) : (
                    <Sparkles size={12} />
                  )}
                  {isGenerating ? 'Calibrating...' : 'AI Synthesis'}
                </button>
              </div>

              <LensArea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Awaiting AI calibration..."
                rows={4}
                className="w-full font-serif text-lg leading-relaxed italic text-bark-base/80"
              />
            </section>

            {/* Experience & Skills - Specimen List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-bark-base/5 pb-2">
                  <Archive
                    size={18}
                    className="text-bark-base opacity-40"
                  />
                  <h3 className="font-mono text-xs font-bold text-bark-base uppercase tracking-widest">
                    Career Strata
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      role: 'Community Support Worker',
                      co: 'Community Care Org',
                      d: '2019 - PRESENT',
                    },
                    { role: 'Peer Worker', co: 'Mental Health Services', d: '2017 - 2019' },
                  ].map((exp, i) => (
                    <div
                      key={i}
                      className="p-4 border border-bark-base/10 bg-white/40 group hover:border-leaf-base transition-colors relative"
                    >
                      <div className="absolute top-2 right-2 font-mono text-[8px] text-bark-base/20">
                        STRATUM.0{i + 1}
                      </div>
                      <h4 className="font-serif font-bold text-bark-base text-base leading-tight uppercase tracking-tight">
                        {exp.role}
                      </h4>
                      <p className="font-mono text-[10px] text-bark-base/60 mt-1 uppercase tracking-widest">
                        {exp.co}
                      </p>
                      <span className="block font-mono text-[9px] text-bark-base/30 mt-2">
                        {exp.d}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-bark-base/5 pb-2">
                  <Award
                    size={18}
                    className="text-bark-base opacity-40"
                  />
                  <h3 className="font-mono text-xs font-bold text-bark-base uppercase tracking-widest">
                    Extracted Filaments (Skills)
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, index) => (
                    <div
                      key={index}
                      className="font-mono text-[9px] uppercase tracking-widest bg-bark-light/10 text-bark-base border border-bark-base/20 px-3 py-1 rounded-sm"
                    >
                      {skill}
                    </div>
                  ))}
                  <button className="w-8 h-8 rounded-full border border-dashed border-bark-base/20 flex items-center justify-center text-bark-base/40 hover:border-leaf-base hover:text-leaf-base transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Global Action Footer */}
        <footer className="mt-20 pt-8 border-t border-bark-base/10 flex justify-between items-center">
          <Pebble
            variant="ghost"
            onClick={onBack}
            className="font-mono text-[10px] uppercase tracking-widest text-bark-base/40 hover:text-bark-base"
          >
            ← Discard Session
          </Pebble>
          <Pebble
            variant="primary"
            onClick={onNext}
            className="h-14 px-12 font-mono text-xs font-bold uppercase tracking-[0.2em] bg-bark-dark text-paper-white-base hover:bg-bark-base shadow-lg"
          >
            Finalize Archive & Proceed
          </Pebble>
        </footer>
      </div>
    </div>
  );
};

export default ProfileEditor;
