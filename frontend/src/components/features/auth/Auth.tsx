import {
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
} from '@mui/material';
import { Box } from '@mui/material';

import { Input } from '../../ui/input';
import { CareerCopilotLogo } from '../common/CareerCopilotLogo';

interface AuthProps {
  onLogin: () => void;
}

export function Auth({ onLogin }: AuthProps) {
  return (
    <div sx={{
      minHeight: "100vh",
      "bg-background": true,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 4
    }}>
      <div sx={{
      width: "100%",
      maxWidth: "md",
      "space-y-6": true
    }}>
        {/* Logo */}
        <div sx={{
      textAlign: "center"
    }}>
          <CareerCopilotLogo sx={{
      "mx-auto": true,
      mb: 4
    }} />
          <h1 sx={{
      typography: h4,
      fontWeight: 600
    }}>Welcome to FML Career Copilot</h1>
          <p sx={{
      "text-muted-foreground": true,
      mt: 2
    }}>Your AI-powered job application assistant</p>
        </div>

        {/* Auth Form */}
        <Card sx={{
      p: 6
    }}>
          <div sx={{
      "space-y-4": true
    }}>
            <h2 sx={{
      typography: h6,
      fontWeight: 600,
      textAlign: "center"
    }}>Sign In</h2>

            <div sx={{
      "space-y-3": true
    }}>
              <Input type="email" placeholder="you@example.com" sx={{
      width: "100%"
    }} />
              <Input type="password" placeholder="••••••••" sx={{
      width: "100%"
    }} />
            </div>

            <Button sx={{
      width: "100%",
      "bg-primary": true,
      '&:hover': { "bg-primary/90": true }
    }} onClick={onLogin}>
              Sign In
            </Button>

            <div sx={{
      display: "flex",
      alignItems: "center",
      typography: body1,
      "text-muted-foreground": true
    }}>
              <hr sx={{
      flex: 1,
      "border-border": true
    }} />
              <span sx={{
      px: 3
    }}>OR</span>
              <hr sx={{
      flex: 1,
      "border-border": true
    }} />
            </div>

            <Button
              variant="outlined"
              sx={{
      width: "100%",
      bgcolor: "common.white",
      color: "common.black",
      '&:hover': { bgcolor: "gray.50" }
    }}
              onClick={onLogin}
            >
              <span sx={{
      mr: 2,
      typography: h6
    }}>G</span>
              Continue with Google
            </Button>

            <div sx={{
      textAlign: "center",
      typography: body1,
      "text-muted-foreground": true
    }}>
              <p>
                Don't have an account?{' '}
                <button sx={{
      "text-primary": true,
      '&:hover': { textDecoration: "underline" }
    }} onClick={onLogin}>
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
