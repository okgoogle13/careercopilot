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
    'Create your account to gather applications, drafts, and next actions inside one movement space.',
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fullName || !email || !password) {
      setStatus('Complete every field to create your account.');
      return;
    }

    console.info('register-screen-submit', { fullName, email });
    setStatus(
      `Account created for ${email || 'unknown-user'}. Profile setup is the next step.`,
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
        eyebrow="Movement Entry"
      >
        Build your account and step into a movement space shaped for applications, drafts, and shared momentum.
      </Strike>
      <Placard title="Claim Your Collective Portal">
        <March>
          Start with a clear base for applications, drafts, and coordinated next steps from day one.
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
            Create Account (Step 1 Of 2)
          </button>
          <button
            className="secondary-action"
            type="button"
            onClick={() => navigate('/login')}
          >
            Back To Login
          </button>
        </form>
        <p
          aria-live="polite"
          className={status.startsWith('Complete every field') ? 'login-error' : 'status-copy'}
          role="status"
        >
          {status}
        </p>
      </Placard>
    </section>
  );
}
