import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Alert } from './ui/alert';

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
      console.error(err);
      setAuthError(err.message || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-screen bg-[#141218] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div
          className="bg-[#25232A] rounded-[28px] p-8"
          style={{
            backgroundImage: 'radial-gradient(circle, #E6DEFF 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundBlendMode: 'overlay',
            backgroundPosition: '0 0'
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D0BCFF] to-[#A8C5A3] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🦄</span>
            </div>
            <h1 style={{ fontSize: '3rem', lineHeight: '1.1', fontFamily: 'Roboto Flex, sans-serif', fontWeight: '800', fontStretch: '150%', color: '#E6E1E5' }}>
              Career <span style={{ fontFamily: 'Roboto Serif, serif', fontStyle: 'italic', fontWeight: '300', color: '#D0BCFF' }}>Copilot</span>
            </h1>
            <p className="text-[#CAC4D0] mt-2">Create your account</p>
          </div>

          {/* Error Alert */}
          {authError && (
            <Alert className="mb-6 bg-[#E07A5F]/20 border-[#E07A5F] text-[#E07A5F]">
              {authError}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm text-[#CAC4D0] mb-2" style={{ fontFamily: 'Roboto Flex, sans-serif', fontStretch: '50%', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Display Name
              </label>
              <Input
                type="text"
                placeholder="Your Name"
                className="bg-[#2B2930] border-[#49454F] text-[#E6E1E5] rounded-full h-12"
                {...register('displayName')}
              />
              {errors.displayName && (
                <p className="text-[#E07A5F] text-sm mt-1">{errors.displayName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#CAC4D0] mb-2" style={{ fontFamily: 'Roboto Flex, sans-serif', fontStretch: '50%', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Email
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                className="bg-[#2B2930] border-[#49454F] text-[#E6E1E5] rounded-full h-12"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-[#E07A5F] text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#CAC4D0] mb-2" style={{ fontFamily: 'Roboto Flex, sans-serif', fontStretch: '50%', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-[#2B2930] border-[#49454F] text-[#E6E1E5] rounded-full h-12"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-[#E07A5F] text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#CAC4D0] mb-2" style={{ fontFamily: 'Roboto Flex, sans-serif', fontStretch: '50%', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-[#2B2930] border-[#49454F] text-[#E6E1E5] rounded-full h-12"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-[#E07A5F] text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#D0BCFF] text-[#381E72] hover:bg-[#E6DDFF] rounded-full h-12"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-[#CAC4D0] text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-[#D0BCFF] hover:text-[#E6DDFF]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}