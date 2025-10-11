import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Divider, Chip } from '@mui/material';
import { ProfileCard } from '../features/profile/ProfileCard';
import { SwapHoriz, Download, Share } from '@mui/icons-material';

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
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  certifications: string[];
}

interface ProfileComparisonProps {
  leftProfile?: ProfileData;
  rightProfile?: ProfileData;
  onProfileSelect?: (po_ition: 'left' | 'right') => void;
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
    avatarColor: '#3B82F6',
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
      {
        company: 'StartupInc',
        position: 'Full Stack Developer',
        duration: '2019-2021',
        highlights: ['Built MVP from scratch', 'Implemented CI/CD pipeline'],
      },
    ],
    education: [
      {
        degree: 'B.S. Computer Science',
        institution: 'University of Technology',
        year: '2019',
      },
    ],
    certifications: ['AWS Certified Developer', 'React Professional'],
  },
  {
    id: '2',
    name: 'John Doe',
    role: 'Senior Software Engineer',
    activeApplications: 12,
    atsScore: 92,
    lastUpdated: '2024-01-20',
    avatarColor: '#3B82F6',
    skills: [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Python',
      'PostgreSQL',
      'AWS',
      'Docker',
    ],
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
      {
        company: 'StartupInc',
        position: 'Full Stack Developer',
        duration: '2019-2021',
        highlights: [
          'Built MVP from scratch using modern tech stack',
          'Implemented comprehensive CI/CD pipeline',
          'Designed and developed RESTful APIs',
        ],
      },
    ],
    education: [
      {
        degree: 'B.S. Computer Science',
        institution: 'University of Technology',
        year: '2019',
      },
    ],
    certifications: ['AWS Certified Developer', 'React Professional', 'Docker Certified Associate'],
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
    { id: 'education', label: 'Education' },
    { id: 'certifications', label: 'Certifications' },
  ];

  const renderSkillsComparison = () => (
    <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-4">
          <Typography variant="h6" className="font-semibold mb-3">
            {leftProfile.name} - Skills
          </Typography>
          <Box className="flex flex-wrap gap-2">
            {leftProfile.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                size="small"
                className={
                  !rightProfile.skills.includes(skill)
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Typography variant="h6" className="font-semibold mb-3">
            {rightProfile.name} - Skills
          </Typography>
          <Box className="flex flex-wrap gap-2">
            {rightProfile.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                size="small"
                className={
                  !leftProfile.skills.includes(skill)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  const renderExperienceComparison = () => (
    <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-4">
          <Typography variant="h6" className="font-semibold mb-3">
            {leftProfile.name} - Experience
          </Typography>
          <Box className="space-y-4">
            {leftProfile.experience.map((exp, index) => (
              <Box key={index} className="border-l-2 border-gray-200 pl-4">
                <Typography variant="subtitle1" className="font-semibold">
                  {exp.position}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {exp.company} • {exp.duration}
                </Typography>
                <ul className="mt-2 text-sm space-y-1">
                  {exp.highlights.map((highlight, hIndex) => (
                    <li key={hIndex} className="text-gray-600">
                      • {highlight}
                    </li>
                  ))}
                </ul>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Typography variant="h6" className="font-semibold mb-3">
            {rightProfile.name} - Experience
          </Typography>
          <Box className="space-y-4">
            {rightProfile.experience.map((exp, index) => (
              <Box key={index} className="border-l-2 border-blue-200 pl-4">
                <Typography variant="subtitle1" className="font-semibold">
                  {exp.position}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {exp.company} • {exp.duration}
                </Typography>
                <ul className="mt-2 text-sm space-y-1">
                  {exp.highlights.map((highlight, hIndex) => (
                    <li key={hIndex} className="text-gray-600">
                      • {highlight}
                    </li>
                  ))}
                </ul>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box className="w-full">
      {/* Header */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <Typography variant="h4" className="text-2xl font-bold mb-2">
            Profile Comparison
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Compare different versions of your profile side by side
          </Typography>
        </Box>

        <Box className="flex gap-2">
          <Button
            variant="outline"
            onClick={onSwapProfiles}
            startIcon={<SwapHoriz sx={{ fontSize: 16 }} />}
          >
            Swap Profiles
          </Button>
          <Button variant="outline" startIcon={<Download sx={{ fontSize: 16 }} />}>
            Export Comparison
          </Button>
          <Button
            variant="contained"
            className="bg-primary hover:bg-primary/90"
            startIcon={<Share sx={{ fontSize: 16 }} />}
          >
            Share
          </Button>
        </Box>
      </Box>

      {/* Profile Cards Overview */}
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Box>
          <Box className="flex items-center justify-between mb-4">
            <Typography variant="h6" className="font-semibold">
              Profile Version 1
            </Typography>
            <Button size="small" variant="outline" onClick={() => onProfileSelect?.('left')}>
              Change Profile
            </Button>
          </Box>
          <ProfileCard
            name={leftProfile.name}
            role={leftProfile.role}
            activeApplications={leftProfile.activeApplications}
            atsScore={leftProfile.atsScore}
            lastUpdated={leftProfile.lastUpdated}
            avatarColor={leftProfile.avatarColor}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </Box>

        <Box>
          <Box className="flex items-center justify-between mb-4">
            <Typography variant="h6" className="font-semibold">
              Profile Version 2
            </Typography>
            <Button size="small" variant="outline" onClick={() => onProfileSelect?.('right')}>
              Change Profile
            </Button>
          </Box>
          <ProfileCard
            name={rightProfile.name}
            role={rightProfile.role}
            activeApplications={rightProfile.activeApplications}
            atsScore={rightProfile.atsScore}
            lastUpdated={rightProfile.lastUpdated}
            avatarColor={rightProfile.avatarColor}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </Box>
      </Box>

      {/* Section Navigation */}
      <Box className="flex gap-2 mb-6 overflow-x-auto">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={selectedSection === section.id ? 'contained' : 'outlined'}
            onClick={() => setSelectedSection(section.id)}
            className={selectedSection === section.id ? 'bg-primary hover:bg-primary/90' : ''}
          >
            {section.label}
          </Button>
        ))}
      </Box>

      {/* Section Content */}
      <Box>
        {selectedSection === 'skills' && renderSkillsComparison()}
        {selectedSection === 'experience' && renderExperienceComparison()}
        {selectedSection === 'overview' && (
          <Box className="text-center py-8">
            <Typography variant="h6" color="text.secondary">
              Select a section above to compare profile details
            </Typography>
          </Box>
        )}
        {(selectedSection === 'education' || selectedSection === 'certifications') && (
          <Box className="text-center py-8">
            <Typography variant="h6" color="text.secondary">
              {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)} comparison coming
              soon
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
