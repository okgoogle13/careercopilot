import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import DocumentsPage from './pages/DocumentsPage';
import AnalysisPage from './pages/AnalysisPage';
import SettingsPage from './pages/SettingsPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import KscGeneratorPage from './pages/KscGeneratorPage';
import { Toaster } from 'react-hot-toast';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';

const App: React.FC = () => {
    return (
        <Router>
            <UserPreferencesProvider>
                <Toaster position="top-center" reverseOrder={false} />
                <Navbar />
                <main className="bg-gray-100 min-h-screen">
                    <div className="container mx-auto">
                        <Routes>
                            <Route path="/" element={<DashboardPage />} />
                            <Route path="/documents" element={<DocumentsPage />} />
                            <Route path="/analysis" element={<AnalysisPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/opportunities" element={<OpportunitiesPage />} />
                            <Route path="/ksc-generator" element={<KscGeneratorPage />} />
                        </Routes>
                    </div>
                </main>
            </UserPreferencesProvider>
        </Router>
    );
};

export default App;
