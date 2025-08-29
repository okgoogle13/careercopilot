import React, { useState, useEffect } from 'react';
import { useAuthStatus } from '../hooks';
import { Button, Card, CardHeader, CardTitle, CardContent, LoadingSpinner } from '../components/ui';
import toast from 'react-hot-toast';

interface OpportunityType {
  id: string;
  title: string;
  company: string;
  deadline?: string;
  source_url: string;
  calendarEventId?: string;
  calendar_synced?: boolean;
  found_at?: string;
}

interface StatsType {
  total_opportunities: number;
  calendar_synced: number;
  recent_opportunities: number;
  sync_percentage: number;
}

// Icons
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const StatsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const OpportunitiesPage: React.FC = () => {
  const { isAuthenticated, isLoading, error: authError, requireAuth, getAuthToken } = useAuthStatus();
  const [opportunities, setOpportunities] = useState<OpportunityType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsType | null>(null);
  const [discovering, setDiscovering] = useState<boolean>(false);
  const [creatingEvent, setCreatingEvent] = useState<string | null>(null);

  const fetchOpportunities = async () => {
    if (!requireAuth()) return;
    
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        setError('Unable to get authentication token');
        return;
      }
      
      const response = await fetch('/api/v1/opportunities', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setOpportunities(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch opportunities');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!requireAuth()) return;
    
    try {
      const token = getAuthToken();
      if (!token) return;
      
      const response = await fetch('/api/v1/opportunities/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const discoverOpportunities = async () => {
    if (!requireAuth()) return;
    
    try {
      setDiscovering(true);
      const token = getAuthToken();
      if (!token) {
        toast.error('Unable to get authentication token');
        return;
      }
      
      const response = await fetch('/api/v1/opportunities/discover', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ auto_scan: true, max_emails: 50 }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(`Found ${result.opportunities_found} new opportunities!`);
        await fetchOpportunities();
        await fetchStats();
      } else {
        toast.error('Job discovery failed');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to discover opportunities');
    } finally {
      setDiscovering(false);
    }
  };

  const createCalendarEvent = async (opportunity: OpportunityType) => {
    if (!requireAuth() || !opportunity.deadline) return;
    
    try {
      setCreatingEvent(opportunity.id);
      const token = getAuthToken();
      if (!token) {
        toast.error('Unable to get authentication token');
        return;
      }
      
      const response = await fetch('/api/v1/opportunities/calendar/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          opportunity_id: opportunity.id,
          title: opportunity.title,
          company: opportunity.company,
          deadline: opportunity.deadline,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Calendar event created successfully!');
        await fetchOpportunities();
        await fetchStats();
      } else {
        toast.error('Failed to create calendar event');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create calendar event');
    } finally {
      setCreatingEvent(null);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOpportunities();
      fetchStats();
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground">Please log in to view your job opportunities.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Job Opportunities</h1>
        <p className="text-muted-foreground">
          Automatically discovered job opportunities from your emails
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <StatsIcon />
                <div>
                  <p className="text-2xl font-bold text-primary">{stats.total_opportunities}</p>
                  <p className="text-sm text-muted-foreground">Total Opportunities</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <CalendarIcon />
                <div>
                  <p className="text-2xl font-bold text-accent">{stats.calendar_synced}</p>
                  <p className="text-sm text-muted-foreground">Calendar Synced</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <SearchIcon />
                <div>
                  <p className="text-2xl font-bold text-chart-3">{stats.recent_opportunities}</p>
                  <p className="text-sm text-muted-foreground">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <RefreshIcon />
                <div>
                  <p className="text-2xl font-bold text-chart-4">{Math.round(stats.sync_percentage)}%</p>
                  <p className="text-sm text-muted-foreground">Sync Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button 
          onClick={discoverOpportunities} 
          disabled={discovering}
          className="flex items-center space-x-2"
        >
          {discovering ? (
            <LoadingSpinner size="sm" />
          ) : (
            <SearchIcon />
          )}
          <span>{discovering ? 'Discovering...' : 'Discover New Opportunities'}</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={fetchOpportunities}
          className="flex items-center space-x-2"
        >
          <RefreshIcon />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Opportunities List */}
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="text-center p-8">
            <p className="text-destructive">{error}</p>
            <Button onClick={fetchOpportunities} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : opportunities.length === 0 ? (
        <Card>
          <CardContent className="text-center p-8">
            <SearchIcon />
            <h3 className="text-lg font-semibold mb-2">No Opportunities Found</h3>
            <p className="text-muted-foreground mb-4">
              Click "Discover New Opportunities" to scan your emails for job postings.
            </p>
            <Button onClick={discoverOpportunities} disabled={discovering}>
              {discovering ? 'Discovering...' : 'Start Discovery'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opportunity) => (
            <Card key={opportunity.id} className="hover-lift animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                <p className="text-muted-foreground">{opportunity.company}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {opportunity.deadline && (
                    <div className="flex items-center space-x-2 text-sm">
                      <CalendarIcon />
                      <span>Deadline: {opportunity.deadline}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <a
                      href={opportunity.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      View Original
                    </a>
                    
                    {opportunity.calendar_synced ? (
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        ✓ Calendar Synced
                      </span>
                    ) : opportunity.deadline ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => createCalendarEvent(opportunity)}
                        disabled={creatingEvent === opportunity.id}
                        className="text-xs"
                      >
                        {creatingEvent === opportunity.id ? (
                          <LoadingSpinner size="xs" />
                        ) : (
                          <>
                            <CalendarIcon />
                            <span className="ml-1">Add to Calendar</span>
                          </>
                        )}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OpportunitiesPage;