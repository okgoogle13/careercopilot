import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import toast from 'react-hot-toast';

// Simple Calendar Icon SVG
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const OpportunitiesPage: React.FC = () => {
    const [opportunities, setOpportunities] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOpportunities = async (user: User) => {
        try {
            setLoading(true);
            const token = await user.getIdToken();
            const response = await fetch('/api/v1/opportunities', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch opportunities');
            const data = await response.json();
            setOpportunities(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchOpportunities(user);
            } else {
                setLoading(false);
                setError('You must be logged in to view this page.');
            }
        });
        return () => unsubscribe();
    }, []);

    const renderContent = () => {
        if (loading) return <div className="p-4 text-center">Loading opportunities...</div>;
        if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
        if (opportunities.length === 0) {
            return (
                <div className="text-center p-10 border-2 border-dashed rounded-lg">
                    <p className="text-gray-500">No job opportunities found. Connect your Google account and scan your emails to get started.</p>
                </div>
            );
        }
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {opportunities.map((opp) => (
                    <div key={opp.id} className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-lg mb-2">{opp.title}</h3>
                            <p className="text-md text-gray-700 mb-1">{opp.company}</p>
                            <p className="text-sm text-gray-500 mb-4">Deadline: {opp.deadline || 'Not specified'}</p>
                        </div>
                        <div className="flex items-center justify-between">
                             <a href={opp.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 font-semibold">
                                View Application
                            </a>
                            {opp.calendarEventId && (
                                <div className="relative group flex items-center">
                                    <CalendarIcon />
                                    <span className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        Application reminder created in your Google Calendar.
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Job Opportunities</h1>
            {renderContent()}
        </div>
    );
};

export default OpportunitiesPage;
