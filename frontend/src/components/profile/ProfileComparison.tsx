import { SwapHoriz, Download, Share } from '@mui/icons-material';
import { Box, Typography, Button, Card, CardContent, Divider, Chip } from '@mui/material';
import React, { useState } from 'react';

import { ProfileCard } from './ProfileCard';

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
    avatarColor: 'var(--sys-color-tertiary)',
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
    avatarColor: 'var(--sys-color-primary)',
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
    <Box sx={{ display: 'grid', gridTemplateColumns: { sm: '1fr 1fr' }, gap: 'var(--sys-space-6)' }}>
      <Card sx={{ borderRadius: 'var(--sys-shape-corner-medium)', boxShadow: 'var(--sys-elevation-level1)' }}>
        <CardContent sx={{ p: 'var(--sys-space-4)' }}>
          <Typography variant="h6" sx={{ fontWeight: 'var(--sys-type-weight-medium)', mb: 'var(--sys-space-3)', color: 'var(--sys-color-on-surface)' }}>
            {leftProfile.name} - Skills
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sys-space-2)' }}>
            {leftProfile.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                size="small"
                sx={{
                  backgroundColor: !rightProfile.skills.includes(skill)
                    ? 'var(--sys-color-error-container)'
                    : 'var(--sys-color-surface-variant)',
                  color: !rightProfile.skills.includes(skill)
                    ? 'var(--sys-color-on-error-container)'
                    : 'var(--sys-color-on-surface-variant)',
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 'var(--sys-shape-corner-medium)', boxShadow: 'var(--sys-elevation-level1)' }}>
        <CardContent sx={{ p: 'var(--sys-space-4)' }}>
          <Typography variant="h6" sx={{ fontWeight: 'var(--sys-type-weight-medium)', mb: 'var(--sys-space-3)', color: 'var(--sys-color-on-surface)' }}>
            {rightProfile.name} - Skills
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sys-space-2)' }}>
            {rightProfile.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                size="small"
                sx={{
                  backgroundColor: !leftProfile.skills.includes(skill)
                    ? 'var(--sys-color-tertiary-container)'
                    : 'var(--sys-color-surface-variant)',
                  color: !leftProfile.skills.includes(skill)
                    ? 'var(--sys-color-on-tertiary-container)'
                    : 'var(--sys-color-on-surface-variant)',
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  const renderExperienceComparison = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { sm: '1fr 1fr' }, gap: 'var(--sys-space-6)' }}>
      <Card sx={{ borderRadius: 'var(--sys-shape-corner-medium)', boxShadow: 'var(--sys-elevation-level1)' }}>
        <CardContent sx={{ p: 'var(--sys-space-4)' }}>
          <Typography variant="h6" sx={{ fontWeight: 'var(--sys-type-weight-medium)', mb: 'var(--sys-space-3)', color: 'var(--sys-color-on-surface)' }}>
            {leftProfile.name} - Experience
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--sys-space-4)' }}>
            {leftProfile.experience.map((exp, index) => (
              <Box key={index} sx={{ borderLeft: '2px solid var(--sys-color-outline-variant)', pl: 'var(--sys-space-4)' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'var(--sys-type-weight-medium)', color: 'var(--sys-color-on-surface)' }}>
                  {exp.position}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>
                  {exp.company} • {exp.duration}
                </Typography>
                <ul sx={{ mt: 'var(--sys-space-2)', pl: 'var(--sys-space-4)' }}>
                  {exp.highlights.map((highlight, hIndex) => (
                    <li key={hIndex} sx={{ color: 'var(--sys-color-on-surface-variant)', mb: 'var(--sys-space-1)' }}>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 'var(--sys-shape-corner-medium)', boxShadow: 'var(--sys-elevation-level1)' }}>
        <CardContent sx={{ p: 'var(--sys-space-4)' }}>
          <Typography variant="h6" sx={{ fontWeight: 'var(--sys-type-weight-medium)', mb: 'var(--sys-space-3)', color: 'var(--sys-color-on-surface)' }}>
            {rightProfile.name} - Experience
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--sys-space-4)' }}>
            {rightProfile.experience.map((exp, index) => (
              <Box key={index} sx={{ borderLeft: '2px solid var(--sys-color-primary)', pl: 'var(--sys-space-4)' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'var(--sys-type-weight-medium)', color: 'var(--sys-color-on-surface)' }}>
                  {exp.position}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>
                  {exp.company} • {exp.duration}
                </Typography>
                <ul sx={{ mt: 'var(--sys-space-2)', pl: 'var(--sys-space-4)' }}>
                  {exp.highlights.map((highlight, hIndex) => (
                    <li key={hIndex} sx={{ color: 'var(--sys-color-on-surface-variant)', mb: 'var(--sys-space-1)' }}>
                      {highlight}
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
    <Box sx={{ width: '100%', p: 'var(--sys-space-4)' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 'var(--sys-space-6)' }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: 'var(--sys-type-font-family-brand)', fontSize: 'var(--sys-type-size-display-small)', fontWeight: 'var(--sys-type-weight-bold)', mb: 'var(--sys-space-2)', color: 'var(--sys-color-on-surface)' }}>
            Profile Comparison
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>
            Compare different versions of your profile side by side
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 'var(--sys-space-2)' }}>
          <Button
            variant="outlined"
            onClick={onSwapProfiles}
            startIcon={<SwapHoriz />}
            sx={{ borderColor: 'var(--sys-color-outline)', color: 'var(--sys-color-primary)' }}
          >
            Swap Profiles
          </Button>
          <Button variant="outlined" startIcon={<Download />} sx={{ borderColor: 'var(--sys-color-outline)', color: 'var(--sys-color-primary)' }}>
            Export Comparison
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'var(--sys-color-primary)', color: 'var(--sys-color-on-primary)', '&:hover': { backgroundColor: 'var(--sys-color-primary-dark)' } }}
            startIcon={<Share />}
          >
            Share
          </Button>
        </Box>
      </Box>

      {/* Profile Cards Overview */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { sm: '1fr 1fr' }, gap: 'var(--sys-space-6)', mb: 'var(--sys-space-8)' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 'var(--sys-space-4)' }}>
            <Typography variant="h6" sx={{ fontWeight: 'var(--sys-type-weight-medium)', color: 'var(--sys-color-on-surface)' }}>
              Profile Version 1
            </Typography>
            <Button size="small" variant="outlined" onClick={() => onProfileSelect?.('left')} sx={{ borderColor: 'var(--sys-color-outline)', color: 'var(--sys-color-primary)' }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 'var(--sys-space-4)' }}>
            <Typography variant="h6" sx={{ fontWeight: 'var(--sys-type-weight-medium)', color: 'var(--sys-color-on-surface)' }}>
              Profile Version 2
            </Typography>
            <Button size="small" variant="outlined" onClick={() => onProfileSelect?.('right')} sx={{ borderColor: 'var(--sys-color-outline)', color: 'var(--sys-color-primary)' }}>
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
      <Box sx={{ display: 'flex', gap: 'var(--sys-space-2)', mb: 'var(--sys-space-6)', borderBottom: '1px solid var(--sys-color-outline-variant)', pb: 'var(--sys-space-2)' }}>
        {sections.map((section) => (
          <Button
            key={section.id}
            variant="text"
            onClick={() => setSelectedSection(section.id)}
            sx={{
              color: selectedSection === section.id ? 'var(--sys-color-primary)' : 'var(--sys-color-on-surface-variant)',
              borderBottom: selectedSection === section.id ? '2px solid var(--sys-color-primary)' : 'none',
              borderRadius: 0,
            }}
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
          <Box sx={{ textAlign: 'center', py: 'var(--sys-space-8)', backgroundColor: 'var(--sys-color-surface-container-low)', borderRadius: 'var(--sys-shape-corner-medium)' }}>
            <Typography variant="h6" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>
              Select a section above to compare profile details
            </Typography>
          </Box>
        )}
        {(selectedSection === 'education' || selectedSection === 'certifications') && (
          <Box sx={{ textAlign: 'center', py: 'var(--sys-space-8)', backgroundColor: 'var(--sys-color-surface-container-low)', borderRadius: 'var(--sys-shape-corner-medium)' }}>
            <Typography variant="h6" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>
              {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)} comparison coming
              soon
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
