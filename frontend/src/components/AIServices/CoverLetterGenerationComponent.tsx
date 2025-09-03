import React, { useState, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Badge } from '../ui/badge';
import { aiServices, SmartCoverLetterRequest, SmartCoverLetterResult } from '../../services/aiServices';
import toast from 'react-hot-toast';
import {
  FileText,
  Building2,
  User,
  Copy,
  Download,
  Sparkles,
  Info,
  TrendingUp,
  Target,
  Heart
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface CoverLetterGenerationComponentProps {
  resumeDocumentId?: string;
  initialJobDescription?: string;
  initialCompanyName?: string;
  initialPositionTitle?: string;
}

export const CoverLetterGenerationComponent: React.FC<CoverLetterGenerationComponentProps> = ({
  resumeDocumentId,
  initialJobDescription = '',
  initialCompanyName = '',
  initialPositionTitle = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SmartCoverLetterResult | null>(null);
  const [activeTab, setActiveTab] = useState('input');

  const [jobDetails, setJobDetails] = useState({
    job_description: initialJobDescription,
    company_name: initialCompanyName,
    position_title: initialPositionTitle,
    resume_content: '',
  });

  const [userBackground, setUserBackground] = useState({
    name: '',
    current_role: '',
    years_experience: '',
    key_achievements: [''],
  });

  const [preferences, setPreferences] = useState({
    tone: 'professional' as 'professional' | 'enthusiastic' | 'conversational' | 'formal',
    length: 'standard' as 'concise' | 'standard' | 'detailed',
  });

  const handleGeneration = useCallback(async () => {
    if (!jobDetails.job_description.trim() || !jobDetails.company_name.trim() || !jobDetails.position_title.trim()) {
      toast.error('Please fill in job description, company name, and position title');
      return;
    }

    if (!resumeDocumentId && !jobDetails.resume_content.trim()) {
      toast.error('Please select a resume or provide resume content');
      return;
    }

    setIsLoading(true);
    try {
      const request: SmartCoverLetterRequest = {
        document_id: resumeDocumentId,
        resume_content: jobDetails.resume_content || undefined,
        job_description: jobDetails.job_description.trim(),
        company_name: jobDetails.company_name.trim(),
        position_title: jobDetails.position_title.trim(),
        user_background: {
          name: userBackground.name || undefined,
          current_role: userBackground.current_role || undefined,
          years_experience: userBackground.years_experience ? parseInt(userBackground.years_experience) : undefined,
          key_achievements: userBackground.key_achievements.filter(a => a.trim()),
        },
        tone: preferences.tone,
        length: preferences.length,
      };

      const result = await aiServices.generateCoverLetter(request);
      setResults(result);
      setActiveTab('letter');
      toast.success('Cover letter generated successfully!');
    } catch (error) {
      console.error('Cover letter generation error:', error);
      toast.error('Failed to generate cover letter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [resumeDocumentId, jobDetails, userBackground, preferences]);

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const addAchievement = () => {
    setUserBackground(prev => ({ ...prev, key_achievements: [...prev.key_achievements, ''] }));
  };

  const updateAchievement = (index: number, value: string) => {
    setUserBackground(prev => ({
      ...prev,
      key_achievements: prev.key_achievements.map((achievement, i) => i === index ? value : achievement)
    }));
  };

  const removeAchievement = (index: number) => {
    setUserBackground(prev => ({
      ...prev,
      key_achievements: prev.key_achievements.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          AI Cover Letter Generator
        </h2>
        <p className="text-gray-600">
          Create personalized, compelling cover letters with company research
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="input">Job Details</TabsTrigger>
          <TabsTrigger value="letter" disabled={!results}>
            Generated Letter
          </TabsTrigger>
          <TabsTrigger value="research" disabled={!results}>
            Company Research
          </TabsTrigger>
          <TabsTrigger value="insights" disabled={!results}>
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Input Tab */}
        <TabsContent value="input" className="space-y-6">
          {/* Job Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Sparkles className="mr-2 h-5 w-5" />
              Job & Company Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={jobDetails.company_name}
                    onChange={(e) => setJobDetails(prev => ({ ...prev, company_name: e.target.value }))}
                    placeholder="e.g. Google"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position Title *
                  </label>
                  <input
                    type="text"
                    value={jobDetails.position_title}
                    onChange={(e) => setJobDetails(prev => ({ ...prev, position_title: e.target.value }))}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  value={jobDetails.job_description}
                  onChange={(e) => setJobDetails(prev => ({ ...prev, job_description: e.target.value }))}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Paste the complete job description here..."
                  required
                />
              </div>

              {!resumeDocumentId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume Content (if no document selected)
                  </label>
                  <textarea
                    value={jobDetails.resume_content}
                    onChange={(e) => setJobDetails(prev => ({ ...prev, resume_content: e.target.value }))}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="Paste your resume content here..."
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Personal Background */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="mr-2 h-5 w-5" />
              Personal Background (Optional)
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={userBackground.name}
                    onChange={(e) => setUserBackground(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Role
                  </label>
                  <input
                    type="text"
                    value={userBackground.current_role}
                    onChange={(e) => setUserBackground(prev => ({ ...prev, current_role: e.target.value }))}
                    placeholder="e.g. Software Engineer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={userBackground.years_experience}
                  onChange={(e) => setUserBackground(prev => ({ ...prev, years_experience: e.target.value }))}
                  placeholder="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Achievements
                </label>
                {userBackground.key_achievements.map((achievement, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => updateAchievement(index, e.target.value)}
                      placeholder="e.g. Led team of 5 developers to deliver project 2 weeks early"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {userBackground.key_achievements.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeAchievement(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addAchievement}>
                  Add Achievement
                </Button>
              </div>
            </div>
          </Card>

          {/* Preferences */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Writing Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tone
                </label>
                <select
                  value={preferences.tone}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    tone: e.target.value as typeof prev.tone
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="professional">Professional</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="conversational">Conversational</option>
                  <option value="formal">Formal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Length
                </label>
                <select
                  value={preferences.length}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    length: e.target.value as typeof prev.length
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="concise">Concise</option>
                  <option value="standard">Standard</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>
            </div>
          </Card>

          <Button
            onClick={handleGeneration}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Generating Cover Letter...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Cover Letter
              </>
            )}
          </Button>
        </TabsContent>

        {/* Generated Letter Tab */}
        <TabsContent value="letter">
          {results && (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Your Personalized Cover Letter</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyToClipboard(results.cover_letter)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 border">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                  {results.cover_letter}
                </pre>
              </div>

              {/* Optimization Notes */}
              {results.optimization_notes.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Optimization Notes
                  </h4>
                  <div className="space-y-2">
                    {results.optimization_notes.map((note, index) => (
                      <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                        <Info className="mr-2 h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}
        </TabsContent>

        {/* Company Research Tab */}
        <TabsContent value="research">
          {results && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Building2 className="mr-2 h-5 w-5" />
                  Company Research Insights
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Company Overview</h4>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {results.company_research.company_info}
                    </p>
                  </div>

                  {results.company_research.recent_news.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Recent News & Updates</h4>
                      <div className="space-y-2">
                        {results.company_research.recent_news.map((news, index) => (
                          <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                            <span className="mr-2 text-green-600">📰</span>
                            <span className="text-sm">{news}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Company Culture</h4>
                    <p className="text-gray-700 bg-purple-50 p-4 rounded-lg">
                      {results.company_research.company_culture}
                    </p>
                  </div>

                  {results.company_research.values_alignment.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Values Alignment</h4>
                      <div className="flex flex-wrap gap-2">
                        {results.company_research.values_alignment.map((value, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center">
                            <Heart className="mr-1 h-3 w-3" />
                            {value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Personalization Insights Tab */}
        <TabsContent value="insights">
          {results && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Personalization Strategy
                </h3>

                <div className="space-y-6">
                  {/* Role-Specific Highlights */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Role-Specific Highlights</h4>
                    <div className="space-y-2">
                      {results.personalization.role_specific_highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                          <Target className="mr-2 h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Company-Specific Connections */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Company-Specific Connections</h4>
                    <div className="space-y-2">
                      {results.personalization.company_specific_connections.map((connection, index) => (
                        <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                          <Building2 className="mr-2 h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{connection}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Value Proposition */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Your Value Proposition</h4>
                    <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                      {results.personalization.value_proposition}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoverLetterGenerationComponent;
