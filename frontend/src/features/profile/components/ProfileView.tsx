import { Pebble, StatusBadge, Stone } from '@/components/ui';
<<<<<<< HEAD
=======
import { ProfileHeader } from '@/components/ProfileHeader';
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
import starfishCage from '../../../assets/specimens/starfish-cage.jpg';
import wallpaper from '../../../assets/textures/wallpaper.png';

/**
 * CareerCopilot Profile View ("The Specimen Archive")
 *
 * V3.1 Gallery Mode View implementation.
=======
const starfishCage = '/assets/kr-solidarity/specimen/kr-solidarity__specimen__triage-natural-history__v1.png';
const wallpaper = '/assets/kr-solidarity/texture/kr-solidarity__substrate__kr-solidarity--texture--melbourne-laneway--v1__v1.png';

/**
 * CareerCopilot Profile View ("The KrMotif Archive")
 *
 * V3.1 KrDark Mode View implementation.
>>>>>>> restoration-KR-Rage-Figma-v2.0
 */
export function ProfileView() {
  const [careerData, setCareerData] = useState<any>(null);

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-specimen-night relative overflow-hidden pb-12 w-full">
=======
    <div className="min-h-screen bg-asphalt-black relative overflow-hidden pb-12 w-full">
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
          alt="Specimen Archive"
          className="w-full h-full object-cover brightness-50 contrast-125 saturate-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-specimen-night via-specimen-night/40 to-transparent" />
=======
          alt="KrMotif Archive"
          className="w-full h-full object-cover brightness-50 contrast-125 saturate-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-asphalt-black via-asphalt-black/40 to-transparent" />
>>>>>>> restoration-KR-Rage-Figma-v2.0

        {/* Subtle Motion Bloom */}
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
<<<<<<< HEAD
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-wattle-gold/10 blur-3xl pointer-events-none"
=======
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-ink-gold/10 blur-3xl pointer-events-none"
>>>>>>> restoration-KR-Rage-Figma-v2.0
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative -mt-32 z-10">
<<<<<<< HEAD
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
=======
        <ProfileHeader
          name="Nishant Dougall"
          bio="Senior Full Stack Engineer / Metadata Architect"
          identityTags={careerData?.skills?.slice(0, 3) || ['React.tsx', 'Neural.sys', 'Archival.Design']}
          landAcknowledgment="Wurundjeri Woi-wurrung Country"
        />
>>>>>>> restoration-KR-Rage-Figma-v2.0

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Column - Career Strata */}
          <div className="lg:col-span-8 space-y-12">
            <Stone
<<<<<<< HEAD
              mode="gallery"
              elevation="raised"
              className="p-10 border-flannel-flower/10 bg-specimen-night/40 backdrop-blur-md"
=======
             
              elevation="raised"
              className="p-10 border-concrete-grey/10 bg-asphalt-black/40 backdrop-blur-md"
>>>>>>> restoration-KR-Rage-Figma-v2.0
            >
              <ResumeUploader onUploadSuccess={setCareerData} />
            </Stone>

            <section className="space-y-8">
              <div className="flex items-baseline gap-4">
<<<<<<< HEAD
                <h2 className="font-bloom text-3xl font-bold text-parchment uppercase tracking-tight flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-wattle-gold" />
                  STRATUM <span className="text-wattle-gold">CHRONOLOGY</span>
                </h2>
                <div className="flex-1 h-px bg-flannel-flower/10" />
=======
                <h2 className="font-bloom text-3xl font-bold text-paper-white uppercase tracking-tight flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-ink-gold" />
                  STRATUM <span className="text-ink-gold">CHRONOLOGY</span>
                </h2>
                <div className="flex-1 h-px bg-concrete-grey/10" />
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
                      description="Designed core taxonomies for career data ingestion. Managed a team of 4 specimen auditors."
=======
                      description="Designed core taxonomies for career data ingestion. Managed a team of 4 KrMotif auditors."
>>>>>>> restoration-KR-Rage-Figma-v2.0
                    />
                  </>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Column - Traits & Filaments */}
          <div className="lg:col-span-4 space-y-8">
            <Stone
<<<<<<< HEAD
              mode="gallery"
              elevation="floating"
              className="p-8 border-flannel-flower/10 bg-specimen-night/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <Fingerprint className="w-5 h-5 text-wattle-gold" />
                <h3 className="font-annotation text-[10px] font-bold text-parchment uppercase tracking-[0.3em]">
=======
             
              elevation="floating"
              className="p-8 border-concrete-grey/10 bg-asphalt-black/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <Fingerprint className="w-5 h-5 text-ink-gold" />
                <h3 className="font-annotation text-[10px] font-bold text-paper-white uppercase tracking-[0.3em]">
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
                    'Specimen.Audit',
=======
                    'KrMotif.Audit',
>>>>>>> restoration-KR-Rage-Figma-v2.0
                    'Python',
                    'Archival.Design',
                  ]
                ).map((skill: string) => (
                  <div
                    key={skill}
<<<<<<< HEAD
                    className="bg-flannel-flower/5 text-flannel-flower border border-flannel-flower/20 font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded-full"
=======
                    className="bg-concrete-grey/5 text-concrete-grey border border-concrete-grey/20 font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded-full"
>>>>>>> restoration-KR-Rage-Figma-v2.0
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </Stone>

            <Stone
<<<<<<< HEAD
              mode="gallery"
              elevation="floating"
              className="p-8 border-flannel-flower/10 bg-specimen-night/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-5 h-5 text-wattle-gold" />
                <h3 className="font-annotation text-[10px] font-bold text-parchment uppercase tracking-[0.3em]">
=======
             
              elevation="floating"
              className="p-8 border-concrete-grey/10 bg-asphalt-black/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-5 h-5 text-ink-gold" />
                <h3 className="font-annotation text-[10px] font-bold text-paper-white uppercase tracking-[0.3em]">
>>>>>>> restoration-KR-Rage-Figma-v2.0
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

<<<<<<< HEAD
            <div className="p-6 border border-flannel-flower/5 rounded-2xl bg-wattle-gold/5 flex flex-col items-center text-center">
              <Archive className="w-8 h-8 text-wattle-gold mb-4 opacity-40" />
              <p className="font-field-note text-sm text-parchment opacity-60 italic leading-relaxed">
                "This record is synchronized with the primary Curio node."
=======
            <div className="p-6 border border-concrete-grey/5 rounded-2xl bg-ink-gold/5 flex flex-col items-center text-center">
              <Archive className="w-8 h-8 text-ink-gold mb-4 opacity-40" />
              <p className="font-field-note text-sm text-paper-white opacity-60 italic leading-relaxed">
                "This record is synchronized with the primary KrSolidarity node."
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
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
=======
     
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
>>>>>>> restoration-KR-Rage-Figma-v2.0
          {description}
        </p>
      )}
    </Stone>
  );
}

function Badge({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div
<<<<<<< HEAD
      className="aspect-square rounded-full bg-bark-light/5 border border-flannel-flower/10 flex items-center justify-center text-2xl hover:bg-wattle-gold/10 hover:border-wattle-gold/30 transition-all cursor-help relative group"
      title={title}
    >
      {emoji}
      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-wattle-gold opacity-0 group-hover:opacity-100 transition-opacity" />
=======
      className="aspect-square rounded-full bg-bark-light/5 border border-concrete-grey/10 flex items-center justify-center text-2xl hover:bg-ink-gold/10 hover:border-ink-gold/30 transition-all cursor-help relative group"
      title={title}
    >
      {emoji}
      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-ink-gold opacity-0 group-hover:opacity-100 transition-opacity" />
>>>>>>> restoration-KR-Rage-Figma-v2.0
    </div>
  );
}
