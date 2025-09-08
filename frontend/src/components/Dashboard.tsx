import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ProfileCard } from "./ProfileCard";
import { CreateProfileCard } from "./CreateProfileCard";
import { ProfileVariationGrid } from "./library/ProfileVariationCard";
import { Plus, User, TrendingUp, Settings, FileText, Sparkles } from "lucide-react";

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
    id: "1",
    name: "Nishant Dougall",
    role: "Community Support Worker",
    activeApplications: 8,
    atsScore: 87,
    lastUpdated: "2 days ago",
    avatarColor: "#e2b8ff",
  },
  {
    id: "2",
    name: "Nishant Dougall",
    role: "Peer Worker",
    activeApplications: 5,
    atsScore: 92,
    lastUpdated: "1 week ago",
    avatarColor: "#d4fb7f",
  },
];

interface DashboardProps {
  onCreateProfile: () => void;
  onEditProfile: (profile: Profile) => void;
  onNavigateToCareerGrowth?: () => void;
  onNavigateToSettings?: () => void;
  isEmpty?: boolean;
}

export function Dashboard({ onCreateProfile, onEditProfile, onNavigateToCareerGrowth, onNavigateToSettings, isEmpty = false }: DashboardProps) {
  const [profiles, setProfiles] = useState(isEmpty ? [] : mockProfiles);

  const handleDeleteProfile = (id: string) => {
    setProfiles(profiles.filter(p => p.id !== id));
  };

  // Empty state for first-time users
  if (isEmpty || profiles.length === 0) {
    return (
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to Career Copilot</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={onNavigateToSettings}
              variant="ghost"
              size="sm"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-black" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-2xl font-semibold mb-3">Your Dashboard is Empty</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md">
            Create your first document to get started with AI-powered job applications.
          </p>
          
          <Button 
            onClick={onCreateProfile}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Document
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Your Job Seeker Profiles</h1>
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
            Create Document
          </Button>
          <Button 
            onClick={onNavigateToSettings}
            variant="ghost"
            size="sm"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-black" />
          </div>
        </div>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Your Profile Variations</h2>
        <ProfileVariationGrid 
          profiles={profileVariations}
          onProfileEdit={(id) => console.log('Edit profile:', id)}
          onProfileDuplicate={(id) => console.log('Duplicate profile:', id)}
          onProfileDelete={(id) => console.log('Delete profile:', id)}
          onProfileSetDefault={(id) => console.log('Set default profile:', id)}
          onProfileClick={(id) => console.log('View profile:', id)}
          emptyState={
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No profile variations yet</p>
              <Button onClick={onCreateProfile}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Profile
              </Button>
            </div>
          }
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
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
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20 hover:border-primary/40 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Career Growth</h3>
              </div>
              
              <p className="text-muted-foreground text-sm">
                Explore AI-powered career insights, job matching, and interview preparation tools.
              </p>
              
              <Button 
                onClick={onNavigateToCareerGrowth}
                className="w-full bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20"
                variant="outline"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Explore Career Tools
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}