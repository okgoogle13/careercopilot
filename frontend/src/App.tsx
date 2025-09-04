import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

// Styles
import '../src/styles/theme.css';

// Component imports
import { ProtectedRoute, LoadingSpinner } from './components';
import { ErrorBoundary, SkipLink } from './components/ui';
import { AuthProvider, UserPreferencesProvider, ThemeProvider } from './contexts';
import { ErrorProvider } from './contexts/ErrorContext';
import { MainLayout } from './components/layout';
import ErrorToastContainer from './components/ui/ErrorToastContainer';

// Add smooth scrolling for anchor links
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Lazy load page components
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const AnalysisPage = lazy(() => import('./pages/AnalysisPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const OpportunitiesPage = lazy(() => import('./pages/OpportunitiesPage'));
const ApplicationsPage = lazy(() => import('./pages/ApplicationsPage'));
const KscGeneratorPage = lazy(() => import('./pages/KscGeneratorPage'));
const DocumentGenerationPage = lazy(() => import('./pages/DocumentGenerationPage'));
const UITestPage = lazy(() => import('./pages/UITestPage'));
const AIServicesPage = lazy(() => import('./pages/AIServicesPage'));

const App: React.FC = () => {
  // Add keyboard navigation class for focus styles
  useEffect(() => {
    const handleFirstTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
      }
    };

    window.addEventListener('keydown', handleFirstTab);
    return () => window.removeEventListener('keydown', handleFirstTab);
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <ErrorProvider>
          <AuthProvider>
            <UserPreferencesProvider>
              <ScrollToTop />
              <SkipLink />
              {/* Accessibility skip links */}
              <SkipLink href='#main-content'>Skip to main content</SkipLink>
              <SkipLink href='#navigation'>Skip to navigation</SkipLink>

              <ProtectedRoute>
                <MainLayout>
                  <Suspense fallback={<LoadingSpinner fullScreen />}>
                    <Routes>
                      <Route
                        path='/'
                        element={
                          <ErrorBoundary>
                            <DashboardPage />
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path='/documents'
                        element={
                          <ErrorBoundary>
                            <DocumentsPage />
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path='/analysis'
                        element={
                          <ErrorBoundary>
                            <AnalysisPage />
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path='/settings'
                        element={
                          <ErrorBoundary>
                            <SettingsPage />
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path='/opportunities'
                        element={
                          <ErrorBoundary>
                            <OpportunitiesPage />
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path='/applications'
                        element={
                          <ErrorBoundary>
                            <ApplicationsPage />
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path='/ksc-generator'
                        element={
                          <ErrorBoundary>
                            <KscGeneratorPage />
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path='/document-generation'
                        element={
                          <ErrorBoundary>
                            <DocumentGenerationPage />
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path='/ai-services'
                        element={
                          <ErrorBoundary>
                            <AIServicesPage />
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path='/ui-test'
                        element={
                          <ErrorBoundary>
                            <UITestPage />
                          </ErrorBoundary>
                        }
                      />
                    </Routes>
                  </Suspense>
                </MainLayout>

                {/* Global error toast notifications */}
                <ErrorToastContainer position='top-right' />
              </ProtectedRoute>
            </UserPreferencesProvider>
          </AuthProvider>
        </ErrorProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
