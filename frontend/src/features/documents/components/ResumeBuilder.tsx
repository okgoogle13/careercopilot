import { ScaffoldInput, Strike, Placard , ScaffoldArea } from '@/components/ui';
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
            <Strike
              iconLeft={<ArrowLeft size={16} />}
              onClick={handleBack}
              variant="ghost"
            >
              Back to Dashboard
            </Strike>
            <h1 className="text-3xl font-bold text-[var(--color-leaf-base)]">Resume Builder</h1>
          </div>
          <div className="flex gap-2">
            <Strike
              variant="secondary"
              iconLeft={<Eye size={16} />}
              onClick={onNext}
            >
              Preview
            </Strike>
            <Strike
              variant="secondary"
              iconLeft={<Download size={16} />}
            >
              Export PDF
            </Strike>
            <Strike
              variant="primary"
              iconLeft={<Save size={16} />}
              onClick={onNext}
            >
              Save & Continue
            </Strike>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Personal Info */}
            <Placard
              elevation="raised"
              className="p-6"
            >
              <h2 className="text-xl font-bold mb-6 text-[var(--color-leaf-base)]">
                Personal Information
              </h2>
              <div className="flex flex-col gap-4">
                <ScaffoldInput
                  className="w-full"
                  label="Full Name"
                  value={resumeData.personalInfo.fullName}
                  onChange={(e: any) => updatePersonalInfo('fullName', e.target.value)}
                />
                <ScaffoldInput
                  className="w-full"
                  label="Email"
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={(e: any) => updatePersonalInfo('email', e.target.value)}
                />
                <ScaffoldInput
                  className="w-full"
                  label="Phone"
                  value={resumeData.personalInfo.phone}
                  onChange={(e: any) => updatePersonalInfo('phone', e.target.value)}
                />
                <ScaffoldInput
                  className="w-full"
                  label="Location"
                  value={resumeData.personalInfo.location}
                  onChange={(e: any) => updatePersonalInfo('location', e.target.value)}
                />
                <ScaffoldArea
                  className="w-full"
                  label="Professional Summary"
                  rows={4}
                  value={resumeData.personalInfo.summary}
                  onChange={(e: any) => updatePersonalInfo('summary', e.target.value)}
                />
              </div>
            </Placard>

            {/* Skills */}
            <Placard
              elevation="raised"
              className="p-6"
            >
              <h2 className="text-xl font-bold mb-6 text-[var(--color-leaf-base)]">Skills</h2>
              <div className="flex gap-2 mb-4">
                <ScaffoldInput
                  className="w-full"
                  placeholder="Add a skill"
                  size="medium"
                  value={newSkill}
                  onChange={(e: any) => setNewSkill(e.target.value)}
                  onKeyPress={(e: any) => e.key === 'Enter' && addSkill()}
                />
                <Strike
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
                    className="flex items-center gap-1 px-3 py-1 rounded-march bg-[var(--color-surface-container)] text-[var(--color-text-primary)] text-sm"
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
            </Placard>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Experience */}
            <Placard
              elevation="raised"
              className="p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[var(--color-leaf-base)]">Work Experience</h2>
                <Strike
                  variant="secondary"
                  size="sm"
                  iconLeft={<Plus size={14} />}
                  onClick={addExperience}
                >
                  Add
                </Strike>
              </div>
              <div className="flex flex-col gap-6">
                {resumeData.experience.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="flex flex-col gap-4"
                  >
                    {index > 0 && <hr className="border-[var(--color-leaf-base)]/20" />}
                    <ScaffoldInput
                      className="w-full"
                      label="Job Title"
                      value={exp.title}
                      onChange={(e: any) => updateExperience(index, 'title', e.target.value)}
                    />
                    <ScaffoldInput
                      className="w-full"
                      label="Company"
                      value={exp.company}
                      onChange={(e: any) => updateExperience(index, 'company', e.target.value)}
                    />
                    <ScaffoldInput
                      className="w-full"
                      label="Duration"
                      placeholder="e.g. Jan 2020 - Present"
                      value={exp.duration}
                      onChange={(e: any) => updateExperience(index, 'duration', e.target.value)}
                    />
                    <ScaffoldArea
                      className="w-full"
                      label="Description"
                      rows={3}
                      value={exp.description}
                      onChange={(e: any) => updateExperience(index, 'description', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </Placard>

            {/* Education */}
            <Placard
              elevation="raised"
              className="p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[var(--color-leaf-base)]">Education</h2>
                <Strike
                  variant="secondary"
                  size="sm"
                  iconLeft={<Plus size={14} />}
                  onClick={addEducation}
                >
                  Add
                </Strike>
              </div>
              <div className="flex flex-col gap-6">
                {resumeData.education.map((edu, index) => (
                  <div
                    key={edu.id}
                    className="flex flex-col gap-4"
                  >
                    {index > 0 && <hr className="border-[var(--color-leaf-base)]/20" />}
                    <ScaffoldInput
                      className="w-full"
                      label="Degree"
                      value={edu.degree}
                      onChange={(e: any) => updateEducation(index, 'degree', e.target.value)}
                    />
                    <ScaffoldInput
                      className="w-full"
                      label="School/Institution"
                      value={edu.school}
                      onChange={(e: any) => updateEducation(index, 'school', e.target.value)}
                    />
                    <ScaffoldInput
                      className="w-full"
                      label="Year"
                      placeholder="e.g. 2020"
                      value={edu.year}
                      onChange={(e: any) => updateEducation(index, 'year', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </Placard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
