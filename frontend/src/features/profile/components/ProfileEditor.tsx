import { Lens } from '@/components/ui/Lens';
import { Pebble } from '@/components/ui/Pebble';
import { Seed } from '@/components/ui/Seed';
import { Stone } from '@/components/ui/Stone';
import { Award, Briefcase, GraduationCap, Loader2, Sparkles, User } from 'lucide-react';
import React, { useState } from 'react';

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
    <div className="min-h-screen bg-[var(--color-background-base)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-display-medium font-bold text-[var(--color-text-primary)] mb-2">
            Review Your Profile
          </h1>
          <p className="text-body-large text-[var(--color-text-secondary)]">
            AI-extracted information from your uploaded documents. Review and enhance below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Main Info */}
          <div className="flex flex-col gap-6">
            {/* Personal Info */}
            <Stone variant="flat">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[var(--color-surface-container)] rounded-lg text-[var(--color-flower-base)]">
                    <User size={24} />
                  </div>
                  <h3 className="text-display-small font-bold text-[var(--color-text-primary)]">
                    Personal Information
                  </h3>
                </div>

                <div className="flex flex-col gap-4">
                  <Lens
                    label="Full Name"
                    defaultValue="Nishant Dougall"
                    className="w-full"
                  />
                  <Lens
                    label="Email"
                    defaultValue="nishant.dougall@email.com"
                    type="email"
                    className="w-full"
                  />
                  <Lens
                    label="Phone"
                    defaultValue="+61 4XX XXX XXX"
                    type="tel"
                    className="w-full"
                  />
                </div>
              </div>
            </Stone>

            {/* Professional Summary */}
            <Stone variant="flat">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--color-surface-container)] rounded-lg text-[var(--color-leaf-base)]">
                      <Briefcase size={24} />
                    </div>
                    <h3 className="text-display-small font-bold text-[var(--color-text-primary)]">
                      Professional Summary
                    </h3>
                  </div>
                  <Pebble
                    variant="ghost"
                    size="small"
                    icon={isGenerating ? Loader2 : Sparkles}
                    onClick={handleGenerateSummary}
                    disabled={isGenerating}
                    className="text-[var(--color-leaf-base)] hover:text-[var(--color-leaf-dark)] hover:bg-[var(--color-leaf-light)]/10"
                  >
                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                  </Pebble>
                </div>

                <Lens
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="AI will generate a professional summary based on your experience..."
                  rows={6}
                  className="w-full font-serif text-body-large"
                />
              </div>
            </Stone>
          </div>

          {/* Right Column - Experience & Skills */}
          <div className="flex flex-col gap-6">
            {/* Experience */}
            <Stone variant="flat">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[var(--color-surface-container)] rounded-lg text-[var(--color-wattle-base)]">
                    <Briefcase size={24} />
                  </div>
                  <h3 className="text-display-small font-bold text-[var(--color-text-primary)]">
                    Experience
                  </h3>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="p-4 bg-[var(--color-background-base)] rounded-lg border border-[var(--color-surface-container-high)]">
                    <h4 className="text-label-large font-bold text-[var(--color-text-primary)]">
                      Community Support Worker
                    </h4>
                    <p className="text-body-medium text-[var(--color-text-secondary)]">
                      Community Care Organization
                    </p>
                    <span className="text-label-small text-[var(--color-text-tertiary)] block mt-1">
                      2019 - Present
                    </span>
                  </div>
                  <div className="p-4 bg-[var(--color-background-base)] rounded-lg border border-[var(--color-surface-container-high)]">
                    <h4 className="text-label-large font-bold text-[var(--color-text-primary)]">
                      Peer Worker
                    </h4>
                    <p className="text-body-medium text-[var(--color-text-secondary)]">
                      Mental Health Support Services
                    </p>
                    <span className="text-label-small text-[var(--color-text-tertiary)] block mt-1">
                      2017 - 2019
                    </span>
                  </div>
                </div>
              </div>
            </Stone>

            {/* Education */}
            <Stone variant="flat">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[var(--color-surface-container)] rounded-lg text-[var(--color-leaf-base)]">
                    <GraduationCap size={24} />
                  </div>
                  <h3 className="text-display-small font-bold text-[var(--color-text-primary)]">
                    Education
                  </h3>
                </div>

                <div className="p-4 bg-[var(--color-background-base)] rounded-lg border border-[var(--color-surface-container-high)]">
                  <h4 className="text-label-large font-bold text-[var(--color-text-primary)]">
                    Certificate IV in Mental Health Peer Work
                  </h4>
                  <p className="text-body-medium text-[var(--color-text-secondary)]">
                    TAFE Queensland
                  </p>
                  <span className="text-label-small text-[var(--color-text-tertiary)] block mt-1">
                    2017
                  </span>
                </div>
              </div>
            </Stone>

            {/* Skills */}
            <Stone variant="flat">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[var(--color-surface-container)] rounded-lg text-[var(--color-wattle-base)]">
                    <Award size={24} />
                  </div>
                  <h3 className="text-display-small font-bold text-[var(--color-text-primary)]">
                    Key Skills
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, index) => (
                    <Seed
                      key={index}
                      label={skill}
                      variant="neutral"
                      className="bg-[var(--color-surface-container)] text-[var(--color-text-primary)]"
                    />
                  ))}
                </div>
              </div>
            </Stone>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-12 pt-6 border-t border-[var(--color-surface-container-high)]">
          <Pebble
            variant="ghost"
            onClick={onBack}
          >
            Back
          </Pebble>
          <Pebble
            variant="primary"
            onClick={onNext}
          >
            Save Profile & Continue
          </Pebble>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
