import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './app/globals.css';

import { AppShell } from './components/AppShell/AppShell';
import { WelcomeBanner } from './components/dashboard/WelcomeBanner';
import { JobSearch } from './components/JobSearch/JobSearch';

const Dashboard = lazy(() =>
  import('./components/features/dashboard/Dashboard').then((module) => ({
    default: module.Dashboard,
  }))
);

// Placeholder Dashboard Page component
const DashboardPage = () => {
  return (
    <div style={{ padding: '24px' }}>
      <WelcomeBanner />
      {/* Other dashboard components will go here */}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/documents" element={<div>Documents Page</div>} />
            <Route path="/opportunities" element={<div>Opportunities Page</div>} />
            <Route path="/applications" element={<div>Applications Page</div>} />
            <Route path="/analysis" element={<div>Analysis Page</div>} />
            {/* Add other routes as needed */}
          </Routes>
        </Suspense}
      </AppShell>
    </BrowserRouter>
  );
}
