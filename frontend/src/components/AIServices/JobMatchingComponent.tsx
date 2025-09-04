import React, { useState, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Badge } from '../ui/badge';
import { aiServices, JobMatchingRequest, JobMatchingResult } from '../../services/aiServices';
import toast from 'react-hot-toast';
import { AlertCircle, Briefcase, MapPin, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';

interface JobMatchingComponentProps {
  resumeDocumentId?: string;
  onJobSelected?: (jobId: string) => void;
}

export const JobMatchingComponent: React.FC<JobMatchingComponentProps> = ({
  resumeDocumentId,
  onJobSelected,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<JobMatchingResult | null>(null);
  const [preferences, setPreferences] = useState({
    job_type: '',
    experience_level: '',
    remote_preference: '',
    location_preference: '',
    salary_min: '',
    salary_max: '',
  });

  const handleJobMatching = useCallback(async () => {
    if (!resumeDocumentId) {
      toast.error('Please select a resume first');
      return;
    }

    setIsLoading(true);
    try {
      const request: JobMatchingRequest = {
        document_id: resumeDocumentId,
        preferences: {
          job_type: preferences.job_type || undefined,
          experience_level: preferences.experience_level || undefined,
          remote_preference: preferences.remote_preference || undefined,
          location_preference: preferences.location_preference || undefined,
          salary_range:
            preferences.salary_min && preferences.salary_max
              ? {
                  min: parseInt(preferences.salary_min),
                  max: parseInt(preferences.salary_max),
                }
              : undefined,
        },
      };

      const result = await aiServices.getJobMatching(request);
      setResults(result);
      toast.success(`Found ${result.matches.length} job matches!`);
    } catch (error) {
      console.error('Job matching error:', error);
      toast.error('Failed to find job matches. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [resumeDocumentId, preferences]);

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMatchScoreText = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Potential Match';
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h2 className='text-3xl font-bold text-gray-900 mb-2'>AI-Powered Job Matching</h2>
        <p className='text-gray-600'>Find jobs that perfectly match your skills and experience</p>
      </div>

      {/* Preferences Form */}
      <Card className='p-6'>
        <h3 className='text-lg font-semibold mb-4'>Job Preferences</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Job Type</label>
            <select
              value={preferences.job_type}
              onChange={e => setPreferences(prev => ({ ...prev, job_type: e.target.value }))}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Any</option>
              <option value='full-time'>Full-time</option>
              <option value='part-time'>Part-time</option>
              <option value='contract'>Contract</option>
              <option value='freelance'>Freelance</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Experience Level</label>
            <select
              value={preferences.experience_level}
              onChange={e =>
                setPreferences(prev => ({ ...prev, experience_level: e.target.value }))
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Any</option>
              <option value='entry-level'>Entry Level</option>
              <option value='mid-level'>Mid Level</option>
              <option value='senior-level'>Senior Level</option>
              <option value='executive'>Executive</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Remote Preference
            </label>
            <select
              value={preferences.remote_preference}
              onChange={e =>
                setPreferences(prev => ({ ...prev, remote_preference: e.target.value }))
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Any</option>
              <option value='remote'>Remote Only</option>
              <option value='hybrid'>Hybrid</option>
              <option value='on-site'>On-site Only</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Location Preference
            </label>
            <input
              type='text'
              value={preferences.location_preference}
              onChange={e =>
                setPreferences(prev => ({ ...prev, location_preference: e.target.value }))
              }
              placeholder='e.g. San Francisco, CA'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Min Salary ($)</label>
            <input
              type='number'
              value={preferences.salary_min}
              onChange={e => setPreferences(prev => ({ ...prev, salary_min: e.target.value }))}
              placeholder='50000'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Max Salary ($)</label>
            <input
              type='number'
              value={preferences.salary_max}
              onChange={e => setPreferences(prev => ({ ...prev, salary_max: e.target.value }))}
              placeholder='100000'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>

        <div className='mt-6'>
          <Button
            onClick={handleJobMatching}
            disabled={isLoading || !resumeDocumentId}
            className='w-full'
          >
            {isLoading ? (
              <>
                <LoadingSpinner size='sm' className='mr-2' />
                Finding Matches...
              </>
            ) : (
              <>
                <Briefcase className='mr-2 h-4 w-4' />
                Find Job Matches
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Results */}
      {results && (
        <div className='space-y-6'>
          {/* Analysis Summary */}
          <Card className='p-6'>
            <h3 className='text-lg font-semibold mb-4 flex items-center'>
              <TrendingUp className='mr-2 h-5 w-5' />
              Analysis Summary
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-600'>
                  {results.analysis.total_jobs_analyzed}
                </div>
                <div className='text-sm text-gray-600'>Jobs Analyzed</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-green-600'>
                  {results.analysis.avg_match_score.toFixed(1)}%
                </div>
                <div className='text-sm text-gray-600'>Avg Match Score</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-purple-600'>{results.matches.length}</div>
                <div className='text-sm text-gray-600'>Matches Found</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-orange-600'>
                  {results.analysis.skill_gaps.length}
                </div>
                <div className='text-sm text-gray-600'>Skill Gaps</div>
              </div>
            </div>

            {results.analysis.top_skills_in_demand.length > 0 && (
              <div className='mt-4'>
                <h4 className='font-medium mb-2'>Top Skills in Demand:</h4>
                <div className='flex flex-wrap gap-2'>
                  {results.analysis.top_skills_in_demand.map((skill, index) => (
                    <Badge key={index} variant='secondary'>
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Job Matches */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Job Matches</h3>
            {results.matches.map((job, index) => (
              <Card key={index} className='p-6 hover:shadow-lg transition-shadow'>
                <div className='flex justify-between items-start mb-4'>
                  <div className='flex-1'>
                    <h4 className='text-xl font-semibold text-gray-900 mb-1'>{job.title}</h4>
                    <p className='text-gray-600 mb-2'>{job.company}</p>
                    <div className='flex items-center text-sm text-gray-500 space-x-4'>
                      <span className='flex items-center'>
                        <MapPin className='mr-1 h-3 w-3' />
                        {job.location}
                      </span>
                      {job.salary_range && (
                        <span className='flex items-center'>
                          <DollarSign className='mr-1 h-3 w-3' />$
                          {job.salary_range.min.toLocaleString()} - $
                          {job.salary_range.max.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='text-right'>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getMatchScoreColor(job.match_score)}`}
                    >
                      {job.match_score}% Match
                    </div>
                    <div className='text-xs text-gray-500 mt-1'>
                      {getMatchScoreText(job.match_score)}
                    </div>
                  </div>
                </div>

                <div className='space-y-3'>
                  {/* Match Reasons */}
                  <div>
                    <h5 className='font-medium text-sm text-gray-700 mb-2'>Why this matches:</h5>
                    <div className='space-y-1'>
                      {job.match_reasons.slice(0, 3).map((reason, idx) => (
                        <div key={idx} className='flex items-start text-sm'>
                          <CheckCircle className='mr-2 h-3 w-3 text-green-500 mt-0.5 flex-shrink-0' />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <h5 className='font-medium text-sm text-gray-700 mb-2'>
                        Required Skills You Have:
                      </h5>
                      <div className='flex flex-wrap gap-1'>
                        {job.required_skills.slice(0, 5).map((skill, idx) => (
                          <Badge key={idx} variant='default' className='text-xs'>
                            {skill}
                          </Badge>
                        ))}
                        {job.required_skills.length > 5 && (
                          <Badge variant='secondary' className='text-xs'>
                            +{job.required_skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {job.missing_skills.length > 0 && (
                      <div>
                        <h5 className='font-medium text-sm text-gray-700 mb-2'>
                          Skills to Develop:
                        </h5>
                        <div className='flex flex-wrap gap-1'>
                          {job.missing_skills.slice(0, 3).map((skill, idx) => (
                            <Badge key={idx} variant='outline' className='text-xs'>
                              {skill}
                            </Badge>
                          ))}
                          {job.missing_skills.length > 3 && (
                            <Badge variant='secondary' className='text-xs'>
                              +{job.missing_skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className='flex gap-2 pt-2'>
                    <Button variant='outline' size='sm' onClick={() => onJobSelected?.(job.job_id)}>
                      View Details
                    </Button>
                    <Button size='sm'>Apply Now</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Recommendations */}
          {results.analysis.recommendations.length > 0 && (
            <Card className='p-6'>
              <h3 className='text-lg font-semibold mb-4 flex items-center'>
                <AlertCircle className='mr-2 h-5 w-5' />
                Recommendations
              </h3>
              <div className='space-y-2'>
                {results.analysis.recommendations.map((recommendation, index) => (
                  <div key={index} className='flex items-start text-sm'>
                    <CheckCircle className='mr-2 h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0' />
                    <span>{recommendation}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default JobMatchingComponent;
