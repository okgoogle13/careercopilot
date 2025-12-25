import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Alert } from '../../components/ui/alert';

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
            <p className="text-on-surface-variant text-body-large">Sign in to your account</p>
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-on-primary hover:bg-primary/90 rounded-pebble h-12 font-bold uppercase tracking-wide shadow-sm hover:shadow-elevation-1 transition-all ease-spring"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-on-surface-variant text-sm">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="text-primary hover:text-primary/80 font-bold hover:underline underline-offset-4"
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
