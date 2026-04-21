import React from 'react';

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface LoginCardProps {
  onLogin: (credentials: LoginCredentials) => void;
  onRegisterClick?: () => void;
  isLoading?: boolean;
}

export const LoginCard: React.FC<LoginCardProps> = ({ onLogin, onRegisterClick, isLoading }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <div
      className="w-full max-w-md p-8 rounded-[var(--sys-shape-placard01,8px)] border"
      style={{
        background: 'var(--sys-color-charcoalBackground-base)',
        borderColor: 'color-mix(in srgb, var(--kr-color-concrete-grey-base) 20%, transparent)',
      }}
    >
      <h2
        className="text-2xl font-bold mb-6 uppercase tracking-widest"
        style={{ color: 'var(--sys-color-worker-ash-base)' }}
      >
        Sign In
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label
            className="block text-xs font-mono uppercase tracking-widest mb-1"
            style={{ color: 'var(--sys-color-concreteGrey-base)' }}
          >
            Email Address
          </label>
          <input
            type="email"
            data-testid="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-sm border bg-transparent text-sm outline-none"
            style={{
              borderColor:
                'color-mix(in srgb, var(--kr-color-concrete-grey-base) 20%, transparent)',
              color: 'var(--sys-color-worker-ash-base)',
            }}
          />
        </div>

        <div>
          <label
            className="block text-xs font-mono uppercase tracking-widest mb-1"
            style={{ color: 'var(--sys-color-concreteGrey-base)' }}
          >
            Password
          </label>
          <input
            type="password"
            data-testid="password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-sm border bg-transparent text-sm outline-none"
            style={{
              borderColor:
                'color-mix(in srgb, var(--kr-color-concrete-grey-base) 20%, transparent)',
              color: 'var(--sys-color-worker-ash-base)',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 font-bold uppercase tracking-widest text-sm disabled:opacity-40"
          style={{
            background: 'var(--sys-color-solidarityRed-base)',
            color: 'var(--sys-color-worker-ash-base)',
          }}
        >
          {isLoading ? 'VERIFYING' : 'ENTER ARCHIVE'}
        </button>
      </form>

      {onRegisterClick && (
        <p
          className="mt-6 text-center text-xs"
          style={{ color: 'var(--sys-color-concreteGrey-base)' }}
        >
          No account?{' '}
          <button
            type="button"
            onClick={onRegisterClick}
            className="underline"
            style={{ color: 'var(--sys-color-inkGold-base)' }}
          >
            Create Collective ID
          </button>
        </p>
      )}
    </div>
  );
};

export default LoginCard;
