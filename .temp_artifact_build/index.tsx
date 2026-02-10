import React from 'react';
import { createRoot } from 'react-dom/client';
import { ManifestoCard } from '../src/components/ui/ManifestoCard';
import '@/design/styles/kerala-rage.css'; // Import global styles

const App = () => (
    <div className="min-h-screen bg-charcoalBackground text-whitewash p-8 flex items-center justify-center">
        <ManifestoCard />
    </div>
);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
