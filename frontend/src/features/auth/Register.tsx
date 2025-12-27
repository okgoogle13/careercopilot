import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/AuthContext';
import { Input } from '@careercopilot/ui';
import { Button } from '@careercopilot/ui';
import { Alert } from '@careercopilot/ui';

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
      if (err.code === 'auth/email-already-in-use') {
        setAuthError('Email is already in use.');
      } else {
        setAuthError('Failed to create account. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-8 animate-in fade-in duration-500">
      <div className="w-full max-w-md">
        {/* Card */}
        <div
          className="bg-surface-container rounded-tech p-8 shadow-elevation-1 border border-outline-variant"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--sys-color-primary) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundBlendMode: 'overlay',
            backgroundPosition: '0 0',
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-container to-secondary-container rounded-gem flex items-center justify-center mx-auto mb-4 shadow-elevation-1">
              <span className="text-3xl">🦄</span>
            </div>
            <h1 className="text-display-medium font-display font-black text-on-surface mb-2">
              Career <span className="text-primary italic font-light font-serif">Copilot</span>
            </h1>
            <p className="text-on-surface-variant text-body-large">Create your account</p>
          </div>

          {/* Error Alert */}
          {authError && (
            <Alert className="mb-6 bg-error-container text-on-error-container border-error/20 font-medium">
              {authError}
            </Alert>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div>
              <label htmlFor="displayName" className="block text-sm text-on-surface-variant mb-2 font-medium uppercase tracking-wider">
                Display Name
              </label>
              <Input
                id="displayName"
                type="text"
                placeholder="Your Name"
                className="bg-surface-container-high border-outline-variant text-on-surface rounded-tech h-12 focus:ring-primary focus:border-primary"
                {...register('displayName')}
              />
              {errors.displayName && (
                <p className="text-error text-sm mt-1">{errors.displayName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-on-surface-variant mb-2 font-medium uppercase tracking-wider">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-surface-container-high border-outline-variant text-on-surface rounded-tech h-12 focus:ring-primary focus:border-primary"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-error text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-on-surface-variant mb-2 font-medium uppercase tracking-wider">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-surface-container-high border-outline-variant text-on-surface rounded-tech h-12 focus:ring-primary focus:border-primary"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-error text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-on-surface-variant mb-2 font-medium uppercase tracking-wider">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="bg-surface-container-high border-outline-variant text-on-surface rounded-tech h-12 focus:ring-primary focus:border-primary"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-error text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-on-primary hover:bg-primary/90 rounded-pebble h-12 font-bold uppercase tracking-wide shadow-sm hover:shadow-elevation-1 transition-all ease-spring"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-on-surface-variant text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 font-bold hover:underline underline-offset-4"
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
