import { Lens, LensArea, Pebble, Stone } from '@/components/ui';
import { ArrowLeft, Download, Eye, Plus, Save, X } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface ResumeBuilderProps {
  onBack?: () => void;
  onNext?: () => void;
  profileName?: string;
}

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    year: string;
  }>;
  skills: string[];
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ onBack, onNext, profileName }) => {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: profileName || '',
      email: '',
      phone: '',
      location: '',
      summary: '',
    },
    experience: [{ id: '1', title: '', company: '', duration: '', description: '' }],
    education: [{ id: '1', degree: '', school: '', year: '' }],
    skills: [],
  });

  const [newSkill, setNewSkill] = useState('');

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Date.now().toString(), title: '', company: '', duration: '', description: '' },
      ],
    }));
  };

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: Date.now().toString(), degree: '', school: '', year: '' },
      ],
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const updateExperience = (
    index: number,
    field: keyof ResumeData['experience'][0],
    value: string
  ) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)),
    }));
  };

  const updateEducation = (
    index: number,
    field: keyof ResumeData['education'][0],
    value: string
  ) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
    }));
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] py-8 font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Pebble
              iconLeft={<ArrowLeft size={16} />}
              onClick={handleBack}
              variant="ghost"
            >
              Back to Dashboard
            </Pebble>
            <h1 className="text-3xl font-bold text-[var(--color-leaf-base)]">Resume Builder</h1>
          </div>
          <div className="flex gap-2">
            <Pebble
              variant="secondary"
              iconLeft={<Eye size={16} />}
              onClick={onNext}
            >
              Preview
            </Pebble>
            <Pebble
              variant="secondary"
              iconLeft={<Download size={16} />}
            >
              Export PDF
            </Pebble>
            <Pebble
              variant="primary"
              iconLeft={<Save size={16} />}
              onClick={onNext}
            >
              Save & Continue
            </Pebble>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Personal Info */}
            <Stone
              elevation="raised"
              className="p-6"
            >
              <h2 className="text-xl font-bold mb-6 text-[var(--color-leaf-base)]">
                Personal Information
              </h2>
              <div className="flex flex-col gap-4">
                <Lens
                  className="w-full"
                  label="Full Name"
                  value={resumeData.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                />
                <Lens
                  className="w-full"
                  label="Email"
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                />
                <Lens
                  className="w-full"
                  label="Phone"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                />
                <Lens
                  className="w-full"
                  label="Location"
                  value={resumeData.personalInfo.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                />
                <LensArea
                  className="w-full"
                  label="Professional Summary"
                  rows={4}
                  value={resumeData.personalInfo.summary}
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                />
              </div>
            </Stone>

            {/* Skills */}
            <Stone
              elevation="raised"
              className="p-6"
            >
              <h2 className="text-xl font-bold mb-6 text-[var(--color-leaf-base)]">Skills</h2>
              <div className="flex gap-2 mb-4">
                <Lens
                  className="w-full"
                  placeholder="Add a skill"
                  size="medium"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Pebble
                  variant="primary"
                  onClick={addSkill}
                  className="min-w-[48px]"
                  iconLeft={<Plus size={20} />}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-surface-container)] text-[var(--color-text-primary)] text-sm"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => removeSkill(index)}
                      className="hover:text-[var(--color-bark-base)] transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </Stone>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Experience */}
            <Stone
              elevation="raised"
              className="p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[var(--color-leaf-base)]">Work Experience</h2>
                <Pebble
                  variant="secondary"
                  size="sm"
                  iconLeft={<Plus size={14} />}
                  onClick={addExperience}
                >
                  Add
                </Pebble>
              </div>
              <div className="flex flex-col gap-6">
                {resumeData.experience.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="flex flex-col gap-4"
                  >
                    {index > 0 && <hr className="border-[var(--color-leaf-base)]/20" />}
                    <Lens
                      className="w-full"
                      label="Job Title"
                      value={exp.title}
                      onChange={(e) => updateExperience(index, 'title', e.target.value)}
                    />
                    <Lens
                      className="w-full"
                      label="Company"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    />
                    <Lens
                      className="w-full"
                      label="Duration"
                      placeholder="e.g. Jan 2020 - Present"
                      value={exp.duration}
                      onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                    />
                    <LensArea
                      className="w-full"
                      label="Description"
                      rows={3}
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </Stone>

            {/* Education */}
            <Stone
              elevation="raised"
              className="p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[var(--color-leaf-base)]">Education</h2>
                <Pebble
                  variant="secondary"
                  size="sm"
                  iconLeft={<Plus size={14} />}
                  onClick={addEducation}
                >
                  Add
                </Pebble>
              </div>
              <div className="flex flex-col gap-6">
                {resumeData.education.map((edu, index) => (
                  <div
                    key={edu.id}
                    className="flex flex-col gap-4"
                  >
                    {index > 0 && <hr className="border-[var(--color-leaf-base)]/20" />}
                    <Lens
                      className="w-full"
                      label="Degree"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    />
                    <Lens
                      className="w-full"
                      label="School/Institution"
                      value={edu.school}
                      onChange={(e) => updateEducation(index, 'school', e.target.value)}
                    />
                    <Lens
                      className="w-full"
                      label="Year"
                      placeholder="e.g. 2020"
                      value={edu.year}
                      onChange={(e) => updateEducation(index, 'year', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </Stone>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
