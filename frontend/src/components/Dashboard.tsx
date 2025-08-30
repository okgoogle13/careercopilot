import { useState } from 'react';
import { Button } from './ui/Button';
import { ProfileCard } from './ProfileCard';
import { CreateProfileCard } from './CreateProfileCard';
import { Plus, User } from 'lucide-react';

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

interface DashboardProps {
  onCreateProfile: () => void;
  onEditProfile: (profile: Profile) => void;
}

export function Dashboard({ onCreateProfile, onEditProfile }: DashboardProps) {
  const [profiles, setProfiles] = useState(mockProfiles);

  const handleDeleteProfile = (id: string) => {
    setProfiles(profiles.filter(p => p.id !== id));
  };

  return (
    <div className="flex-1 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Your Job Seeker Profiles
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Dashboard</span>
            <span>ATS Analysis</span>
          </div>
          <Button
            onClick={onCreateProfile}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Profile
          </Button>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-black" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
}
