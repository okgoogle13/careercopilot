import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../../components/ui/Logo';

// Figma node 1:10 — KR-Solidarity-CAREERCOPILOT, 2026-04-01
const imgHero =
  '/assets/kr-solidarity/street/kr-solidarity__street__protest--textless-protest-tram--v1.png';
const imgEvidence =
  '/assets/kr-solidarity/devotional/kr-solidarity__spiritual__devotional--textless-deity-poster--v1.png';

const STATS = [
  { value: '127', label: 'Advocacy Stories', color: 'var(--kr-color-solidarity-red-base)' },
  { value: '45', label: 'Organisations Reached', color: 'var(--kr-color-stencil-yellow-base)' },
  { value: '98%', label: 'Success Rate', color: 'var(--kr-color-protest-metal-blue-base)' },
  { value: '1:1', label: 'Peer Connections', color: 'var(--kr-color-ink-gold-base)' },
] as const;

const FEATURE_CARDS = [
  {
    id: 'build',
    title: 'Build Your Story',
    body: 'Upload your resume, parse your experience, and let the archive reconstruct your professional narrative with precision.',
    accentColor: 'var(--kr-color-solidarity-red-base)',
    iconBg: 'color-mix(in srgb, var(--kr-color-solidarity-red-base) 8%, transparent)',
  },
  {
    id: 'archive',
    title: 'Archive Evidence',
    body: "Every skill, every role, every achievement — catalogued, cross-referenced, and ready for deployment at a moment's notice.",
    accentColor: 'var(--kr-color-stencil-yellow-base)',
    iconBg: 'color-mix(in srgb, var(--kr-color-stencil-yellow-base) 8%, transparent)',
  },
  {
    id: 'resist',
    title: 'Resist Slop',
    body: 'AI-powered responses that cut through generic templates. Your applications are weapons of specificity, not wallpaper.',
    accentColor: 'var(--kr-color-protest-metal-blue-base)',
    iconBg: 'color-mix(in srgb, var(--kr-color-protest-metal-blue-base) 8%, transparent)',
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
            'radial-gradient(circle at 15% 25%, color-mix(in srgb, var(--kr-color-solidarity-red-base) 12%, transparent) 0%, transparent 40%)',
            'radial-gradient(circle at 75% 75%, color-mix(in srgb, var(--kr-color-stencil-yellow-base) 10%, transparent) 0%, transparent 40%)',
            'radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--kr-color-protest-metal-blue-base) 8%, transparent) 0%, transparent 35%)',
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
            color: 'var(--kr-color-protest-metal-blue-base)',
            borderColor: 'var(--kr-color-protest-metal-blue-base)',
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
            // CAREER_COPILOT // SOLIDARITY BUILD
          </p>

          {/* Headline — Libre Bodoni, Figma node 1:6784 */}
          <h1
            className="font-['Libre_Bodoni'] font-bold uppercase leading-none tracking-tight mb-8"
            style={{
              fontSize: 'clamp(52px, 8vw, 92px)',
              letterSpacing: '-0.04em',
              color: 'var(--kr-color-solidarity-red-base)',
            }}
          >
            GENERIC
            <br />
            CAREERS
            <br />
            DON'T FIT YOU.
          </h1>

          {/* Subtext — Figma nodes 1:6789, 1:6791, 1:6793 */}
          <p
            className="font-display text-[22px] leading-relaxed mb-4 max-w-[480px]"
            style={{
              color: 'var(--kr-color-stencil-yellow-base)',
              fontVariationSettings: "'SOFT' 0, 'WONK' 1",
            }}
          >
            For social workers. Advocates. People who change systems, not just survive them.
          </p>
          <p
            className="font-primary text-[18px] leading-relaxed mb-4 max-w-[480px] opacity-80"
            style={{ color: 'var(--kr-color-worker-ash-base)' }}
          >
            Your work doesn't fit into neat boxes. Your history is proof — not data points. Don't
            let a resume parser or a generic algorithm flatten what you've built.
          </p>
          <p
            className="font-['Work_Sans'] font-medium text-[16px] leading-relaxed mb-10 max-w-[480px]"
            style={{ color: 'var(--kr-color-worker-ash-base)' }}
          >
            Store your evidence, generate stronger applications, and find aligned opportunities in
            one place.
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
                borderRadius: 'var(--kr-archetypes-strike-shape-base)',
              }}
            >
              Create Account →
            </Link>
            <Link
              to="/opportunities"
              className="inline-flex items-center justify-center px-7 font-['Work_Sans'] font-bold tracking-[0.7px] text-[14px] border transition-colors"
              style={{
                height: '55px',
                color: 'var(--kr-color-worker-ash-base)',
                borderColor: 'var(--kr-color-charcoal-background-steps-4)',
                borderRadius: 'var(--kr-archetypes-strike-shape-base)',
              }}
            >
              Explore Opportunities →
            </Link>
          </div>

          {/* Country acknowledgement — Figma node 1:61 */}
          <p
            className="font-proclamation text-[13px] opacity-70"
            style={{ color: 'var(--kr-color-protest-metal-blue-base)' }}
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
            style={{ borderRadius: 'var(--kr-shape-march-open01)' }}
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
                background:
                  'linear-gradient(to bottom, transparent 30%, color-mix(in srgb, var(--kr-color-charcoal-background-base) 92%, transparent) 100%)',
              }}
            />
            {/* Red glow top-left */}
            <div
              className="absolute top-0 left-0 w-[280px] h-[140px] pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--kr-color-solidarity-red-base) 20%, transparent) 0%, color-mix(in srgb, var(--kr-color-solidarity-smoke-orange-base) 10%, transparent) 30%, transparent 60%)',
              }}
            />
          </div>

          {/* Stories archived badge — Figma node 1:67 */}
          <div
            className="absolute bottom-10 left-[-16px] flex flex-col gap-1 px-6 py-5"
            style={{
              backgroundColor: 'var(--kr-color-charcoal-background-steps-1)',
              border: '1px solid var(--kr-color-charcoal-background-steps-3)',
              borderRadius: 'var(--kr-shape-block-riot01)',
              boxShadow:
                '0 16px 32px color-mix(in srgb, var(--kr-color-charcoal-background-base) 55%, transparent)',
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
              style={{ color: 'var(--kr-color-protest-metal-blue-base)' }}
            >
              ADVOCACY STORIES
            </span>
          </div>

          {/* Anti-slop badge — Figma node 1:72 — dev only */}
          {import.meta.env.DEV && (
            <div
              className="absolute top-[-12px] right-0 flex items-center px-4 h-[34px]"
              style={{
                backgroundColor:
                  'color-mix(in srgb, var(--kr-color-protest-metal-blue-base) 10%, transparent)',
                border:
                  '1px solid color-mix(in srgb, var(--kr-color-protest-metal-blue-base) 30%, transparent)',
                borderRadius: 'var(--kr-shape-march-open01)',
              }}
            >
              <span
                className="font-mono font-extrabold text-[10px] uppercase tracking-[1px] whitespace-nowrap"
                style={{ color: 'var(--kr-color-protest-metal-blue-base)' }}
              >
                ANTI-SLOP ACTIVE
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Stat Bar — Figma node 1:123 */}
      <section className="relative z-10 mx-8 mb-8">
        <div
          className="flex flex-row items-center justify-around py-6 px-4"
          style={{
            backgroundColor: 'var(--kr-color-charcoal-background-steps-1)',
            border: '1px solid var(--kr-color-charcoal-background-steps-3)',
            borderRadius: 'var(--kr-shape-block-riot01)',
            boxShadow:
              '0 0 40px color-mix(in srgb, var(--kr-color-stencil-yellow-base) 4%, transparent)',
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
                  className="font-display-ultra text-[clamp(32px,4vw,56px)] leading-none tracking-tight"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </span>
                <span
                  className="font-mono font-thin text-[9px] uppercase tracking-[1.08px] opacity-75 text-center"
                  style={{ color: 'var(--kr-color-protest-metal-blue-base)' }}
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
          style={{ color: 'var(--kr-color-protest-metal-blue-base)' }}
        >
          THE SOLIDARITY TOOLKIT
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURE_CARDS.map((card) => (
            <div
              key={card.id}
              className="relative overflow-hidden rounded-march flex flex-col gap-4 p-8"
              style={{
                backgroundColor: 'var(--kr-color-charcoal-background-steps-1)',
                border: '1px solid var(--kr-color-charcoal-background-steps-3)',
                boxShadow:
                  '0px 4px 8px 0px color-mix(in srgb, var(--kr-color-charcoal-background-base) 35%, transparent)',
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
              'linear-gradient(153.74deg, color-mix(in srgb, var(--kr-color-charcoal-background-base) 85%, transparent) 0%, color-mix(in srgb, var(--kr-color-charcoal-background-base) 60%, transparent) 100%)',
          }}
        />
        <div className="relative flex flex-col items-center justify-center py-24 px-8 gap-6">
          <p
            className="font-['Fraunces'] font-normal italic text-center leading-relaxed max-w-lg"
            style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              color: 'var(--kr-color-worker-ash-base)',
              fontVariationSettings: "'SOFT' 0, 'WONK' 1",
            }}
          >
            "Our labor is not a commodity to be optimized, but a story to be told with dignity."
          </p>
          <p
            className="font-primary text-[20px] leading-relaxed text-center max-w-sm"
            style={{ color: 'var(--kr-color-stencil-yellow-base)' }}
          >
            Join a community that gets the weight of this work. Reclaim your story from the system
            that tried to flatten it.
          </p>
          <Link
            to="/auth?mode=register"
            className="inline-flex items-center gap-2 px-10 font-['Work_Sans'] font-bold text-[16px]"
            style={{
              height: '56px',
              backgroundColor: 'var(--kr-color-stencil-yellow-base)',
              color: 'var(--kr-color-charcoal-background-base)',
              borderRadius: 'var(--kr-archetypes-strike-shape-base)',
            }}
          >
            Get Started
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
            style={{ color: 'var(--kr-color-protest-metal-blue-base)' }}
          >
            Career Copilot v6.1 · Solidarity Edition
          </p>
          {import.meta.env.DEV && (
            <p
              className="font-mono text-[9px] uppercase tracking-[0.54px] opacity-60"
              style={{ color: 'var(--kr-color-protest-metal-blue-base)' }}
            >
              TOKEN SYNC v2.0 · SHAPE SYSTEM v6.1 · ANTI-SLOP ACTIVE
            </p>
          )}
        </div>
        <div className="flex items-center gap-6">
          <Link
            to="/style-guide"
            className="font-mono text-[10px] uppercase tracking-[0.6px] hover:opacity-100 opacity-80 transition-opacity"
            style={{ color: 'var(--kr-color-protest-metal-blue-base)' }}
          >
            STYLE GUIDE
          </Link>
          <span
            className="font-proclamation text-[15px] opacity-65"
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
