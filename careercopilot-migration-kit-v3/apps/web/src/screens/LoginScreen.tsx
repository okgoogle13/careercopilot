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
  const [status, setStatus] = useState('Sign in to reopen your saved drafts, roles, and next moves.');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || !password) {
      setStatus('Add both email and password to continue.');
      return;
    }

    console.info('migrated-login-placeholder', { email });
    setStatus(`Access checkpoint cleared for ${email || 'unknown-user'}. Workspace handoff remains placeholder-safe.`);
    void password;
  }

  return (
    <section
      className="login-panel login-panel--auth login-panel--login"
      data-testid="login-screen"
    >
      <Strike
        className="auth-strike"
        eyebrow="Worker Access"
      >
        Re-enter the workspace with sharper focus, faster routing, and the same safe fallback behind the flag.
      </Strike>
      <Placard title="Step Back Into The Worker Portal">
        <March>
          Pick up applications, notes, and active leads without losing the reversible rollout path.
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
            Enter The Workspace
          </button>
          <button
            className="secondary-action"
            type="button"
            onClick={() => navigate('/register')}
          >
            Open Registration
          </button>
        </form>
        <p
          aria-live="polite"
          className={status.startsWith('Enter both') ? 'login-error' : 'status-copy'}
          role="status"
        >
          {status}
        </p>
      </Placard>
    </section>
  );
}
