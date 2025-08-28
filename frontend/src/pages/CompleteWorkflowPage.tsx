import React from 'react';
import { WorkflowManager } from '../components/WorkflowManager/WorkflowManager';

const CompleteWorkflowPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <WorkflowManager />
      </div>
    </div>
  );
};

export default CompleteWorkflowPage;