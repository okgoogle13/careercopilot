import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft,
  Kanban,
  History,
  Activity,
  Filter,
  BarChart3,
  Sparkles,
  Clock,
  Users,
  Target,
  TrendingUp,
  FileText,
  DollarSign,
  CheckCircle
} from 'lucide-react';

// Import the new components
import { KanbanBoard } from './kanban/KanbanBoard';
import { TimelineView } from './timeline/TimelineView';
import { ActivityFeed } from './activity/ActivityFeed';
import { FilterPanel } from './filter/FilterPanel';
import { StatCard, CompactStatCard, DetailedStatCard, MinimalStatCard } from './cards/StatCard';
import { FeatureCard, CompactFeatureCard, DetailedFeatureCard, MinimalFeatureCard } from './cards/FeatureCard';

interface ComplexComponentsShowcaseProps {
  onBack?: () => void;
}

export const ComplexComponentsShowcase: React.FC<ComplexComponentsShowcaseProps> = ({ onBack }) => {
  const [activeDemo, setActiveDemo] = useState<'overview' | 'kanban' | 'timeline' | 'activity' | 'filter'>('overview');
  const [showFilterPanel, setShowFilterPanel] = useState(true);

  const componentSections = [
    {
      id: 'overview',
      title: 'Component Overview',
      description: 'All new complex components at a glance',
      icon: BarChart3
    },
    {
      id: 'kanban',
      title: 'Kanban Board',
      description: 'Application tracking with drag & drop',
      icon: Kanban
    },
    {
      id: 'timeline',
      title: 'Timeline View',
      description: 'Application history visualization',
      icon: History
    },
    {
      id: 'activity',
      title: 'Activity Feed',
      description: 'Recent user activity tracking',
      icon: Activity
    },
    {
      id: 'filter',
      title: 'Filter Panel',
      description: 'Advanced filtering interface',
      icon: Filter
    }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* StatCard Examples */}
      <div>
        <h2 className="text-xl font-medium text-on-surface mb-4">StatCard Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Applications"
            value="28"
            icon={FileText}
            trend={{ value: 12, label: "this month", timeframe: "vs last month" }}
            status="positive"
            onClick={() => console.log('Clicked total applications')}
          />
          <CompactStatCard
            title="ATS Score"
            value="87%"
            icon={Target}
            trend={{ value: 5 }}
            status="positive"
          />
          <DetailedStatCard
            title="Interview Rate"
            value="24%"
            subtitle="6 of 25 applications"
            icon={Users}
            trend={{ value: -3, label: "interviews", timeframe: "last 30 days" }}
            status="warning"
          >
            <div className="text-xs text-on-surface-variant">
              Average response time: 5 days
            </div>
          </DetailedStatCard>
          <MinimalStatCard
            title="Salary Range"
            value="$120k"
            subtitle="Average target"
            icon={DollarSign}
          />
        </div>
      </div>

      {/* FeatureCard Examples */}
      <div>
        <h2 className="text-xl font-medium text-on-surface mb-4">FeatureCard Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            title="AI Resume Builder"
            description="Create professional resumes with AI-powered suggestions and optimization"
            icon={Sparkles}
            iconColor="text-brand-primary"
            status="available"
            onClick={() => console.log('AI Resume Builder clicked')}
            features={[
              "Smart content suggestions",
              "ATS optimization",
              "Multiple templates"
            ]}
          />
          <CompactFeatureCard
            title="Interview Prep"
            description="Practice with AI-powered mock interviews"
            icon={Users}
            iconColor="text-brand-tertiary"
            status="new"
            badge={{ text: "Popular", variant: "secondary" }}
          />
          <DetailedFeatureCard
            title="Salary Negotiation"
            description="Get insights and strategies for salary negotiations based on market data"
            icon={TrendingUp}
            iconColor="text-brand-secondary"
            status="premium"
            features={[
              "Market salary analysis",
              "Negotiation scripts",
              "Success tracking",
              "Industry benchmarks"
            ]}
            onLearnMore={() => console.log('Learn more clicked')}
          />
          <MinimalFeatureCard
            title="Cover Letter AI"
            description="Generate personalized cover letters"
            icon={FileText}
            status="beta"
          />
          <FeatureCard
            title="Job Matching"
            description="Find jobs that match your skills and preferences using AI"
            icon={Target}
            iconColor="text-aurora-tertiary"
            status="coming-soon"
            badge={{ text: "Q2 2024", variant: "outline" }}
          />
          <CompactFeatureCard
            title="Portfolio Builder"
            description="Showcase your work professionally"
            icon={CheckCircle}
            status="available"
            href="https://example.com"
          />
        </div>
      </div>

      {/* Activity Feed Compact Example */}
      <div>
        <h2 className="text-xl font-medium text-on-surface mb-4">Activity Feed (Compact)</h2>
        <Card className="p-4">
          <ActivityFeed 
            isCompact={true} 
            maxItems={5} 
            showHeader={false}
            onViewAll={() => setActiveDemo('activity')}
          />
        </Card>
      </div>

      {/* Loading States */}
      <div>
        <h2 className="text-xl font-medium text-on-surface mb-4">Loading & Error States</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Loading Example"
            value="--"
            loading={true}
          />
          <StatCard
            title="Error Example"
            value="--"
            error={true}
            onInfoClick={() => console.log('Error info clicked')}
          />
          <FeatureCard
            title="Loading Feature"
            description="This feature is being loaded..."
            loading={true}
          />
          <StatCard
            title="Disabled State"
            value="N/A"
            disabled={true}
            icon={Clock}
          />
        </div>
      </div>
    </div>
  );

  const renderComponentDemo = () => {
    switch (activeDemo) {
      case 'kanban':
        return <KanbanBoard onBack={() => setActiveDemo('overview')} />;
      case 'timeline':
        return <TimelineView onBack={() => setActiveDemo('overview')} />;
      case 'activity':
        return <ActivityFeed className="p-6" />;
      case 'filter':
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-medium text-on-surface mb-1">Filter Panel Demo</h2>
                <p className="text-sm text-on-surface-variant">
                  Interactive filtering interface for document library
                </p>
              </div>
              <Button variant="outline" onClick={() => setActiveDemo('overview')}>
                Back to Overview
              </Button>
            </div>
            <div className="flex gap-6">
              <FilterPanel 
                isOpen={showFilterPanel}
                onClose={() => setShowFilterPanel(false)}
                onFiltersChange={(filters) => console.log('Filters changed:', filters)}
              />
              <div className="flex-1">
                <Card className="p-8 text-center">
                  <FileText className="w-16 h-16 text-on-surface-variant/40 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-on-surface mb-2">
                    Document Library Content
                  </h3>
                  <p className="text-on-surface-variant mb-4">
                    This area would show filtered documents based on the selected criteria.
                  </p>
                  {!showFilterPanel && (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowFilterPanel(true)}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Show Filters
                    </Button>
                  )}
                </Card>
              </div>
            </div>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  if (activeDemo !== 'overview') {
    return renderComponentDemo();
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface/80 backdrop-blur-lg border-b border-outline-variant">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-medium text-on-surface mb-1">
                  Complex Components Showcase
                </h1>
                <p className="text-on-surface-variant">
                  Advanced Material 3 Aurora components for career applications
                </p>
              </div>
            </div>
            <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20">
              5 New Components
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="p-6">
        <div className="flex gap-2 mb-6">
          {componentSections.map(section => {
            const Icon = section.icon;
            return (
              <Button
                key={section.id}
                variant={activeDemo === section.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveDemo(section.id as any)}
                className={`
                  flex items-center gap-2
                  ${activeDemo === section.id ? "btn-gradient" : ""}
                `}
              >
                <Icon className="w-4 h-4" />
                {section.title}
              </Button>
            );
          })}
        </div>

        {/* Component Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {componentSections.map(section => {
            const Icon = section.icon;
            return (
              <Card 
                key={section.id}
                className={`
                  p-4 cursor-pointer transition-all duration-300
                  ${activeDemo === section.id ? 'card-aurora' : 'card-surface hover:card-surface'}
                `}
                onClick={() => setActiveDemo(section.id as any)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Icon className={`
                      w-6 h-6 
                      ${activeDemo === section.id ? 'text-brand-primary' : 'text-on-surface-variant'}
                    `} />
                    {section.id !== 'overview' && (
                      <Badge variant="secondary" className="text-xs">
                        Interactive
                      </Badge>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-on-surface mb-1">
                      {section.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Separator className="mb-8" />

        {/* Component Demo Content */}
        {renderComponentDemo()}
      </div>
    </div>
  );
};

export default ComplexComponentsShowcase;