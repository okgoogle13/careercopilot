/**
 * Login Page
 * User authentication page with email and password form
 * Migrated to Electric Alchemist Design System v4.2
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { ariaLabels, announceToScreenReader } from '../utils/accessibility';
import {
  ElectricContainer,
  ElectricCard,
  ElectricInput,
  ElectricButton,
  ElectricAlert,
  ElectricSkeleton,
} from '../components/electric';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // Focus on error when it appears
  useEffect(() => {
    if (error) {
      errorRef.current?.focus();
      announceToScreenReader(`Error: ${error}`, 'assertive');
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    // Clear field error
    setFieldErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      announceToScreenReader('Form validation failed. Please check your entries.', 'assertive');
      return;
    }

    try {
      await login(formData.email, formData.password);
      announceToScreenReader('Login successful. Redirecting to dashboard...', 'polite');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <ElectricContainer size="sm">
      <div className="flex flex-col justify-center items-center min-h-screen py-8">
        <ElectricCard
          variant="default"
          className="w-full max-w-md"
          component="main"
        >
          {/* Header */}
          <h1 className="text-hero text-center mb-2">
            Career Copilot
          </h1>
          <p className="text-ai text-center mb-6 text-outline">
            Sign in to your account
          </p>

          {/* Error Alert */}
          {error && (
            <div ref={errorRef} tabIndex={-1}>
              <ElectricAlert
                variant="error"
                className="mb-4"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </ElectricAlert>
            </div>
          )}

          {/* Login Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
            aria-label={ariaLabels.submit}
          >
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-ai mb-2">
                Email
              </label>
              <ElectricInput
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={isLoading}
                autoComplete="email"
                required
                variant={fieldErrors.email ? 'error' : 'default'}
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                className="w-full"
              />
              {fieldErrors.email && (
                <p id="email-error" className="text-red-400 text-sm mt-1">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-ai mb-2">
                Password
              </label>
              <ElectricInput
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete="current-password"
                required
                variant={fieldErrors.password ? 'error' : 'default'}
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                className="w-full"
              />
              {fieldErrors.password && (
                <p id="password-error" className="text-red-400 text-sm mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <ElectricButton
              variant="default"
              size="lg"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2"
              aria-label={ariaLabels.submit}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <ElectricSkeleton variant="circle" className="h-6 w-6" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </ElectricButton>

            {/* Sign Up Link */}
            <p className="text-ai text-center text-outline mt-2">
              Don't have an account?{' '}
              <RouterLink
                to="/register"
                className="text-tertiary hover:text-primary transition-colors"
                aria-label="Navigate to sign up page"
              >
                Sign up
              </RouterLink>
            </p>
          </form>
        </ElectricCard>
      </div>
    </ElectricContainer>
  );
};
