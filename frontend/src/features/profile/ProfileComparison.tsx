/**
 * ELECTRIC ALCHEMIST: PROFILE COMPARISON FEATURE
 *
 * Side-by-side profile comparison with design system tokens.
 */

import React, { useState } from 'react';
import { ArrowLeftRight, Download, Share } from 'lucide-react';
import { Button } from '@/components';
import { Card } from '@/components';
import { Badge } from '@/components/electric';
import { Tabs } from '@/components/electric';

interface ProfileData {
  id: string;
  name: string;
  role: string;
  activeApplications: number;
  atsScore: number;
  lastUpdated: string;
  avatarColor: string;
  skills: string[];
  experience: {
    company: string;
    position: string;
    duration: string;
    highlights: string[];
  }[];
}

interface ProfileComparisonProps {
  leftProfile?: ProfileData;
  rightProfile?: ProfileData;
  onProfileSelect?: (position: 'left' | 'right') => void;
  onSwapProfiles?: () => void;
}

const sampleProfiles: ProfileData[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Software Engineer',
    activeApplications: 8,
    atsScore: 85,
    lastUpdated: '2024-01-15',
    avatarColor: 'tertiary',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'PostgreSQL'],
    experience: [
      {
        company: 'TechCorp',
        position: 'Senior Software Engineer',
        duration: '2021-2023',
        highlights: [
          'Led development of scalable web applications',
          'Improved application performance by 40%',
          'Mentored junior developers',
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'John Doe',
    role: 'Senior Software Engineer',
    activeApplications: 12,
    atsScore: 92,
    lastUpdated: '2024-01-20',
    avatarColor: 'primary',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker'],
    experience: [
      {
        company: 'TechCorp',
        position: 'Senior Software Engineer',
        duration: '2021-2023',
        highlights: [
          'Led cross-functional development of scalable web applications',
          'Improved application performance by 40% through optimization',
          'Mentored junior developers and conducted code reviews',
          'Implemented CI/CD pipeline reducing deployment time by 60%',
        ],
      },
    ],
  },
];

export function ProfileComparison({
  leftProfile = sampleProfiles[0],
  rightProfile = sampleProfiles[1],
  onProfileSelect,
  onSwapProfiles,
}: ProfileComparisonProps) {
  const [selectedSection, setSelectedSection] = useState<string>('overview');

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
  ];

  const renderSkillsComparison = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <Card className="p-4">
        <h4 className="text-hero text-base font-medium text-on-surface mb-2">
          {leftProfile.name} - Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {leftProfile.skills.map((skill, index) => (
            <Badge
              key={index}
              variant={!rightProfile.skills.includes(skill) ? 'tertiary' : 'default'}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="text-hero text-base font-medium text-on-surface mb-2">
          {rightProfile.name} - Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {rightProfile.skills.map((skill, index) => (
            <Badge
              key={index}
              variant={!leftProfile.skills.includes(skill) ? 'outline' : 'default'}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderExperienceComparison = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <Card className="p-4">
        <h4 className="text-hero text-base font-medium text-on-surface mb-2">
          {leftProfile.name} - Experience
        </h4>
        <div className="space-y-4">
          {leftProfile.experience.map((exp, index) => (
            <div key={index} className="border-l-2 border-outline-variant pl-4">
              <h5 className="text-hero text-sm font-medium text-on-surface">{exp.position}</h5>
              <p className="text-human text-xs text-on-surface-variant">
                {exp.company} • {exp.duration}
              </p>
              <ul className="mt-2 space-y-1 pl-4 list-disc">
                {exp.highlights.map((highlight, hIndex) => (
                  <li key={hIndex} className="text-human text-xs text-on-surface-variant">
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="text-hero text-base font-medium text-on-surface mb-2">
          {rightProfile.name} - Experience
        </h4>
        <div className="space-y-4">
          {rightProfile.experience.map((exp, index) => (
            <div key={index} className="border-l-2 border-primary pl-4">
              <h5 className="text-hero text-sm font-medium text-on-surface">{exp.position}</h5>
              <p className="text-human text-xs text-on-surface-variant">
                {exp.company} • {exp.duration}
              </p>
              <ul className="mt-2 space-y-1 pl-4 list-disc">
                {exp.highlights.map((highlight, hIndex) => (
                  <li key={hIndex} className="text-human text-xs text-on-surface-variant">
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderOverview = () => (
    <Card className="p-8 text-center bg-surface-container-low">
      <p className="text-hero text-base text-on-surface-variant">
        Select a section above to compare profile details
      </p>
    </Card>
  );

  const tabItems = [
    { id: 'overview', label: 'Overview', content: renderOverview() },
    { id: 'skills', label: 'Skills', content: renderSkillsComparison() },
    { id: 'experience', label: 'Experience', content: renderExperienceComparison() },
  ];

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-hero text-3xl font-bold text-on-surface mb-2">
            Profile Comparison
          </h1>
          <p className="text-human text-base text-on-surface-variant">
            Compare different versions of your profile side by side
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onSwapProfiles}>
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Swap Profiles
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Comparison
          </Button>
          <Button>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Profile Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-hero text-base font-medium text-on-surface">
              Profile Version 1
            </h3>
            <Button variant="outline" size="sm" onClick={() => onProfileSelect?.('left')}>
              Change Profile
            </Button>
          </div>
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-xl font-bold">
                {leftProfile.name[0]}
              </div>
              <div>
                <h4 className="text-hero text-lg font-semibold text-on-surface">
                  {leftProfile.name}
                </h4>
                <p className="text-human text-sm text-on-surface-variant">{leftProfile.role}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-data text-xs text-on-surface-variant">Active Applications</p>
                <p className="text-hero text-xl font-bold text-on-surface">
                  {leftProfile.activeApplications}
                </p>
              </div>
              <div className="rounded-full bg-primary text-on-primary w-8 h-8 flex items-center justify-center font-bold text-sm">{leftProfile.atsScore}</div>
            </div>
            <p className="text-human text-xs text-on-surface-variant">
              Last updated: {leftProfile.lastUpdated}
            </p>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-hero text-base font-medium text-on-surface">
              Profile Version 2
            </h3>
            <Button variant="outline" size="sm" onClick={() => onProfileSelect?.('right')}>
              Change Profile
            </Button>
          </div>
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary text-xl font-bold">
                {rightProfile.name[0]}
              </div>
              <div>
                <h4 className="text-hero text-lg font-semibold text-on-surface">
                  {rightProfile.name}
                </h4>
                <p className="text-human text-sm text-on-surface-variant">{rightProfile.role}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-data text-xs text-on-surface-variant">Active Applications</p>
                <p className="text-hero text-xl font-bold text-on-surface">
                  {rightProfile.activeApplications}
                </p>
              </div>
              <div className="rounded-full bg-primary text-on-primary w-8 h-8 flex items-center justify-center font-bold text-sm">{rightProfile.atsScore}</div>
            </div>
            <p className="text-human text-xs text-on-surface-variant">
              Last updated: {rightProfile.lastUpdated}
            </p>
          </Card>
        </div>
      </div>

      {/* Section Navigation */}
      <Tabs tabs={tabItems} defaultTab={selectedSection} onChange={setSelectedSection} />
    </div>
  );
}

export default ProfileComparison;

