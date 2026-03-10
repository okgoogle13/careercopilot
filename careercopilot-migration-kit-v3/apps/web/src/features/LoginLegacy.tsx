import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Placard } from '../components/ui/Placard';
import { Strike } from '../components/ui/Strike';

export function LoginLegacy() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.info('legacy-login-placeholder', { email });
    setMessage(`Legacy placeholder accepted credentials for ${email || 'unknown-user'}.`);
    void password;
  }

  return (
    <section
      className="login-panel login-panel--legacy"
      data-testid="legacy-login"
    >
      <Strike eyebrow="Legacy Feature">Legacy /login remains active until the flag flips.</Strike>
      <Placard title="Legacy Login Fallback">
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
            Continue With Legacy Flow
          </button>
          <button
            className="secondary-action"
            type="button"
            onClick={() => navigate('/register')}
          >
            Go To Register
          </button>
        </form>
        <p
          aria-live="polite"
          className="status-copy"
        >
          {message || 'Legacy feature remains the committed default.'}
        </p>
      </Placard>
    </section>
  );
}
