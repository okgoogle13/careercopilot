/**
 * Register Page
 * New user registration page with email, password, and display name
 * Migrated to Electric Alchemist Design System v4.2
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { ariaLabels, announceToScreenReader } from '../utils/accessibility';
import {
  Container,
  Card,
  Input,
  Button,
  Alert,
  Skeleton,
} from '../components/electric';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

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
    const errors: {
      displayName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!formData.displayName) {
      errors.displayName = 'Display name is required';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      await register(formData.email, formData.password, formData.displayName);
      announceToScreenReader('Registration successful. Redirecting to dashboard...', 'polite');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <Container size="sm">
      <div className="flex flex-col justify-center items-center min-h-screen py-8">
        <Card
          variant="default"
          className="w-full max-w-md"
          component="main"
        >
          {/* Header */}
          <h1 className="text-hero text-center mb-2">
            Career Copilot
          </h1>
          <p className="text-ai text-center mb-6 text-outline">
            Create your account
          </p>

          {/* Error Alert */}
          {error && (
            <div ref={errorRef} tabIndex={-1}>
              <Alert
                variant="error"
                className="mb-4"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </Alert>
            </div>
          )}

          {/* Registration Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
            aria-label="Registration form"
          >
            {/* Display Name Input */}
            <div>
              <label htmlFor="displayName" className="block text-ai mb-2">
                Display Name
              </label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="John Doe"
                disabled={isLoading}
                autoComplete="name"
                required
                variant={fieldErrors.displayName ? 'error' : 'default'}
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.displayName)}
                aria-describedby={fieldErrors.displayName ? 'displayName-error' : undefined}
                className="w-full"
              />
              {fieldErrors.displayName && (
                <p id="displayName-error" className="text-red-400 text-sm mt-1">
                  {fieldErrors.displayName}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-ai mb-2">
                Email
              </label>
              <Input
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
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                disabled={isLoading}
                autoComplete="new-password"
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

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-ai mb-2">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                disabled={isLoading}
                autoComplete="new-password"
                required
                variant={fieldErrors.confirmPassword ? 'error' : 'default'}
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
                aria-describedby={fieldErrors.confirmPassword ? 'confirmPassword-error' : undefined}
                className="w-full"
              />
              {fieldErrors.confirmPassword && (
                <p id="confirmPassword-error" className="text-red-400 text-sm mt-1">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              variant="default"
              size="lg"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2"
              aria-label="Create account"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Skeleton variant="circle" className="h-6 w-6" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>

            {/* Sign In Link */}
            <p className="text-ai text-center text-outline mt-2">
              Already have an account?{' '}
              <RouterLink
                to="/login"
                className="text-tertiary hover:text-primary transition-colors"
                aria-label="Navigate to sign in page"
              >
                Sign in
              </RouterLink>
            </p>
          </form>
        </Card>
      </div>
    </Container>
  );
};
