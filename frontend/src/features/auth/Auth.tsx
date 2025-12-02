/**
 * ELECTRIC ALCHEMIST: AUTH FEATURE
 *
 * Authentication form with sign in and Google OAuth.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/electric/button';
import { Input } from '@/components/electric/input';
import { Card } from '@/components';
import { Separator } from '@/components/electric';

interface AuthProps {
  onLogin: () => void;
}

export function Auth({ onLogin }: AuthProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-hero text-3xl font-semibold text-on-surface mb-2">
            Welcome to Career Copilot
          </h1>
          <p className="text-human text-base text-on-surface-variant">
            Your AI-powered job application assistant
          </p>
        </div>

        {/* Auth Form */}
        <Card className="p-8">
          <h2 className="text-hero text-xl font-semibold text-center mb-6 text-on-surface">
            Sign In
          </h2>

          <div className="space-y-4">
            <Input type="email" placeholder="you@example.com" label="Email" />
            <Input type="password" placeholder="••••••••" label="Password" />

            <Button onClick={onLogin} className="w-full" size="lg">
              Sign In
            </Button>

            <div className="flex items-center gap-3 my-6">
              <Separator className="flex-1" />
              <span className="text-human text-sm text-on-surface-variant">OR</span>
              <Separator className="flex-1" />
            </div>

            <Button variant="outline" onClick={onLogin} className="w-full">
              <span className="text-hero text-xl mr-2">G</span>
              Continue with Google
            </Button>

            <div className="text-center text-human text-sm text-on-surface-variant mt-6">
              <p>
                Don't have an account?{' '}
                <button
                  onClick={onLogin}
                  className="text-primary hover:text-primary-container transition-colors"
                >
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

export default Auth;

