import { BusinessCenter as Briefcase, Mail } from '@mui/icons-material';
import { Box } from '@mui/material';
import { Card, Button } from '@mui/material';
import React, { useState } from 'react';

import { prepareApplicationPackage, scanInboxForOpportunities } from '../../../../api/aiServices';
import { Textarea } from '../../../ui/textarea';

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
    <div sx={{
      [theme.breakpoints.up('md')]: {},
      gap: 6,
      mb: 6
    }}>
      {/* One-Click Application Prep Card */}
      <Card sx={{
      p: 6,
      borderColor: "blue.200"
    }}>
        <div sx={{}}>
          <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
            <div sx={{
      p: 2,
      bgcolor: "blue.100",
      borderRadius: "0.5rem"
    }}>
              <Briefcase sx={{
      color: "blue.600"
    }} />
            </div>
            <h3 sx={{
      fontWeight: 600,
      typography: "h6",}}>One-Click Application Prep</h3>
          </div>

          <p sx={{
      color: "blue.700",
      typography: "body1"
    }}>
            Generate a complete application package including tailored resume, cover letter, and KSC
            responses.
          </p>

          <div sx={{}}>
            <Textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setJobDescription(e.target.value)
              }
              sx={{
      h: "100px",}}
              disabled={isPreparingApplication}
            />

            {applicationError && <p sx={{
      color: "red.600",
      typography: "body1"
    }}>{applicationError}</p>}

            <Button
              onClick={handlePrepareApplication}
              disabled={isPreparingApplication || !jobDescription.trim()}
              sx={{
      width: "100%",
      '&:hover': {},
      color: "common.white"
    }}
            >
              {isPreparingApplication ? (
                <>
                  <div sx={{
      border: 2,
      borderRadius: "9999px",
      mr: 2
    }} />
                  Preparing Application Package...
                </>
              ) : (
                <>
                  <Briefcase sx={{
      mr: 2
    }} />
                  Prepare Application Package
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Email Scanning Card */}
      <Card sx={{
      p: 6,
      borderColor: "green.200"
    }}>
        <div sx={{}}>
          <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
            <div sx={{
      p: 2,
      bgcolor: "green.100",
      borderRadius: "0.5rem"
    }}>
              <Mail sx={{
      color: "green.600"
    }} />
            </div>
            <h3 sx={{
      fontWeight: 600,
      typography: "h6",}}>Scan Inbox for Jobs</h3>
          </div>

          <p sx={{
      color: "green.700",
      typography: "body1"
    }}>
            Automatically scan your email for job opportunities and create calendar tasks for
            high-scoring matches.
          </p>

          <div sx={{}}>
            {emailScanError && <p sx={{
      color: "red.600",
      typography: "body1"
    }}>{emailScanError}</p>}

            <Button
              onClick={handleScanEmails}
              disabled={isScanningEmails}
              sx={{
      width: "100%",
      '&:hover': {},
      color: "common.white"
    }}
            >
              {isScanningEmails ? (
                <>
                  <div sx={{
      border: 2,
      borderRadius: "9999px",
      mr: 2
    }} />
                  Scanning Inbox...
                </>
              ) : (
                <>
                  <Mail sx={{
      mr: 2
    }} />
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
