import { motion } from 'framer-motion';
import { ArrowRight, FileText, Sparkles, Target } from 'lucide-react';

export const WELCOME_SEEN_KEY = 'cc_welcome_seen';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const benefits = [
  {
    icon: FileText,
    title: 'Upload once, use everywhere',
    body: 'AI extracts your career history from your resume and stores it so every tool is pre-filled for you.',
  },
  {
    icon: Target,
    title: 'Land the right role faster',
    body: 'Paste any job ad and get an instant ATS score showing exactly how well your resume matches.',
  },
  {
    icon: Sparkles,
    title: 'AI-written cover letters & KSC in minutes',
    body: 'Generate tailored cover letters and Key Selection Criteria responses in under a minute—guided step by step.',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 28 } },
};

/**
 * WelcomeScreen — H1 recommendation from docs/analysis/user-journey-analysis.md
 *
 * Shown once to new users before domain selection. Explains what CareerCopilot
 * does, who it is for, and the 3 main jobs-to-be-done. Dismissed via
 * localStorage key `cc_welcome_seen`.
 */
export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const handleGetStarted = () => {
    try {
      localStorage.setItem(WELCOME_SEEN_KEY, 'true');
    } catch {
      // ignore storage errors
    }
    onGetStarted();
  };

  return (
    <div className="min-h-screen bg-asphalt-black flex items-center justify-center p-6 md:p-12">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-2xl w-full space-y-12"
      >
        {/* Eyebrow */}
        <motion.p
          variants={item}
          className="font-annotation text-[10px] text-ink-gold uppercase tracking-[0.6em] opacity-70 text-center"
        >
          [ WELCOME.TO.CAREERCOPILOT ]
        </motion.p>

        {/* Headline */}
        <motion.div
          variants={item}
          className="text-center space-y-4"
        >
          <h1 className="font-display text-5xl md:text-7xl font-black text-paper-white tracking-tighter uppercase leading-[0.9]">
            Land the job you{' '}
            <span className="text-ink-gold">actually want.</span>
          </h1>
          <p className="font-primary text-lg text-concrete-grey opacity-70">
            CareerCopilot is your AI-powered job application assistant — built for community and
            public-sector roles.
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.ul
          variants={container}
          className="space-y-5"
          aria-label="Key benefits"
        >
          {benefits.map(({ icon: Icon, title, body }) => (
            <motion.li
              key={title}
              variants={item}
              className="flex items-start gap-5 p-5 rounded-[10px] border border-concrete-grey/10 bg-white/[0.02] hover:border-ink-gold/20 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-ink-gold/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-ink-gold" />
              </div>
              <div>
                <p className="font-primary text-sm font-semibold text-paper-white mb-1">{title}</p>
                <p className="font-primary text-xs text-concrete-grey/70">{body}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        {/* CTA */}
        <motion.div
          variants={item}
          className="flex justify-center"
        >
          <button
            onClick={handleGetStarted}
            className="
              inline-flex items-center gap-3 px-10 py-4 font-black uppercase tracking-wider
              bg-ink-gold text-asphalt-black rounded-[8px]
              hover:bg-ink-gold/90 active:scale-[0.98]
              transition-all duration-150 shadow-lg text-base
            "
          >
            Get started <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Already familiar link */}
        <motion.p
          variants={item}
          className="text-center text-xs text-concrete-grey/40 font-annotation uppercase tracking-widest"
        >
          Already familiar?{' '}
          <button
            onClick={handleGetStarted}
            className="underline hover:text-concrete-grey transition-colors"
          >
            Skip intro
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default WelcomeScreen;
