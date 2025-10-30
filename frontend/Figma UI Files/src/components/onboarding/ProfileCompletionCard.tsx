import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import {
  CheckCircle2,
  Circle,
  User,
  Briefcase,
  GraduationCap,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { ProfileCompletion } from '../../types/profile';

export interface ProfileCompletionCardProps {
  completion: ProfileCompletion;
  onEditProfile?: () => void;
  compact?: boolean;
}

export function ProfileCompletionCard({
  completion,
  onEditProfile,
  compact = false,
}: ProfileCompletionCardProps) {
  const items = [
    {
      id: 'personalInfo',
      label: 'Personal Information',
      icon: User,
      complete: completion.personalInfoComplete,
    },
    {
      id: 'professional',
      label: 'Professional Summary',
      icon: Briefcase,
      complete: completion.professionalSummaryComplete,
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: FileText,
      complete: completion.skillsComplete,
    },
    {
      id: 'experience',
      label: 'Experience',
      icon: Briefcase,
      complete: completion.experienceComplete,
    },
    {
      id: 'education',
      label: 'Education',
      icon: GraduationCap,
      complete: completion.educationComplete,
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      complete: completion.documentsUploaded,
    },
  ];

  const incompleteItems = items.filter((item) => !item.complete);

  if (completion.overallPercentage === 100) {
    return (
      <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-green-200 dark:border-green-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-green-900 dark:text-green-100">
              Profile Complete! 🎉
            </h3>
            <p className="text-sm text-green-800 dark:text-green-200">Your profile is 100% ready</p>
          </div>
        </div>
        <p className="text-sm text-green-700 dark:text-green-300">
          You're all set to create AI-optimized documents and start applying for jobs.
        </p>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Profile Completion</h3>
          <span className="text-sm font-medium text-primary">{completion.overallPercentage}%</span>
        </div>
        <Progress value={completion.overallPercentage} className="h-2" />
        {incompleteItems.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {incompleteItems.length} item{incompleteItems.length !== 1 ? 's' : ''} remaining
          </div>
        )}
        {onEditProfile && (
          <Button size="sm" variant="outline" onClick={onEditProfile} className="w-full">
            Complete Profile
            <ArrowRight className="w-3 h-3 ml-2" />
          </Button>
        )}
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Complete Your Profile</h3>
          <span className="text-sm font-medium text-primary">{completion.overallPercentage}%</span>
        </div>
        <Progress value={completion.overallPercentage} className="h-2" />
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-accent/50"
            >
              <div className="pt-0.5">
                {item.complete ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    item.complete ? 'text-muted-foreground line-through' : 'text-foreground'
                  }`}
                >
                  {item.label}
                </p>
              </div>
              {!item.complete && <div className="w-1 h-1 rounded-full bg-primary" />}
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      {incompleteItems.length > 0 && onEditProfile && (
        <Button onClick={onEditProfile} className="w-full">
          Complete {incompleteItems.length} Remaining Item
          {incompleteItems.length !== 1 ? 's' : ''}
        </Button>
      )}
    </Card>
  );
}
