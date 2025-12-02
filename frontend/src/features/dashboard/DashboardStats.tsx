/**
 * ELECTRIC ALCHEMIST: DASHBOARD STATS FEATURE
 *
 * Dashboard statistics with one-click application prep and email scanning.
 */

import React, { useState } from 'react';
import { Briefcase, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui';
import { Alert } from '@/components/ui/Alert';
import { prepareApplicationPackage, scanInboxForOpportunities } from '@/api/aiServices';

export function DashboardStats() {
  const [jobDescription, setJobDescription] = useState('');
  const [isPreparingApplication, setIsPreparingApplication] = useState(false);
  const [applicationError, setApplicationError] = useState('');
  const [isScanningEmails, setIsScanningEmails] = useState(false);
  const [emailScanError, setEmailScanError] = useState('');

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
        alert(
          `Application package prepared successfully!\n\nComponents generated: ${response.data.components_generated.join(
            ', '
          )}\nJob Match Score: ${response.data.job_match_score}%\nApplication Strength: ${
            response.data.application_strength
          }\nProcessing time: ${response.processing_time_seconds.toFixed(1)}s`
        );
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

  const handleScanEmails = async () => {
    setIsScanningEmails(true);
    setEmailScanError('');
    try {
      const response = await scanInboxForOpportunities();
      if (response.success && response.data) {
        alert(
          `Email scan completed successfully!\n\nOpportunities found: ${response.data.total_opportunities_found}\nHigh-scoring opportunities: ${response.data.high_scoring_opportunities}\nCalendar tasks created: ${response.data.tasks_created}`
        );
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Card className="p-6 border-outline-variant bg-surface-container-low">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-container rounded-[8px]">
            <Briefcase className="h-5 w-5 text-on-primary-container" />
          </div>
          <h3 className="text-hero text-xl font-semibold text-on-surface">
            One-Click Application Prep
          </h3>
        </div>
        <p className="text-human text-sm text-on-surface-variant mb-4">
          Paste a job description and let AI prepare your complete application package instantly.
        </p>
        <Textarea
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={4}
          className="mb-4"
        />
        {applicationError && (
          <Alert severity="error" className="mb-4">
            {applicationError}
          </Alert>
        )}
        <Button
          onClick={handlePrepareApplication}
          disabled={isPreparingApplication || !jobDescription.trim()}
          className="w-full"
        >
          {isPreparingApplication ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Preparing...
            </>
          ) : (
            <>
              <Briefcase className="h-4 w-4 mr-2" />
              Prepare Application Package
            </>
          )}
        </Button>
      </Card>

      <Card className="p-6 border-outline-variant bg-surface-container-low">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-secondary-container rounded-[8px]">
            <Mail className="h-5 w-5 text-on-secondary" />
          </div>
          <h3 className="text-hero text-xl font-semibold text-on-surface">
            Smart Email Scanner
          </h3>
        </div>
        <p className="text-human text-sm text-on-surface-variant mb-4">
          Automatically scan your inbox for job opportunities and create calendar reminders.
        </p>
        {emailScanError && (
          <Alert severity="error" className="mb-4">
            {emailScanError}
          </Alert>
        )}
        <Button
          onClick={handleScanEmails}
          disabled={isScanningEmails}
          variant="secondary"
          className="w-full"
        >
          {isScanningEmails ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4 mr-2" />
              Scan Inbox for Opportunities
            </>
          )}
        </Button>
      </Card>
    </div>
  );
}

export default DashboardStats;

