import { BusinessCenter as Briefcase, Mail } from '@mui/icons-material';
import { Box, Card, Button, CircularProgress } from '@mui/material';
import React, { useState } from 'react';

import { prepareApplicationPackage, scanInboxForOpportunities } from '../../../../api/aiServices';
import { Textarea } from '../../../ui/textarea';

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
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { md: '1fr 1fr' },
        gap: 'var(--sys-spacing-6)',
        marginBottom: 'var(--sys-spacing-6)',
      }}
    >
      <Card
        sx={{
          padding: 'var(--sys-spacing-6)',
          border: '1px solid var(--sys-color-outline-variant)',
          borderRadius: 'var(--shape-corner-large)',
          backgroundColor: 'var(--sys-color-surface-container-low)',
          boxShadow: 'var(--elevation-level1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-spacing-3)', marginBottom: 'var(--sys-spacing-4)' }}>
          <Box
            sx={{
              padding: 'var(--sys-spacing-2)',
              backgroundColor: 'var(--sys-color-primary-container)',
              borderRadius: 'var(--shape-corner-medium)',
            }}
          >
            <Briefcase sx={{ color: 'var(--sys-color-on-primary-container)' }} />
          </Box>
          <h3 style={{ font: 'var(--sys-type-title-large)', color: 'var(--sys-color-on-surface)' }}>
            One-Click Application Prep
          </h3>
        </Box>
        <p
          style={{
            font: 'var(--sys-type-body-medium)',
            color: 'var(--sys-color-on-surface-variant)',
            marginBottom: 'var(--sys-spacing-4)',
          }}
        >
          Generate a complete application package including tailored resume, cover letter, and KSC responses.
        </p>
        <Box>
          <Textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value)}
            sx={{ minHeight: '120px', marginBottom: 'var(--sys-spacing-2)' }}
            disabled={isPreparingApplication}
          />
          {applicationError && (
            <p style={{ font: 'var(--sys-type-body-small)', color: 'var(--sys-color-error)' }}>
              {applicationError}
            </p>
          )}
          <Button
            onClick={handlePrepareApplication}
            disabled={isPreparingApplication || !jobDescription.trim()}
            variant="contained"
            sx={{
              width: '100%',
              marginTop: 'var(--sys-spacing-2)',
              backgroundColor: 'var(--sys-color-primary)',
              color: 'var(--sys-color-on-primary)',
              '&:hover': { backgroundColor: 'var(--sys-color-primary-dark)' },
            }}
          >
            {isPreparingApplication ? (
              <>
                <CircularProgress size={20} sx={{ marginRight: 'var(--sys-spacing-2)', color: 'var(--sys-color-on-primary)' }} />
                Preparing Application Package...
              </>
            ) : (
              <>
                <Briefcase sx={{ marginRight: 'var(--sys-spacing-2)' }} />
                Prepare Application Package
              </>
            )}
          </Button>
        </Box>
      </Card>
      <Card
        sx={{
          padding: 'var(--sys-spacing-6)',
          border: '1px solid var(--sys-color-outline-variant)',
          borderRadius: 'var(--shape-corner-large)',
          backgroundColor: 'var(--sys-color-surface-container-low)',
          boxShadow: 'var(--elevation-level1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-spacing-3)', marginBottom: 'var(--sys-spacing-4)' }}>
          <Box
            sx={{
              padding: 'var(--sys-spacing-2)',
              backgroundColor: 'var(--sys-color-secondary-container)',
              borderRadius: 'var(--shape-corner-medium)',
            }}
          >
            <Mail sx={{ color: 'var(--sys-color-on-secondary-container)' }} />
          </Box>
          <h3 style={{ font: 'var(--sys-type-title-large)', color: 'var(--sys-color-on-surface)' }}>
            Scan Inbox for Jobs
          </h3>
        </Box>
        <p
          style={{
            font: 'var(--sys-type-body-medium)',
            color: 'var(--sys-color-on-surface-variant)',
            marginBottom: 'var(--sys-spacing-4)',
          }}
        >
          Automatically scan your email for job opportunities and create calendar tasks for high-scoring matches.
        </p>
        <Box>
          {emailScanError && (
            <p style={{ font: 'var(--sys-type-body-small)', color: 'var(--sys-color-error)' }}>
              {emailScanError}
            </p>
          )}
          <Button
            onClick={handleScanEmails}
            disabled={isScanningEmails}
            variant="contained"
            sx={{
              width: '100%',
              marginTop: 'var(--sys-spacing-2)',
              backgroundColor: 'var(--sys-color-secondary)',
              color: 'var(--sys-color-on-secondary)',
              '&:hover': { backgroundColor: 'var(--sys-color-secondary-dark)' },
            }}
          >
            {isScanningEmails ? (
              <>
                <CircularProgress size={20} sx={{ marginRight: 'var(--sys-spacing-2)', color: 'var(--sys-color-on-secondary)' }} />
                Scanning Inbox...
              </>
            ) : (
              <>
                <Mail sx={{ marginRight: 'var(--sys-spacing-2)' }} />
                Scan Inbox for Opportunities
              </>
            )}
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
