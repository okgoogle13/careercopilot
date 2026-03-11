import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { March } from '../components/ui/March';
import { Placard } from '../components/ui/Placard';
import { Strike } from '../components/ui/Strike';

const onboardingPaths = [
  'Community Services',
  'Government Roles',
  'Care Coordination',
] as const;

export function OnboardingScreen() {
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = useState<(typeof onboardingPaths)[number] | ''>('');
  const [status, setStatus] = useState(
    'Choose the route pressure point that should shape your drafting and search decisions.',
  );

  function handleContinue() {
    if (!selectedPath) {
      setStatus('Choose one pathway before opening the welcome briefing.');
      return;
    }

    setStatus(`Pathway locked: ${selectedPath}. Welcome briefing is ready to open.`);
  }

  return (
    <section
      className="journey-screen onboarding-screen"
      data-testid="onboarding-screen"
    >
      <Strike
        className="auth-strike dashboard-strike"
        eyebrow="Onboarding Route"
      >
        Set the first route focus so the next drafting pass starts from the right work, not a generic intake.
      </Strike>
      <Placard title="Choose The Route Pressure Point">
        <March>
          Start with the role path that needs attention first, then carry that context into the welcome briefing and the document setup step.
        </March>
        <div className="dashboard-grid">
          {onboardingPaths.map((path) => (
            <button
              aria-pressed={selectedPath === path}
              className={selectedPath === path ? 'primary-action' : 'secondary-action'}
              key={path}
              onClick={() => {
                setSelectedPath(path);
                setStatus(`Pathway ready: ${path}. Open the welcome briefing when the route feels correct.`);
              }}
              type="button"
            >
              {path}
            </button>
          ))}
        </div>
        <div className="dashboard-actions">
          <button
            className="primary-action"
            onClick={handleContinue}
            type="button"
          >
            Open Welcome Briefing
          </button>
          <button
            className="secondary-action"
            onClick={() => navigate('/dashboard')}
            type="button"
          >
            Review Dashboard First
          </button>
        </div>
        <p
          aria-live="polite"
          className={
            status.startsWith('Choose one pathway') ? 'login-error' : 'status-copy'
          }
          role="status"
        >
          {status}
        </p>
      </Placard>
    </section>
  );
}
