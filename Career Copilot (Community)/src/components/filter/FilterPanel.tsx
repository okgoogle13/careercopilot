import React, { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  Calendar as CalendarIcon,
  FileText,
  Briefcase,
  Tag,
  Clock,
  SortAsc,
  RotateCcw,
} from "lucide-react";
import { format } from "date-fns";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
  color?: string;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface FilterState {
  documentTypes: string[];
  tags: string[];
  dateRange: DateRange;
  sortOrder: "newest" | "oldest" | "name-asc" | "name-desc" | "size" | "type";
  status: string[];
  createdBy: string[];
}

const documentTypeOptions: FilterOption[] = [
  { id: "resume", label: "Resume", count: 12, color: "bg-brand-primary" },
  { id: "cover-letter", label: "Cover Letter", count: 8, color: "bg-brand-secondary" },
  { id: "selection-criteria", label: "Selection Criteria", count: 3, color: "bg-brand-tertiary" },
  { id: "portfolio", label: "Portfolio", count: 5, color: "bg-aurora-tertiary" },
];

const tagOptions: FilterOption[] = [
  { id: "frontend", label: "Frontend Development", count: 15 },
  { id: "react", label: "React", count: 12 },
  { id: "typescript", label: "TypeScript", count: 10 },
  { id: "ui-ux", label: "UI/UX Design", count: 8 },
  { id: "leadership", label: "Leadership", count: 6 },
  { id: "startup", label: "Startup Experience", count: 4 },
  { id: "remote", label: "Remote Work", count: 7 },
  { id: "agile", label: "Agile/Scrum", count: 9 },
];

const statusOptions: FilterOption[] = [
  { id: "draft", label: "Draft", count: 3 },
  { id: "active", label: "Active", count: 18 },
  { id: "archived", label: "Archived", count: 5 },
];

const createdByOptions: FilterOption[] = [
  { id: "ai-assistant", label: "AI Assistant", count: 14 },
  { id: "manual", label: "Manual Creation", count: 8 },
  { id: "template", label: "Template Based", count: 6 },
];

interface FilterSectionProps {
  title: string;
  icon: React.ComponentType<any>;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: number;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  badge,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-3 h-auto text-left hover:bg-surface-container-high"
        >
          <div className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-on-surface-variant" />
            <span className="font-medium text-on-surface">{title}</span>
            {badge && badge > 0 && (
              <Badge variant="secondary" className="h-5 px-2 text-xs">
                {badge}
              </Badge>
            )}
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-on-surface-variant" />
          ) : (
            <ChevronDown className="w-4 h-4 text-on-surface-variant" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3">{children}</CollapsibleContent>
    </Collapsible>
  );
};

interface FilterPanelProps {
  onFiltersChange?: (filters: FilterState) => void;
  onClose?: () => void;
  isOpen?: boolean;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  onFiltersChange,
  onClose,
  isOpen = true,
  className = "",
}) => {
  const [filters, setFilters] = useState<FilterState>({
    documentTypes: [],
    tags: [],
    dateRange: { from: undefined, to: undefined },
    sortOrder: "newest",
    status: ["active"],
    createdBy: [],
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const handleDocumentTypeChange = (typeId: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.documentTypes, typeId]
      : filters.documentTypes.filter((id) => id !== typeId);
    updateFilters({ documentTypes: newTypes });
  };

  const handleTagChange = (tagId: string, checked: boolean) => {
    const newTags = checked ? [...filters.tags, tagId] : filters.tags.filter((id) => id !== tagId);
    updateFilters({ tags: newTags });
  };

  const handleStatusChange = (statusId: string, checked: boolean) => {
    const newStatus = checked
      ? [...filters.status, statusId]
      : filters.status.filter((id) => id !== statusId);
    updateFilters({ status: newStatus });
  };

  const handleCreatedByChange = (createdById: string, checked: boolean) => {
    const newCreatedBy = checked
      ? [...filters.createdBy, createdById]
      : filters.createdBy.filter((id) => id !== createdById);
    updateFilters({ createdBy: newCreatedBy });
  };

  const handleDateRangeChange = (range: DateRange) => {
    updateFilters({ dateRange: range });
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      documentTypes: [],
      tags: [],
      dateRange: { from: undefined, to: undefined },
      sortOrder: "newest",
      status: [],
      createdBy: [],
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const clearFilter = (filterType: keyof FilterState, value?: string) => {
    switch (filterType) {
      case "documentTypes":
        updateFilters({
          documentTypes: value ? filters.documentTypes.filter((id) => id !== value) : [],
        });
        break;
      case "tags":
        updateFilters({ tags: value ? filters.tags.filter((id) => id !== value) : [] });
        break;
      case "status":
        updateFilters({ status: value ? filters.status.filter((id) => id !== value) : [] });
        break;
      case "createdBy":
        updateFilters({ createdBy: value ? filters.createdBy.filter((id) => id !== value) : [] });
        break;
      case "dateRange":
        updateFilters({ dateRange: { from: undefined, to: undefined } });
        break;
    }
  };

  const getActiveFiltersCount = () => {
    return (
      filters.documentTypes.length +
      filters.tags.length +
      filters.status.length +
      filters.createdBy.length +
      (filters.dateRange.from || filters.dateRange.to ? 1 : 0)
    );
  };

  const hasActiveFilters = getActiveFiltersCount() > 0;

  if (!isOpen) return null;

  return (
    <Card className={`w-80 h-fit card-surface ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-brand-primary" />
          <h2 className="font-medium text-on-surface">Filters</h2>
          {hasActiveFilters && (
            <Badge
              variant="secondary"
              className="bg-brand-primary/10 text-brand-primary border-brand-primary/20"
            >
              {getActiveFiltersCount()}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 px-2 text-xs text-on-surface-variant hover:text-on-surface"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Clear
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="divide-y divide-outline-variant">
        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="p-4">
            <div className="flex flex-wrap gap-1">
              {filters.documentTypes.map((typeId) => {
                const option = documentTypeOptions.find((opt) => opt.id === typeId);
                return option ? (
                  <Badge
                    key={typeId}
                    variant="secondary"
                    className="bg-brand-primary/10 text-brand-primary border-brand-primary/20"
                  >
                    {option.label}
                    <button
                      onClick={() => clearFilter("documentTypes", typeId)}
                      className="ml-1 hover:bg-brand-primary/20 rounded-full p-0.5"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </Badge>
                ) : null;
              })}

              {filters.tags.map((tagId) => {
                const option = tagOptions.find((opt) => opt.id === tagId);
                return option ? (
                  <Badge
                    key={tagId}
                    variant="secondary"
                    className="bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20"
                  >
                    {option.label}
                    <button
                      onClick={() => clearFilter("tags", tagId)}
                      className="ml-1 hover:bg-brand-secondary/20 rounded-full p-0.5"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </Badge>
                ) : null;
              })}

              {filters.status.map((statusId) => {
                const option = statusOptions.find((opt) => opt.id === statusId);
                return option ? (
                  <Badge
                    key={statusId}
                    variant="secondary"
                    className="bg-brand-tertiary/10 text-brand-tertiary border-brand-tertiary/20"
                  >
                    {option.label}
                    <button
                      onClick={() => clearFilter("status", statusId)}
                      className="ml-1 hover:bg-brand-tertiary/20 rounded-full p-0.5"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </Badge>
                ) : null;
              })}

              {(filters.dateRange.from || filters.dateRange.to) && (
                <Badge
                  variant="secondary"
                  className="bg-aurora-tertiary/10 text-brand-tertiary border-brand-tertiary/20"
                >
                  Date Range
                  <button
                    onClick={() => clearFilter("dateRange")}
                    className="ml-1 hover:bg-brand-tertiary/20 rounded-full p-0.5"
                  >
                    <X className="w-2 h-2" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Document Type Filter */}
        <FilterSection
          title="Document Type"
          icon={FileText}
          badge={filters.documentTypes.length}
          defaultOpen={true}
        >
          <div className="space-y-3 mt-3">
            {documentTypeOptions.map((option) => (
              <div key={option.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`type-${option.id}`}
                    checked={filters.documentTypes.includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleDocumentTypeChange(option.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`type-${option.id}`}
                    className="flex items-center gap-2 text-sm font-normal cursor-pointer"
                  >
                    <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                    {option.label}
                  </Label>
                </div>
                {option.count && (
                  <span className="text-xs text-on-surface-variant">{option.count}</span>
                )}
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Status Filter */}
        <FilterSection title="Status" icon={Clock} badge={filters.status.length}>
          <div className="space-y-3 mt-3">
            {statusOptions.map((option) => (
              <div key={option.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`status-${option.id}`}
                    checked={filters.status.includes(option.id)}
                    onCheckedChange={(checked) => handleStatusChange(option.id, checked as boolean)}
                  />
                  <Label
                    htmlFor={`status-${option.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
                {option.count && (
                  <span className="text-xs text-on-surface-variant">{option.count}</span>
                )}
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Tags Filter */}
        <FilterSection title="Tags" icon={Tag} badge={filters.tags.length}>
          <div className="space-y-3 mt-3 max-h-48 overflow-y-auto">
            {tagOptions.map((option) => (
              <div key={option.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`tag-${option.id}`}
                    checked={filters.tags.includes(option.id)}
                    onCheckedChange={(checked) => handleTagChange(option.id, checked as boolean)}
                  />
                  <Label
                    htmlFor={`tag-${option.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
                {option.count && (
                  <span className="text-xs text-on-surface-variant">{option.count}</span>
                )}
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Date Range Filter */}
        <FilterSection
          title="Date Modified"
          icon={CalendarIcon}
          badge={filters.dateRange.from || filters.dateRange.to ? 1 : 0}
        >
          <div className="mt-3">
            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                        {format(filters.dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(filters.dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange.from}
                  selected={{
                    from: filters.dateRange.from,
                    to: filters.dateRange.to,
                  }}
                  onSelect={(range) => {
                    handleDateRangeChange({
                      from: range?.from,
                      to: range?.to,
                    });
                    if (range?.from && range?.to) {
                      setShowDatePicker(false);
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </FilterSection>

        {/* Created By Filter */}
        <FilterSection title="Created By" icon={Briefcase} badge={filters.createdBy.length}>
          <div className="space-y-3 mt-3">
            {createdByOptions.map((option) => (
              <div key={option.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`created-${option.id}`}
                    checked={filters.createdBy.includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleCreatedByChange(option.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`created-${option.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
                {option.count && (
                  <span className="text-xs text-on-surface-variant">{option.count}</span>
                )}
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Sort Order */}
        <FilterSection title="Sort Order" icon={SortAsc}>
          <div className="mt-3">
            <RadioGroup
              value={filters.sortOrder}
              onValueChange={(value) => updateFilters({ sortOrder: value as any })}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="newest" id="sort-newest" />
                <Label htmlFor="sort-newest" className="text-sm font-normal">
                  Newest First
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oldest" id="sort-oldest" />
                <Label htmlFor="sort-oldest" className="text-sm font-normal">
                  Oldest First
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="name-asc" id="sort-name-asc" />
                <Label htmlFor="sort-name-asc" className="text-sm font-normal">
                  Name A-Z
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="name-desc" id="sort-name-desc" />
                <Label htmlFor="sort-name-desc" className="text-sm font-normal">
                  Name Z-A
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="size" id="sort-size" />
                <Label htmlFor="sort-size" className="text-sm font-normal">
                  File Size
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="type" id="sort-type" />
                <Label htmlFor="sort-type" className="text-sm font-normal">
                  Document Type
                </Label>
              </div>
            </RadioGroup>
          </div>
        </FilterSection>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-outline-variant">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="flex-1"
            disabled={!hasActiveFilters}
          >
            Clear All
          </Button>
          <Button
            size="sm"
            className="flex-1 btn-gradient"
            onClick={() => console.log("Apply filters:", filters)}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FilterPanel;
