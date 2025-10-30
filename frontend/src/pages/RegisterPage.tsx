/**
 * Register Page
 * New user registration page with email, password, and display name
 */

import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.displayName || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(formData.email, formData.password, formData.displayName);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            backgroundColor: '#1A1A1A',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              mb: 1,
              fontWeight: 700,
              color: '#FFFFFF',
              textAlign: 'center',
            }}
          >
            Career Copilot
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: '#B3B3B3',
              textAlign: 'center',
            }}
          >
            Create your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              fullWidth
              label="Display Name"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={isLoading}
              autoComplete="name"
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              disabled={isLoading}
              autoComplete="email"
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              disabled={isLoading}
              autoComplete="new-password"
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="new-password"
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={isLoading}
              sx={{
                py: 1.5,
                mt: 1,
              }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>

            <Typography variant="body2" sx={{ textAlign: 'center', color: '#B3B3B3' }}>
              Already have an account?{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: '#A855F7',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
