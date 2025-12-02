/**
 * ELECTRIC ALCHEMIST: OPPORTUNITIES PAGE
 *
 * Opportunities page using Electric Alchemist Design System v4.4.
 */

import React from 'react';
import { Container, Card, Button, Input, Grid } from '@/components/ui';
import { JobCard } from '@/features/jobs/JobCard';

export function OpportunitiesPage() {
  const sampleJobs = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      type: 'full-time' as const,
      description: 'Join our team...',
      requirements: [],
      skills: ['React', 'TypeScript', 'Node.js'],
      postedDate: new Date(),
      applicationDeadline: new Date(),
      experienceLevel: 'senior' as const,
      remote: true,
    },
  ];

  return (
    <Container size="lg">
      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-hero text-3xl font-semibold">Job Opportunities</h1>
          <Button variant="default">Filter Jobs</Button>
        </div>

        <div className="mb-6">
          <Input type="text" placeholder="Search jobs..." className="w-full" />
        </div>

        <Grid cols={1} gap="md">
          {sampleJobs.map((job) => (
            <JobCard key={job.id} job={job} variant="default" />
          ))}
        </Grid>
      </div>
    </Container>
  );
}

export default OpportunitiesPage;

