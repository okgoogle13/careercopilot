import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Component imports
import { Navbar, ProtectedRoute, LoadingSpinner } from './components';
import { ErrorBoundary } from './components/ui';
import { AuthProvider, UserPreferencesProvider } from './contexts';

// Lazy load page components
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const AnalysisPage = lazy(() => import('./pages/AnalysisPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const OpportunitiesPage = lazy(() => import('./pages/OpportunitiesPage'));
const KscGeneratorPage = lazy(() => import('./pages/KscGeneratorPage'));
const DocumentGenerationPage = lazy(() => import('./pages/DocumentGenerationPage'));

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <UserPreferencesProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <ProtectedRoute>
            <Navbar />
            <main
              id="main-content"
              className="bg-gray-100 min-h-screen"
              role="main"
            >
              <div className="container mx-auto">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <ErrorBoundary>
                          <DashboardPage />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/documents"
                      element={
                        <ErrorBoundary>
                          <DocumentsPage />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/analysis"
                      element={
                        <ErrorBoundary>
                          <AnalysisPage />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ErrorBoundary>
                          <SettingsPage />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/opportunities"
                      element={
                        <ErrorBoundary>
                          <OpportunitiesPage />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/ksc-generator"
                      element={
                        <ErrorBoundary>
                          <KscGeneratorPage />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/document-generation"
                      element={
                        <ErrorBoundary>
                          <DocumentGenerationPage />
                        </ErrorBoundary>
                      }
                    />
                  </Routes>
                </Suspense>
              </div>
            </main>
          </ProtectedRoute>
        </UserPreferencesProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
