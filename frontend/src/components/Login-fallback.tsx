import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface LoginProps {
  onSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, loading, error, connectionStatus } = useAuth();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (isSignUp) {
        await register(email, password);
        toast.success('Registration successful!');
      } else {
        await login(email, password);
        toast.success('Login successful!');
      }
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      toast.error(errorMessage);
    }
  };

  // Demo credential helper
  const fillDemoCredentials = () => {
    setEmail('demo@careercopilot.com');
    setPassword('demo123');
    toast.info('Demo credentials filled!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
          
          {/* Connection Status Indicator */}
          <div className="mt-4 text-center">
            {connectionStatus.usingFallback && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
                <p className="text-blue-700 text-sm">
                  🔧 Development Mode - Local Authentication Active
                </p>
              </div>
            )}
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleEmailAuth}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-2">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isSignUp ? 'Sign up' : 'Sign in')}
            </button>
          </div>

          {/* Demo Credentials Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Use demo credentials
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>

        {/* Development Info */}
        {import.meta.env.DEV && (
          <div className="bg-gray-50 rounded-md p-4 mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Development Mode</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• Any email/password combination works</p>
              <p>• Password must be 6+ characters</p>
              <p>• Sessions persist in localStorage</p>
              <p>• Demo: demo@careercopilot.com / demo123</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;