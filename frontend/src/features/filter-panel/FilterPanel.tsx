/**
 * ELECTRIC ALCHEMIST: FILTER PANEL FEATURE
 *
 * Filter panel with checkboxes, radio groups, and sliders.
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Card } from '@/components';
import { Checkbox } from '@/components/electric';
import { RadioGroup, RadioGroupItem } from '@/components/electric';
import { Slider } from '@/components/electric';
import { Button } from '@/components/electric/button';
import { Separator } from '@/components/electric';

interface FilterPanelProps {
  onClose?: () => void;
  onApply?: (filters: FilterState) => void;
}

interface FilterState {
  jobTypes: string[];
  locations: string[];
  salaryRange: number;
  experienceLevel: string;
}

export function FilterPanel({ onClose, onApply }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    jobTypes: [],
    locations: [],
    salaryRange: 50,
    experienceLevel: '',
  });

  const handleJobTypeChange = (type: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      jobTypes: checked
        ? [...prev.jobTypes, type]
        : prev.jobTypes.filter((t) => t !== type),
    }));
  };

  const handleLocationChange = (location: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      locations: checked
        ? [...prev.locations, location]
        : prev.locations.filter((l) => l !== location),
    }));
  };

  const handleApply = () => {
    onApply?.(filters);
  };

  const handleReset = () => {
    setFilters({
      jobTypes: [],
      locations: [],
      salaryRange: 50,
      experienceLevel: '',
    });
  };

  return (
    <Card className="p-6 w-full max-w-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-hero text-xl font-semibold text-on-surface">Filters</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container-low transition-colors"
          >
            <X className="h-5 w-5 text-on-surface-variant" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Job Type */}
        <div>
          <h3 className="text-hero text-sm font-medium text-on-surface mb-3">Job Type</h3>
          <div className="space-y-2">
            {['Full-time', 'Part-time', 'Contract', 'Remote'].map((type) => (
              <Checkbox
                key={type}
                label={type}
                checked={filters.jobTypes.includes(type)}
                onChange={(e) => handleJobTypeChange(type, e.target.checked)}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Location */}
        <div>
          <h3 className="text-hero text-sm font-medium text-on-surface mb-3">Location</h3>
          <div className="space-y-2">
            {['Sydney', 'Melbourne', 'Brisbane', 'Remote'].map((location) => (
              <Checkbox
                key={location}
                label={location}
                checked={filters.locations.includes(location)}
                onChange={(e) => handleLocationChange(location, e.target.checked)}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Salary Range */}
        <div>
          <h3 className="text-hero text-sm font-medium text-on-surface mb-3">Salary Range</h3>
          <Slider
            min={0}
            max={150}
            step={10}
            value={filters.salaryRange}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, salaryRange: Number(e.target.value) }))
            }
            showValue
            label={`$${filters.salaryRange}k+`}
          />
        </div>

        <Separator />

        {/* Experience Level */}
        <div>
          <h3 className="text-hero text-sm font-medium text-on-surface mb-3">
            Experience Level
          </h3>
          <RadioGroup
            name="experienceLevel"
            value={filters.experienceLevel}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, experienceLevel: value }))
            }
          >
            <RadioGroupItem value="entry" label="Entry Level" />
            <RadioGroupItem value="mid" label="Mid Level" />
            <RadioGroupItem value="senior" label="Senior Level" />
          </RadioGroup>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Reset
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default FilterPanel;

