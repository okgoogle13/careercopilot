import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { March } from '../components/ui/March';
import { Placard } from '../components/ui/Placard';
import { Strike } from '../components/ui/Strike';

export function ProfileScreen() {
  const navigate = useNavigate();
  const [roleFocus, setRoleFocus] = useState('');
  const [communityStrengths, setCommunityStrengths] = useState('');
  const [status, setStatus] = useState(
    'Set the foundation for your role focus, strengths, and next applications in one shared profile.',
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!roleFocus || !communityStrengths) {
      setStatus('Add your role focus and community strengths before saving.');
      return;
    }

    setStatus(`Profile foundation saved for ${roleFocus}. Dashboard review is the next step.`);
  }

  return (
    <section
      className="login-panel login-panel--profile"
      data-testid="profile-screen"
    >
      <Strike eyebrow="Profile Foundation">
        Shape a movement-ready profile that keeps your strengths, role direction, and application narrative aligned.
      </Strike>
      <Placard title="Shape Your Movement Profile">
        <March>
          Capture the core signals that make future applications, tailored drafts, and next-step decisions faster to coordinate.
        </March>
        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <label className="field-label">
            Role Focus
            <input
              className="field-input"
              value={roleFocus}
              onChange={(event) => setRoleFocus(event.target.value)}
              type="text"
            />
          </label>
          <label className="field-label">
            Community Strengths
            <textarea
              className="field-input"
              value={communityStrengths}
              onChange={(event) => setCommunityStrengths(event.target.value)}
              rows={4}
            />
          </label>
          <button
            className="primary-action"
            type="submit"
          >
            Save Profile Foundation
          </button>
          <button
            className="secondary-action"
            type="button"
            onClick={() => navigate('/dashboard')}
          >
            Review Dashboard
          </button>
        </form>
        <p
          aria-live="polite"
          className={
            status.startsWith('Add your role focus') ? 'login-error' : 'status-copy'
          }
          role="status"
        >
          {status}
        </p>
      </Placard>
    </section>
  );
}
