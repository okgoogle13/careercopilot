import React from 'react';
import { ApplicationTracker } from '../components/applications/ApplicationTracker';
import { PageContainer } from '../components/layout';

const ApplicationsPage: React.FC = () => {
  return (
    <PageContainer>
      <ApplicationTracker />
    </PageContainer>
  );
};

export default ApplicationsPage;
