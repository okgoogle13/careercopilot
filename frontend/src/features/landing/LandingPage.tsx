import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../../components/ui/Logo';

// Figma node 1:10 — KR-Solidarity-CAREERCOPILOT, 2026-04-01
// Hero image placeholder — replace with /public/kr-hero-001.webp once asset is exported from Figma
const imgHero = '';
// Evidence section background placeholder
const imgEvidence = '';

const STATS = [
  { value: '127', label: 'Stories Archived', color: 'var(--kr-color-stencil-yellow-base)' },
  { value: '45', label: 'Orgs Represented', color: 'var(--kr-color-solidarity-red-base)' },
  { value: '98%', label: 'KSC Match Rate', color: 'var(--kr-color-protest-metal-blue-base)' },
  {
    value: '3×',
    label: 'Faster Applications',
    color: 'var(--kr-color-ink-bronze-base, var(--kr-color-ink-gold-base))',
  },
] as const;

const FEATURE_CARDS = [
  {
    id: 'build',
    title: 'Build Your Story',
    body: 'Upload your resume, parse your experience, and let the archive reconstruct your professional narrative with precision.',
    accentColor: 'var(--kr-color-solidarity-red-base)',
    iconBg: 'rgba(241,71,20,0.08)',
  },
  {
    id: 'archive',
    title: 'Archive Evidence',
    body: "Every skill, every role, every achievement — catalogued, cross-referenced, and ready for deployment at a moment's notice.",
    accentColor: 'var(--kr-color-stencil-yellow-base)',
    iconBg: 'rgba(218,246,116,0.08)',
  },
  {
    id: 'resist',
    title: 'Resist Slop',
    body: 'AI-powered responses that cut through generic templates. Your applications are weapons of specificity, not wallpaper.',
    accentColor: 'var(--kr-color-protest-metal-blue-base)',
    iconBg: 'rgba(72,240,229,0.08)',
  },
] as const;

export const LandingPage: React.FC = () => {
  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden antialiased"
      style={{ backgroundColor: 'var(--kr-color-charcoal-background-base)' }}
    >
      {/* Atmospheric gradient blobs — Figma node 1:12 */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: [
            'radial-gradient(circle at 15% 25%, rgba(241,71,20,0.12) 0%, transparent 40%)',
            'radial-gradient(circle at 75% 75%, rgba(218,246,116,0.10) 0%, transparent 40%)',
            'radial-gradient(circle at 50% 50%, rgba(72,240,229,0.08) 0%, transparent 35%)',
          ].join(', '),
        }}
      />

      {/* Header — Figma node 1:18 */}
      <header className="relative z-20 flex items-center justify-between px-8 pt-7 pb-4">
        <Logo size="md" />
        <Link
          to="/auth?mode=login"
          className="flex items-center justify-center px-5 h-[30px] font-mono text-[8px] uppercase tracking-[0.8px] border rounded-full transition-colors"
          style={{
            color: 'var(--kr-color-kr-activist-smoke-green-base)',
            borderColor: 'var(--kr-color-kr-activist-smoke-green-base)',
          }}
        >
          Sign In
        </Link>
      </header>

      {/* Hero Section — Figma node 1:42 */}
      <section className="relative z-10 flex flex-col md:flex-row items-start gap-8 px-8 pt-10 pb-12">
        {/* Left — headline + CTAs */}
        <div className="flex-1 flex flex-col gap-0">
          {/* Eyebrow */}
          <p
            className="font-mono text-[11px] uppercase tracking-[1.65px] mb-6"
            style={{ color: 'var(--kr-color-solidarity-red-base)' }}
          >
            CAREER COPILOT // SOLIDARITY MODE
          </p>

          {/* Headline — Libre Bodoni, Figma node 1:46 */}
          <h1
            className="font-['Libre_Bodoni'] font-bold uppercase leading-none tracking-tight mb-8"
            style={{
              fontSize: 'clamp(52px, 8vw, 92px)',
              letterSpacing: '-0.04em',
              color: 'var(--kr-color-solidarity-red-base)',
            }}
          >
            THE
            <br />
            SOLIDARITY
            <br />
            MANIFESTO
          </h1>

          {/* Subtext — Caveat, Figma node 1:50 */}
          <p
            className="font-['Caveat'] text-[22px] leading-relaxed mb-10 max-w-[480px]"
            style={{ color: 'var(--kr-color-stencil-yellow-base)' }}
          >
            Your professional history, re-documented for the{' '}
            <span className="font-bold">collective</span> future.
          </p>

          {/* CTAs — Figma node 1:52 */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link
              to="/auth?mode=register"
              className="inline-flex items-center gap-2 px-7 font-['Work_Sans'] font-black uppercase tracking-[0.8px] text-[16px]"
              style={{
                height: '56px',
                backgroundColor: 'var(--kr-color-solidarity-red-base)',
                color: 'var(--kr-color-charcoal-background-base)',
                borderRadius: '32px 8px 12px 20px',
              }}
            >
              BUILD YOUR STORY →
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-7 font-['Work_Sans'] font-bold uppercase tracking-[0.7px] text-[14px] border transition-colors"
              style={{
                height: '55px',
                color: 'var(--kr-color-stencil-yellow-base)',
                borderColor: 'rgba(218,246,116,0.3)',
                borderRadius: '32px 8px 12px 20px',
              }}
            >
              VIEW THE COLLECTIVE
            </Link>
          </div>

          {/* Country acknowledgement — Figma node 1:61 */}
          <p
            className="font-['Caveat'] text-[13px] opacity-70"
            style={{ color: 'var(--kr-color-kr-activist-smoke-green-base)' }}
          >
            Always was, always will be — built on unceded Wurundjeri Country.
          </p>
        </div>

        {/* Right — hero image + badges */}
        <div className="relative w-full md:w-[420px] flex-shrink-0">
          {/* Hero image — Figma node 1:63 */}
          {/* Replace imgHero with /public/kr-hero-001.webp once exported from Figma */}
          <div
            className="relative overflow-hidden w-full h-[420px] md:h-[560px]"
            style={{ borderRadius: '20px 8px 12px 32px' }}
          >
            {imgHero ? (
              <img
                src={imgHero}
                alt="Solidarity collective"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(135deg, var(--kr-color-charcoal-background-base) 0%, var(--kr-color-solidarity-smoke-orange-steps-4) 25%, var(--kr-color-protest-metal-blue-steps-3) 60%, var(--kr-color-charcoal-background-steps-6) 100%)',
                }}
              />
            )}
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, transparent 30%, rgba(15,15,15,0.92) 100%)',
              }}
            />
            {/* Red glow top-left */}
            <div
              className="absolute top-0 left-0 w-[280px] h-[140px] pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 20% 20%, rgba(241,71,20,0.2) 0%, rgba(121,36,10,0.1) 30%, transparent 60%)',
              }}
            />
          </div>

          {/* Stories archived badge — Figma node 1:67 */}
          <div
            className="absolute bottom-10 left-[-16px] flex flex-col gap-1 px-6 py-5"
            style={{
              backgroundColor: 'var(--kr-color-charcoal-background-steps-1)',
              border: '1px solid var(--kr-color-charcoal-background-steps-3)',
              borderRadius: '20px 4px 12px 2px',
              boxShadow: '0 16px 32px rgba(0,0,0,0.55)',
            }}
          >
            <span
              className="font-mono font-extrabold text-[38px] leading-none tracking-tight"
              style={{ color: 'var(--kr-color-stencil-yellow-base)' }}
            >
              127
            </span>
            <span
              className="font-mono font-bold text-[10px] uppercase tracking-[0.8px]"
              style={{ color: 'var(--kr-color-kr-activist-smoke-green-base)' }}
            >
              STORIES ARCHIVED
            </span>
          </div>

          {/* Anti-slop badge — Figma node 1:72 */}
          <div
            className="absolute top-[-12px] right-0 flex items-center px-4 h-[34px]"
            style={{
              backgroundColor: 'rgba(72,240,229,0.1)',
              border: '1px solid rgba(72,240,229,0.3)',
              borderRadius: '20px 8px 12px 32px',
            }}
          >
            <span
              className="font-mono font-extrabold text-[10px] uppercase tracking-[1px] whitespace-nowrap"
              style={{ color: 'var(--kr-color-protest-metal-blue-base)' }}
            >
              ANTI-SLOP ACTIVE
            </span>
          </div>
        </div>
      </section>

      {/* Stat Bar — Figma node 1:123 */}
      <section className="relative z-10 mx-8 mb-8">
        <div
          className="flex flex-row items-center justify-around py-6 px-4"
          style={{
            backgroundColor: 'var(--kr-color-charcoal-background-steps-1)',
            border: '1px solid var(--kr-color-charcoal-background-steps-3)',
            borderRadius: '20px 4px 12px 2px',
            boxShadow: '0 0 40px rgba(218,246,116,0.04)',
          }}
        >
          {STATS.map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i > 0 && (
                <div
                  className="hidden md:block w-px h-10 flex-shrink-0"
                  style={{ backgroundColor: 'var(--kr-color-charcoal-background-steps-3)' }}
                />
              )}
              <div className="flex flex-col items-center gap-2">
                <span
                  className="font-['Fraunces'] text-[clamp(32px,4vw,56px)] font-normal leading-none tracking-tight"
                  style={{ color: stat.color, fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
                >
                  {stat.value}
                </span>
                <span
                  className="font-mono font-thin text-[9px] uppercase tracking-[1.08px] opacity-75 text-center"
                  style={{ color: 'var(--kr-color-kr-activist-smoke-green-base)' }}
                >
                  {stat.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Feature Cards — Figma node 1:75 */}
      <section className="relative z-10 px-8 py-12 flex flex-col gap-8">
        <p
          className="font-mono font-bold text-[10px] uppercase tracking-[1px]"
          style={{ color: 'var(--kr-color-kr-activist-smoke-green-base)' }}
        >
          THE SOLIDARITY TOOLKIT
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURE_CARDS.map((card) => (
            <div
              key={card.id}
              className="relative overflow-hidden rounded-placard flex flex-col gap-4 p-8 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.35)]"
              style={{
                backgroundColor: 'var(--kr-color-charcoal-background-steps-1)',
                border: '1px solid var(--kr-color-charcoal-background-steps-3)',
              }}
            >
              {/* Top color bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ backgroundColor: card.accentColor }}
              />
              {/* Icon badge */}
              <div
                className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                style={{ background: card.iconBg, borderRadius: 'var(--kr-shape-march-open01)' }}
              />
              <h3
                className="font-['Fraunces'] text-2xl uppercase tracking-wide"
                style={{
                  color: 'var(--kr-color-worker-ash-base)',
                  fontVariationSettings: "'SOFT' 0, 'WONK' 1",
                }}
              >
                {card.title}
              </h3>
              <p
                className="text-sm font-['Work_Sans'] font-light leading-relaxed opacity-65"
                style={{ color: 'var(--kr-color-worker-ash-base)' }}
              >
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Evidence Section — Figma node 1:148 */}
      <section
        className="relative z-10 mx-8 mb-12 overflow-hidden rounded-placard"
        style={{
          border: '1px solid var(--kr-color-charcoal-background-steps-3)',
        }}
      >
        {imgEvidence && (
          <img
            src={imgEvidence}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(153.74deg, rgba(15,15,15,0.85) 0%, rgba(15,15,15,0.6) 100%)',
          }}
        />
        <div className="relative flex flex-col items-center justify-center py-24 px-8 gap-6">
          <p
            className="font-['Caveat'] text-lg italic opacity-65 -rotate-3"
            style={{ color: 'var(--kr-color-solidarity-smoke-orange-base)' }}
          >
            no neutral canvas.
          </p>
          <h2
            className="font-['Libre_Bodoni'] font-bold uppercase text-center leading-tight"
            style={{ fontSize: 'clamp(40px, 6vw, 69px)', letterSpacing: '-0.03em' }}
          >
            <span style={{ color: 'var(--kr-color-worker-ash-base)' }}>YOUR STORY IS</span>
            <br />
            <span style={{ color: 'var(--kr-color-solidarity-red-base)' }}>EVIDENCE.</span>
          </h2>
          <p
            className="max-w-lg text-center text-[15px] font-['Work_Sans'] font-thin leading-relaxed opacity-65"
            style={{ color: 'var(--kr-color-worker-ash-base)' }}
          >
            Social workers are archive-keepers. Career Copilot turns your lived professional
            experience into precision-targeted applications — specific, dignified, un-sloppable.
          </p>
          <Link
            to="/auth?mode=register"
            className="inline-flex items-center gap-2 px-7 font-['Work_Sans'] font-extrabold uppercase tracking-[0.7px] text-[14px]"
            style={{
              height: '53px',
              backgroundColor: 'var(--kr-color-solidarity-red-base)',
              color: 'var(--kr-color-charcoal-background-base)',
              borderRadius: '20px 8px 12px 32px',
            }}
          >
            START YOUR ARCHIVE →
          </Link>
        </div>
      </section>

      {/* Footer — Figma node 1:112 */}
      <footer
        className="relative z-10 mx-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4"
        style={{ borderTop: '1px solid var(--kr-color-charcoal-background-steps-3)' }}
      >
        <div className="flex flex-col gap-1">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.8px]"
            style={{ color: 'var(--kr-color-kr-activist-smoke-green-base)' }}
          >
            BUILT WITH SOLIDARITY // CAREER COPILOT v2.0
          </p>
          <p
            className="font-mono text-[9px] uppercase tracking-[0.54px] opacity-60"
            style={{ color: 'var(--kr-color-kr-activist-smoke-green-base)' }}
          >
            TOKEN SYNC v2.0 · SHAPE SYSTEM v6.1 · ANTI-SLOP ACTIVE
          </p>
        </div>
        <div className="flex items-center gap-6">
          <Link
            to="/style-guide"
            className="font-mono text-[10px] uppercase tracking-[0.6px] hover:opacity-100 opacity-80 transition-opacity"
            style={{ color: 'var(--kr-color-kr-activist-smoke-green-base)' }}
          >
            STYLE GUIDE
          </Link>
          <span
            className="font-['Caveat'] text-[15px] opacity-65"
            style={{ color: 'var(--kr-color-solidarity-smoke-orange-base)' }}
          >
            no neutral canvas
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
