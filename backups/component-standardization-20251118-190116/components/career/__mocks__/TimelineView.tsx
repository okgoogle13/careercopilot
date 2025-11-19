import React from 'react';

// This is a mock implementation of TimelineView for testing
const TimelineView = (props: any) => {
  return <div data-testid="timeline-view">TimelineView Mock</div>;
};

export { TimelineView };

// This tells Jest to use our mock when the actual TimelineView is imported
module.exports = {
  TimelineView: jest.fn((props) => (
    <div data-testid="timeline-view">TimelineView Mock</div>
  ))
};
