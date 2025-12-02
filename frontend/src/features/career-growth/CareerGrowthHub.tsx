/**
 * ELECTRIC ALCHEMIST: CAREER GROWTH HUB FEATURE
 *
 * Career growth hub with learning paths and skill development.
 */

import React from 'react';
import { TrendingUp, BookOpen, Target, Award } from 'lucide-react';
import { Card } from '@/components';
import { Button } from '@/components/electric/button';

export function CareerGrowthHub() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-hero text-3xl font-bold text-on-surface mb-2">
          Career Growth Hub
        </h2>
        <p className="text-human text-base text-on-surface-variant">
          Develop your skills and advance your career
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6" variant="interactive">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-primary-container rounded-[16px]">
              <BookOpen className="h-6 w-6 text-on-primary-container" />
            </div>
            <div className="flex-1">
              <h3 className="text-hero text-xl font-semibold text-on-surface mb-2">
                Learning Paths
              </h3>
              <p className="text-human text-sm text-on-surface-variant mb-4">
                Structured courses to build your skills
              </p>
              <Button variant="outline" size="sm">
                Explore Paths
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6" variant="interactive">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-secondary-container rounded-[16px]">
              <Target className="h-6 w-6 text-on-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="text-hero text-xl font-semibold text-on-surface mb-2">
                Skill Assessment
              </h3>
              <p className="text-human text-sm text-on-surface-variant mb-4">
                Evaluate your current skill level
              </p>
              <Button variant="outline" size="sm">
                Take Assessment
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6" variant="interactive">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-tertiary-container rounded-[16px]">
              <TrendingUp className="h-6 w-6 text-on-tertiary" />
            </div>
            <div className="flex-1">
              <h3 className="text-hero text-xl font-semibold text-on-surface mb-2">
                Career Insights
              </h3>
              <p className="text-human text-sm text-on-surface-variant mb-4">
                AI-powered career recommendations
              </p>
              <Button variant="outline" size="sm">
                View Insights
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6" variant="interactive">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-primary-container rounded-[16px]">
              <Award className="h-6 w-6 text-on-primary-container" />
            </div>
            <div className="flex-1">
              <h3 className="text-hero text-xl font-semibold text-on-surface mb-2">
                Achievements
              </h3>
              <p className="text-human text-sm text-on-surface-variant mb-4">
                Track your career milestones
              </p>
              <Button variant="outline" size="sm">
                View Achievements
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default CareerGrowthHub;

