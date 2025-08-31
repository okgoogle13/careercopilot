import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { ErrorDisplay, ProfileCardSkeleton } from '../components/ui';
import { db } from '../auth/enhanced-firebase';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

interface ProfileVariation {
  id: string;
  name: string;
  keywords?: string[];
  skills?: string[];
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ProfileVariation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // State for the form, used for both create and update
  const [currentProfile, setCurrentProfile] = useState<ProfileVariation | null>(
    null
  );
  const [profileName, setProfileName] = useState<string>('');
  const [profileKeywords, setProfileKeywords] = useState<string>('');
  const [profileSkills, setProfileSkills] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');


  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      setError('You must be logged in to view this page.');
      return;
    }

    setLoading(true);
    setError(null);

    // Set up real-time listener for profiles
    const profilesRef = collection(db, `users/${user.uid}/profiles`);
    
    const unsubscribe = onSnapshot(
      profilesRef,
      (snapshot) => {
        const profilesData: ProfileVariation[] = [];
        snapshot.forEach((doc) => {
          profilesData.push({
            id: doc.id,
            ...doc.data(),
          } as ProfileVariation);
        });
        setProfiles(profilesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching profiles:', error);
        setError('Failed to load profiles. Please try again.');
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [user]);

  const openModalForCreate = () => {
    setCurrentProfile(null);
    setProfileName('');
    setProfileKeywords('');
    setProfileSkills('');
    setNameError('');
    setIsModalOpen(true);
  };

  const openModalForEdit = (profile: ProfileVariation) => {
    setCurrentProfile(profile);
    setProfileName(profile.name);
    setProfileKeywords((profile.keywords || []).join(', '));
    setProfileSkills((profile.skills || []).join(', '));
    setNameError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (profileId: string) => {
    if (
      !window.confirm('Are you sure you want to delete this profile variation?')
    ) {
      return;
    }

    if (!user?.uid) return;

    try {
      await deleteDoc(doc(db, `users/${user.uid}/profiles`, profileId));
      toast.success('Profile variation deleted.');
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error('Failed to delete profile.');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!profileName.trim()) {
      setNameError('Profile name cannot be empty');
      return;
    }

    if (!user?.uid) return;

    const keywords = profileKeywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k);
    const skills = profileSkills
      .split(',')
      .map(s => s.trim())
      .filter(s => s);
    
    const profileData = {
      name: profileName,
      keywords,
      skills,
      updatedAt: new Date(),
    };

    try {
      if (currentProfile) {
        // Update existing profile
        await updateDoc(doc(db, `users/${user.uid}/profiles`, currentProfile.id), profileData);
        toast.success('Profile updated successfully!');
      } else {
        // Create new profile
        await addDoc(collection(db, `users/${user.uid}/profiles`), {
          ...profileData,
          createdAt: new Date(),
        });
        toast.success('Profile created successfully!');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile.');
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileName(e.target.value);
    if (e.target.value.trim()) {
      setNameError('');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <ProfileCardSkeleton key={index} />
          ))}
        </div>
      );
    }
    
    if (error)
      return (
        <ErrorDisplay
          error={error}
          variant="card"
          onDismiss={() => setError(null)}
        />
      );
      
    if (profiles.length === 0) {
      return (
        <div className="text-center p-10 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">
            You haven't created any profile variations yet. Get started by
            clicking the 'Create New Profile Variation' button!
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map(profile => (
          <div
            key={profile.id}
            className="bg-card border rounded-lg p-4 flex flex-col justify-between"
          >
            <h2 className="text-xl font-semibold mb-2 text-card-foreground">{profile.name}</h2>
            <div className="space-y-2 mb-4">
              {profile.keywords && profile.keywords.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Keywords:</p>
                  <p className="text-sm text-card-foreground">{profile.keywords.join(', ')}</p>
                </div>
              )}
              {profile.skills && profile.skills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Skills:</p>
                  <p className="text-sm text-card-foreground">{profile.skills.join(', ')}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => openModalForEdit(profile)}
                className="text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-1 px-3 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(profile.id)}
                className="text-sm bg-destructive hover:bg-destructive/80 text-destructive-foreground font-semibold py-1 px-3 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Profile Variations</h1>
        <button
          onClick={openModalForCreate}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create New Profile Variation
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {currentProfile ? 'Edit' : 'New'} Profile Variation
            </h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={profileName}
                  onChange={handleNameChange}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${nameError ? 'border-red-500' : ''}`}
                />
                {nameError && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {nameError}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="keywords"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  id="keywords"
                  value={profileKeywords}
                  onChange={e => setProfileKeywords(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="skills"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  id="skills"
                  value={profileSkills}
                  onChange={e => setProfileSkills(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={!profileName.trim()}
                  className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {currentProfile ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default DashboardPage;
