import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthProvider';
import toast from 'react-hot-toast';
import { ErrorDisplay, LoadingSpinner, Button } from '../components/ui';
import { db } from '../auth/enhanced-firebase';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Plus, AlertCircle } from 'lucide-react';
import { PageContainer, PageHeader } from '../components/layout';
import { z } from 'zod';

// Define validation schema
const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Name can only contain letters, numbers, spaces, and hyphens'),
  keywords: z.string().transform(val =>
    val
      .split(',')
      .map(k => k.trim())
      .filter(Boolean)
  ),
  skills: z.string().transform(val =>
    val
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  ),
});

type ProfileFormData = z.infer<typeof profileSchema>;

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
  const [currentProfile, setCurrentProfile] = useState<ProfileVariation | null>(null);
  const [profileName, setProfileName] = useState<string>('');
  const [profileKeywords, setProfileKeywords] = useState<string>('');
  const [profileSkills, setProfileSkills] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModalForCreate = useCallback(() => {
    setCurrentProfile(null);
    setProfileName('');
    setProfileKeywords('');
    setProfileSkills('');
    setFormErrors({});
    setIsModalOpen(true);
  }, []);

  const openModalForEdit = useCallback((profile: ProfileVariation) => {
    setCurrentProfile(profile);
    setProfileName(profile.name);
    setProfileKeywords(profile.keywords?.join(', ') || '');
    setProfileSkills(profile.skills?.join(', ') || '');
    setFormErrors({});
    setIsModalOpen(true);
  }, []);

  const handleInputChange = useCallback(
    (field: 'name' | 'keywords' | 'skills', value: string) => {
      if (field === 'name') setProfileName(value);
      else if (field === 'keywords') setProfileKeywords(value);
      else if (field === 'skills') setProfileSkills(value);

      // Clear error when user starts typing
      if (value.trim() && formErrors[field]) {
        setFormErrors(prev => ({
          ...prev,
          [field]: '',
        }));
      }
    },
    [formErrors]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!user?.uid || !db) return;

      if (window.confirm('Are you sure you want to delete this profile?')) {
        try {
          await deleteDoc(doc(db, `users/${user.uid}/profiles`, id));
          toast.success('Profile deleted successfully');
        } catch (error) {
          console.error('Error deleting profile:', error);
          toast.error('Failed to delete profile');
        }
      }
    },
    [user?.uid]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!user?.uid || !db) {
        toast.error('You must be logged in to save profiles');
        return;
      }

      setIsSubmitting(true);

      try {
        // Validate form data
        const result = profileSchema.safeParse({
          name: profileName.trim(),
          keywords: profileKeywords,
          skills: profileSkills,
        });

        if (!result.success) {
          // Convert Zod errors to form errors
          const errors: Record<string, string> = {};
          result.error.issues.forEach(issue => {
            const path = issue.path[0] as string;
            errors[path] = issue.message;
          });
          setFormErrors(errors);
          return;
        }

        const { name, keywords, skills } = result.data;

        const profileData = {
          name,
          keywords: keywords || [],
          skills: skills || [],
          updatedAt: new Date(),
        };

        if (currentProfile) {
          // Update existing profile
          await updateDoc(doc(db, `users/${user.uid}/profiles`, currentProfile.id), profileData);
          toast.success('Profile updated successfully');
        } else {
          // Create new profile
          await addDoc(collection(db, `users/${user.uid}/profiles`), {
            ...profileData,
            createdAt: new Date(),
          });
          toast.success('Profile created successfully');
        }

        // Reset form
        setFormErrors({});
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error saving profile:', error);
        toast.error('Failed to save profile');
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentProfile, profileName, profileKeywords, profileSkills, user?.uid]
  );

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      setError('You must be logged in to view this page.');
      return;
    }

    if (!db) {
      setError('Database not initialized');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Set up real-time listener for profiles
      const profilesRef = collection(db, `users/${user.uid}/profiles`);

      const unsubscribe = onSnapshot(
        profilesRef,
        snapshot => {
          const profilesData: ProfileVariation[] = [];
          snapshot.forEach(doc => {
            profilesData.push({
              id: doc.id,
              ...doc.data(),
            } as ProfileVariation);
          });
          setProfiles(profilesData);
          setLoading(false);
        },
        error => {
          console.error('Error fetching profiles:', error);
          setError('Failed to load profiles. Please try again.');
          setLoading(false);
        }
      );

      // Cleanup listener on unmount
      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up profiles listener:', err);
      setError('Failed to load profiles. Please try again.');
      setLoading(false);
    }
  }, [user?.uid]);

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner fullScreen />;
    }

    if (error) {
      return <ErrorDisplay error={error} className='my-8' />;
    }

    if (profiles.length === 0) {
      return (
        <div className='flex flex-col items-center justify-center py-12 px-4 text-center'>
          <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='text-muted-foreground'
            >
              <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
              <circle cx='12' cy='7' r='4' />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-foreground mb-2'>No profiles yet</h3>
          <p className='text-muted-foreground max-w-md mb-6'>
            You haven't created any profile variations yet. Get started by creating your first
            profile!
          </p>
          <Button onClick={openModalForCreate}>
            <Plus className='mr-2 h-4 w-4' />
            Create Profile
          </Button>
        </div>
      );
    }

    return (
      <PageContainer>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {profiles.map(profile => (
            <div
              key={profile.id}
              className='bg-card border rounded-lg p-6 flex flex-col justify-between hover:shadow-md transition-shadow'
            >
              <div>
                <div className='flex justify-between items-start mb-4'>
                  <h3 className='text-lg font-semibold text-foreground'>{profile.name}</h3>
                </div>

                <div className='space-y-3'>
                  {profile.keywords && profile.keywords.length > 0 && (
                    <div>
                      <p className='text-sm font-medium text-muted-foreground mb-1'>Keywords</p>
                      <div className='flex flex-wrap gap-2'>
                        {profile.keywords.slice(0, 3).map((keyword, i) => (
                          <span
                            key={i}
                            className='text-xs bg-muted text-foreground px-2 py-1 rounded'
                          >
                            {keyword}
                          </span>
                        ))}
                        {profile.keywords.length > 3 && (
                          <span className='text-xs text-muted-foreground'>
                            +{profile.keywords.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {profile.skills && profile.skills.length > 0 && (
                    <div>
                      <p className='text-sm font-medium text-muted-foreground mb-1'>Skills</p>
                      <div className='flex flex-wrap gap-2'>
                        {profile.skills.slice(0, 3).map((skill, i) => (
                          <span
                            key={i}
                            className='text-xs bg-muted text-foreground px-2 py-1 rounded'
                          >
                            {skill}
                          </span>
                        ))}
                        {profile.skills.length > 3 && (
                          <span className='text-xs text-muted-foreground'>
                            +{profile.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className='mt-6 flex justify-end gap-2'>
                <Button variant='outline' size='sm' onClick={() => openModalForEdit(profile)}>
                  Edit
                </Button>
                <Button variant='destructive' size='sm' onClick={() => handleDelete(profile.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    );
  };

  const headerActions = [
    {
      label: 'Create New Profile',
      onClick: openModalForCreate,
      variant: 'default' as const,
    },
  ];

  return (
    <div className='min-h-screen bg-background'>
      <PageHeader
        title='Dashboard'
        description='Manage your profile variations'
        actions={headerActions}
      />
      <PageContainer>{renderContent()}</PageContainer>

      {isModalOpen && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
          <div className='bg-background rounded-lg shadow-xl w-full max-w-md'>
            <div className='p-6'>
              <h2 className='text-2xl font-semibold mb-4 text-foreground'>
                {currentProfile ? 'Edit' : 'New'} Profile Variation
              </h2>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label htmlFor='name' className='block text-sm font-medium text-foreground mb-1'>
                    Name <span className='text-destructive'>*</span>
                  </label>
                  <div className='relative'>
                    <input
                      type='text'
                      id='name'
                      value={profileName}
                      onChange={e => handleInputChange('name', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border ${
                        formErrors.name ? 'border-destructive' : 'border-input'
                      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                      placeholder='Enter profile name'
                      aria-invalid={!!formErrors.name}
                      aria-describedby={formErrors.name ? 'name-error' : undefined}
                    />
                    {formErrors.name && (
                      <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                        <AlertCircle className='h-5 w-5 text-destructive' aria-hidden='true' />
                      </div>
                    )}
                  </div>
                  {formErrors.name && (
                    <p id='name-error' className='mt-1 text-sm text-destructive flex items-start'>
                      <AlertCircle className='h-4 w-4 mr-1 mt-0.5 flex-shrink-0' />
                      <span>{formErrors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor='keywords'
                    className='block text-sm font-medium text-foreground mb-1'
                  >
                    Keywords
                  </label>
                  <div className='relative'>
                    <input
                      type='text'
                      id='keywords'
                      value={profileKeywords}
                      onChange={e => handleInputChange('keywords', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border ${
                        formErrors.keywords ? 'border-destructive' : 'border-input'
                      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                      placeholder='e.g., React, TypeScript, UI/UX'
                      aria-invalid={!!formErrors.keywords}
                      aria-describedby={formErrors.keywords ? 'keywords-error' : 'keywords-help'}
                    />
                    {formErrors.keywords && (
                      <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                        <AlertCircle className='h-5 w-5 text-destructive' aria-hidden='true' />
                      </div>
                    )}
                  </div>
                  {formErrors.keywords ? (
                    <p
                      id='keywords-error'
                      className='mt-1 text-sm text-destructive flex items-start'
                    >
                      <AlertCircle className='h-4 w-4 mr-1 mt-0.5 flex-shrink-0' />
                      <span>{formErrors.keywords}</span>
                    </p>
                  ) : (
                    <p id='keywords-help' className='mt-1 text-xs text-muted-foreground'>
                      Separate keywords with commas
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor='skills'
                    className='block text-sm font-medium text-foreground mb-1'
                  >
                    Skills
                  </label>
                  <div className='relative'>
                    <input
                      type='text'
                      id='skills'
                      value={profileSkills}
                      onChange={e => handleInputChange('skills', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border ${
                        formErrors.skills ? 'border-destructive' : 'border-input'
                      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                      placeholder='e.g., JavaScript, CSS, Project Management'
                      aria-invalid={!!formErrors.skills}
                      aria-describedby={formErrors.skills ? 'skills-error' : 'skills-help'}
                    />
                    {formErrors.skills && (
                      <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                        <AlertCircle className='h-5 w-5 text-destructive' aria-hidden='true' />
                      </div>
                    )}
                  </div>
                  {formErrors.skills ? (
                    <p id='skills-error' className='mt-1 text-sm text-destructive flex items-start'>
                      <AlertCircle className='h-4 w-4 mr-1 mt-0.5 flex-shrink-0' />
                      <span>{formErrors.skills}</span>
                    </p>
                  ) : (
                    <p id='skills-help' className='mt-1 text-xs text-muted-foreground'>
                      Separate skills with commas
                    </p>
                  )}
                </div>

                <div className='flex justify-end space-x-3 pt-4'>
                  <Button type='button' variant='outline' onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type='submit' disabled={isSubmitting || !profileName.trim()}>
                    {isSubmitting ? (
                      <>
                        <svg
                          className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        {currentProfile ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>{currentProfile ? 'Update Profile' : 'Create Profile'}</>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
