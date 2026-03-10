import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingProgress } from './OnboardingProgress';
import { useUserStore } from '@/stores/userStore';

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { isNewUser, setIsNewUser } = useUserStore();

  useEffect(() => {
    if (!isNewUser) {
      navigate('/onboarding', { replace: true });
    }
  }, [isNewUser, navigate]);

  return (
    <div className="min-h-screen bg-asphalt-black-darkest relative overflow-hidden px-6 py-10 md:px-12">
      <div className="mx-auto max-w-4xl">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 210, damping: 22 }}
          className="rounded-placard border border-ink-gold/25 bg-asphalt-black/65 p-8 md:p-12 shadow-[0_26px_64px_rgba(0,0,0,0.45)]"
        >
          <div className="mb-8">
            <OnboardingProgress
              currentStep={1}
              totalSteps={4}
              steps={['Welcome', 'Choose field', 'Choose your situation', 'Upload resume']}
            />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-ink-gold/80 mb-4">
            [ WELCOME.PROTOCOL ]
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-black text-paper-white leading-[0.94] tracking-tight">
            Land The Job You Actually Want.
          </h1>
          <ul className="mt-8 space-y-4 text-paper-white/90 font-primary text-base md:text-lg leading-relaxed">
            <li>Upload your resume once. AI extracts and organizes your career history.</li>
            <li>Paste any job ad and generate a tailored cover letter in under a minute.</li>
            <li>Build strong Key Selection Criteria responses with guided STAR prompts.</li>
          </ul>
          <button
            type="button"
            onClick={() => {
              setIsNewUser(false);
              navigate('/onboarding');
            }}
            className="mt-10 inline-flex items-center justify-center rounded-placard bg-ink-gold text-asphalt-black font-black uppercase tracking-wide px-8 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_46px_rgba(218,246,116,0.35)]"
          >
            Get Started →
          </button>
        </motion.section>
      </div>
    </div>
  );
}

export default WelcomeScreen;
