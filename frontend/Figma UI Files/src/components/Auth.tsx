import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { CareerCopilotLogo } from './CareerCopilotLogo';

interface AuthProps {
  onLogin: () => void;
}

export function Auth({ onLogin }: AuthProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <CareerCopilotLogo className="mx-auto mb-4" />
          <h1 className="text-2xl font-semibold">Welcome to FML Career Copilot</h1>
          <p className="text-muted-foreground mt-2">Your AI-powered job application assistant</p>
        </div>

        {/* Auth Form */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-center">Sign In</h2>

            <div className="space-y-3">
              <Input type="email" placeholder="you@example.com" className="w-full" />
              <Input type="password" placeholder="••••••••" className="w-full" />
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90" onClick={onLogin}>
              Sign In
            </Button>

            <div className="flex items-center text-sm text-muted-foreground">
              <hr className="flex-1 border-border" />
              <span className="px-3">OR</span>
              <hr className="flex-1 border-border" />
            </div>

            <Button
              variant="outline"
              className="w-full bg-white text-black hover:bg-gray-50"
              onClick={onLogin}
            >
              <span className="mr-2 text-lg">G</span>
              Continue with Google
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Don't have an account?{' '}
                <button className="text-primary hover:underline" onClick={onLogin}>
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
