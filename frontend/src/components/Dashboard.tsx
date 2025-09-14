import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { ProfileCard } from './ProfileCard';
import { CreateProfileCard } from './CreateProfileCard';
import { ProfileVariationGrid } from './library/ProfileVariationCard';
import {
  Plus,
  User,
  TrendingUp,
  Settings,
  FileText,
  Sparkles,
  Mail,
  Briefcase,
} from 'lucide-react';
import { prepareApplicationPackage, scanInboxForOpportunities } from '../api/aiServices';

interface Profile {
  id: string;
  name: string;
  role: string;
  activeApplications: number;
  atsScore: number;
  lastUpdated: string;
  avatarColor: string;
}

const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Nishant Dougall',
    role: 'Community Support Worker',
    activeApplications: 8,
    atsScore: 87,
    lastUpdated: '2 days ago',
    avatarColor: '#e2b8ff',
  },
  {
    id: '2',
    name: 'Nishant Dougall',
    role: 'Peer Worker',
    activeApplications: 5,
    atsScore: 92,
    lastUpdated: '1 week ago',
    avatarColor: '#d4fb7f',
  },
];

// Mock data for profile variations
const profileVariations = [
  {
    id: '1',
    name: 'Software Engineer Profile',
    role: 'Software Engineer',
    lastUpdated: '3 days ago',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Data Scientist Profile',
    role: 'Data Scientist',
    lastUpdated: '1 week ago',
    isDefault: false,
  },
];

interface DashboardProps {
  onCreateProfile: () => void;
  onEditProfile: (profile: Profile) => void;
  onNavigateToCareerGrowth?: () => void;
  onNavigateToSettings?: () => void;
  isEmpty?: boolean;
}

export function Dashboard({
  onCreateProfile,
  onEditProfile,
  onNavigateToCareerGrowth,
  onNavigateToSettings,
  isEmpty = false,
}: DashboardProps) {
  const [profiles, setProfiles] = useState(isEmpty ? [] : mockProfiles);

  // State for Application Preparation
  const [jobDescription, setJobDescription] = useState('');
  const [isPreparingApplication, setIsPreparingApplication] = useState(false);
  const [applicationError, setApplicationError] = useState('');

  // State for Email Scanning
  const [isScanningEmails, setIsScanningEmails] = useState(false);
  const [emailScanError, setEmailScanError] = useState('');

  const handleDeleteProfile = (id: string) => {
    setProfiles(profiles.filter(p => p.id !== id));
  };

  // Handler for Application Package Preparation
  const handlePrepareApplication = async () => {
    if (!jobDescription.trim()) {
      setApplicationError('Please enter a job description');
      return;
    }

    setIsPreparingApplication(true);
    setApplicationError('');

    try {
      const response = await prepareApplicationPackage(jobDescription);

      if (response.success && response.data) {
        // Show success notification
        alert(`Application package prepared successfully!

Components generated: ${response.data.components_generated.join(', ')}
Job Match Score: ${response.data.job_match_score}%
Application Strength: ${response.data.application_strength}
Processing time: ${response.processing_time_seconds.toFixed(1)}s`);

        // Clear form on success
        setJobDescription('');
      } else {
        setApplicationError(response.message || 'Failed to prepare application package');
      }
    } catch (error) {
      setApplicationError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsPreparingApplication(false);
    }
  };

  // Handler for Email Scanning
  const handleScanEmails = async () => {
    setIsScanningEmails(true);
    setEmailScanError('');

    try {
      const response = await scanInboxForOpportunities();

      if (response.success && response.data) {
        // Show success notification
        alert(`Email scan completed successfully!

Opportunities found: ${response.data.total_opportunities_found}
High-scoring opportunities: ${response.data.high_scoring_opportunities}
Calendar tasks created: ${response.data.tasks_created}`);
      } else {
        setEmailScanError(response.message || 'Email scan failed');
      }
    } catch (error) {
      setEmailScanError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsScanningEmails(false);
    }
  };

  // Empty state for first-time users
  if (isEmpty || profiles.length === 0) {
    return (
      <div className='flex-1 p-8'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-2xl font-bold text-foreground mb-2'>Welcome to Career Copilot</h1>
          </div>
          <div className='flex items-center gap-4'>
            <Button onClick={onNavigateToSettings} variant='ghost' size='sm'>
              <Settings className='w-4 h-4' />
            </Button>
            <div className='w-8 h-8 bg-white rounded-full flex items-center justify-center'>
              <User className='w-4 h-4 text-black' />
            </div>
          </div>
        </div>

        <div className='flex flex-col items-center justify-center min-h-[60vh] text-center'>
          <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6'>
            <FileText className='w-8 h-8 text-primary' />
          </div>

          <h2 className='text-2xl font-semibold mb-3'>Your Dashboard is Empty</h2>
          <p className='text-muted-foreground text-lg mb-8 max-w-md'>
            Create your first document to get started with AI-powered job applications.
          </p>

          <Button
            onClick={onCreateProfile}
            className='bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg'
            size='lg'
          >
            <Plus className='w-5 h-5 mr-2' />
            Create Your First Document
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 p-8'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-foreground mb-2'>Your Job Seeker Profiles</h1>
        </div>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <span>Dashboard</span>
            <span>ATS Analysis</span>
          </div>
          <Button
            onClick={onCreateProfile}
            className='bg-primary hover:bg-primary/90 text-primary-foreground'
          >
            <Plus className='w-4 h-4 mr-2' />
            Create Document
          </Button>
          <Button onClick={onNavigateToSettings} variant='ghost' size='sm'>
            <Settings className='w-4 h-4' />
          </Button>
          <div className='w-8 h-8 bg-white rounded-full flex items-center justify-center'>
            <User className='w-4 h-4 text-black' />
          </div>
        </div>
      </div>

      {/* AI Workflow Features */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        {/* One-Click Application Prep Card */}
        <Card className='p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'>
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <Briefcase className='w-5 h-5 text-blue-600' />
              </div>
              <h3 className='font-semibold text-lg text-blue-900'>One-Click Application Prep</h3>
            </div>

            <p className='text-blue-700 text-sm'>
              Generate a complete application package including tailored resume, cover letter, and
              KSC responses.
            </p>

            <div className='space-y-3'>
              <Textarea
                placeholder='Paste the job description here...'
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                className='min-h-[100px] resize-y'
                disabled={isPreparingApplication}
              />

              {applicationError && <p className='text-red-600 text-sm'>{applicationError}</p>}

              <Button
                onClick={handlePrepareApplication}
                disabled={isPreparingApplication || !jobDescription.trim()}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white'
              >
                {isPreparingApplication ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
                    Preparing Application Package...
                  </>
                ) : (
                  <>
                    <Briefcase className='w-4 h-4 mr-2' />
                    Prepare Application Package
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Email Scanning Card */}
        <Card className='p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'>
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <Mail className='w-5 h-5 text-green-600' />
              </div>
              <h3 className='font-semibold text-lg text-green-900'>Scan Inbox for Jobs</h3>
            </div>

            <p className='text-green-700 text-sm'>
              Automatically scan your email for job opportunities and create calendar tasks for
              high-scoring matches.
            </p>

            <div className='space-y-3'>
              {emailScanError && <p className='text-red-600 text-sm'>{emailScanError}</p>}

              <Button
                onClick={handleScanEmails}
                disabled={isScanningEmails}
                className='w-full bg-green-600 hover:bg-green-700 text-white'
              >
                {isScanningEmails ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
                    Scanning Inbox...
                  </>
                ) : (
                  <>
                    <Mail className='w-4 h-4 mr-2' />
                    Scan Inbox for Opportunities
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Card className='p-6 mb-6'>
        <h2 className='text-lg font-semibold mb-4'>Your Profile Variations</h2>
        <ProfileVariationGrid
          profiles={profileVariations}
          onProfileEdit={id => console.log('Edit profile:', id)}
          onProfileDuplicate={id => console.log('Duplicate profile:', id)}
          onProfileDelete={id => console.log('Delete profile:', id)}
          onProfileSetDefault={id => console.log('Set default profile:', id)}
          onProfileClick={id => console.log('View profile:', id)}
          emptyState={
            <div className='text-center py-8'>
              <p className='text-muted-foreground mb-4'>No profile variations yet</p>
              <Button onClick={onCreateProfile}>
                <Plus className='w-4 h-4 mr-2' />
                Create Your First Profile
              </Button>
            </div>
          }
        />
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {profiles.map(profile => (
          <ProfileCard
            key={profile.id}
            name={profile.name}
            role={profile.role}
            activeApplications={profile.activeApplications}
            atsScore={profile.atsScore}
            lastUpdated={profile.lastUpdated}
            avatarColor={profile.avatarColor}
            onEdit={() => onEditProfile(profile)}
            onDelete={() => handleDeleteProfile(profile.id)}
          />
        ))}
        <CreateProfileCard onCreate={onCreateProfile} />

        {/* Career Growth Card */}
        {onNavigateToCareerGrowth && (
          <Card className='p-6 bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20 hover:border-primary/40 transition-colors'>
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-primary/10 rounded-lg'>
                  <TrendingUp className='w-5 h-5 text-primary' />
                </div>
                <h3 className='font-semibold text-lg'>Career Growth</h3>
              </div>

              <p className='text-muted-foreground text-sm'>
                Explore AI-powered career insights, job matching, and interview preparation tools.
              </p>

              <Button
                onClick={onNavigateToCareerGrowth}
                className='w-full bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20'
                variant='outline'
              >
                <Sparkles className='w-4 h-4 mr-2' />
                Explore Career Tools
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
