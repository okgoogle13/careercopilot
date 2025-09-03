import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

// Component imports
import { ProtectedRoute, LoadingSpinner } from './components';
import { ErrorBoundary, SkipLink } from './components/ui';
import { AuthProvider, UserPreferencesProvider, ThemeProvider } from './contexts';
import { MainLayout } from './components/layout';

// Lazy load page components
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const AnalysisPage = lazy(() => import('./pages/AnalysisPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const OpportunitiesPage = lazy(() => import('./pages/OpportunitiesPage'));
const ApplicationsPage = lazy(() => import('./pages/ApplicationsPage'));
const KscGeneratorPage = lazy(() => import('./pages/KscGeneratorPage'));
const DocumentGenerationPage = lazy(
  () => import('./pages/DocumentGenerationPage')
);
const UITestPage = lazy(() => import('./pages/UITestPage'));

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <UserPreferencesProvider>
            {/* Accessibility skip links */}
            <SkipLink href="#main-content">Skip to main content</SkipLink>
            <SkipLink href="#navigation">Skip to navigation</SkipLink>
            
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<LoadingSpinner fullScreen />}>
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
                      path="/applications"
                      element={
                        <ErrorBoundary>
                          <ApplicationsPage />
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
                    <Route
                      path="/ui-test"
                      element={
                        <ErrorBoundary>
                          <UITestPage />
                        </ErrorBoundary>
                      }
                    />
                  </Routes>
                </Suspense>
              </MainLayout>
          </ProtectedRoute>
        </UserPreferencesProvider>
      </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
