import React, { useState, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Badge } from '../ui/badge';
import { aiServices, ResumeIntelligenceRequest, ResumeIntelligenceResult } from '../../services/aiServices';
import toast from 'react-hot-toast';
import {
  Brain,
  TrendingUp,
  Star,
  Target,
  Award,
  BookOpen,
  User,
  Briefcase,
  BarChart3,
  Lightbulb,
  MapPin
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface ResumeIntelligenceComponentProps {
  resumeDocumentId?: string;
  initialResumeContent?: string;
}

export const ResumeIntelligenceComponent: React.FC<ResumeIntelligenceComponentProps> = ({
  resumeDocumentId,
  initialResumeContent = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ResumeIntelligenceResult | null>(null);
  const [settings, setSettings] = useState({
    resume_content: initialResumeContent,
    target_roles: [''],
    career_goals: '',
  });

  const handleAnalysis = useCallback(async () => {
    if (!resumeDocumentId && !settings.resume_content.trim()) {
      toast.error('Please select a resume or provide resume content');
      return;
    }

    setIsLoading(true);
    try {
      const request: ResumeIntelligenceRequest = {
        document_id: resumeDocumentId,
        resume_content: settings.resume_content || undefined,
        target_roles: settings.target_roles.filter(role => role.trim()),
        career_goals: settings.career_goals || undefined,
      };

      const result = await aiServices.getResumeIntelligence(request);
      setResults(result);
      toast.success('Resume analysis complete!');
    } catch (error) {
      console.error('Resume intelligence error:', error);
      toast.error('Failed to analyze resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [resumeDocumentId, settings]);

  const addTargetRole = () => {
    setSettings(prev => ({ ...prev, target_roles: [...prev.target_roles, ''] }));
  };

  const updateTargetRole = (index: number, value: string) => {
    setSettings(prev => ({
      ...prev,
      target_roles: prev.target_roles.map((role, i) => i === index ? value : role)
    }));
  };

  const removeTargetRole = (index: number) => {
    setSettings(prev => ({
      ...prev,
      target_roles: prev.target_roles.filter((_, i) => i !== index)
    }));
  };

  const getSkillLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'expert': return 'bg-green-100 text-green-800';
      case 'advanced': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'beginner': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMarketDemandColor = (demand: string) => {
    switch (demand.toLowerCase()) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Resume Intelligence Analysis
        </h2>
        <p className="text-gray-600">
          Get deep insights into your career trajectory and market positioning
        </p>
      </div>

      {/* Input Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Analysis Settings</h3>
        <div className="space-y-4">
          {/* Resume Content (if no document ID) */}
          {!resumeDocumentId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume Content
              </label>
              <textarea
                value={settings.resume_content}
                onChange={(e) => setSettings(prev => ({ ...prev, resume_content: e.target.value }))}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="Paste your resume content here..."
              />
            </div>
          )}

          {/* Target Roles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Roles (Optional)
            </label>
            {settings.target_roles.map((role, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={role}
                  onChange={(e) => updateTargetRole(index, e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {settings.target_roles.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeTargetRole(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addTargetRole}>
              Add Target Role
            </Button>
          </div>

          {/* Career Goals */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Career Goals (Optional)
            </label>
            <textarea
              value={settings.career_goals}
              onChange={(e) => setSettings(prev => ({ ...prev, career_goals: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your short and long-term career aspirations..."
            />
          </div>

          <Button
            onClick={handleAnalysis}
            disabled={isLoading || (!resumeDocumentId && !settings.resume_content.trim())}
            className="w-full"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Analyze Resume
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Results */}
      {results && (
        <Tabs defaultValue="progression" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="progression">Career Path</TabsTrigger>
            <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="positioning">Market Fit</TabsTrigger>
          </TabsList>

          {/* Career Progression Tab */}
          <TabsContent value="progression">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Career Progression Analysis
              </h3>

              <div className="space-y-6">
                {/* Current Level */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Current Career Level</h4>
                  <Badge variant="default" className="text-lg px-4 py-2">
                    {results.career_progression.current_level}
                  </Badge>
                </div>

                {/* Suggested Next Roles */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Suggested Next Roles</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {results.career_progression.suggested_next_roles.map((role, index) => (
                      <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <Briefcase className="mr-2 h-4 w-4 text-blue-600" />
                        <span className="font-medium">{role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Timeline Projection</h4>
                  <p className="text-gray-700">{results.career_progression.timeline_projection}</p>
                </div>

                {/* Required Skills for Growth */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Skills Needed for Growth</h4>
                  <div className="flex flex-wrap gap-2">
                    {results.career_progression.required_skills_for_growth.map((skill, index) => (
                      <Badge key={index} variant="outline" className="flex items-center">
                        <Target className="mr-1 h-3 w-3" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Skills Analysis Tab */}
          <TabsContent value="skills">
            <div className="space-y-6">
              {/* Technical Skills */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Star className="mr-2 h-5 w-5" />
                  Technical Skills Analysis
                </h3>
                <div className="space-y-4">
                  {results.skills_analysis.technical_skills.map((skill, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{skill.skill}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getSkillLevelColor(skill.proficiency_level)}>
                            {skill.proficiency_level}
                          </Badge>
                          <span className={`text-sm font-medium ${getMarketDemandColor(skill.market_demand)}`}>
                            {skill.market_demand} Demand
                          </span>
                        </div>
                      </div>
                      {skill.improvement_suggestions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">Improvement suggestions:</p>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {skill.improvement_suggestions.map((suggestion, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Soft Skills */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Soft Skills Assessment
                </h3>
                <div className="space-y-4">
                  {results.skills_analysis.soft_skills.map((skill, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{skill.skill}</h4>
                        <Badge variant="secondary">
                          {skill.evidence_strength} Evidence
                        </Badge>
                      </div>
                      {skill.improvement_suggestions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">Enhancement ideas:</p>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {skill.improvement_suggestions.map((suggestion, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Skill Gaps */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Skill Gaps & Learning Opportunities
                </h3>
                <div className="space-y-4">
                  {results.skills_analysis.skill_gaps.map((gap, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{gap.skill}</h4>
                        <Badge variant="outline" className="border-orange-300 text-orange-700">
                          {gap.importance} Priority
                        </Badge>
                      </div>
                      {gap.learning_resources.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">Learning resources:</p>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {gap.learning_resources.map((resource, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="mr-2">📚</span>
                                <span>{resource}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Experience Insights Tab */}
          <TabsContent value="experience">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Experience Analysis & Insights
              </h3>

              <div className="space-y-6">
                {/* Achievements Impact */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Achievement Impact Analysis</h4>
                  <div className="space-y-2">
                    {results.experience_insights.achievements_impact.map((achievement, index) => (
                      <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                        <TrendingUp className="mr-2 h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quantification Opportunities */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Quantification Opportunities</h4>
                  <div className="space-y-2">
                    {results.experience_insights.quantification_opportunities.map((opportunity, index) => (
                      <div key={index} className="flex items-start p-3 bg-yellow-50 rounded-lg">
                        <BarChart3 className="mr-2 h-4 w-4 text-yellow-600 mt-0.5" />
                        <span className="text-sm">{opportunity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience Narrative */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Career Narrative</h4>
                  <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">
                    {results.experience_insights.experience_narrative}
                  </p>
                </div>

                {/* Missing Experience Areas */}
                {results.experience_insights.missing_experience_areas.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Areas for Experience Growth</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.experience_insights.missing_experience_areas.map((area, index) => (
                        <Badge key={index} variant="outline" className="border-red-300 text-red-700">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Market Positioning Tab */}
          <TabsContent value="positioning">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Market Positioning Analysis
              </h3>

              <div className="space-y-6">
                {/* Market Fit Score */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {results.market_positioning.market_fit_score}%
                  </div>
                  <div className="text-gray-600">Market Fit Score</div>
                </div>

                {/* Unique Value Proposition */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Unique Value Proposition</h4>
                  <p className="text-gray-700 bg-purple-50 p-4 rounded-lg">
                    {results.market_positioning.unique_value_proposition}
                  </p>
                </div>

                {/* Competitive Advantages */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Competitive Advantages</h4>
                  <div className="space-y-2">
                    {results.market_positioning.competitive_advantages.map((advantage, index) => (
                      <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                        <Lightbulb className="mr-2 h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">{advantage}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Positioning Recommendations */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Positioning Recommendations</h4>
                  <div className="space-y-2">
                    {results.market_positioning.positioning_recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                        <Target className="mr-2 h-4 w-4 text-blue-600 mt-0.5" />
                        <span className="text-sm">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ResumeIntelligenceComponent;
