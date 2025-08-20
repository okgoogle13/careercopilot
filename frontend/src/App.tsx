import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Component imports
import { Navbar, ProtectedRoute } from './components';
import { 
  DashboardPage, 
  DocumentsPage, 
  AnalysisPage, 
  SettingsPage, 
  OpportunitiesPage, 
  KscGeneratorPage 
} from './pages';
import { AuthProvider, UserPreferencesProvider } from './contexts';

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <UserPreferencesProvider>
                    <Toaster position="top-center" reverseOrder={false} />
                    <ProtectedRoute>
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
                    </ProtectedRoute>
                </UserPreferencesProvider>
            </AuthProvider>
        </Router>
    );
};

export default App;
