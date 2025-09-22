import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Collapse,
  IconButton,
  Stack,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { logUserAction } from '@/utils/logger';

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

const FILTER_GROUPS: FilterGroup[] = [
  {
    id: 'status',
    label: 'Application Status',
    options: [
      { id: 'applied', label: 'Applied', count: 12 },
      { id: 'interview', label: 'Interview', count: 5 },
      { id: 'offer', label: 'Offer', count: 2 },
      { id: 'rejected', label: 'Rejected', count: 8 }
    ]
  },
  {
    id: 'priority',
    label: 'Priority Level',
    options: [
      { id: 'high', label: 'High Priority', count: 6 },
      { id: 'medium', label: 'Medium Priority', count: 15 },
      { id: 'low', label: 'Low Priority', count: 6 }
    ]
  },
  {
    id: 'company-size',
    label: 'Company Size',
    options: [
      { id: 'startup', label: 'Startup (1-50)', count: 8 },
      { id: 'medium', label: 'Medium (51-500)', count: 12 },
      { id: 'large', label: 'Large (500+)', count: 7 }
    ]
  }
];

interface FilterPanelProps {
  onFiltersChange?: (filters: Record<string, string[]>) => void;
  onResultsFocus?: () => void;
  className?: string;
}

export function FilterPanel({ onFiltersChange, onResultsFocus, className }: FilterPanelProps) {
  const theme = useTheme();
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['status']));
  const [searchQuery, setSearchQuery] = useState('');

  const resultsAnnouncementRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const getTotalSelectedCount = () => {
    return Object.values(selectedFilters).flat().length;
  };

  const getFilteredResultsCount = () => {
    // Simulate filtered results count based on selected filters
    const baseCount = 27;
    const selectedCount = getTotalSelectedCount();
    return Math.max(1, baseCount - selectedCount * 3);
  };

  const handleFilterChange = (groupId: string, optionId: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const groupFilters = prev[groupId] || [];
      const newGroupFilters = checked
        ? [...groupFilters, optionId]
        : groupFilters.filter(id => id !== optionId);

      const newFilters = {
        ...prev,
        [groupId]: newGroupFilters
      };

      // Remove empty groups
      if (newGroupFilters.length === 0) {
        delete newFilters[groupId];
      }

      // Log the filter change
      logUserAction('filter_applied', {
        groupId,
        optionId,
        checked,
        totalActiveFilters: Object.values(newFilters).flat().length
      });

      return newFilters;
    });
  };

  const handleGroupToggle = (groupId: string) => {
    setExpandedGroups(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(groupId)) {
        newExpanded.delete(groupId);
      } else {
        newExpanded.add(groupId);
      }
      return newExpanded;
    });

    logUserAction('filter_group_toggle', { groupId, expanded: !expandedGroups.has(groupId) });
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    logUserAction('filter_search', { query: event.target.value });
  };

  const handleClearAll = () => {
    setSelectedFilters({});
    setSearchQuery('');
    logUserAction('filters_cleared');

    // Announce clearing to screen readers
    if (resultsAnnouncementRef.current) {
      resultsAnnouncementRef.current.textContent = 'All filters cleared. Showing all 27 results.';
    }

    // Focus back to search input for better UX
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleApplyFilters = () => {
    if (onFiltersChange) {
      onFiltersChange(selectedFilters);
    }

    // Announce results to screen readers
    const resultCount = getFilteredResultsCount();
    if (resultsAnnouncementRef.current) {
      resultsAnnouncementRef.current.textContent = `Filters applied. Showing ${resultCount} result${resultCount !== 1 ? 's' : ''}.`;
    }

    // Move focus to results area after applying filters
    setTimeout(() => {
      if (onResultsFocus) {
        onResultsFocus();
      }
    }, 100);

    logUserAction('filters_applied', {
      filterCount: getTotalSelectedCount(),
      resultCount,
      filters: selectedFilters
    });
  };

  // Update results announcement when filters change
  useEffect(() => {
    if (getTotalSelectedCount() > 0) {
      const resultCount = getFilteredResultsCount();
      setTimeout(() => {
        if (resultsAnnouncementRef.current) {
          resultsAnnouncementRef.current.textContent = `${resultCount} result${resultCount !== 1 ? 's' : ''} match your filters.`;
        }
      }, 500);
    }
  }, [selectedFilters]);

  return (
    <Box sx={{ width: '100%', maxWidth: 384, ...className }}>
      {/* Screen reader announcements */}
      <Box
        ref={resultsAnnouncementRef}
        aria-live="polite"
        aria-atomic="true"
        sx={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      />

      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
            Filter Applications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Narrow down your applications by status, priority, and company size.
          </Typography>
        </Box>

        {/* Search */}
        <Box>
          <TextField
            inputRef={searchInputRef}
            id="filter-search"
            label="Search Applications"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by company or position..."
            fullWidth
            variant="outlined"
            size="small"
            aria-describedby="search-help"
          />
          <Typography id="search-help" variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Search across company names and position titles
          </Typography>
        </Box>

        {/* Active Filters Summary */}
        {getTotalSelectedCount() > 0 && (
          <Box
            sx={{
              p: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              borderRadius: 1,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight="600" color="primary">
                {getTotalSelectedCount()} filter{getTotalSelectedCount() !== 1 ? 's' : ''} active
              </Typography>
              <Button
                variant="text"
                size="small"
                onClick={handleClearAll}
                aria-label="Clear all filters"
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  py: 0.5,
                  fontSize: '0.75rem',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  },
                }}
              >
                Clear All
              </Button>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Showing {getFilteredResultsCount()} of 27 applications
            </Typography>
          </Box>
        )}

        {/* Filter Groups */}
        <Box role="group" aria-label="Filter options">
          <Stack spacing={2}>
            {FILTER_GROUPS.map((group) => {
              const isExpanded = expandedGroups.has(group.id);
              const groupSelectedCount = selectedFilters[group.id]?.length || 0;

              return (
                <Box
                  key={group.id}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                  }}
                >
                  <Button
                    onClick={() => handleGroupToggle(group.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`filter-group-${group.id}`}
                    sx={{
                      width: '100%',
                      px: 2,
                      py: 1.5,
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      color: theme.palette.text.primary,
                      backgroundColor: 'transparent',
                      borderRadius: isExpanded ? '4px 4px 0 0' : 1,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.action.hover, 0.5),
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight="500">
                        {group.label}
                      </Typography>
                      {groupSelectedCount > 0 && (
                        <Chip
                          label={`${groupSelectedCount} selected`}
                          size="small"
                          sx={{
                            ml: 1,
                            height: 20,
                            fontSize: '0.75rem',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                          }}
                        />
                      )}
                    </Box>
                    {isExpanded ? (
                      <ExpandLess sx={{ color: theme.palette.text.secondary }} />
                    ) : (
                      <ExpandMore sx={{ color: theme.palette.text.secondary }} />
                    )}
                  </Button>

                  <Collapse in={isExpanded}>
                    <Box
                      id={`filter-group-${group.id}`}
                      sx={{ px: 2, pb: 2 }}
                      role="group"
                      aria-label={`${group.label} filter options`}
                    >
                      <FormGroup>
                        {group.options.map((option) => {
                          const isChecked = selectedFilters[group.id]?.includes(option.id) || false;
                          const checkboxId = `filter-${group.id}-${option.id}`;

                          return (
                            <FormControlLabel
                              key={option.id}
                              control={
                                <Checkbox
                                  id={checkboxId}
                                  checked={isChecked}
                                  onChange={(e) =>
                                    handleFilterChange(group.id, option.id, e.target.checked)
                                  }
                                  size="small"
                                  sx={{ py: 0.5 }}
                                />
                              }
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                  <Typography variant="body2">
                                    {option.label}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ ml: 1 }}
                                    id={`${checkboxId}-count`}
                                  >
                                    ({option.count})
                                  </Typography>
                                </Box>
                              }
                              sx={{
                                width: '100%',
                                mx: 0,
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.action.hover, 0.3),
                                },
                                '& .MuiFormControlLabel-label': {
                                  flex: 1,
                                  minWidth: 0,
                                },
                              }}
                            />
                          );
                        })}
                      </FormGroup>
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* Apply Button */}
        <Box sx={{ pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            variant="contained"
            onClick={handleApplyFilters}
            fullWidth
            disabled={getTotalSelectedCount() === 0 && !searchQuery}
            aria-describedby="apply-filters-help"
            sx={{
              position: 'relative',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            }}
          >
            Apply Filters
            {getTotalSelectedCount() > 0 && (
              <Chip
                label={getTotalSelectedCount()}
                size="small"
                sx={{
                  ml: 1,
                  height: 20,
                  fontSize: '0.75rem',
                  bgcolor: alpha(theme.palette.primary.contrastText, 0.2),
                  color: theme.palette.primary.contrastText,
                }}
              />
            )}
          </Button>
          <Typography id="apply-filters-help" variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
            Focus will move to filtered results after applying
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}