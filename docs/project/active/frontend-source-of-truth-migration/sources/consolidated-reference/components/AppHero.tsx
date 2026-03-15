import { motion } from "motion/react";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Logo } from "./Logo";

export default function AppHero() {
  const m3Curve = [0.34, 1.56, 0.64, 1];

  const typography = {
    hero: { fontFamily: '"Fraunces", serif', fontVariationSettings: '"wght" 900, "SOFT" 10' },
    body: { fontFamily: '"Work Sans", sans-serif' },
    mono: { fontFamily: '"JetBrains Mono", monospace' },
    subline: { fontFamily: '"Work Sans", sans-serif', fontVariationSettings: '"wght" 475' },
    button: { fontFamily: '"Work Sans", sans-serif', fontVariationSettings: '"wght" 800' },
  };

  const shapes = {
    pebble: "16px 8px 12px 20px",
    slab: "48% 52% 58% 42% / 55% 45% 60% 40%",
    sentryAvatar: "98%",
  };

  const colors = {
    bg: "#0F0F0F",
    surface: "#1A1A1A",
    solidarityRed: "#F14714",
    inkGold: "#DAF674",
    workerAsh: "#DAF6B3",
    stencilYellow: "#F6E748",
  };

  const navItems = ["Manifesto", "Features", "Community", "Portal"];

  return (
    <div
      className="w-full h-screen max-h-[900px] max-w-[1440px] mx-auto flex flex-col overflow-hidden relative"
      style={{ backgroundColor: colors.bg, ...typography.body }}
    >
      {/* Navigation (M3 Expressive) */}
      <nav
        className="w-full h-[64px] flex items-center justify-between px-8 border-b border-[#2A2A2A] shrink-0"
        style={{ backgroundColor: colors.surface }}
      >
        {/* Wordmark / Logo */}
        <Logo variant="horizontal" size={40} />

        {/* Nav Items */}
        <div className="flex items-center gap-2">
          {navItems.map((item, i) => {
            const isActive = i === 0;
            return (
              <button
                key={item}
                className="relative px-5 py-2 text-sm uppercase tracking-wider transition-colors"
                style={{
                  ...typography.button,
                  color: isActive ? "#000000" : colors.workerAsh,
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute inset-0 z-0"
                    style={{
                      backgroundColor: colors.solidarityRed,
                      borderRadius: shapes.pebble,
                    }}
                    transition={{ duration: 0.6, ease: m3Curve }}
                  />
                )}
                <span className="relative z-10">{item}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Hero Content (55/45 Split) */}
      <main className="flex-1 w-full grid grid-cols-[55%_45%] items-center px-8 lg:px-16 gap-12 lg:gap-16 relative z-10">

        {/* Left Column: Text & CTAs */}
        <div className="flex flex-col justify-center max-w-[640px] w-full mt-[-40px]">
          {/* Headline */}
          <motion.h1
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: m3Curve }}
            className="text-[96px] xl:text-[112px] leading-[0.85] text-white uppercase tracking-tight mb-6"
            style={typography.hero}
          >
            THE SOLIDARITY<br />MANIFESTO
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: m3Curve }}
            className="text-[20px] italic mb-10 tracking-wide"
            style={{ color: colors.inkGold, ...typography.subline }}
          >
            No neutral canvas. We build power, not just resumes.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: m3Curve }}
            className="flex flex-row items-center gap-6"
          >
            {/* Primary CTA */}
            <button
              className="h-[56px] px-12 text-white uppercase tracking-[0.1em] text-sm flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-[0_4px_8px_rgba(0,0,0,0.35)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.45)]"
              style={{
                backgroundColor: colors.solidarityRed,
                borderRadius: shapes.pebble,
                ...typography.button,
              }}
            >
              Join the Line <ArrowRight className="w-5 h-5" />
            </button>

            {/* Secondary CTA */}
            <button
              className="h-[56px] px-8 uppercase tracking-[0.1em] text-sm flex items-center justify-center transition-all hover:bg-[#DAF6B3]/10"
              style={{
                color: colors.workerAsh,
                border: `2px solid ${colors.workerAsh}`,
                borderRadius: shapes.pebble,
                ...typography.button,
              }}
            >
              Read the Terms
            </button>
          </motion.div>
        </div>

        {/* Right Column: Visual */}
        <div className="relative h-full w-full flex flex-col items-center justify-center py-12">

          {/* Anti-Slop Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: m3Curve }}
            className="absolute top-8 right-0 z-20 flex items-center gap-2 px-4 py-2 text-black text-xs font-bold uppercase tracking-widest"
            style={{
              backgroundColor: colors.stencilYellow,
              borderRadius: shapes.pebble,
              boxShadow: `2px 2px 0px ${colors.solidarityRed}`,
              ...typography.mono,
            }}
          >
            <ShieldAlert className="w-4 h-4" />
            Anti-Slop Active
          </motion.div>

          {/* Hero Visual Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 1.2, ease: m3Curve }}
            className="relative w-full aspect-[4/5] max-h-[600px] overflow-hidden group shadow-[0_16px_32px_rgba(0,0,0,0.55)]"
            style={{ borderRadius: shapes.slab, backgroundColor: "#242424" }}
          >
            {/* Ink Offset / Graphic Treatment Overlays */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#F14714]/30 to-transparent mix-blend-overlay z-10 pointer-events-none" />
            <div
              className="absolute inset-0 border-[3px] opacity-40 mix-blend-screen pointer-events-none z-10"
              style={{
                borderColor: colors.inkGold,
                borderRadius: shapes.slab,
              }}
            />

            {/* Visual Subject - Using Unsplash image */}
            <div className="w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[3000ms] ease-out">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1709962225384-452857bca8dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm90ZXN0JTIwY3Jvd2QlMjBzaWxob3VldHRlfGVufDF8fHx8MTc3MzU3MzI2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Solidarity March"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </main>

      {/* Background Texture Overlay (Subtle noise/grain would go here, simulating wheat-paste/brick) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>
    </div>
  );
}
