import { Suspense } from 'react'
import './App.css'
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { logUserAction } from '@/utils/logger';

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  const handleGetStarted = () => {
    logUserAction('clicked_get_started', { page: 'home', timestamp: new Date().toISOString() });
    // Add navigation logic here when routes are implemented
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <ErrorBoundary>
          <header className="border-b">
            <div className="container flex h-16 items-center justify-between px-4">
              <h1 className="text-xl font-bold">Career Copilot</h1>
              <ErrorBoundary>
                <ThemeToggle />
              </ErrorBoundary>
            </div>
          </header>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <main className="container py-8">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">Welcome to Career Copilot</h2>
                <p className="mt-2 text-muted-foreground">
                  Your AI-powered career assistant
                </p>
                <div className="mt-6">
                  <Button onClick={handleGetStarted}>Get Started</Button>
                </div>
              </div>
            </main>
          </Suspense>
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}
