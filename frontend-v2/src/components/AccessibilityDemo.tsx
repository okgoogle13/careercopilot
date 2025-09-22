import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  AlertTitle,
  Grid,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { KanbanBoard } from '@/components/KanbanBoard';
import { FilterPanel } from '@/components/FilterPanel';

export function AccessibilityDemo() {
  const theme = useTheme();
  const [activeDemo, setActiveDemo] = useState<'kanban' | 'filter' | 'modal'>('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [filterResults, setFilterResults] = useState<Record<string, string[]>>({});

  const resultsRef = useRef<HTMLDivElement>(null);
  const modalTriggerRef = useRef<HTMLButtonElement>(null);

  const handleFilterChange = (filters: Record<string, string[]>) => {
    setFilterResults(filters);
  };

  const handleResultsFocus = () => {
    resultsRef.current?.focus();
  };

  const handleModalConfirm = () => {
    console.log('Modal confirmed!');
  };

  const handleAlertConfirm = () => {
    console.log('Alert confirmed!');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
            Accessibility Demo
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Demonstrating comprehensive keyboard navigation, ARIA support, and focus management
            across different interface patterns.
          </Typography>

          {/* Demo Navigation */}
          <Stack direction="row" spacing={1} sx={{ mb: 3 }} role="tablist" aria-label="Demo sections">
            {[
              { id: 'kanban', label: 'Kanban Board', description: 'Keyboard-accessible drag & drop' },
              { id: 'filter', label: 'Filter Panel', description: 'Focus management and ARIA' },
              { id: 'modal', label: 'Modal Dialogs', description: 'Focus trapping and restoration' }
            ].map((demo) => (
              <Button
                key={demo.id}
                variant={activeDemo === demo.id ? 'contained' : 'outlined'}
                onClick={() => setActiveDemo(demo.id as any)}
                role="tab"
                aria-selected={activeDemo === demo.id}
                aria-controls={`demo-panel-${demo.id}`}
                aria-describedby={`demo-desc-${demo.id}`}
              >
                {demo.label}
                <Box
                  id={`demo-desc-${demo.id}`}
                  sx={{
                    position: 'absolute',
                    left: '-10000px',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden',
                  }}
                >
                  {demo.description}
                </Box>
              </Button>
            ))}
          </Stack>
        </Box>

        {/* Accessibility Instructions */}
        <Alert severity="info">
          <AlertTitle>Accessibility Features</AlertTitle>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              This demo showcases production-ready accessibility patterns:
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0, '& li': { mb: 0.5 } }}>
              <li>
                <Typography variant="body2">
                  <strong>Keyboard Navigation:</strong> Full keyboard support with logical tab order
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Screen Reader Support:</strong> Proper ARIA labels, roles, and live regions
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Focus Management:</strong> Focus trapping in modals, restoration after interactions
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Visual Indicators:</strong> Clear focus states and interactive element styling
                </Typography>
              </li>
            </Box>
          </Box>
        </Alert>

        {/* Demo Content */}
        <Box>
          {/* Kanban Board Demo */}
          {activeDemo === 'kanban' && (
            <Box
              id="demo-panel-kanban"
              role="tabpanel"
              aria-labelledby="demo-tab-kanban"
            >
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h5" fontWeight="600" sx={{ mb: 1 }}>
                    Keyboard-Accessible Kanban Board
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This Kanban board supports full keyboard navigation for drag-and-drop operations.
                    Cards are focusable with{' '}
                    <Chip label="Tab" size="small" sx={{ mx: 0.5, height: 20, fontSize: '0.75rem' }} />,
                    and can be moved using arrow keys after pickup with{' '}
                    <Chip label="Enter" size="small" sx={{ mx: 0.5, height: 20, fontSize: '0.75rem' }} /> or{' '}
                    <Chip label="Space" size="small" sx={{ mx: 0.5, height: 20, fontSize: '0.75rem' }} />.
                  </Typography>
                </Box>
                <KanbanBoard />
              </Stack>
            </Box>
          )}

          {/* Filter Panel Demo */}
          {activeDemo === 'filter' && (
            <Box
              id="demo-panel-filter"
              role="tabpanel"
              aria-labelledby="demo-tab-filter"
            >
              <Grid container spacing={3}>
                <Grid item xs={12} lg={4}>
                  <Typography variant="h5" fontWeight="600" sx={{ mb: 1 }}>
                    Smart Filter Panel
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Features logical focus order, live result announcements, and automatic focus
                    management after filter application.
                  </Typography>
                  <FilterPanel
                    onFiltersChange={handleFilterChange}
                    onResultsFocus={handleResultsFocus}
                  />
                </Grid>

                <Grid item xs={12} lg={8}>
                  <Typography variant="h6" fontWeight="500" sx={{ mb: 2 }}>
                    Filtered Results
                  </Typography>
                  <Box
                    ref={resultsRef}
                    tabIndex={-1}
                    aria-label="Filter results area"
                    sx={{
                      '&:focus-visible': {
                        outline: `2px solid ${theme.palette.primary.main}`,
                        outlineOffset: 2,
                        borderRadius: 1,
                      },
                    }}
                  >
                    {Object.keys(filterResults).length === 0 ? (
                      <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                          All 27 applications shown
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Apply filters to see filtered results
                        </Typography>
                      </Box>
                    ) : (
                      <Stack spacing={2}>
                        <Typography variant="body2" color="text.secondary">
                          Active filters: {Object.entries(filterResults).map(([group, options]) =>
                            `${group}: ${options.join(', ')}`
                          ).join(' | ')}
                        </Typography>
                        <Grid container spacing={2}>
                          {Array.from({ length: Math.max(1, 12 - Object.values(filterResults).flat().length * 2) }, (_, i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                              <Box
                                sx={{
                                  p: 2,
                                  border: `1px solid ${theme.palette.divider}`,
                                  borderRadius: 1,
                                }}
                              >
                                <Typography variant="subtitle2" fontWeight="500">
                                  Application {i + 1}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                  Matching your filter criteria
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Stack>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Modal Demo */}
          {activeDemo === 'modal' && (
            <Box
              id="demo-panel-modal"
              role="tabpanel"
              aria-labelledby="demo-tab-modal"
            >
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h5" fontWeight="600" sx={{ mb: 1 }}>
                    Focus-Trapped Modal Dialogs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Modals with proper focus trapping, keyboard navigation, and focus restoration.
                    Focus is automatically managed and restored to the trigger element upon closing.
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {/* Standard Modal */}
                  <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                      <Typography variant="h6" fontWeight="500">
                        Standard Modal
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Full-featured modal with focus trapping and keyboard navigation.
                      </Typography>
                      <Button
                        ref={modalTriggerRef}
                        variant="contained"
                        onClick={() => setIsModalOpen(true)}
                        aria-describedby="modal-trigger-help"
                      >
                        Open Modal
                      </Button>
                      <Typography id="modal-trigger-help" variant="caption" color="text.secondary">
                        Focus will be trapped inside the modal and restored here when closed
                      </Typography>
                    </Stack>
                  </Grid>

                  {/* Alert Dialog */}
                  <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                      <Typography variant="h6" fontWeight="500">
                        Alert Dialog
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Confirmation dialog with appropriate default focus for safe operations.
                      </Typography>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => setIsAlertOpen(true)}
                        aria-describedby="alert-trigger-help"
                      >
                        Delete Item
                      </Button>
                      <Typography id="alert-trigger-help" variant="caption" color="text.secondary">
                        Destructive actions focus "Cancel" by default for safety
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>

                {/* Accessibility Features List */}
                <Box
                  sx={{
                    mt: 4,
                    p: 3,
                    bgcolor: alpha(theme.palette.action.hover, 0.3),
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
                    Modal Accessibility Features:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0, '& li': { mb: 0.5 } }}>
                    <li>
                      <Typography variant="body2" color="text.secondary">
                        • <strong>Focus Trapping:</strong> Tab navigation stays within the modal
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" color="text.secondary">
                        • <strong>Escape to Close:</strong> ESC key closes modal and restores focus
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" color="text.secondary">
                        • <strong>Click Outside:</strong> Overlay click closes modal (configurable)
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" color="text.secondary">
                        • <strong>ARIA Labels:</strong> Proper dialog role and labeling
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" color="text.secondary">
                        • <strong>Screen Reader Announcements:</strong> Modal opening/closing announced
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" color="text.secondary">
                        • <strong>Initial Focus:</strong> Configurable first focused element
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" color="text.secondary">
                        • <strong>Focus Restoration:</strong> Returns focus to trigger element
                      </Typography>
                    </li>
                  </Box>
                </Box>
              </Stack>
            </Box>
          )}
        </Box>

        {/* Modal Components */}
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          aria-labelledby="modal-title"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle id="modal-title">Example Modal</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                This modal demonstrates proper focus management. Try navigating with Tab and Shift+Tab
                to see how focus is trapped within the modal.
              </Typography>

              <TextField
                fullWidth
                placeholder="First focusable input"
                variant="outlined"
                size="small"
              />
              <TextField
                fullWidth
                placeholder="Second focusable input"
                variant="outlined"
                size="small"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleModalConfirm}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
          aria-labelledby="alert-title"
          aria-describedby="alert-description"
        >
          <DialogTitle id="alert-title">Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography id="alert-description">
              Are you sure you want to delete this item? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={() => setIsAlertOpen(false)} autoFocus>
              Keep Item
            </Button>
            <Button variant="contained" color="error" onClick={handleAlertConfirm}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
}