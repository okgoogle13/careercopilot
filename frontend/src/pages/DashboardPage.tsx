import React, { useState, useEffect, FormEvent } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    
    // State for the form, used for both create and update
    const [currentProfile, setCurrentProfile] = useState<any | null>(null);
    const [profileName, setProfileName] = useState<string>('');
    const [profileKeywords, setProfileKeywords] = useState<string>('');
    const [profileSkills, setProfileSkills] = useState<string>('');
    const [nameError, setNameError] = useState<string>('');

    const fetchProfiles = async (user: User) => {
        try {
            setLoading(true);
            const token = await user.getIdToken();
            const response = await fetch('/api/v1/profile/variations', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch profile variations');
            const data = await response.json();
            setProfiles(data);
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
                fetchProfiles(user);
            } else {
                setLoading(false);
                setError('You must be logged in to view this page.');
            }
        });
        return () => unsubscribe();
    }, []);

    const openModalForCreate = () => {
        setCurrentProfile(null);
        setProfileName('');
        setProfileKeywords('');
        setProfileSkills('');
        setNameError('');
        setIsModalOpen(true);
    };

    const openModalForEdit = (profile: any) => {
        setCurrentProfile(profile);
        setProfileName(profile.name);
        setProfileKeywords((profile.keywords || []).join(', '));
        setProfileSkills((profile.skills || []).join(', '));
        setNameError('');
        setIsModalOpen(true);
    };

    const handleDelete = async (profileId: string) => {
        if (!window.confirm('Are you sure you want to delete this profile variation?')) {
            return;
        }
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        try {
            const token = await user.getIdToken();
            await fetch(`/api/v1/profile/variations/${profileId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setProfiles(profiles.filter(p => p.id !== profileId));
            toast.success('Profile variation deleted.');
        } catch (err: any) {
            toast.error('Failed to delete profile.');
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!profileName.trim()) {
            setNameError('Profile name cannot be empty');
            return;
        }
        
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const token = await user.getIdToken();
        const keywords = profileKeywords.split(',').map(k => k.trim()).filter(k => k);
        const skills = profileSkills.split(',').map(s => s.trim()).filter(s => s);
        const body = JSON.stringify({ name: profileName, keywords, skills });

        const url = currentProfile
            ? `/api/v1/profile/variations/${currentProfile.id}`
            : '/api/v1/profile/variations';
        
        const method = currentProfile ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to save profile.');
            }

            const savedProfile = await response.json();
            if (currentProfile) {
                setProfiles(profiles.map(p => p.id === savedProfile.id ? savedProfile : p));
                toast.success('Profile updated successfully!');
            } else {
                setProfiles([...profiles, savedProfile]);
                toast.success('Profile created successfully!');
            }
            setIsModalOpen(false);
        } catch (err: any) {
            toast.error(err.message || 'Failed to save profile.');
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileName(e.target.value);
        if (e.target.value.trim()) {
            setNameError('');
        }
    }

    const renderContent = () => {
        if (loading) return <div className="p-4 text-center">Loading profiles...</div>;
        if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
        if (profiles.length === 0) {
            return (
                <div className="text-center p-10 border-2 border-dashed rounded-lg">
                    <p className="text-gray-500">You haven't created any profile variations yet. Get started by clicking the 'Create New Profile Variation' button!</p>
                </div>
            );
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profiles.map((profile) => (
                    <div key={profile.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between">
                        <h2 className="text-xl font-semibold mb-2">{profile.name}</h2>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => openModalForEdit(profile)} className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded">Edit</button>
                            <button onClick={() => handleDelete(profile.id)} className="text-sm bg-red-500 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Your Profile Variations</h1>
                <button onClick={openModalForCreate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Create New Profile Variation
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">{currentProfile ? 'Edit' : 'New'} Profile Variation</h2>
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    value={profileName} 
                                    onChange={handleNameChange} 
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${nameError ? 'border-red-500' : ''}`}
                                />
                                {nameError && <p className="text-red-500 text-xs italic mt-1">{nameError}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="keywords" className="block text-gray-700 text-sm font-bold mb-2">Keywords (comma-separated)</label>
                                <input type="text" id="keywords" value={profileKeywords} onChange={(e) => setProfileKeywords(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="skills" className="block text-gray-700 text-sm font-bold mb-2">Skills (comma-separated)</label>
                                <input type="text" id="skills" value={profileSkills} onChange={(e) => setProfileSkills(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                            </div>
                            <div className="flex items-center justify-between">
                                <button 
                                    type="submit" 
                                    disabled={!profileName.trim()}
                                    className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    {currentProfile ? 'Update' : 'Create'}
                                </button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {renderContent()}
e        </div>
    );
};

export default DashboardPage;
