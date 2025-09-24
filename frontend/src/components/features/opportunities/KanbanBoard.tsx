import React, { useState } from 'react';
import { Box, Typography, Paper, Badge, Button, Card, CardContent } from '@mui/material';
import { Add as Plus } from '@mui/icons-material';
import { ApplicationCard } from './ApplicationCard';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  salary?: string;
  appliedDate: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
  nextEvent?: {
    type: string;
    date: string;
  };
  progress: number;
  companyLogo?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  status: Application['status'];
  color: string;
  applications: Application[];
}

interface KanbanBoardProps {
  applications?: Application[];
  onApplicationMove?: (applicationId: string, newStatus: Application['status']) => void;
  onApplicationClick?: (applicationId: string) => void;
  onAddApplication?: () => void;
}

const defaultColumns: Omit<KanbanColumn, 'applications'>[] = [
  {
    id: 'applied',
    title: 'Applied',
    status: 'applied',
    color: 'bg-blue-50 border-blue-200',
  },
  {
    id: 'screening',
    title: 'Screening',
    status: 'screening',
    color: 'bg-yellow-50 border-yellow-200',
  },
  {
    id: 'interview',
    title: 'Interview',
    status: 'interview',
    color: 'bg-purple-50 border-purple-200',
  },
  {
    id: 'offer',
    title: 'Offer',
    status: 'offer',
    color: 'bg-green-50 border-green-200',
  },
  {
    id: 'rejected',
    title: 'Rejected',
    status: 'rejected',
    color: 'bg-red-50 border-red-200',
  },
];

const sampleApplications: Application[] = [
  {
    id: '1',
    jobTitle: 'Senior Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    salary: '$140K - $200K',
    appliedDate: '2 days ago',
    status: 'applied',
    progress: 20,
    nextEvent: {
      type: 'Phone Screening',
      date: 'Tomorrow 2:00 PM',
    },
  },
  {
    id: '2',
    jobTitle: 'Frontend Developer',
    company: 'Microsoft',
    location: 'Seattle, WA',
    salary: '$110K - $160K',
    appliedDate: '1 week ago',
    status: 'screening',
    progress: 40,
    nextEvent: {
      type: 'Technical Interview',
      date: 'Friday 10:00 AM',
    },
  },
  {
    id: '3',
    jobTitle: 'Full Stack Developer',
    company: 'Startup Inc',
    location: 'Austin, TX',
    salary: '$90K - $130K',
    appliedDate: '3 days ago',
    status: 'interview',
    progress: 60,
    nextEvent: {
      type: 'Final Interview',
      date: 'Next Monday 3:00 PM',
    },
  },
  {
    id: '4',
    jobTitle: 'DevOps Engineer',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    salary: '$130K - $180K',
    appliedDate: '2 weeks ago',
    status: 'offer',
    progress: 90,
  },
  {
    id: '5',
    jobTitle: 'Backend Developer',
    company: 'Meta',
    location: 'Menlo Park, CA',
    salary: '$120K - $170K',
    appliedDate: '1 month ago',
    status: 'rejected',
    progress: 30,
  },
];

export function KanbanBoard({
  applications = sampleApplications,
  onApplicationMove,
  onApplicationClick,
  onAddApplication,
}: KanbanBoardProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Group applications by status
  const columns: KanbanColumn[] = defaultColumns.map((col) => ({
    ...col,
    applications: applications.filter((app) => app.status === col.status),
  }));

  const handleDragStart = (e: React.DragEvent, applicationId: string) => {
    setDraggedItem(applicationId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: Application['status']) => {
    e.preventDefault();
    if (draggedItem) {
      onApplicationMove?.(draggedItem, newStatus);
      setDraggedItem(null);
    }
  };

  return (
    <Box className="w-full">
      {/* Header */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <Typography variant="h4" className="text-2xl font-bold mb-2">
            Application Tracker
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage your job applications
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={onAddApplication}
          startIcon={<Plus sx={{ fontSize: 16 }} />}
          className="bg-primary hover:bg-primary/90"
          aria-label="Add new job application"
        >
          Add Application
        </Button>
      </Box>

      {/* Kanban Board */}
      <Box className="flex gap-6 overflow-x-auto pb-6">
        {columns.map((column) => (
          <Box
            key={column.id}
            className="min-w-80 flex-shrink-0"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.status)}
            role="region"
            aria-label={`${column.title} applications column`}
          >
            {/* Column Header */}
            <Paper className={`p-4 mb-4 border-2 ${column.color}`}>
              <Box className="flex items-center justify-between">
                <Typography variant="h6" className="font-semibold">
                  {column.title}
                </Typography>
                <Badge
                  badgeContent={column.applications.length}
                  color="primary"
                  className="text-sm"
                />
              </Box>
            </Paper>

            {/* Applications */}
            <Box className="space-y-3 min-h-96">
              {column.applications.map((application) => (
                <Box
                  key={application.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, application.id)}
                  onDragEnd={handleDragEnd}
                  className="cursor-move"
                >
                  <ApplicationCard
                    {...application}
                    isDragging={draggedItem === application.id}
                    onViewTimeline={onApplicationClick}
                  />
                </Box>
              ))}

              {/* Empty State */}
              {column.applications.length === 0 && (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="p-8 text-center">
                    <Typography variant="body2" color="text.secondary">
                      No applications in {column.title.toLowerCase()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Drag applications here or add new ones
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Summary Stats */}
      <Paper className="p-6 mt-6 bg-gray-50">
        <Typography variant="h6" className="font-semibold mb-4">
          Application Summary
        </Typography>
        <Box className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          {columns.map((column) => (
            <Box key={column.id}>
              <Typography variant="h3" className="font-bold text-primary">
                {column.applications.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {column.title}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
