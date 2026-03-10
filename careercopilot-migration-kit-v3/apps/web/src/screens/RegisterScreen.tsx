import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { March } from '../components/ui/March';
import { Placard } from '../components/ui/Placard';
import { Strike } from '../components/ui/Strike';

export function RegisterScreen() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(
    'Create your account to start tracking applications, drafts, and next actions in one place.',
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fullName || !email || !password) {
      setStatus('Complete every field to create your account.');
      return;
    }

    console.info('migrated-register-placeholder', { fullName, email });
    setStatus(
      `Account setup checkpoint cleared for ${email || 'unknown-user'}. Final provisioning still runs through the placeholder path.`,
    );
    void password;
  }

  return (
    <section
      className="login-panel login-panel--auth login-panel--register"
      data-testid="register-screen"
    >
      <Strike
        className="auth-strike"
        eyebrow="New Worker Entry"
      >
        Build your account on the migrated shell now, while the legacy route stays ready behind the same URL.
      </Strike>
      <Placard title="Claim Your Worker Portal">
        <March>
          Start with a stronger home for applications, drafts, and coordinated next steps from day one.
        </March>
        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <label className="field-label">
            Full Name
            <input
              className="field-input"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              type="text"
            />
          </label>
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
            Create The Worker Account
          </button>
          <button
            className="secondary-action"
            type="button"
            onClick={() => navigate('/login')}
          >
            Back To Sign In
          </button>
        </form>
        <p
          aria-live="polite"
          className={status.startsWith('Complete all') ? 'login-error' : 'status-copy'}
          role="status"
        >
          {status}
        </p>
      </Placard>
    </section>
  );
}
