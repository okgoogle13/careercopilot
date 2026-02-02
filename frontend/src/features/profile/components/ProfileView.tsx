import { Pebble, StatusBadge, Stone } from '@/components/ui';
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
import starfishCage from '../../../assets/specimens/starfish-cage.jpg';
import wallpaper from '../../../assets/textures/wallpaper.png';

/**
 * CareerCopilot Profile View ("The Specimen Archive")
 *
 * V3.1 Gallery Mode View implementation.
 */
export function ProfileView() {
  const [careerData, setCareerData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-specimen-night relative overflow-hidden pb-12 w-full">
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
          alt="Specimen Archive"
          className="w-full h-full object-cover brightness-50 contrast-125 saturate-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-specimen-night via-specimen-night/40 to-transparent" />

        {/* Subtle Motion Bloom */}
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-wattle-gold/10 blur-3xl pointer-events-none"
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative -mt-32 z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-end gap-8 mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-40 h-40 md:w-52 md:h-52 rounded-full border-8 border-specimen-night bg-bark-light/10 shadow-glow-gold overflow-hidden relative group cursor-pointer"
          >
            <div className="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
              🧑‍💻
            </div>
            <div className="absolute inset-0 bg-wattle-gold/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>

          <div className="flex-1 pb-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <span className="font-annotation text-[10px] text-wattle-gold uppercase tracking-[0.4em] opacity-60">
                IDENTIFIER: NJD_08
              </span>
              <StatusBadge
                label="ACTIVE"
                variant="success"
                showDot
              />
            </div>
            <h1 className="font-bloom text-5xl md:text-7xl font-black text-parchment tracking-tighter uppercase leading-none mb-4">
              Nishant <span className="text-wattle-gold">Dougall</span>
            </h1>

            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-flannel-flower text-xs font-annotation uppercase tracking-widest opacity-80">
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-wattle-gold" /> San Francisco, CL
              </span>
              <span className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-wattle-gold" /> nishant@arch.ive
              </span>
              <span className="flex items-center gap-2">
                <LinkIcon className="w-3.5 h-3.5 text-wattle-gold" /> CC_NODE_691
              </span>
            </div>
          </div>

          <div className="pb-4">
            <Pebble
              variant="primary"
              size="lg"
              className="px-10 font-bold uppercase tracking-widest shadow-lg"
            >
              <Edit3 className="w-4 h-4 mr-2" /> RECALIBRATE
            </Pebble>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Column - Career Strata */}
          <div className="lg:col-span-8 space-y-12">
            <Stone
              mode="gallery"
              elevation="raised"
              className="p-10 border-flannel-flower/10 bg-specimen-night/40 backdrop-blur-md"
            >
              <ResumeUploader onUploadSuccess={setCareerData} />
            </Stone>

            <section className="space-y-8">
              <div className="flex items-baseline gap-4">
                <h2 className="font-bloom text-3xl font-bold text-parchment uppercase tracking-tight flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-wattle-gold" />
                  STRATUM <span className="text-wattle-gold">CHRONOLOGY</span>
                </h2>
                <div className="flex-1 h-px bg-flannel-flower/10" />
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
                      description="Designed core taxonomies for career data ingestion. Managed a team of 4 specimen auditors."
                    />
                  </>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Column - Traits & Filaments */}
          <div className="lg:col-span-4 space-y-8">
            <Stone
              mode="gallery"
              elevation="floating"
              className="p-8 border-flannel-flower/10 bg-specimen-night/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <Fingerprint className="w-5 h-5 text-wattle-gold" />
                <h3 className="font-annotation text-[10px] font-bold text-parchment uppercase tracking-[0.3em]">
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
                    'Specimen.Audit',
                    'Python',
                    'Archival.Design',
                  ]
                ).map((skill: string) => (
                  <div
                    key={skill}
                    className="bg-flannel-flower/5 text-flannel-flower border border-flannel-flower/20 font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded-full"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </Stone>

            <Stone
              mode="gallery"
              elevation="floating"
              className="p-8 border-flannel-flower/10 bg-specimen-night/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-5 h-5 text-wattle-gold" />
                <h3 className="font-annotation text-[10px] font-bold text-parchment uppercase tracking-[0.3em]">
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

            <div className="p-6 border border-flannel-flower/5 rounded-2xl bg-wattle-gold/5 flex flex-col items-center text-center">
              <Archive className="w-8 h-8 text-wattle-gold mb-4 opacity-40" />
              <p className="font-field-note text-sm text-parchment opacity-60 italic leading-relaxed">
                "This record is synchronized with the primary Curio node."
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
      mode="gallery"
      elevation="flat"
      className="p-6 border-flannel-flower/5 bg-white/5 hover:border-wattle-gold/20 transition-all group overflow-hidden relative"
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-wattle-gold opacity-20 group-hover:opacity-100 transition-opacity" />
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bloom text-xl font-bold text-parchment uppercase tracking-tight">
          {role}
        </h3>
        <span className="font-mono text-[9px] text-wattle-gold opacity-60 tracking-widest uppercase">
          {date}
        </span>
      </div>
      <p className="font-annotation text-[10px] text-wattle-gold uppercase tracking-[0.2em] mb-4 opacity-80">
        {company}
      </p>
      {description && (
        <p className="font-field-note text-sm text-flannel-flower italic opacity-70 leading-relaxed">
          {description}
        </p>
      )}
    </Stone>
  );
}

function Badge({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div
      className="aspect-square rounded-full bg-bark-light/5 border border-flannel-flower/10 flex items-center justify-center text-2xl hover:bg-wattle-gold/10 hover:border-wattle-gold/30 transition-all cursor-help relative group"
      title={title}
    >
      {emoji}
      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-wattle-gold opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
