import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Divider,
  alpha,
} from '@mui/material';

export interface AuthProps {
  onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        {/* Logo & Title */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          {/* Logo placeholder - you can import CareerCopilotLogo if needed */}
          <Box
            sx={{
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 3,
              borderRadius: 4,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.tertiary.main})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: (theme) => theme.customShadows.glowAurora,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: 'white',
              }}
            >
              F
            </Typography>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Welcome to FML Career Copilot
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your AI-powered job application assistant
          </Typography>
        </Box>

        {/* Auth Form */}
        <Card variant="glass">
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center', mb: 4 }}>
              Sign In
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>
              <TextField
                fullWidth
                type="email"
                placeholder="you@example.com"
                label="Email"
              />
              <TextField
                fullWidth
                type="password"
                placeholder="••••••••"
                label="Password"
              />
            </Box>

            <Button variant="aurora" fullWidth size="large" onClick={onLogin} sx={{ mb: 3 }}>
              Sign In
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                OR
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={onLogin}
              sx={{
                bgcolor: 'white',
                color: 'black',
                borderColor: (theme) => alpha('#000', 0.2),
                '&:hover': {
                  bgcolor: (theme) => alpha('#fff', 0.95),
                  borderColor: (theme) => alpha('#000', 0.3),
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mr: 1,
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  background: 'linear-gradient(90deg, #4285F4, #34A853, #FBBC05, #EA4335)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                G
              </Typography>
              Continue with Google
            </Button>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Button
                  variant="text"
                  onClick={onLogin}
                  sx={{
                    color: 'primary.main',
                    textTransform: 'none',
                    fontWeight: 600,
                    p: 0,
                    minWidth: 'auto',
                    '&:hover': {
                      bgcolor: 'transparent',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="caption" color="text.secondary">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Auth;
