import { Suspense, useState } from 'react'
import './App.css'
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { UploadResume } from '@/components/UploadResume';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
  const [showUpload, setShowUpload] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleGetStarted = () => {
    logUserAction('clicked_get_started', { page: 'home', timestamp: new Date().toISOString() });
    setShowUpload(true);
  };

  const handleUploadSuccess = (file: File, result: any) => {
    logUserAction('upload_success', { fileName: file.name, resultId: result.id });
    setUploadResult(result);
  };

  const handleUploadError = (error: Error) => {
    logUserAction('upload_error', { error: error.message });
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
            <main className="container py-8 max-w-4xl">
              {!showUpload ? (
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold">Welcome to Career Copilot</h2>
                  <p className="mt-2 text-muted-foreground">
                    Your AI-powered career assistant. Upload your resume to get started with personalized career insights.
                  </p>
                  <div className="mt-6">
                    <Button onClick={handleGetStarted}>Get Started</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold">Upload Your Resume</h2>
                    <p className="mt-2 text-muted-foreground">
                      Upload your resume to begin the analysis process. We'll extract key information to help improve your career prospects.
                    </p>
                  </div>

                  <ErrorBoundary>
                    <UploadResume
                      onUploadSuccess={handleUploadSuccess}
                      onUploadError={handleUploadError}
                    />
                  </ErrorBoundary>

                  {uploadResult && (
                    <Alert variant="success">
                      <AlertTitle>Upload Successful!</AlertTitle>
                      <AlertDescription>
                        <div className="mt-2 space-y-1">
                          <p><strong>File:</strong> {uploadResult.fileName}</p>
                          <p><strong>Size:</strong> {(uploadResult.fileSize / 1024).toFixed(1)} KB</p>
                          <p><strong>Uploaded:</strong> {new Date(uploadResult.uploadedAt).toLocaleString()}</p>
                          {uploadResult.skills && (
                            <p><strong>Skills Found:</strong> {uploadResult.skills.join(', ')}</p>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowUpload(false)}>
                      Back to Home
                    </Button>
                    {uploadResult && (
                      <Button onClick={() => setUploadResult(null)}>
                        Upload Another Resume
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </main>
          </Suspense>
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}
