import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Modal, LoadingSpinner } from '../ui';
import { 
  Plus, Calendar, MapPin, Building, Clock, ExternalLink, 
  CheckCircle, AlertCircle, XCircle, Eye, Edit, Trash2,
  Filter, Search, MoreHorizontal, Bell, Target, Users, FileText
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  jobUrl?: string;
  status: 'draft' | 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  priority: 'low' | 'medium' | 'high';
  appliedDate?: Date;
  deadline?: Date;
  salary?: {
    min?: number;
    max?: number;
    currency: string;
  };
  notes: string;
  documents: {
    resumeId?: string;
    coverLetterId?: string;
    customDocuments?: string[];
  };
  contacts: {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
  }[];
  interviews: {
    id: string;
    date: Date;
    type: 'phone' | 'video' | 'in-person' | 'technical';
    interviewer?: string;
    notes?: string;
    completed: boolean;
  }[];
  timeline: {
    id: string;
    date: Date;
    event: string;
    description?: string;
    type: 'applied' | 'response' | 'interview' | 'follow-up' | 'offer' | 'rejection' | 'note';
  }[];
  reminders: {
    id: string;
    date: Date;
    message: string;
    completed: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

interface ApplicationTrackerProps {
  className?: string;
}

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: Edit },
  applied: { label: 'Applied', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  interview: { label: 'Interview', color: 'bg-yellow-100 text-yellow-800', icon: Calendar },
  offer: { label: 'Offer', color: 'bg-green-100 text-green-800', icon: Target },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
  withdrawn: { label: 'Withdrawn', color: 'bg-gray-100 text-gray-600', icon: AlertCircle },
};

const priorityConfig = {
  low: { label: 'Low', color: 'bg-gray-100 text-gray-600' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  high: { label: 'High', color: 'bg-red-100 text-red-700' },
};

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ className = '' }) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'company' | 'status' | 'priority'>('date');
  
  // Bulk operations state
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set());
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const [showBulkActionsModal, setShowBulkActionsModal] = useState(false);
  
  // Mock data for development
  useEffect(() => {
    const mockApplications: JobApplication[] = [
      {
        id: '1',
        jobTitle: 'Senior Software Engineer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        jobUrl: 'https://example.com/job/1',
        status: 'interview',
        priority: 'high',
        appliedDate: new Date('2024-01-15'),
        deadline: new Date('2024-01-30'),
        salary: { min: 120000, max: 150000, currency: 'USD' },
        notes: 'Great company culture, exciting tech stack with React and Node.js',
        documents: { resumeId: 'resume-1', coverLetterId: 'cover-1' },
        contacts: [
          { name: 'Sarah Johnson', email: 'sarah@techcorp.com', role: 'Hiring Manager' }
        ],
        interviews: [
          {
            id: 'int-1',
            date: new Date('2024-01-20'),
            type: 'video',
            interviewer: 'John Smith',
            notes: 'Technical discussion went well',
            completed: true
          }
        ],
        timeline: [
          {
            id: 'tl-1',
            date: new Date('2024-01-15'),
            event: 'Application Submitted',
            type: 'applied'
          },
          {
            id: 'tl-2',
            date: new Date('2024-01-18'),
            event: 'Interview Scheduled',
            description: 'Video interview with John Smith',
            type: 'interview'
          }
        ],
        reminders: [
          {
            id: 'rem-1',
            date: new Date('2024-01-25'),
            message: 'Follow up on interview feedback',
            completed: false
          }
        ],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-18')
      },
      {
        id: '2',
        jobTitle: 'Frontend Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        status: 'applied',
        priority: 'medium',
        appliedDate: new Date('2024-01-12'),
        notes: 'Remote-first company, focus on React and TypeScript',
        documents: { resumeId: 'resume-2' },
        contacts: [],
        interviews: [],
        timeline: [
          {
            id: 'tl-3',
            date: new Date('2024-01-12'),
            event: 'Application Submitted',
            type: 'applied'
          }
        ],
        reminders: [],
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12')
      }
    ];

    setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredApplications = applications
    .filter(app => {
      const matchesSearch = app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'company':
          return a.company.localeCompare(b.company);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'date':
        default:
          return (b.appliedDate?.getTime() || b.createdAt.getTime()) - 
                 (a.appliedDate?.getTime() || a.createdAt.getTime());
      }
    });

  const handleViewDetails = (app: JobApplication) => {
    setSelectedApp(app);
    setIsDetailsModalOpen(true);
  };

  const handleStatusChange = async (appId: string, newStatus: JobApplication['status']) => {
    try {
      setApplications(prev => prev.map(app => 
        app.id === appId ? { 
          ...app, 
          status: newStatus,
          updatedAt: new Date()
        } : app
      ));
      toast.success('Application status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (appId: string) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    
    try {
      setApplications(prev => prev.filter(app => app.id !== appId));
      toast.success('Application deleted');
    } catch (error) {
      toast.error('Failed to delete application');
    }
  };

  const getUpcomingDeadlines = () => {
    const now = new Date();
    const upcoming = applications.filter(app => {
      if (!app.deadline) return false;
      const daysUntil = Math.ceil((app.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntil <= 7 && daysUntil >= 0;
    });
    return upcoming;
  };

  const getStatusCounts = () => {
    const counts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return counts;
  };

  // Bulk Operations Handlers
  const toggleBulkMode = () => {
    setBulkActionMode(!bulkActionMode);
    if (bulkActionMode) {
      setSelectedApplications(new Set());
    }
  };

  const toggleApplicationSelection = (appId: string) => {
    const newSelected = new Set(selectedApplications);
    if (newSelected.has(appId)) {
      newSelected.delete(appId);
    } else {
      newSelected.add(appId);
    }
    setSelectedApplications(newSelected);
  };

  const selectAllApplications = () => {
    const allIds = filteredApplications.map(app => app.id);
    setSelectedApplications(new Set(allIds));
  };

  const clearSelection = () => {
    setSelectedApplications(new Set());
  };

  const handleBulkStatusUpdate = async (newStatus: JobApplication['status']) => {
    try {
      const selectedIds = Array.from(selectedApplications);
      setApplications(prev => prev.map(app => 
        selectedIds.includes(app.id) ? {
          ...app,
          status: newStatus,
          updatedAt: new Date()
        } : app
      ));
      
      toast.success(`Updated ${selectedIds.length} application(s) to ${newStatus}`);
      setSelectedApplications(new Set());
      setShowBulkActionsModal(false);
    } catch (error) {
      toast.error('Failed to update applications');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedApplications.size} application(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      const selectedIds = Array.from(selectedApplications);
      setApplications(prev => prev.filter(app => !selectedIds.includes(app.id)));
      
      toast.success(`Deleted ${selectedIds.length} application(s)`);
      setSelectedApplications(new Set());
      setShowBulkActionsModal(false);
    } catch (error) {
      toast.error('Failed to delete applications');
    }
  };

  const handleBulkArchive = async () => {
    // In a real app, this would move applications to an archived state
    // For now, we'll change status to 'withdrawn' as a form of archiving
    await handleBulkStatusUpdate('withdrawn');
  };

  const exportApplications = () => {
    const selectedApps = applications.filter(app => 
      selectedApplications.size === 0 || selectedApplications.has(app.id)
    );

    const csvContent = [
      ['Job Title', 'Company', 'Location', 'Status', 'Applied Date', 'Deadline', 'Notes'].join(','),
      ...selectedApps.map(app => [
        `"${app.jobTitle}"`,
        `"${app.company}"`,
        `"${app.location}"`,
        app.status,
        app.appliedDate?.toLocaleDateString() || '',
        app.deadline?.toLocaleDateString() || '',
        `"${app.notes.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `job-applications-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success(`Exported ${selectedApps.length} application(s) to CSV`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const upcomingDeadlines = getUpcomingDeadlines();
  const statusCounts = getStatusCounts();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Application Tracker</h1>
          <p className="text-muted-foreground">
            Track and manage your job applications in one place
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Application
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const StatusIcon = config.icon;
          const count = statusCounts[status] || 0;
          return (
            <Card key={status} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium capitalize">{config.label}</span>
              </div>
              <div className="text-2xl font-bold">{count}</div>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Deadlines Alert */}
      {upcomingDeadlines.length > 0 && (
        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-orange-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-900">Upcoming Deadlines</h3>
              <ul className="mt-2 space-y-1">
                {upcomingDeadlines.map(app => (
                  <li key={app.id} className="text-sm text-orange-800">
                    <strong>{app.jobTitle}</strong> at {app.company} - 
                    {app.deadline && format(app.deadline, 'MMM d, yyyy')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          {Object.entries(statusConfig).map(([status, config]) => (
            <option key={status} value={status}>{config.label}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
        >
          <option value="date">Sort by Date</option>
          <option value="company">Sort by Company</option>
          <option value="status">Sort by Status</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>

      {/* Bulk Operations Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant={bulkActionMode ? "default" : "outline"}
            onClick={toggleBulkMode}
            className="flex items-center gap-2"
          >
            <input 
              type="checkbox" 
              checked={bulkActionMode}
              onChange={() => {}}
              className="w-4 h-4"
            />
            {bulkActionMode ? 'Exit Bulk Mode' : 'Bulk Actions'}
          </Button>
          
          {bulkActionMode && (
            <>
              <span className="text-sm text-muted-foreground">
                {selectedApplications.size} selected
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={selectAllApplications}
                disabled={filteredApplications.length === selectedApplications.size}
              >
                Select All ({filteredApplications.length})
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearSelection}
                disabled={selectedApplications.size === 0}
              >
                Clear
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={exportApplications}
            className="flex items-center gap-2"
          >
            📊 Export CSV
          </Button>
          
          {bulkActionMode && selectedApplications.size > 0 && (
            <Button
              onClick={() => setShowBulkActionsModal(true)}
              className="flex items-center gap-2"
            >
              Actions ({selectedApplications.size})
            </Button>
          )}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card className="p-8 text-center">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No applications found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start tracking your job applications to stay organized'
              }
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                Add Your First Application
              </Button>
            )}
          </Card>
        ) : (
          filteredApplications.map(app => (
            <ApplicationCard
              key={app.id}
              application={app}
              onViewDetails={() => handleViewDetails(app)}
              onStatusChange={(status) => handleStatusChange(app.id, status)}
              onDelete={() => handleDelete(app.id)}
              bulkMode={bulkActionMode}
              selected={selectedApplications.has(app.id)}
              onToggleSelection={() => toggleApplicationSelection(app.id)}
            />
          ))
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApp && (
        <ApplicationDetailsModal
          application={selectedApp}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onUpdate={(updated) => {
            setApplications(prev => prev.map(app => 
              app.id === updated.id ? updated : app
            ));
            setSelectedApp(updated);
          }}
        />
      )}

      {/* Add Application Modal */}
      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(newApp) => {
          setApplications(prev => [newApp, ...prev]);
          setIsAddModalOpen(false);
          toast.success('Application added successfully');
        }}
      />

      {/* Bulk Actions Modal */}
      <Modal isOpen={showBulkActionsModal} onClose={() => setShowBulkActionsModal(false)} title="Bulk Actions">
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Apply actions to {selectedApplications.size} selected application(s)
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm mb-2">Change Status</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(statusConfig).map(([status, config]) => (
                  <Button
                    key={status}
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusUpdate(status as any)}
                    className="justify-start"
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      status === 'draft' ? 'bg-gray-500' :
                      status === 'applied' ? 'bg-blue-500' :
                      status === 'interview' ? 'bg-yellow-500' :
                      status === 'offer' ? 'bg-green-500' :
                      status === 'rejected' ? 'bg-red-500' : 'bg-gray-400'
                    }`} />
                    {config.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="border-t pt-3">
              <h4 className="font-medium text-sm mb-2">Other Actions</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkArchive}
                  className="w-full justify-start"
                >
                  📥 Archive Applications
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="w-full justify-start"
                >
                  🗑️ Delete Applications
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowBulkActionsModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Mobile-Optimized Application Card Component with Swipe Actions
const ApplicationCard: React.FC<{
  application: JobApplication;
  onViewDetails: () => void;
  onStatusChange: (status: JobApplication['status']) => void;
  onDelete: () => void;
  bulkMode?: boolean;
  selected?: boolean;
  onToggleSelection?: () => void;
}> = ({ application, onViewDetails, onStatusChange, onDelete, bulkMode = false, selected = false, onToggleSelection }) => {
  const [swipeX, setSwipeX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const statusInfo = statusConfig[application.status];
  const priorityInfo = priorityConfig[application.priority];
  const StatusIcon = statusInfo.icon;

  const daysUntilDeadline = application.deadline 
    ? Math.ceil((application.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Touch/Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (bulkMode) return; // Disable swipe in bulk mode
    setIsDragging(true);
    const touch = e.touches[0];
    cardRef.current?.setAttribute('data-start-x', touch.clientX.toString());
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || bulkMode) return;
    
    const touch = e.touches[0];
    const startX = parseFloat(cardRef.current?.getAttribute('data-start-x') || '0');
    const currentX = touch.clientX;
    const diffX = currentX - startX;
    
    // Limit swipe to left only and max 150px
    const clampedX = Math.max(Math.min(diffX, 0), -150);
    setSwipeX(clampedX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // If swiped more than 75px, show actions
    if (swipeX < -75) {
      setSwipeX(-120);
      setShowActions(true);
    } else {
      setSwipeX(0);
      setShowActions(false);
    }
  };

  const resetSwipe = () => {
    setSwipeX(0);
    setShowActions(false);
  };

  // Quick status change for mobile
  const getNextStatus = (currentStatus: JobApplication['status']): JobApplication['status'] => {
    const statusFlow: JobApplication['status'][] = ['draft', 'applied', 'interview', 'offer'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return statusFlow[currentIndex + 1] || 'applied';
  };

  return (
    <div className="relative overflow-hidden">
      {/* Swipe Action Background */}
      {showActions && (
        <div className="absolute inset-0 flex items-center justify-end pr-4 bg-gradient-to-l from-red-500 to-orange-500">
          <div className="flex gap-2">
            <button
              onClick={() => {
                onStatusChange(getNextStatus(application.status));
                resetSwipe();
              }}
              className="p-2 bg-white/20 rounded-full text-white"
            >
              <CheckCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                onDelete();
                resetSwipe();
              }}
              className="p-2 bg-white/20 rounded-full text-white"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Card */}
      <Card 
        ref={cardRef}
        className={`transition-transform duration-200 ${
          selected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
        } ${isDragging ? 'transition-none' : ''}`}
        style={{ 
          transform: `translateX(${swipeX}px)`,
          // Mobile-first responsive padding
          padding: window.innerWidth < 768 ? '1rem' : '1.5rem'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={!isDragging && !showActions ? onViewDetails : undefined}
      >
        <div className="flex items-start justify-between mb-3">
          {bulkMode && (
            <div className="mr-3 mt-1 flex-shrink-0">
              <input
                type="checkbox"
                checked={selected}
                onChange={onToggleSelection}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            {/* Mobile-optimized header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                {application.jobTitle}
              </h3>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color}`}>
                  {priorityInfo.label}
                </span>
              </div>
            </div>
            
            {/* Mobile-optimized company info */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{application.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{application.location}</span>
            </div>
            {application.appliedDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Applied {format(application.appliedDate, 'MMM d')}
              </div>
            )}
          </div>

          {application.salary && (
            <div className="text-sm text-muted-foreground mb-2">
              ${application.salary.min?.toLocaleString()} - ${application.salary.max?.toLocaleString()} {application.salary.currency}
            </div>
          )}

          {daysUntilDeadline !== null && (
            <div className={`text-sm font-medium ${
              daysUntilDeadline <= 3 ? 'text-red-600' : daysUntilDeadline <= 7 ? 'text-orange-600' : 'text-muted-foreground'
            }`}>
              {daysUntilDeadline === 0 ? 'Deadline today' : 
               daysUntilDeadline === 1 ? 'Deadline tomorrow' :
               daysUntilDeadline > 0 ? `${daysUntilDeadline} days until deadline` :
               'Deadline passed'}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {application.jobUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(application.jobUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
          
          <select
            value={application.status}
            onChange={(e) => onStatusChange(e.target.value as JobApplication['status'])}
            className="text-xs px-2 py-1 border border-border rounded focus:ring-2 focus:ring-primary"
          >
            {Object.entries(statusConfig).map(([status, config]) => (
              <option key={status} value={status}>{config.label}</option>
            ))}
          </select>

              <Button variant="ghost" size="sm" onClick={onViewDetails}>
                <Eye className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }} 
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile swipe hint */}
        {!bulkMode && (
          <div className="sm:hidden mt-2 text-xs text-muted-foreground text-center opacity-60">
            ← Swipe left for quick actions
          </div>
        )}

        {application.notes && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-muted-foreground line-clamp-2">{application.notes}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

// Complete ApplicationDetailsModal implementation
const ApplicationDetailsModal: React.FC<{
  application: JobApplication;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (app: JobApplication) => void;
}> = ({ application, isOpen, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'contacts' | 'documents'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedApp, setEditedApp] = useState<JobApplication>(application);
  const [newNote, setNewNote] = useState('');

  const handleSave = () => {
    onUpdate(editedApp);
    setIsEditing(false);
    toast.success('Application updated successfully');
  };

  const addTimelineEvent = (event: string, description?: string) => {
    const newEvent = {
      id: `timeline-${Date.now()}`,
      date: new Date(),
      event,
      description,
      type: 'note' as const
    };
    const updatedApp = {
      ...editedApp,
      timeline: [...editedApp.timeline, newEvent]
    };
    setEditedApp(updatedApp);
    onUpdate(updatedApp);
  };

  const addContact = (contact: typeof application.contacts[0]) => {
    const updatedApp = {
      ...editedApp,
      contacts: [...editedApp.contacts, contact]
    };
    setEditedApp(updatedApp);
    onUpdate(updatedApp);
  };

  const statusInfo = statusConfig[application.status];
  const priorityInfo = priorityConfig[application.priority];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedApp.jobTitle}
                  onChange={(e) => setEditedApp({...editedApp, jobTitle: e.target.value})}
                  className="text-xl font-bold border-b border-gray-300 bg-transparent w-full focus:outline-none focus:border-blue-500"
                />
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={editedApp.company}
                    onChange={(e) => setEditedApp({...editedApp, company: e.target.value})}
                    className="border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500"
                    placeholder="Company"
                  />
                  <input
                    type="text"
                    value={editedApp.location}
                    onChange={(e) => setEditedApp({...editedApp, location: e.target.value})}
                    className="border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500"
                    placeholder="Location"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold">{application.jobTitle}</h2>
                <p className="text-muted-foreground">{application.company} • {application.location}</p>
              </div>
            )}
            
            <div className="flex items-center gap-3 mt-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityInfo.color}`}>
                {priorityInfo.label} Priority
              </span>
              {application.appliedDate && (
                <span className="text-sm text-muted-foreground">
                  Applied {format(application.appliedDate, 'MMM d, yyyy')}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
                <Button variant="outline" onClick={onClose}>Close</Button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'timeline', label: 'Timeline' },
              { id: 'contacts', label: 'Contacts' },
              { id: 'documents', label: 'Documents' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="text-lg font-semibold">{statusInfo.label}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Days Since Applied</div>
                  <div className="text-lg font-semibold">
                    {application.appliedDate 
                      ? Math.ceil((new Date().getTime() - application.appliedDate.getTime()) / (1000 * 60 * 60 * 24))
                      : 'N/A'
                    }
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Interviews</div>
                  <div className="text-lg font-semibold">{application.interviews.length}</div>
                </Card>
              </div>

              {/* Job Details */}
              <div>
                <h3 className="font-semibold mb-3">Job Details</h3>
                <div className="space-y-2 text-sm">
                  {application.jobUrl && (
                    <div>
                      <span className="font-medium">Job Posting:</span>{' '}
                      <a href={application.jobUrl} target="_blank" rel="noopener noreferrer" 
                         className="text-primary hover:underline">
                        View Original Posting <ExternalLink className="w-3 h-3 inline ml-1" />
                      </a>
                    </div>
                  )}
                  {application.salary && (
                    <div>
                      <span className="font-medium">Salary Range:</span>{' '}
                      ${application.salary.min?.toLocaleString()} - ${application.salary.max?.toLocaleString()} {application.salary.currency}
                    </div>
                  )}
                  {application.deadline && (
                    <div>
                      <span className="font-medium">Deadline:</span>{' '}
                      <span className={new Date() > application.deadline ? 'text-red-600' : ''}>
                        {format(application.deadline, 'PPP')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="font-semibold mb-3">Notes</h3>
                <div className="bg-muted p-4 rounded-lg">
                  {isEditing ? (
                    <textarea
                      value={editedApp.notes}
                      onChange={(e) => setEditedApp({...editedApp, notes: e.target.value})}
                      rows={4}
                      className="w-full bg-transparent border-0 resize-none focus:outline-none"
                      placeholder="Add your notes about this application..."
                    />
                  ) : (
                    <p className="text-sm">{application.notes || 'No notes added yet.'}</p>
                  )}
                </div>
              </div>

              {/* Upcoming Reminders */}
              {application.reminders.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Upcoming Reminders</h3>
                  <div className="space-y-2">
                    {application.reminders
                      .filter(reminder => !reminder.completed && reminder.date > new Date())
                      .map(reminder => (
                        <div key={reminder.id} className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <Bell className="w-4 h-4 text-yellow-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{reminder.message}</p>
                            <p className="text-xs text-muted-foreground">{format(reminder.date, 'PPP')}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Application Timeline</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="text-sm px-3 py-1 border border-border rounded"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      if (newNote.trim()) {
                        addTimelineEvent('Note added', newNote.trim());
                        setNewNote('');
                      }
                    }}
                    disabled={!newNote.trim()}
                  >
                    Add Note
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {application.timeline
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          event.type === 'applied' ? 'bg-blue-500' :
                          event.type === 'interview' ? 'bg-yellow-500' :
                          event.type === 'offer' ? 'bg-green-500' :
                          event.type === 'rejection' ? 'bg-red-500' :
                          'bg-gray-400'
                        }`} />
                        {index < application.timeline.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{event.event}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(event.date), 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Contacts</h3>
                <ContactForm onAdd={addContact} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {application.contacts.map((contact, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{contact.name}</h4>
                        <p className="text-sm text-muted-foreground">{contact.role}</p>
                        {contact.email && (
                          <p className="text-sm text-blue-600 mt-1">{contact.email}</p>
                        )}
                        {contact.phone && (
                          <p className="text-sm text-muted-foreground">{contact.phone}</p>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
                
                {application.contacts.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No contacts added yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="font-semibold">Related Documents</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {application.documents.resumeId && (
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Resume</h4>
                        <p className="text-sm text-muted-foreground">Used for this application</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                )}
                
                {application.documents.coverLetterId && (
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-green-600" />
                      <div>
                        <h4 className="font-medium">Cover Letter</h4>
                        <p className="text-sm text-muted-foreground">Tailored for this role</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                )}
                
                {application.documents.customDocuments?.map((docId, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-purple-600" />
                      <div>
                        <h4 className="font-medium">Additional Document {index + 1}</h4>
                        <p className="text-sm text-muted-foreground">Supporting material</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
                
                {!application.documents.resumeId && !application.documents.coverLetterId && 
                 (!application.documents.customDocuments || application.documents.customDocuments.length === 0) && (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No documents linked to this application</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

const AddApplicationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (app: JobApplication) => void;
}> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    location: '',
    jobUrl: '',
    status: 'draft' as const,
    priority: 'medium' as const,
    deadline: '',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isParsingUrl, setIsParsingUrl] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.jobUrl && !isValidUrl(formData.jobUrl)) {
      newErrors.jobUrl = 'Please enter a valid URL';
    }

    if (formData.deadline && new Date(formData.deadline) < new Date()) {
      newErrors.deadline = 'Deadline cannot be in the past';
    }

    if (formData.salaryMin && formData.salaryMax) {
      const min = parseInt(formData.salaryMin);
      const max = parseInt(formData.salaryMax);
      if (min >= max) {
        newErrors.salaryMax = 'Maximum salary must be greater than minimum';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const parseJobUrl = async (url: string) => {
    if (!isValidUrl(url)) return;
    
    setIsParsingUrl(true);
    try {
      // Simulate URL parsing - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock parsed data based on common job sites
      if (url.includes('linkedin.com')) {
        setFormData(prev => ({
          ...prev,
          jobTitle: prev.jobTitle || 'Software Engineer',
          company: prev.company || 'Tech Company',
          location: prev.location || 'San Francisco, CA'
        }));
      } else if (url.includes('indeed.com')) {
        setFormData(prev => ({
          ...prev,
          jobTitle: prev.jobTitle || 'Frontend Developer',
          company: prev.company || 'Startup Inc',
          location: prev.location || 'Remote'
        }));
      }
      
      toast.success('Job details extracted from URL');
    } catch (error) {
      toast.error('Failed to parse job URL');
    } finally {
      setIsParsingUrl(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    const newApplication: JobApplication = {
      id: Date.now().toString(),
      jobTitle: formData.jobTitle.trim(),
      company: formData.company.trim(),
      location: formData.location.trim(),
      jobUrl: formData.jobUrl.trim() || undefined,
      status: formData.status,
      priority: formData.priority,
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
      salary: formData.salaryMin || formData.salaryMax ? {
        min: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        max: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        currency: formData.currency
      } : undefined,
      notes: formData.notes.trim(),
      documents: {},
      contacts: [],
      interviews: [],
      timeline: [{
        id: Date.now().toString(),
        date: new Date(),
        event: 'Application Created',
        description: 'Application added to tracker'
      }]
    };

    onAdd(newApplication);
    handleReset();
    onClose();
    toast.success('Application added successfully');
  };

  const handleReset = () => {
    setFormData({
      jobTitle: '',
      company: '',
      location: '',
      jobUrl: '',
      status: 'draft',
      priority: 'medium',
      deadline: '',
      salaryMin: '',
      salaryMax: '',
      currency: 'USD',
      notes: ''
    });
    setErrors({});
  };

  const handleUrlBlur = () => {
    if (formData.jobUrl && isValidUrl(formData.jobUrl)) {
      parseJobUrl(formData.jobUrl);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Add New Application">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Parser Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Job Posting URL (Optional)
          </label>
          <div className="relative">
            <input
              type="url"
              value={formData.jobUrl}
              onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
              onBlur={handleUrlBlur}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.jobUrl ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://company.com/jobs/position"
            />
            {isParsingUrl && (
              <div className="absolute right-3 top-2">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>
          {errors.jobUrl && <p className="text-sm text-red-600">{errors.jobUrl}</p>}
          <p className="text-xs text-gray-500">
            Paste a job URL to automatically extract job details
          </p>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              required
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.jobTitle ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Software Engineer"
            />
            {errors.jobTitle && <p className="text-sm text-red-600">{errors.jobTitle}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company *
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.company ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Acme Corp"
            />
            {errors.company && <p className="text-sm text-red-600">{errors.company}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="San Francisco, CA or Remote"
            />
            {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Application Deadline
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.deadline ? 'border-red-500' : 'border-gray-300'
              }`}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.deadline && <p className="text-sm text-red-600">{errors.deadline}</p>}
          </div>
        </div>

        {/* Status and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Salary Information */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Salary Range (Optional)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <input
                type="number"
                value={formData.salaryMin}
                onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
                min="0"
              />
            </div>
            <div>
              <input
                type="number"
                value={formData.salaryMax}
                onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.salaryMax ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Max"
                min="0"
              />
              {errors.salaryMax && <p className="text-sm text-red-600">{errors.salaryMax}</p>}
            </div>
            <div>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Additional notes about this application..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit" disabled={isParsingUrl}>
            {isParsingUrl ? 'Parsing URL...' : 'Add Application'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Contact Form Component
const ContactForm: React.FC<{
  onAdd: (contact: { name: string; email?: string; phone?: string; role?: string }) => void;
}> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Contact name is required');
      return;
    }

    onAdd({
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      role: formData.role || undefined
    });

    setFormData({ name: '', email: '', phone: '', role: '' });
    setIsOpen(false);
    toast.success('Contact added successfully');
  };

  const handleCancel = () => {
    setFormData({ name: '', email: '', phone: '', role: '' });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button size="sm" onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4 mr-1" />
        Add Contact
      </Button>
    );
  }

  return (
    <Card className="p-4 border-2 border-dashed border-gray-300">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h4 className="font-medium">Add New Contact</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Smith"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role/Title
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Hiring Manager"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="john@company.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Add Contact
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ApplicationTracker;