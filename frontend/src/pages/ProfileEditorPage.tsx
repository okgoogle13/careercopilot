import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import { Card, Button, Modal, LoadingSpinner } from '../components/ui';
import {
  Save,
  Plus,
  Trash2,
  Edit3,
  Award,
  Briefcase,
  GraduationCap,
  User,
  FileText,
  Target,
  ArrowLeft,
  Eye,
  EyeOff,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '../auth/enhanced-firebase';
import { doc, updateDoc, collection, addDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

interface ProfileData {
  id?: string;
  name: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
    portfolio?: string;
    summary: string;
  };
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: {
    technical: string[];
    soft: string[];
    certifications: string[];
  };
  keywords: string[];
  targetRoles: string[];
  metadata: {
    created: Date;
    updated: Date;
    version: number;
  };
}

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
  skills: string[];
}

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
  relevant_coursework?: string[];
  honors?: string[];
}

const ProfileEditorPage: React.FC = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [previewMode, setPreviewMode] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Auto-save functionality
  const autoSave = useCallback(
    async (profileData: ProfileData) => {
      if (!user?.uid || !profileData.id) return;

      try {
        const profileRef = doc(db, `users/${user.uid}/profiles`, profileData.id);
        await updateDoc(profileRef, {
          ...profileData,
          'metadata.updated': new Date(),
          'metadata.version': (profileData.metadata?.version || 0) + 1,
        });
        setUnsavedChanges(false);
        toast.success('Profile auto-saved');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    },
    [user]
  );

  useEffect(() => {
    if (!user?.uid) return;

    if (profileId === 'new') {
      // Create new profile
      const newProfile: ProfileData = {
        name: 'New Profile',
        personalInfo: {
          fullName: '',
          email: user.email || '',
          phone: '',
          location: '',
          summary: '',
        },
        experience: [],
        education: [],
        skills: {
          technical: [],
          soft: [],
          certifications: [],
        },
        keywords: [],
        targetRoles: [],
        metadata: {
          created: new Date(),
          updated: new Date(),
          version: 1,
        },
      };
      setProfile(newProfile);
      setLoading(false);
    } else if (profileId) {
      // Load existing profile
      const profileRef = doc(db, `users/${user.uid}/profiles`, profileId);
      const unsubscribe = onSnapshot(profileRef, doc => {
        if (doc.exists()) {
          setProfile({ id: doc.id, ...doc.data() } as ProfileData);
        } else {
          toast.error('Profile not found');
          navigate('/');
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [profileId, user, navigate]);

  // Auto-save on changes
  useEffect(() => {
    if (profile && !loading && unsavedChanges) {
      const saveTimeout = setTimeout(() => {
        autoSave(profile);
      }, 2000);

      return () => clearTimeout(saveTimeout);
    }
  }, [profile, unsavedChanges, loading, autoSave]);

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile(prev => (prev ? { ...prev, ...updates } : null));
    setUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!user?.uid || !profile) return;

    setSaving(true);
    try {
      if (profile.id) {
        // Update existing profile
        const profileRef = doc(db, `users/${user.uid}/profiles`, profile.id);
        await updateDoc(profileRef, {
          ...profile,
          'metadata.updated': new Date(),
          'metadata.version': (profile.metadata?.version || 0) + 1,
        });
        toast.success('Profile updated successfully!');
      } else {
        // Create new profile
        const profileRef = await addDoc(collection(db, `users/${user.uid}/profiles`), {
          ...profile,
          'metadata.created': new Date(),
          'metadata.updated': new Date(),
        });
        setProfile(prev => (prev ? { ...prev, id: profileRef.id } : null));
        navigate(`/profile/editor/${profileRef.id}`, { replace: true });
        toast.success('Profile created successfully!');
      }
      setUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.uid || !profile?.id) return;

    try {
      await deleteDoc(doc(db, `users/${user.uid}/profiles`, profile.id));
      toast.success('Profile deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error('Failed to delete profile');
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>Profile not found</h2>
          <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'summary', name: 'Professional Summary', icon: FileText },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'skills', name: 'Skills & Certifications', icon: Award },
    { id: 'targeting', name: 'Job Targeting', icon: Target },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Button
                variant='ghost'
                onClick={() => navigate('/')}
                className='flex items-center gap-2'
              >
                <ArrowLeft className='w-4 h-4' />
                Back to Dashboard
              </Button>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  {profile.name || 'New Profile'}
                </h1>
                {unsavedChanges && (
                  <span className='text-sm text-amber-600 flex items-center gap-1'>
                    <div className='w-2 h-2 bg-amber-500 rounded-full animate-pulse' />
                    Unsaved changes
                  </span>
                )}
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <Button
                variant='outline'
                onClick={() => setPreviewMode(!previewMode)}
                className='flex items-center gap-2'
              >
                {previewMode ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                {previewMode ? 'Edit Mode' : 'Preview'}
              </Button>

              {profile.id && (
                <Button
                  variant='destructive'
                  onClick={() => setShowDeleteConfirm(true)}
                  className='flex items-center gap-2'
                >
                  <Trash2 className='w-4 h-4' />
                  Delete
                </Button>
              )}

              <Button
                onClick={handleSave}
                disabled={saving || !unsavedChanges}
                className='flex items-center gap-2'
              >
                <Save className='w-4 h-4' />
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-6'>
        <div className='grid grid-cols-12 gap-6'>
          {/* Sidebar Navigation */}
          <div className='col-span-3'>
            <Card className='p-4 sticky top-24'>
              <nav className='space-y-2'>
                {sections.map(section => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className='w-4 h-4' />
                      <span className='font-medium'>{section.name}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Enhanced Profile Completion Guidance */}
              <ProfileCompletionGuide
                profile={profile}
                activeSection={activeSection}
                onNavigate={setActiveSection}
              />
            </Card>
          </div>

          {/* Main Content */}
          <div className='col-span-9'>
            {previewMode ? (
              <ProfilePreview profile={profile} />
            ) : (
              <div className='space-y-6'>
                {activeSection === 'personal' && (
                  <PersonalInfoSection profile={profile} onUpdate={updateProfile} />
                )}
                {activeSection === 'summary' && (
                  <SummarySection profile={profile} onUpdate={updateProfile} />
                )}
                {activeSection === 'experience' && (
                  <ExperienceSection profile={profile} onUpdate={updateProfile} />
                )}
                {activeSection === 'education' && (
                  <EducationSection profile={profile} onUpdate={updateProfile} />
                )}
                {activeSection === 'skills' && (
                  <SkillsSection profile={profile} onUpdate={updateProfile} />
                )}
                {activeSection === 'targeting' && (
                  <TargetingSection profile={profile} onUpdate={updateProfile} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <div className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>Delete Profile</h3>
          <p className='text-gray-600 mb-6'>
            Are you sure you want to delete this profile? This action cannot be undone.
          </p>
          <div className='flex gap-3 justify-end'>
            <Button variant='outline' onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleDelete}>
              Delete Profile
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Individual section components
const PersonalInfoSection: React.FC<{
  profile: ProfileData;
  onUpdate: (updates: Partial<ProfileData>) => void;
}> = ({ profile, onUpdate }) => {
  const updatePersonalInfo = (field: string, value: string) => {
    onUpdate({
      personalInfo: {
        ...profile.personalInfo,
        [field]: value,
      },
    });
  };

  return (
    <Card className='p-6'>
      <div className='flex items-center gap-3 mb-6'>
        <User className='w-5 h-5 text-blue-500' />
        <h2 className='text-xl font-semibold'>Personal Information</h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name *</label>
          <input
            type='text'
            value={profile.personalInfo.fullName}
            onChange={e => updatePersonalInfo('fullName', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='John Doe'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address *</label>
          <input
            type='email'
            value={profile.personalInfo.email}
            onChange={e => updatePersonalInfo('email', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='john@example.com'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Phone Number</label>
          <input
            type='tel'
            value={profile.personalInfo.phone}
            onChange={e => updatePersonalInfo('phone', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='+1 (555) 123-4567'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Location</label>
          <input
            type='text'
            value={profile.personalInfo.location}
            onChange={e => updatePersonalInfo('location', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='San Francisco, CA'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>LinkedIn URL</label>
          <input
            type='url'
            value={profile.personalInfo.linkedIn || ''}
            onChange={e => updatePersonalInfo('linkedIn', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='https://linkedin.com/in/johndoe'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Portfolio URL</label>
          <input
            type='url'
            value={profile.personalInfo.portfolio || ''}
            onChange={e => updatePersonalInfo('portfolio', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='https://johndoe.com'
          />
        </div>
      </div>
    </Card>
  );
};

const SummarySection: React.FC<{
  profile: ProfileData;
  onUpdate: (updates: Partial<ProfileData>) => void;
}> = ({ profile, onUpdate }) => {
  const updateSummary = (summary: string) => {
    onUpdate({
      personalInfo: {
        ...profile.personalInfo,
        summary,
      },
    });
  };

  return (
    <Card className='p-6'>
      <div className='flex items-center gap-3 mb-6'>
        <FileText className='w-5 h-5 text-blue-500' />
        <h2 className='text-xl font-semibold'>Professional Summary</h2>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>Professional Summary</label>
        <textarea
          value={profile.personalInfo.summary}
          onChange={e => updateSummary(e.target.value)}
          rows={6}
          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical'
          placeholder='Write a compelling professional summary that highlights your key strengths, experience, and career objectives...'
        />
        <p className='text-xs text-gray-500 mt-2'>
          💡 Tip: Keep it concise (2-3 sentences) and focus on your unique value proposition.
        </p>
      </div>
    </Card>
  );
};

// Additional section components would be implemented similarly...
// For brevity, I'll include the key sections

const ExperienceSection: React.FC<{
  profile: ProfileData;
  onUpdate: (updates: Partial<ProfileData>) => void;
}> = ({ profile, onUpdate }) => {
  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null);

  const addExperience = () => {
    const newExperience: ExperienceItem = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
      skills: [],
    };
    setEditingExperience(newExperience);
  };

  const saveExperience = (experience: ExperienceItem) => {
    const existingIndex = profile.experience.findIndex(exp => exp.id === experience.id);
    let newExperience;

    if (existingIndex >= 0) {
      newExperience = [...profile.experience];
      newExperience[existingIndex] = experience;
    } else {
      newExperience = [...profile.experience, experience];
    }

    onUpdate({ experience: newExperience });
    setEditingExperience(null);
  };

  const deleteExperience = (id: string) => {
    onUpdate({
      experience: profile.experience.filter(exp => exp.id !== id),
    });
  };

  return (
    <Card className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <Briefcase className='w-5 h-5 text-blue-500' />
          <h2 className='text-xl font-semibold'>Work Experience</h2>
        </div>
        <Button onClick={addExperience} className='flex items-center gap-2'>
          <Plus className='w-4 h-4' />
          Add Experience
        </Button>
      </div>

      <div className='space-y-4'>
        {profile.experience.map(exp => (
          <div key={exp.id} className='border border-gray-200 rounded-lg p-4'>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <h3 className='font-semibold text-gray-900'>{exp.title}</h3>
                <p className='text-blue-600 font-medium'>{exp.company}</p>
                <p className='text-sm text-gray-500'>
                  {exp.location} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
                <p className='text-gray-700 mt-2'>{exp.description}</p>
                {exp.achievements.length > 0 && (
                  <div className='mt-2'>
                    <p className='text-sm font-medium text-gray-900 mb-1'>Key Achievements:</p>
                    <ul className='text-sm text-gray-700 list-disc list-inside'>
                      {exp.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className='flex gap-2'>
                <Button size='sm' variant='outline' onClick={() => setEditingExperience(exp)}>
                  <Edit3 className='w-3 h-3' />
                </Button>
                <Button size='sm' variant='destructive' onClick={() => deleteExperience(exp.id)}>
                  <Trash2 className='w-3 h-3' />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {profile.experience.length === 0 && (
          <div className='text-center py-8 text-gray-500'>
            <Briefcase className='w-12 h-12 text-gray-300 mx-auto mb-3' />
            <p>No work experience added yet.</p>
            <Button onClick={addExperience} className='mt-3'>
              Add Your First Position
            </Button>
          </div>
        )}
      </div>

      {/* Experience Edit Modal */}
      {editingExperience && (
        <ExperienceEditModal
          experience={editingExperience}
          onSave={saveExperience}
          onCancel={() => setEditingExperience(null)}
        />
      )}
    </Card>
  );
};

// Experience Edit Modal Component
const ExperienceEditModal: React.FC<{
  experience: ExperienceItem;
  onSave: (experience: ExperienceItem) => void;
  onCancel: () => void;
}> = ({ experience, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ExperienceItem>(experience);

  const updateField = (field: keyof ExperienceItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={true} onClose={onCancel} size='lg'>
      <form onSubmit={handleSubmit} className='p-6'>
        <h3 className='text-lg font-semibold mb-6'>
          {experience.id ? 'Edit Experience' : 'Add Experience'}
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Job Title *</label>
            <input
              type='text'
              required
              value={formData.title}
              onChange={e => updateField('title', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              placeholder='Software Engineer'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Company *</label>
            <input
              type='text'
              required
              value={formData.company}
              onChange={e => updateField('company', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              placeholder='Tech Corp'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Location</label>
            <input
              type='text'
              value={formData.location}
              onChange={e => updateField('location', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              placeholder='San Francisco, CA'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Start Date *</label>
            <input
              type='month'
              required
              value={formData.startDate}
              onChange={e => updateField('startDate', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>End Date</label>
            <input
              type='month'
              value={formData.endDate}
              onChange={e => updateField('endDate', e.target.value)}
              disabled={formData.current}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50'
            />
            <label className='flex items-center mt-2'>
              <input
                type='checkbox'
                checked={formData.current}
                onChange={e => {
                  updateField('current', e.target.checked);
                  if (e.target.checked) {
                    updateField('endDate', '');
                  }
                }}
                className='mr-2'
              />
              <span className='text-sm text-gray-700'>I currently work here</span>
            </label>
          </div>
        </div>

        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Job Description</label>
          <textarea
            value={formData.description}
            onChange={e => updateField('description', e.target.value)}
            rows={4}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-vertical'
            placeholder='Describe your role and responsibilities...'
          />
        </div>

        <div className='flex justify-end gap-3'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button type='submit'>Save Experience</Button>
        </div>
      </form>
    </Modal>
  );
};

// Profile Preview Component
const ProfilePreview: React.FC<{ profile: ProfileData }> = ({ profile }) => {
  return (
    <Card className='p-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>{profile.personalInfo.fullName}</h1>
          <div className='flex flex-wrap items-center justify-center gap-4 mt-2 text-gray-600'>
            {profile.personalInfo.email && <span>{profile.personalInfo.email}</span>}
            {profile.personalInfo.phone && <span>{profile.personalInfo.phone}</span>}
            {profile.personalInfo.location && <span>{profile.personalInfo.location}</span>}
          </div>
          <div className='flex flex-wrap items-center justify-center gap-4 mt-2'>
            {profile.personalInfo.linkedIn && (
              <a href={profile.personalInfo.linkedIn} className='text-blue-600 hover:underline'>
                LinkedIn Profile
              </a>
            )}
            {profile.personalInfo.portfolio && (
              <a href={profile.personalInfo.portfolio} className='text-blue-600 hover:underline'>
                Portfolio
              </a>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        {profile.personalInfo.summary && (
          <div className='mb-8'>
            <h2 className='text-xl font-bold text-gray-900 mb-3 pb-2 border-b'>
              Professional Summary
            </h2>
            <p className='text-gray-700 leading-relaxed'>{profile.personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {profile.experience.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-xl font-bold text-gray-900 mb-4 pb-2 border-b'>Work Experience</h2>
            <div className='space-y-6'>
              {profile.experience.map(exp => (
                <div key={exp.id}>
                  <div className='flex justify-between items-start mb-2'>
                    <div>
                      <h3 className='text-lg font-semibold text-gray-900'>{exp.title}</h3>
                      <p className='text-blue-600 font-medium'>{exp.company}</p>
                    </div>
                    <p className='text-sm text-gray-500'>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                  {exp.location && <p className='text-sm text-gray-500 mb-2'>{exp.location}</p>}
                  <p className='text-gray-700 mb-3'>{exp.description}</p>
                  {exp.achievements.length > 0 && (
                    <ul className='list-disc list-inside text-gray-700 space-y-1'>
                      {exp.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {(profile.skills.technical.length > 0 ||
          profile.skills.soft.length > 0 ||
          profile.skills.certifications.length > 0) && (
          <div className='mb-8'>
            <h2 className='text-xl font-bold text-gray-900 mb-4 pb-2 border-b'>
              Skills & Qualifications
            </h2>
            <div className='grid md:grid-cols-3 gap-6'>
              {profile.skills.technical.length > 0 && (
                <div>
                  <h3 className='font-semibold text-gray-900 mb-2'>Technical Skills</h3>
                  <div className='flex flex-wrap gap-2'>
                    {profile.skills.technical.map((skill, index) => (
                      <span
                        key={index}
                        className='px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded'
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.skills.soft.length > 0 && (
                <div>
                  <h3 className='font-semibold text-gray-900 mb-2'>Soft Skills</h3>
                  <div className='flex flex-wrap gap-2'>
                    {profile.skills.soft.map((skill, index) => (
                      <span
                        key={index}
                        className='px-2 py-1 bg-green-100 text-green-800 text-sm rounded'
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.skills.certifications.length > 0 && (
                <div>
                  <h3 className='font-semibold text-gray-900 mb-2'>Certifications</h3>
                  <div className='flex flex-wrap gap-2'>
                    {profile.skills.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className='px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded'
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Education */}
        {profile.education.length > 0 && (
          <div>
            <h2 className='text-xl font-bold text-gray-900 mb-4 pb-2 border-b'>Education</h2>
            <div className='space-y-4'>
              {profile.education.map(edu => (
                <div key={edu.id} className='flex justify-between items-start'>
                  <div>
                    <h3 className='font-semibold text-gray-900'>{edu.degree}</h3>
                    <p className='text-blue-600'>{edu.institution}</p>
                    {edu.location && <p className='text-sm text-gray-500'>{edu.location}</p>}
                  </div>
                  <div className='text-right text-sm text-gray-500'>
                    <p>{edu.graduationDate}</p>
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// Additional section components for skills, education, targeting would be implemented similarly...
const SkillsSection: React.FC<{
  profile: ProfileData;
  onUpdate: (updates: Partial<ProfileData>) => void;
}> = ({ profile, onUpdate }) => {
  const [newSkill, setNewSkill] = useState('');
  const [skillType, setSkillType] = useState<'technical' | 'soft' | 'certifications'>('technical');

  const addSkill = () => {
    if (!newSkill.trim()) return;

    onUpdate({
      skills: {
        ...profile.skills,
        [skillType]: [...profile.skills[skillType], newSkill.trim()],
      },
    });
    setNewSkill('');
  };

  const removeSkill = (type: 'technical' | 'soft' | 'certifications', index: number) => {
    onUpdate({
      skills: {
        ...profile.skills,
        [type]: profile.skills[type].filter((_, i) => i !== index),
      },
    });
  };

  return (
    <Card className='p-6'>
      <div className='flex items-center gap-3 mb-6'>
        <Award className='w-5 h-5 text-blue-500' />
        <h2 className='text-xl font-semibold'>Skills & Certifications</h2>
      </div>

      {/* Add new skill */}
      <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
        <div className='flex gap-3'>
          <select
            value={skillType}
            onChange={e => setSkillType(e.target.value as any)}
            className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
          >
            <option value='technical'>Technical Skill</option>
            <option value='soft'>Soft Skill</option>
            <option value='certifications'>Certification</option>
          </select>
          <input
            type='text'
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && addSkill()}
            className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
            placeholder='Add a skill or certification...'
          />
          <Button onClick={addSkill}>Add</Button>
        </div>
      </div>

      {/* Skills display */}
      <div className='grid md:grid-cols-3 gap-6'>
        <div>
          <h3 className='font-semibold text-gray-900 mb-3'>Technical Skills</h3>
          <div className='space-y-2'>
            {profile.skills.technical.map((skill, index) => (
              <div
                key={index}
                className='flex items-center justify-between px-3 py-2 bg-blue-50 rounded-lg'
              >
                <span className='text-blue-800'>{skill}</span>
                <button
                  onClick={() => removeSkill('technical', index)}
                  className='text-red-500 hover:text-red-700'
                >
                  <Trash2 className='w-4 h-4' />
                </button>
              </div>
            ))}
            {profile.skills.technical.length === 0 && (
              <p className='text-gray-500 text-sm'>No technical skills added yet</p>
            )}
          </div>
        </div>

        <div>
          <h3 className='font-semibold text-gray-900 mb-3'>Soft Skills</h3>
          <div className='space-y-2'>
            {profile.skills.soft.map((skill, index) => (
              <div
                key={index}
                className='flex items-center justify-between px-3 py-2 bg-green-50 rounded-lg'
              >
                <span className='text-green-800'>{skill}</span>
                <button
                  onClick={() => removeSkill('soft', index)}
                  className='text-red-500 hover:text-red-700'
                >
                  <Trash2 className='w-4 h-4' />
                </button>
              </div>
            ))}
            {profile.skills.soft.length === 0 && (
              <p className='text-gray-500 text-sm'>No soft skills added yet</p>
            )}
          </div>
        </div>

        <div>
          <h3 className='font-semibold text-gray-900 mb-3'>Certifications</h3>
          <div className='space-y-2'>
            {profile.skills.certifications.map((cert, index) => (
              <div
                key={index}
                className='flex items-center justify-between px-3 py-2 bg-purple-50 rounded-lg'
              >
                <span className='text-purple-800'>{cert}</span>
                <button
                  onClick={() => removeSkill('certifications', index)}
                  className='text-red-500 hover:text-red-700'
                >
                  <Trash2 className='w-4 h-4' />
                </button>
              </div>
            ))}
            {profile.skills.certifications.length === 0 && (
              <p className='text-gray-500 text-sm'>No certifications added yet</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

const EducationSection: React.FC<{
  profile: ProfileData;
  onUpdate: (updates: Partial<ProfileData>) => void;
}> = ({ profile, onUpdate }) => {
  const [editingEducation, setEditingEducation] = useState<EducationItem | null>(null);

  const addEducation = () => {
    const newEducation: EducationItem = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      graduationDate: '',
    };
    setEditingEducation(newEducation);
  };

  const saveEducation = (education: EducationItem) => {
    const existingIndex = profile.education.findIndex(edu => edu.id === education.id);
    let newEducation;

    if (existingIndex >= 0) {
      newEducation = [...profile.education];
      newEducation[existingIndex] = education;
    } else {
      newEducation = [...profile.education, education];
    }

    onUpdate({ education: newEducation });
    setEditingEducation(null);
  };

  const deleteEducation = (id: string) => {
    onUpdate({
      education: profile.education.filter(edu => edu.id !== id),
    });
  };

  return (
    <Card className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <GraduationCap className='w-5 h-5 text-blue-500' />
          <h2 className='text-xl font-semibold'>Education</h2>
        </div>
        <Button onClick={addEducation} className='flex items-center gap-2'>
          <Plus className='w-4 h-4' />
          Add Education
        </Button>
      </div>

      <div className='space-y-4'>
        {profile.education.map(edu => (
          <div key={edu.id} className='border border-gray-200 rounded-lg p-4'>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <h3 className='font-semibold text-gray-900'>{edu.degree}</h3>
                <p className='text-blue-600 font-medium'>{edu.institution}</p>
                <p className='text-sm text-gray-500'>
                  {edu.location} • Graduated: {edu.graduationDate}
                </p>
                {edu.gpa && <p className='text-sm text-gray-600'>GPA: {edu.gpa}</p>}
              </div>
              <div className='flex gap-2'>
                <Button size='sm' variant='outline' onClick={() => setEditingEducation(edu)}>
                  <Edit3 className='w-3 h-3' />
                </Button>
                <Button size='sm' variant='destructive' onClick={() => deleteEducation(edu.id)}>
                  <Trash2 className='w-3 h-3' />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {profile.education.length === 0 && (
          <div className='text-center py-8 text-gray-500'>
            <GraduationCap className='w-12 h-12 text-gray-300 mx-auto mb-3' />
            <p>No education history added yet.</p>
            <Button onClick={addEducation} className='mt-3'>
              Add Your Education
            </Button>
          </div>
        )}
      </div>

      {/* Education Edit Modal */}
      {editingEducation && (
        <Modal isOpen={true} onClose={() => setEditingEducation(null)}>
          <div className='p-6'>
            <h3 className='text-lg font-semibold mb-6'>
              {editingEducation.degree ? 'Edit Education' : 'Add Education'}
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Degree *</label>
                <input
                  type='text'
                  required
                  value={editingEducation.degree}
                  onChange={e =>
                    setEditingEducation(prev => (prev ? { ...prev, degree: e.target.value } : null))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                  placeholder='Bachelor of Science in Computer Science'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Institution *
                </label>
                <input
                  type='text'
                  required
                  value={editingEducation.institution}
                  onChange={e =>
                    setEditingEducation(prev =>
                      prev ? { ...prev, institution: e.target.value } : null
                    )
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                  placeholder='University of California, Berkeley'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Location</label>
                <input
                  type='text'
                  value={editingEducation.location}
                  onChange={e =>
                    setEditingEducation(prev =>
                      prev ? { ...prev, location: e.target.value } : null
                    )
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                  placeholder='Berkeley, CA'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Graduation Date *
                </label>
                <input
                  type='month'
                  required
                  value={editingEducation.graduationDate}
                  onChange={e =>
                    setEditingEducation(prev =>
                      prev ? { ...prev, graduationDate: e.target.value } : null
                    )
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  GPA (Optional)
                </label>
                <input
                  type='text'
                  value={editingEducation.gpa || ''}
                  onChange={e =>
                    setEditingEducation(prev => (prev ? { ...prev, gpa: e.target.value } : null))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                  placeholder='3.8'
                />
              </div>
            </div>

            <div className='flex justify-end gap-3'>
              <Button variant='outline' onClick={() => setEditingEducation(null)}>
                Cancel
              </Button>
              <Button onClick={() => editingEducation && saveEducation(editingEducation)}>
                Save Education
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
};

const TargetingSection: React.FC<{
  profile: ProfileData;
  onUpdate: (updates: Partial<ProfileData>) => void;
}> = ({ profile, onUpdate }) => {
  const [newRole, setNewRole] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  const addRole = () => {
    if (!newRole.trim()) return;

    onUpdate({
      targetRoles: [...profile.targetRoles, newRole.trim()],
    });
    setNewRole('');
  };

  const removeRole = (index: number) => {
    onUpdate({
      targetRoles: profile.targetRoles.filter((_, i) => i !== index),
    });
  };

  const addKeyword = () => {
    if (!newKeyword.trim()) return;

    onUpdate({
      keywords: [...profile.keywords, newKeyword.trim()],
    });
    setNewKeyword('');
  };

  const removeKeyword = (index: number) => {
    onUpdate({
      keywords: profile.keywords.filter((_, i) => i !== index),
    });
  };

  return (
    <Card className='p-6'>
      <div className='flex items-center gap-3 mb-6'>
        <Target className='w-5 h-5 text-blue-500' />
        <h2 className='text-xl font-semibold'>Job Targeting</h2>
      </div>

      <div className='grid md:grid-cols-2 gap-6'>
        {/* Target Roles */}
        <div>
          <h3 className='font-semibold text-gray-900 mb-3'>Target Job Titles</h3>
          <div className='mb-3 p-3 bg-gray-50 rounded-lg'>
            <div className='flex gap-2'>
              <input
                type='text'
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addRole()}
                className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                placeholder='e.g., Software Engineer, Data Analyst...'
              />
              <Button onClick={addRole}>Add</Button>
            </div>
          </div>

          <div className='space-y-2'>
            {profile.targetRoles.map((role, index) => (
              <div
                key={index}
                className='flex items-center justify-between px-3 py-2 bg-blue-50 rounded-lg'
              >
                <span className='text-blue-800'>{role}</span>
                <button
                  onClick={() => removeRole(index)}
                  className='text-red-500 hover:text-red-700'
                >
                  <Trash2 className='w-4 h-4' />
                </button>
              </div>
            ))}
            {profile.targetRoles.length === 0 && (
              <p className='text-gray-500 text-sm'>No target roles specified</p>
            )}
          </div>
        </div>

        {/* Keywords */}
        <div>
          <h3 className='font-semibold text-gray-900 mb-3'>Target Keywords</h3>
          <div className='mb-3 p-3 bg-gray-50 rounded-lg'>
            <div className='flex gap-2'>
              <input
                type='text'
                value={newKeyword}
                onChange={e => setNewKeyword(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addKeyword()}
                className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                placeholder='e.g., React, Python, Leadership...'
              />
              <Button onClick={addKeyword}>Add</Button>
            </div>
          </div>

          <div className='space-y-2'>
            {profile.keywords.map((keyword, index) => (
              <div
                key={index}
                className='flex items-center justify-between px-3 py-2 bg-green-50 rounded-lg'
              >
                <span className='text-green-800'>{keyword}</span>
                <button
                  onClick={() => removeKeyword(index)}
                  className='text-red-500 hover:text-red-700'
                >
                  <Trash2 className='w-4 h-4' />
                </button>
              </div>
            ))}
            {profile.keywords.length === 0 && (
              <p className='text-gray-500 text-sm'>No keywords specified</p>
            )}
          </div>
        </div>
      </div>

      <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
        <h4 className='font-medium text-blue-900 mb-2'>💡 Targeting Tips</h4>
        <ul className='text-sm text-blue-800 space-y-1'>
          <li>• Add specific job titles you're interested in to customize resume generation</li>
          <li>• Include industry-specific keywords to improve ATS compatibility</li>
          <li>• Use keywords from job postings you want to apply to</li>
          <li>• This data helps optimize your documents for better matches</li>
        </ul>
      </div>
    </Card>
  );
};

// Profile Completion Guide Component
interface CompletionItem {
  id: string;
  name: string;
  completed: boolean;
  priority: 'critical' | 'important' | 'optional';
  section: string;
  description: string;
  actionText: string;
}

const ProfileCompletionGuide: React.FC<{
  profile: ProfileData;
  activeSection: string;
  onNavigate: (section: string) => void;
}> = ({ profile, activeSection, onNavigate }) => {
  // Calculate completion status for different sections
  const getCompletionItems = (): CompletionItem[] => {
    const items: CompletionItem[] = [
      // Critical items (must have)
      {
        id: 'basic-info',
        name: 'Basic Information',
        completed: Boolean(
          profile.personalInfo.fullName && profile.personalInfo.email && profile.personalInfo.phone
        ),
        priority: 'critical',
        section: 'personal',
        description: 'Name, email, and contact information',
        actionText: 'Add contact details',
      },
      {
        id: 'professional-summary',
        name: 'Professional Summary',
        completed: Boolean(
          profile.personalInfo.summary && profile.personalInfo.summary.length > 50
        ),
        priority: 'critical',
        section: 'summary',
        description: 'Compelling summary of your experience',
        actionText: 'Write summary',
      },
      {
        id: 'work-experience',
        name: 'Work Experience',
        completed: profile.experience.length > 0,
        priority: 'critical',
        section: 'experience',
        description: 'At least one work experience entry',
        actionText: 'Add experience',
      },

      // Important items (should have)
      {
        id: 'skills',
        name: 'Skills & Certifications',
        completed: profile.skills.technical.length > 2 || profile.skills.soft.length > 2,
        priority: 'important',
        section: 'skills',
        description: 'Technical and soft skills relevant to your field',
        actionText: 'Add skills',
      },
      {
        id: 'location',
        name: 'Location',
        completed: Boolean(profile.personalInfo.location),
        priority: 'important',
        section: 'personal',
        description: 'Your current location or preferred work location',
        actionText: 'Add location',
      },
      {
        id: 'education',
        name: 'Education',
        completed: profile.education.length > 0,
        priority: 'important',
        section: 'education',
        description: 'Educational background',
        actionText: 'Add education',
      },

      // Optional items (nice to have)
      {
        id: 'linkedin',
        name: 'LinkedIn Profile',
        completed: Boolean(profile.personalInfo.linkedIn),
        priority: 'optional',
        section: 'personal',
        description: 'Professional networking profile',
        actionText: 'Add LinkedIn',
      },
      {
        id: 'portfolio',
        name: 'Portfolio Website',
        completed: Boolean(profile.personalInfo.portfolio),
        priority: 'optional',
        section: 'personal',
        description: 'Showcase your work and projects',
        actionText: 'Add portfolio',
      },
      {
        id: 'target-roles',
        name: 'Target Job Roles',
        completed: profile.targetRoles.length > 0,
        priority: 'optional',
        section: 'targeting',
        description: "Specify the types of roles you're seeking",
        actionText: 'Set targets',
      },
      {
        id: 'keywords',
        name: 'Industry Keywords',
        completed: profile.keywords.length > 3,
        priority: 'optional',
        section: 'targeting',
        description: 'Keywords to optimize for ATS systems',
        actionText: 'Add keywords',
      },
      {
        id: 'detailed-experience',
        name: 'Detailed Experience',
        completed: profile.experience.some(exp => exp.achievements.length > 0),
        priority: 'important',
        section: 'experience',
        description: 'Add achievements and detailed descriptions',
        actionText: 'Enhance experience',
      },
      {
        id: 'certifications',
        name: 'Professional Certifications',
        completed: profile.skills.certifications.length > 0,
        priority: 'optional',
        section: 'skills',
        description: 'Industry certifications and credentials',
        actionText: 'Add certifications',
      },
    ];

    return items;
  };

  const completionItems = getCompletionItems();

  // Calculate overall completion percentage
  const criticalItems = completionItems.filter(item => item.priority === 'critical');
  const importantItems = completionItems.filter(item => item.priority === 'important');
  const optionalItems = completionItems.filter(item => item.priority === 'optional');

  const criticalCompleted = criticalItems.filter(item => item.completed).length;
  const importantCompleted = importantItems.filter(item => item.completed).length;
  const optionalCompleted = optionalItems.filter(item => item.completed).length;

  // Weighted completion: Critical (50%), Important (35%), Optional (15%)
  const completionPercentage = Math.round(
    (criticalCompleted / criticalItems.length) * 50 +
      (importantCompleted / importantItems.length) * 35 +
      (optionalCompleted / optionalItems.length) * 15
  );

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPriorityColor = (priority: 'critical' | 'important' | 'optional') => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'important':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'optional':
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getPriorityIcon = (priority: 'critical' | 'important' | 'optional') => {
    switch (priority) {
      case 'critical':
        return '🔴';
      case 'important':
        return '🟡';
      case 'optional':
        return '🔵';
    }
  };

  const incompleteItems = completionItems.filter(item => !item.completed);
  const nextActionItems = incompleteItems.slice(0, 3); // Show top 3 next actions

  return (
    <div className='mt-6 pt-6 border-t space-y-4'>
      {/* Overall Completion */}
      <div>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='font-medium text-gray-900'>Profile Strength</h3>
          <span
            className={`text-sm font-semibold px-2 py-1 rounded ${getCompletionColor(completionPercentage)}`}
          >
            {completionPercentage}%
          </span>
        </div>

        <div className='w-full bg-gray-200 rounded-full h-3 mb-2'>
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              completionPercentage >= 80
                ? 'bg-green-500'
                : completionPercentage >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
            }`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <p className='text-xs text-gray-500'>
          {completionPercentage >= 80
            ? '✅ Excellent! Your profile is job-ready.'
            : completionPercentage >= 60
              ? '⚠️ Good progress. A few more details will help.'
              : "🚀 Just getting started. Let's build your profile!"}
        </p>
      </div>

      {/* Completion Stats */}
      <div className='grid grid-cols-3 gap-2 text-xs'>
        <div className='text-center'>
          <div className='font-semibold text-red-600'>
            {criticalCompleted}/{criticalItems.length}
          </div>
          <div className='text-gray-500'>Critical</div>
        </div>
        <div className='text-center'>
          <div className='font-semibold text-yellow-600'>
            {importantCompleted}/{importantItems.length}
          </div>
          <div className='text-gray-500'>Important</div>
        </div>
        <div className='text-center'>
          <div className='font-semibold text-blue-600'>
            {optionalCompleted}/{optionalItems.length}
          </div>
          <div className='text-gray-500'>Optional</div>
        </div>
      </div>

      {/* Next Actions */}
      {nextActionItems.length > 0 && (
        <div>
          <h4 className='font-medium text-gray-900 mb-3 flex items-center gap-2'>
            <Target className='w-4 h-4 text-blue-500' />
            Next Steps
          </h4>
          <div className='space-y-2'>
            {nextActionItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.section)}
                className={`w-full text-left p-3 rounded-lg border transition-colors hover:bg-gray-50 ${
                  activeSection === item.section ? 'ring-2 ring-blue-500 border-blue-300' : ''
                } ${getPriorityColor(item.priority)}`}
              >
                <div className='flex items-start gap-3'>
                  <span className='text-sm'>{getPriorityIcon(item.priority)}</span>
                  <div className='flex-1 min-w-0'>
                    <div className='font-medium text-sm'>{item.name}</div>
                    <div className='text-xs opacity-75 mt-1'>{item.description}</div>
                    <div className='text-xs font-medium mt-1'>{item.actionText}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Completion Achievement */}
      {completionPercentage >= 80 && (
        <div className='p-3 bg-green-50 border border-green-200 rounded-lg'>
          <div className='flex items-center gap-2 text-green-800'>
            <div className='text-lg'>🎉</div>
            <div>
              <div className='font-medium text-sm'>Profile Complete!</div>
              <div className='text-xs'>Your profile is ready for job applications.</div>
            </div>
          </div>
        </div>
      )}

      {/* Helpful Tips */}
      <div className='p-3 bg-blue-50 border border-blue-200 rounded-lg'>
        <div className='text-blue-800'>
          <div className='font-medium text-sm mb-1'>💡 Pro Tips</div>
          <div className='text-xs space-y-1'>
            <div>• Complete critical items first for best results</div>
            <div>• Add specific achievements in experience section</div>
            <div>• Use keywords from target job descriptions</div>
            <div>• Keep information current and accurate</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='pt-3 border-t'>
        <div className='grid grid-cols-2 gap-2'>
          <Button
            size='sm'
            variant='outline'
            onClick={() => onNavigate('summary')}
            className='text-xs'
          >
            Quick Start
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={() => onNavigate('targeting')}
            className='text-xs'
          >
            Set Goals
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditorPage;
