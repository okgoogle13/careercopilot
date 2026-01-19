import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/AuthContext';
import { NorthcoteButton } from '../../components/ui/NorthcoteButton';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

export function Login() {
  const [authError, setAuthError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setAuthError('');
    try {
      await login(data.email, data.password);
      // Login successful, redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      // Handle Firebase errors or generic errors
      if (err.code === 'auth/invalid-credential') {
        setAuthError('Invalid email or password.');
      } else {
        setAuthError('Failed to sign in. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface-specimen-night-base flex items-center justify-center p-8 animate-in fade-in duration-500">
      <div className="w-full max-w-md">
        {/* Card */}
        <div
          className="bg-surface-gallery-eucalypt-smoke rounded-[var(--radius-stone)] p-8 shadow-[var(--elevation-shadow-rest)] border border-outline-variant"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--sys-color-primary) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundBlendMode: 'overlay',
            backgroundPosition: '0 0',
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-wattle-gold-container to-primary-wattle-gold-container rounded-[var(--radius-pebble)] flex items-center justify-center mx-auto mb-4 shadow-[var(--elevation-shadow-rest)]">
              <span className="text-3xl">🦄</span>
            </div>
            <h1 className="text-display-large-gallery font-bloom font-black text-on-surface-parchment mb-2">
              Career<span className="text-primary-wattle-gold italic font-light ml-2">Copilot</span>
            </h1>
            <p className="text-on-surface-variant text-body-large">Sign in to your account</p>
          </div>

          {/* Error Alert */}
          {authError && (
            <div className="mb-6 p-4 rounded-[var(--radius-pebble)] bg-error-container text-on-error-container border-error/20 font-medium">
              {authError}
            </div>
          )}

          {/* Guest Access Button */}
          <div className="mb-6">
            <NorthcoteButton
              variant="secondary"
              size="lg"
              onClick={() => navigate('/dashboard?demo=true')}
              className="w-full"
            >
              🔍 Explore as Guest
            </NorthcoteButton>
            <p className="text-center text-xs text-on-surface-variant mt-2">
              No account needed • Full access to job search
            </p>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-surface-gallery-eucalypt-smoke text-on-surface-parchment-dim uppercase tracking-wider text-xs font-bold">
                Or sign in
              </span>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <div>
              <label htmlFor="email" className="block text-sm text-secondary-flannel-flower mb-2 font-medium uppercase tracking-wider">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 bg-surface-gallery-eucalypt-smoke-high border border-outline-variant text-on-surface-parchment rounded-[var(--radius-stone)] h-12 focus:outline-none focus:ring-2 focus:ring-primary-wattle-gold focus:border-primary-wattle-gold transition-colors"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email')}
              />
              {errors.email && (
                <p id="email-error" role="alert" className="text-error text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-secondary-flannel-flower mb-2 font-medium uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 bg-surface-gallery-eucalypt-smoke-high border border-outline-variant text-on-surface-parchment rounded-[var(--radius-stone)] h-12 focus:outline-none focus:ring-2 focus:ring-primary-wattle-gold focus:border-primary-wattle-gold transition-colors"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
                {...register('password')}
              />
              {errors.password && (
                <p id="password-error" role="alert" className="text-error text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <NorthcoteButton
              variant="primary"
              size="lg"
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </NorthcoteButton>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-on-surface-variant text-sm">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="text-primary-wattle-gold hover:text-primary-wattle-glow font-bold hover:underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
