import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { March } from '../components/ui/March';
import { Placard } from '../components/ui/Placard';
import { Strike } from '../components/ui/Strike';

export function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(
    'Log in to reopen your drafts, active roles, and next moves from one movement base.',
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || !password) {
      setStatus('Add your email and password to move forward.');
      return;
    }

    console.info('login-screen-submit', { email });
    setStatus(`Login confirmed for ${email || 'unknown-user'}. Dashboard access is next.`);
    void password;
  }

  return (
    <section
      className="login-panel login-panel--auth login-panel--login"
      data-testid="login-screen"
    >
      <Strike
        className="auth-strike"
        eyebrow="Collective Access"
      >
        Return to your movement base with your current roles, notes, and next actions held in one place.
      </Strike>
      <Placard title="Return To The Collective Portal">
        <March>
          Pick up applications, notes, and active leads without losing the thread of the search.
        </March>
        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <label className="field-label">
            Email
            <input
              className="field-input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
            />
          </label>
          <label className="field-label">
            Password
            <input
              className="field-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
            />
          </label>
          <button
            className="primary-action"
            type="submit"
          >
            Login &rarr; Access Dashboard
          </button>
          <button
            className="secondary-action"
            type="button"
            onClick={() => navigate('/register')}
          >
            Create Account (Step 1 Of 2)
          </button>
        </form>
        <p
          aria-live="polite"
          className={status.startsWith('Add your email') ? 'login-error' : 'status-copy'}
          role="status"
        >
          {status}
        </p>
      </Placard>
    </section>
  );
}
