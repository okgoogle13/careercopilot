import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ProfileVariation {
    id: string;
    name: string;
}

const KscGeneratorPage: React.FC = () => {
    const [profileVariations, setProfileVariations] = useState<ProfileVariation[]>([]);
    const [selectedProfileId, setSelectedProfileId] = useState<string>('');
    const [kscStatements, setKscStatements] = useState<string[]>(['']);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();

    // Fetch profile variations on component mount
    useEffect(() => {
        const fetchProfiles = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                toast.error("You must be logged in to access this page.");
                setLoading(false);
                return;
            }

            try {
                const token = await user.getIdToken();
                const response = await fetch('/api/v1/profile/variations', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) throw new Error('Failed to fetch profile variations.');
                const data = await response.json();
                setProfileVariations(data);
                if (data.length > 0) {
                    setSelectedProfileId(data[0].id); // Default to the first profile
                }
            } catch (error: any) {
                toast.error(error.message || 'Could not load profile data.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, []);

    const handleStatementChange = (index: number, value: string) => {
        const updatedStatements = [...kscStatements];
        updatedStatements[index] = value;
        setKscStatements(updatedStatements);
    };

    const addStatement = () => {
        setKscStatements([...kscStatements, '']);
    };

    const removeStatement = (index: number) => {
        const updatedStatements = kscStatements.filter((_, i) => i !== index);
        setKscStatements(updatedStatements);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const auth = getAuth();
        const user = auth.currentUser;
        const statements = kscStatements.filter(s => s.trim() !== '');

        if (!user) {
            toast.error("Authentication error. Please log in again.");
            setSubmitting(false);
            return;
        }
        if (!selectedProfileId) {
            toast.error("Please select a profile variation.");
            setSubmitting(false);
            return;
        }
        if (statements.length === 0) {
            toast.error("Please enter at least one Key Selection Criterion.");
            setSubmitting(false);
            return;
        }

        try {
            const token = await user.getIdToken();
            const response = await fetch('/api/v1/ksc/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    profile_variation_id: selectedProfileId,
                    ksc_statements: statements,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to generate responses.');
            }

            toast.success("Success! Your KSC responses have been generated and saved to 'My Documents'.");
            navigate('/documents');

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">KSC Response Generator</h1>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded-lg p-6">
                
                <div>
                    <label htmlFor="profile-select" className="block text-lg font-medium text-gray-700 mb-2">
                        1. Select Base Profile Variation
                    </label>
                    <select
                        id="profile-select"
                        value={selectedProfileId}
                        onChange={(e) => setSelectedProfileId(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        disabled={profileVariations.length === 0}
                    >
                        {profileVariations.length > 0 ? (
                            profileVariations.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                        ) : (
                            <option>No profile variations found.</option>
                        )}
                    </select>
                </div>

                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                        2. Enter Key Selection Criteria
                    </label>
                    <div className="space-y-3">
                        {kscStatements.map((statement, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={statement}
                                    onChange={(e) => handleStatementChange(index, e.target.value)}
                                    placeholder={`Criterion ${index + 1}`}
                                    className="flex-grow block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                                {kscStatements.length > 1 && (
                                    <button type="button" onClick={() => removeStatement(index)} className="text-red-500 hover:text-red-700 font-semibold">
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addStatement} className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
                        + Add Criterion
                    </button>
                </div>

                <div className="pt-4 border-t">
                    <button
                        type="submit"
                        disabled={submitting || loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                    >
                        {submitting ? 'Generating...' : 'Generate KSC Responses'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default KscGeneratorPage;
