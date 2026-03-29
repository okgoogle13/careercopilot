import React from 'react';
import { Scaffold } from '../components/archetypes';
import KanbanTracker from '../screens/07_kanban/KanbanTracker';

export default function ApplicationsPage() {
  return (
    <Scaffold>
      <KanbanTracker />
    </Scaffold>
  );
}
