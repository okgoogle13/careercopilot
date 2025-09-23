import React, { useState } from 'react';
import { Card } from '@mui/material';
import { Button } from '@mui/material';
import { Textarea } from '../ui/textarea';
import { Briefcase, Mail } from 'lucide-react';
import { prepareApplicationPackage, scanInboxForOpportunities } from '../../api/aiServices';

export function DashboardStats() {
  // State for Application Preparation
  const [jobDescription, setJobDescription] = useState('');
  const [isPreparingApplication, setIsPreparingApplication] = useState(false);
  const [applicationError, setApplicationError] = useState('');

  // State for Email Scanning
  const [isScanningEmails, setIsScanningEmails] = useState(false);
  const [emailScanError, setEmailScanError] = useState('');

  // Handler for Application Package Preparation
  const handlePrepareApplication = async () => {
    if (!jobDescription.trim()) {
      setApplicationError('Please enter a job description');
      return;
    }

    setIsPreparingApplication(true);
    setApplicationError('');

    try {
      const response = await prepareApplicationPackage(jobDescription);

      if (response.success && response.data) {
        // Show success notification
        alert(`Application package prepared successfully!

Components generated: ${response.data.components_generated.join(', ')}
Job Match Score: ${response.data.job_match_score}%
Application Strength: ${response.data.application_strength}
Processing time: ${response.processing_time_seconds.toFixed(1)}s`);

        // Clear form on success
        setJobDescription('');
      } else {
        setApplicationError(response.message || 'Failed to prepare application package');
      }
    } catch (error) {
      setApplicationError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsPreparingApplication(false);
    }
  };

  // Handler for Email Scanning
  const handleScanEmails = async () => {
    setIsScanningEmails(true);
    setEmailScanError('');

    try {
      const response = await scanInboxForOpportunities();

      if (response.success && response.data) {
        // Show success notification
        alert(`Email scan completed successfully!

Opportunities found: ${response.data.total_opportunities_found}
High-scoring opportunities: ${response.data.high_scoring_opportunities}
Calendar tasks created: ${response.data.tasks_created}`);
      } else {
        setEmailScanError(response.message || 'Email scan failed');
      }
    } catch (error) {
      setEmailScanError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsScanningEmails(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* One-Click Application Prep Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg text-blue-900">One-Click Application Prep</h3>
          </div>

          <p className="text-blue-700 text-sm">
            Generate a complete application package including tailored resume, cover letter, and
            KSC responses.
          </p>

          <div className="space-y-3">
            <Textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[100px] resize-y"
              disabled={isPreparingApplication}
            />

            {applicationError && <p className="text-red-600 text-sm">{applicationError}</p>}

            <Button
              onClick={handlePrepareApplication}
              disabled={isPreparingApplication || !jobDescription.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPreparingApplication ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Preparing Application Package...
                </>
              ) : (
                <>
                  <Briefcase className="w-4 h-4 mr-2" />
                  Prepare Application Package
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Email Scanning Card */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Mail className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg text-green-900">Scan Inbox for Jobs</h3>
          </div>

          <p className="text-green-700 text-sm">
            Automatically scan your email for job opportunities and create calendar tasks for
            high-scoring matches.
          </p>

          <div className="space-y-3">
            {emailScanError && <p className="text-red-600 text-sm">{emailScanError}</p>}

            <Button
              onClick={handleScanEmails}
              disabled={isScanningEmails}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isScanningEmails ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Scanning Inbox...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Scan Inbox for Opportunities
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}