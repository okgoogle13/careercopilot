import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { March } from '../components/ui/March';
import { Placard } from '../components/ui/Placard';
import { Strike } from '../components/ui/Strike';

const welcomeSignals = [
  'Upload one resume and keep the drafting base steady.',
  'Bring in a role brief before opening the first tailored draft.',
  'Keep the route focused on concrete next actions, not generic setup.',
] as const;

export function WelcomeScreen() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(
    'Welcome briefing is set. Review the next application move, then enter onboarding with a clear route.',
  );

  return (
    <section
      className="journey-screen welcome-screen"
      data-testid="welcome-screen"
    >
      <Strike
        className="auth-strike dashboard-strike"
        eyebrow="Welcome Briefing"
      >
        Bring the current application move into focus, so the route opens with useful pressure instead of empty setup.
      </Strike>
      <Placard title="Bring Your Application Into View">
        <March>
          Keep the opening brief short and concrete: one role direction, one document base, and one next action ready to carry forward.
        </March>
        <div className="dashboard-grid">
          {welcomeSignals.map((signal) => (
            <article
              className="dashboard-card"
              key={signal}
            >
              <p className="dashboard-card__detail">{signal}</p>
            </article>
          ))}
        </div>
        <div className="dashboard-actions">
          <button
            className="primary-action"
            onClick={() => {
              setStatus('Welcome briefing cleared. Onboarding route is next.');
            }}
            type="button"
          >
            Start Onboarding Pass
          </button>
          <button
            className="secondary-action"
            onClick={() => navigate('/onboarding')}
            type="button"
          >
            Open Onboarding Route
          </button>
        </div>
        <p
          aria-live="polite"
          className="status-copy"
          role="status"
        >
          {status}
        </p>
      </Placard>
    </section>
  );
}
