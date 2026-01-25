import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/AuthContext';
import { NorthcoteButton } from '../../components/ui/NorthcoteButton';

// ... schema definition remains same ...

const registerSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export function Register() {
  const [authError, setAuthError] = useState('');
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterValues) => {
    setAuthError('');
    try {
      await registerAuth(data.email, data.password, data.displayName);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      // Supabase returns error messages, not codes
      const message = err?.message || '';
      if (message.includes('already registered') || message.includes('already been registered')) {
        setAuthError('Email is already in use.');
      } else if (message.includes('Password should be')) {
        setAuthError('Password must be at least 6 characters.');
      } else {
        setAuthError(err?.message || 'Failed to create account. Please try again.');
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
              Career <span className="text-wattle-gold italic font-light font-serif">Copilot</span>
            </h1>
            <p className="text-on-surface-variant text-body-large">Create your account</p>
          </div>

          {/* Error Alert */}
          {authError && (
            <div className="mb-6 p-4 rounded-[var(--radius-pebble)] bg-error-container text-on-error-container border-error/20 font-medium">
              {authError}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div>
              <label htmlFor="displayName" className="block text-sm text-secondary-flannel-flower mb-2 font-medium uppercase tracking-wider">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                placeholder="Your Name"
                className="w-full px-4 bg-surface-gallery-eucalypt-smoke-high border border-outline-variant text-on-surface-parchment rounded-[var(--radius-stone)] h-12 focus:outline-none focus:ring-2 focus:ring-primary-wattle-gold focus:border-primary-wattle-gold transition-colors"
                {...register('displayName')}
              />
              {errors.displayName && (
                <p className="text-error text-sm mt-1">{errors.displayName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-secondary-flannel-flower mb-2 font-medium uppercase tracking-wider">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 bg-surface-gallery-eucalypt-smoke-high border border-outline-variant text-on-surface-parchment rounded-[var(--radius-stone)] h-12 focus:outline-none focus:ring-2 focus:ring-primary-wattle-gold focus:border-primary-wattle-gold transition-colors"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-error text-sm mt-1">{errors.email.message}</p>
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
                {...register('password')}
              />
              {errors.password && (
                <p className="text-error text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-secondary-flannel-flower mb-2 font-medium uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 bg-surface-gallery-eucalypt-smoke-high border border-outline-variant text-on-surface-parchment rounded-[var(--radius-stone)] h-12 focus:outline-none focus:ring-2 focus:ring-primary-wattle-gold focus:border-primary-wattle-gold transition-colors"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-error text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <NorthcoteButton
              variant="primary"
              size="lg"
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </NorthcoteButton>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-on-surface-variant text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-wattle-gold hover:text-primary-wattle-glow font-bold hover:underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
