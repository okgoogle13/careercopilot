import { Pebble, StatusBadge, Stone } from '@/components/ui';
import { ProfileHeader } from '@/components/ProfileHeader';
import { motion } from 'framer-motion';
import {
  Archive,
  Award,
  Briefcase,
  Edit3,
  Fingerprint,
  Link as LinkIcon,
  Mail,
  MapPin,
} from 'lucide-react';
import { useState } from 'react';
import ResumeUploader from './ResumeUploader';

// Assets
import starfishCage from '../../../assets/KrMotifs/starfish-cage.jpg';
import wallpaper from '../../../assets/textures/wallpaper.png';

/**
 * CareerCopilot Profile View ("The KrMotif Archive")
 *
 * V3.1 KrDark Mode View implementation.
 */
export function ProfileView() {
  const [careerData, setCareerData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-asphalt-black relative overflow-hidden pb-12 w-full">
      {/* Background Layer */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none mix-blend-soft-light"
        style={{
          backgroundImage: `url(${wallpaper})`,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Hero Banner Section */}
      <div className="h-64 md:h-80 relative overflow-hidden">
        <img
          src={starfishCage}
          alt="KrMotif Archive"
          className="w-full h-full object-cover brightness-50 contrast-125 saturate-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-asphalt-black via-asphalt-black/40 to-transparent" />

        {/* Subtle Motion Bloom */}
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-ink-gold/10 blur-3xl pointer-events-none"
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative -mt-32 z-10">
        <ProfileHeader
          name="Nishant Dougall"
          bio="Senior Full Stack Engineer / Metadata Architect"
          identityTags={careerData?.skills?.slice(0, 3) || ['React.tsx', 'Neural.sys', 'Archival.Design']}
          landAcknowledgment="Wurundjeri Woi-wurrung Country"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Column - Career Strata */}
          <div className="lg:col-span-8 space-y-12">
            <Stone
              mode="KrDark"
              elevation="raised"
              className="p-10 border-concrete-grey/10 bg-asphalt-black/40 backdrop-blur-md"
            >
              <ResumeUploader onUploadSuccess={setCareerData} />
            </Stone>

            <section className="space-y-8">
              <div className="flex items-baseline gap-4">
                <h2 className="font-bloom text-3xl font-bold text-paper-white uppercase tracking-tight flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-ink-gold" />
                  STRATUM <span className="text-ink-gold">CHRONOLOGY</span>
                </h2>
                <div className="flex-1 h-px bg-concrete-grey/10" />
              </div>

              <div className="space-y-4">
                {careerData && careerData.entries && careerData.entries.length > 0 ? (
                  careerData.entries.map((entry: any, index: number) => (
                    <TimelineItem
                      key={index}
                      role={entry.title}
                      company={entry.employer}
                      date={
                        entry.start_date
                          ? `${entry.start_date} - ${entry.end_date || 'Present'}`
                          : 'Date Unknown'
                      }
                      description={entry.description}
                    />
                  ))
                ) : (
                  <>
                    <TimelineItem
                      role="Senior Full Stack Engineer"
                      company="Tech Corp Inc."
                      date="2022 - PRESENT"
                      description="Leading the archive migration to high-fidelity synthesis models. Improved extraction throughput by 40%."
                    />
                    <TimelineItem
                      role="Metadata Architect"
                      company="StartUp Studio"
                      date="2020 - 2022"
                      description="Designed core taxonomies for career data ingestion. Managed a team of 4 KrMotif auditors."
                    />
                  </>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Column - Traits & Filaments */}
          <div className="lg:col-span-4 space-y-8">
            <Stone
              mode="KrDark"
              elevation="floating"
              className="p-8 border-concrete-grey/10 bg-asphalt-black/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <Fingerprint className="w-5 h-5 text-ink-gold" />
                <h3 className="font-annotation text-[10px] font-bold text-paper-white uppercase tracking-[0.3em]">
                  Extracted Filaments
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(
                  careerData?.skills || [
                    'React.tsx',
                    'TypeScript',
                    'Neural.sys',
                    'Tailwind',
                    'GraphQL',
                    'KrMotif.Audit',
                    'Python',
                    'Archival.Design',
                  ]
                ).map((skill: string) => (
                  <div
                    key={skill}
                    className="bg-concrete-grey/5 text-concrete-grey border border-concrete-grey/20 font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded-full"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </Stone>

            <Stone
              mode="KrDark"
              elevation="floating"
              className="p-8 border-concrete-grey/10 bg-asphalt-black/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-5 h-5 text-ink-gold" />
                <h3 className="font-annotation text-[10px] font-bold text-paper-white uppercase tracking-[0.3em]">
                  Validation Badges
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Badge
                  emoji="🚀"
                  title="Early Adopter"
                />
                <Badge
                  emoji="💻"
                  title="Systems Architect"
                />
                <Badge
                  emoji="🔍"
                  title="Forensic Auditor"
                />
                <Badge
                  emoji="🎓"
                  title="Scientific Lead"
                />
                <Badge
                  emoji="🤝"
                  title="Collaborative Hub"
                />
                <Badge
                  emoji="🏺"
                  title="Archivist"
                />
              </div>
            </Stone>

            <div className="p-6 border border-concrete-grey/5 rounded-2xl bg-ink-gold/5 flex flex-col items-center text-center">
              <Archive className="w-8 h-8 text-ink-gold mb-4 opacity-40" />
              <p className="font-field-note text-sm text-paper-white opacity-60 italic leading-relaxed">
                "This record is synchronized with the primary KrSolidarity node."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({
  role,
  company,
  date,
  description,
}: {
  role: string;
  company: string;
  date: string;
  description?: string;
}) {
  return (
    <Stone
      mode="KrDark"
      elevation="flat"
      className="p-6 border-concrete-grey/5 bg-white/5 hover:border-ink-gold/20 transition-all group overflow-hidden relative"
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-ink-gold opacity-20 group-hover:opacity-100 transition-opacity" />
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bloom text-xl font-bold text-paper-white uppercase tracking-tight">
          {role}
        </h3>
        <span className="font-mono text-[9px] text-ink-gold opacity-60 tracking-widest uppercase">
          {date}
        </span>
      </div>
      <p className="font-annotation text-[10px] text-ink-gold uppercase tracking-[0.2em] mb-4 opacity-80">
        {company}
      </p>
      {description && (
        <p className="font-field-note text-sm text-concrete-grey italic opacity-70 leading-relaxed">
          {description}
        </p>
      )}
    </Stone>
  );
}

function Badge({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div
      className="aspect-square rounded-full bg-bark-light/5 border border-concrete-grey/10 flex items-center justify-center text-2xl hover:bg-ink-gold/10 hover:border-ink-gold/30 transition-all cursor-help relative group"
      title={title}
    >
      {emoji}
      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-ink-gold opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
