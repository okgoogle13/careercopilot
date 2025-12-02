/**
 * ELECTRIC ALCHEMIST: CAREER INTELLIGENCE FEATURE
 *
 * AI-powered career intelligence and market insights.
 */

import React from 'react';
import { Brain, BarChart3, Lightbulb, TrendingUp } from 'lucide-react';
import { Card } from '@/components';
import { Button } from '@/components/electric/button';

export function CareerIntelligence() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-hero text-3xl font-bold text-on-surface mb-2">
          Career Intelligence
        </h2>
        <p className="text-human text-base text-on-surface-variant">
          AI-powered insights to guide your career decisions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6" variant="interactive">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-container rounded-[16px]">
              <Brain className="h-6 w-6 text-on-primary-container" />
            </div>
            <div className="flex-1">
              <h3 className="text-hero text-xl font-semibold text-on-surface mb-2">
                Market Analysis
              </h3>
              <p className="text-human text-sm text-on-surface-variant mb-4">
                Understand job market trends and demand
              </p>
              <Button variant="outline" size="sm">
                View Analysis
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6" variant="interactive">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-secondary-container rounded-[16px]">
              <BarChart3 className="h-6 w-6 text-on-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="text-hero text-xl font-semibold text-on-surface mb-2">
                Salary Insights
              </h3>
              <p className="text-human text-sm text-on-surface-variant mb-4">
                Compare salaries across roles and locations
              </p>
              <Button variant="outline" size="sm">
                Explore Salaries
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6" variant="interactive">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-tertiary-container rounded-[16px]">
              <Lightbulb className="h-6 w-6 text-on-tertiary" />
            </div>
            <div className="flex-1">
              <h3 className="text-hero text-xl font-semibold text-on-surface mb-2">
                Career Recommendations
              </h3>
              <p className="text-human text-sm text-on-surface-variant mb-4">
                Personalized career path suggestions
              </p>
              <Button variant="outline" size="sm">
                Get Recommendations
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6" variant="interactive">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-container rounded-[16px]">
              <TrendingUp className="h-6 w-6 text-on-primary-container" />
            </div>
            <div className="flex-1">
              <h3 className="text-hero text-xl font-semibold text-on-surface mb-2">
                Growth Opportunities
              </h3>
              <p className="text-human text-sm text-on-surface-variant mb-4">
                Identify skills to develop for advancement
              </p>
              <Button variant="outline" size="sm">
                View Opportunities
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default CareerIntelligence;

