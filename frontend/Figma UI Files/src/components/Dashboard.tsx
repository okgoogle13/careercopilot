import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ProfileCard } from "./ProfileCard";
import { CreateProfileCard } from "./CreateProfileCard";
import { Plus, User, TrendingUp, Settings, FileText, Sparkles, BarChart3, Target, Brain, ChevronRight } from "lucide-react";
import { Progress } from "./ui/progress";

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
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to FML Career Copilot</h1>
            <p className="text-muted-foreground">Your AI-powered career companion</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={onNavigateToSettings}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/30 to-tertiary/30 rounded-3xl flex items-center justify-center mb-6 shadow-glow-aurora">
              <FileText className="w-12 h-12 text-brand-primary" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-aurora-full rounded-full flex items-center justify-center pulse-ai">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-4 text-gradient-aurora">Ready to Launch Your Career?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
            Create your first AI-optimized resume or cover letter to start landing more interviews. Our advanced ATS analysis ensures your documents get noticed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button 
              onClick={onCreateProfile}
              className="btn-gradient px-8 py-4 text-lg"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Document
            </Button>
            
            {onNavigateToCareerGrowth && (
              <Button 
                onClick={onNavigateToCareerGrowth}
                variant="outline"
                className="border-brand-tertiary/40 text-brand-tertiary hover:bg-tertiary/10 hover:border-tertiary/60 transition-all duration-300"
                size="lg"
              >
                <Brain className="w-5 h-5 mr-2" />
                Explore AI Tools
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-3xl">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center mx-auto shadow-glow-primary">
                <Target className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="font-semibold">ATS Optimization</h3>
              <p className="text-sm text-muted-foreground">AI-powered resume scoring and optimization</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-tertiary/15 rounded-xl flex items-center justify-center mx-auto shadow-glow-tertiary">
                <Brain className="w-6 h-6 text-brand-tertiary" />
              </div>
              <h3 className="font-semibold">Smart Insights</h3>
              <p className="text-sm text-muted-foreground">Get personalized career recommendations</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/15 to-tertiary/15 rounded-xl flex items-center justify-center mx-auto shadow-glow-aurora">
                <TrendingUp className="w-6 h-6 text-gradient-aurora" />
              </div>
              <h3 className="font-semibold">Career Growth</h3>
              <p className="text-sm text-muted-foreground">Track progress and achieve your goals</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Career Dashboard</h1>
          <p className="text-muted-foreground">Manage your job search with AI-powered insights</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={onCreateProfile}
            className="btn-gradient px-6 py-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Document
          </Button>
          <Button 
            onClick={onNavigateToSettings}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="card-aurora glass p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Applications</p>
              <p className="text-2xl font-bold text-brand-primary">{profiles.reduce((sum, p) => sum + p.activeApplications, 0)}</p>
            </div>
            <div className="p-3 bg-primary/15 rounded-lg shadow-glow-primary">
              <Target className="w-6 h-6 text-brand-primary icon-interactive" />
            </div>
          </div>
        </Card>
        
        <Card className="card-aurora glass p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average ATS Score</p>
              <p className="text-2xl font-bold text-brand-tertiary">{Math.round(profiles.reduce((sum, p) => sum + p.atsScore, 0) / profiles.length) || 0}%</p>
            </div>
            <div className="p-3 bg-tertiary/15 rounded-lg shadow-glow-tertiary">
              <BarChart3 className="w-6 h-6 text-brand-tertiary icon-interactive" />
            </div>
          </div>
        </Card>
        
        <Card className="card-aurora glass p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">AI Optimizations</p>
              <p className="text-2xl font-bold text-gradient-aurora">24</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-primary/15 to-tertiary/15 rounded-lg shadow-glow-aurora">
              <Brain className="w-6 h-6 text-gradient-aurora icon-interactive" />
            </div>
          </div>
        </Card>
      </div>

      {/* Featured Career Growth Section */}
      {onNavigateToCareerGrowth && (
        <Card className="card-aurora glass p-8 bg-gradient-to-br from-primary/15 via-tertiary/8 to-transparent">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-aurora-full/20 rounded-xl shadow-glow-aurora">
                  <Sparkles className="w-6 h-6 text-gradient-aurora" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gradient-aurora">AI Career Intelligence</h3>
                  <p className="text-muted-foreground">Get personalized insights and recommendations</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-brand-primary rounded-full pulse-ai"></div>
                  <span className="text-muted-foreground">Job market analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-brand-tertiary rounded-full pulse-tertiary"></div>
                  <span className="text-muted-foreground">Skill gap assessment</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-gradient-to-r from-primary to-tertiary rounded-full pulse-ai"></div>
                  <span className="text-muted-foreground">Interview preparation</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={onNavigateToCareerGrowth}
              className="btn-gradient px-6 py-3"
            >
              Explore Tools
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* Profile Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Your Profiles</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="px-3 py-1 bg-primary/15 text-brand-primary rounded-full shadow-glow-primary">{profiles.length} Active</span>
          </div>
        </div>
        
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
        </div>
      </div>
    </div>
  );
}