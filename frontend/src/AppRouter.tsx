import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Box, CircularProgress } from '@mui/material';

// Lazy load page components
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const KscGeneratorPage = lazy(() =>
  import('./pages/KscGeneratorPage').then((m) => ({ default: m.KscGeneratorPage }))
);
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const ResumeAuditPage = lazy(() =>
  import('./pages/ResumeAuditPage').then((m) => ({ default: m.ResumeAuditPage }))
);

// Loading fallback
const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
);

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/ksc-generator" element={<KscGeneratorPage />} />
        <Route path="/resume-audit" element={<ResumeAuditPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
