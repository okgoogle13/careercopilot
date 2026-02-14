import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Chip,
  Collapse,
  IconButton,
  Divider,
  alpha,
} from "@mui/material";
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
  { id: "resume", label: "Resume", count: 12, color: "primary" },
  { id: "cover-letter", label: "Cover Letter", count: 8, color: "secondary" },
  { id: "selection-criteria", label: "Selection Criteria", count: 3, color: "tertiary" },
  { id: "portfolio", label: "Portfolio", count: 5, color: "tertiary" },
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
    <Box>
      <Button
        fullWidth
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          justifyContent: "space-between",
          p: 2,
          textTransform: "none",
          color: "text.primary",
          "&:hover": {
            bgcolor: "surface.containerHigh",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Icon size={16} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {badge && badge > 0 && (
            <Chip
              label={badge}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.75rem",
              }}
            />
          )}
        </Box>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </Button>
      <Collapse in={isOpen}>
        <Box sx={{ px: 2, pb: 2 }}>{children}</Box>
      </Collapse>
    </Box>
  );
};

export interface FilterPanelProps {
  onFiltersChange?: (filters: FilterState) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  onFiltersChange,
  onClose,
  isOpen = true,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    documentTypes: [],
    tags: [],
    dateRange: { from: undefined, to: undefined },
    sortOrder: "newest",
    status: ["active"],
    createdBy: [],
  });

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
    <Card
      variant="glass"
      sx={{
        width: 320,
        height: "fit-content",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: 1,
          borderColor: "outline.variant",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Filter size={20} color="#A78BFA" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filters
          </Typography>
          {hasActiveFilters && (
            <Chip
              label={getActiveFiltersCount()}
              size="small"
              sx={{
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
                border: 1,
                borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
              }}
            />
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {hasActiveFilters && (
            <Button
              variant="text"
              size="small"
              startIcon={<RotateCcw size={12} />}
              onClick={clearAllFilters}
              sx={{
                fontSize: "0.75rem",
                color: "text.secondary",
                textTransform: "none",
              }}
            >
              Clear
            </Button>
          )}
          {onClose && (
            <IconButton size="small" onClick={onClose}>
              <X size={16} />
            </IconButton>
          )}
        </Box>
      </Box>

      <Box>
        {/* Active Filters */}
        {hasActiveFilters && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {filters.documentTypes.map((typeId) => {
                const option = documentTypeOptions.find((opt) => opt.id === typeId);
                return option ? (
                  <Chip
                    key={typeId}
                    label={option.label}
                    size="small"
                    onDelete={() => clearFilter("documentTypes", typeId)}
                    deleteIcon={<X size={12} />}
                    sx={{
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      color: "primary.main",
                      border: 1,
                      borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                    }}
                  />
                ) : null;
              })}

              {filters.tags.map((tagId) => {
                const option = tagOptions.find((opt) => opt.id === tagId);
                return option ? (
                  <Chip
                    key={tagId}
                    label={option.label}
                    size="small"
                    onDelete={() => clearFilter("tags", tagId)}
                    deleteIcon={<X size={12} />}
                    sx={{
                      bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1),
                      color: "secondary.main",
                      border: 1,
                      borderColor: (theme) => alpha(theme.palette.secondary.main, 0.2),
                    }}
                  />
                ) : null;
              })}

              {filters.status.map((statusId) => {
                const option = statusOptions.find((opt) => opt.id === statusId);
                return option ? (
                  <Chip
                    key={statusId}
                    label={option.label}
                    size="small"
                    onDelete={() => clearFilter("status", statusId)}
                    deleteIcon={<X size={12} />}
                    sx={{
                      bgcolor: (theme) => alpha(theme.palette.tertiary.main, 0.1),
                      color: "tertiary.main",
                      border: 1,
                      borderColor: (theme) => alpha(theme.palette.tertiary.main, 0.2),
                    }}
                  />
                ) : null;
              })}

              {(filters.dateRange.from || filters.dateRange.to) && (
                <Chip
                  label="Date Range"
                  size="small"
                  onDelete={() => clearFilter("dateRange")}
                  deleteIcon={<X size={12} />}
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.tertiary.main, 0.1),
                    color: "tertiary.main",
                    border: 1,
                    borderColor: (theme) => alpha(theme.palette.tertiary.main, 0.2),
                  }}
                />
              )}
            </Box>
          </Box>
        )}

        <Divider />

        {/* Document Type Filter */}
        <FilterSection
          title="Document Type"
          icon={FileText}
          badge={filters.documentTypes.length}
          defaultOpen={true}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
            {documentTypeOptions.map((option) => (
              <Box
                key={option.id}
                sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.documentTypes.includes(option.id)}
                      onChange={(e) => handleDocumentTypeChange(option.id, e.target.checked)}
                      size="small"
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: `${option.color}.main`,
                        }}
                      />
                      <Typography variant="body2">{option.label}</Typography>
                    </Box>
                  }
                />
                {option.count && (
                  <Typography variant="caption" color="text.secondary">
                    {option.count}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </FilterSection>

        <Divider />

        {/* Status Filter */}
        <FilterSection title="Status" icon={Clock} badge={filters.status.length}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
            {statusOptions.map((option) => (
              <Box
                key={option.id}
                sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.status.includes(option.id)}
                      onChange={(e) => handleStatusChange(option.id, e.target.checked)}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">{option.label}</Typography>}
                />
                {option.count && (
                  <Typography variant="caption" color="text.secondary">
                    {option.count}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </FilterSection>

        <Divider />

        {/* Tags Filter */}
        <FilterSection title="Tags" icon={Tag} badge={filters.tags.length}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              mt: 2,
              maxHeight: 192,
              overflowY: "auto",
            }}
          >
            {tagOptions.map((option) => (
              <Box
                key={option.id}
                sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.tags.includes(option.id)}
                      onChange={(e) => handleTagChange(option.id, e.target.checked)}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">{option.label}</Typography>}
                />
                {option.count && (
                  <Typography variant="caption" color="text.secondary">
                    {option.count}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </FilterSection>

        <Divider />

        {/* Created By Filter */}
        <FilterSection title="Created By" icon={Briefcase} badge={filters.createdBy.length}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
            {createdByOptions.map((option) => (
              <Box
                key={option.id}
                sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.createdBy.includes(option.id)}
                      onChange={(e) => handleCreatedByChange(option.id, e.target.checked)}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">{option.label}</Typography>}
                />
                {option.count && (
                  <Typography variant="caption" color="text.secondary">
                    {option.count}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </FilterSection>

        <Divider />

        {/* Sort Order */}
        <FilterSection title="Sort Order" icon={SortAsc}>
          <Box sx={{ mt: 2 }}>
            <RadioGroup
              value={filters.sortOrder}
              onChange={(e) => updateFilters({ sortOrder: e.target.value as any })}
            >
              <FormControlLabel
                value="newest"
                control={<Radio size="small" />}
                label="Newest First"
              />
              <FormControlLabel
                value="oldest"
                control={<Radio size="small" />}
                label="Oldest First"
              />
              <FormControlLabel
                value="name-asc"
                control={<Radio size="small" />}
                label="Name A-Z"
              />
              <FormControlLabel
                value="name-desc"
                control={<Radio size="small" />}
                label="Name Z-A"
              />
              <FormControlLabel value="size" control={<Radio size="small" />} label="File Size" />
              <FormControlLabel
                value="type"
                control={<Radio size="small" />}
                label="Document Type"
              />
            </RadioGroup>
          </Box>
        </FilterSection>
      </Box>

      {/* Footer Actions */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "outline.variant",
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={clearAllFilters}
            disabled={!hasActiveFilters}
            sx={{ flex: 1 }}
          >
            Clear All
          </Button>
          <Button
            variant="aurora"
            size="small"
            onClick={() => console.log("Apply filters:", filters)}
            sx={{ flex: 1 }}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default FilterPanel;
