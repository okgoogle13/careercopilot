import { useState } from 'react';
import JobAnalyzer from '../../components/JobAnalyzer';
import Header from '../../components/Header';

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-500 to-secondary-500">
            <div className="container mx-auto p-5">
                <Header />
                <div className="mt-6">
                    <JobAnalyzer />
                </div>
            </div>
        </div>
    );
}

export default App;
