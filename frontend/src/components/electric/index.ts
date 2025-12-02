/**
 * ELECTRIC ALCHEMIST: DESIGN SYSTEM BARREL EXPORT
 * Version: 4.2
 *
 * Central export point for all Electric Alchemist components.
 */

// ============================================================================
// BATCH 1: CORE PRIMITIVES
// ============================================================================

// Badge
export { ElectricBadge } from './badge';
export type { ElectricBadgeProps } from './badge';

// Button
export { ElectricButton } from './button';
export type { ElectricButtonProps } from './button';

// Checkbox
export { ElectricCheckbox } from './checkbox';
export type { ElectricCheckboxProps } from './checkbox';

// Divider
export { ElectricDivider } from './divider';
export type { ElectricDividerProps } from './divider';

// Input
export { ElectricInput } from './input';
export type { ElectricInputProps } from './input';

// Progress
export { ElectricProgress } from './progress';
export type { ElectricProgressProps } from './progress';

// Radio Group
export { ElectricRadioGroup } from './radio-group';
export type { ElectricRadioGroupProps, RadioOption } from './radio-group';

// Search Input
export { ElectricSearchInput } from './search-input';
export type { ElectricSearchInputProps } from './search-input';

// Select
export { ElectricSelect } from './select';
export type { ElectricSelectProps } from './select';

// Skeleton
export { ElectricSkeleton } from './skeleton';
export type { ElectricSkeletonProps } from './skeleton';

// Slider
export { ElectricSlider } from './slider';
export type { ElectricSliderProps } from './slider';

// Switch
export { ElectricSwitch } from './switch';
export type { ElectricSwitchProps } from './switch';

// Textarea
export { ElectricTextarea } from './textarea';
export type { ElectricTextareaProps } from './textarea';

// ============================================================================
// BATCH 2: LAYOUT & CONTAINERS
// ============================================================================

// Alert
export { ElectricAlert } from './alert';
export type { ElectricAlertProps } from './alert';

// Breadcrumb
export { ElectricBreadcrumb } from './breadcrumb';
export type { ElectricBreadcrumbProps, BreadcrumbItem } from './breadcrumb';

// Card
export { ElectricCard, PopOutGraphic } from './card';
export type { ElectricCardProps, PopOutGraphicProps } from './card';

// Container
export { ElectricContainer } from './container';
export type { ElectricContainerProps } from './container';

// Dialog
export { ElectricDialog } from './dialog';
export type { ElectricDialogProps } from './dialog';

// Drawer
export { ElectricDrawer } from './drawer';
export type { ElectricDrawerProps } from './drawer';

// Empty State
export { ElectricEmptyState } from './empty-state';
export type { ElectricEmptyStateProps } from './empty-state';

// Grid
export { ElectricGrid } from './grid';
export type { ElectricGridProps } from './grid';

// Tabs
export { ElectricTabs } from './tabs';
export type { ElectricTabsProps, Tab } from './tabs';

// ============================================================================
// BATCH 3: DATA DISPLAY
// ============================================================================

// Avatar
export { ElectricAvatar } from './avatar';
export type { ElectricAvatarProps } from './avatar';

// Date Picker
export { ElectricDatePicker } from './date-picker';
export type { ElectricDatePickerProps } from './date-picker';

// Pagination
export { ElectricPagination } from './pagination';
export type { ElectricPaginationProps } from './pagination';

// Popover
export { ElectricPopover } from './popover';
export type { ElectricPopoverProps } from './popover';

// Table
export {
  ElectricTable,
  ElectricTableHeader,
  ElectricTableBody,
  ElectricTableRow,
  ElectricTableHead,
  ElectricTableCell,
} from './table';
export type {
  ElectricTableProps,
  ElectricTableHeaderProps,
  ElectricTableBodyProps,
  ElectricTableRowProps,
  ElectricTableHeadProps,
  ElectricTableCellProps,
} from './table';

// Tooltip
export { ElectricTooltip } from './tooltip';
export type { ElectricTooltipProps } from './tooltip';

// ============================================================================
// ALIASED EXPORTS (Without 'Electric' Prefix)
// Use these for cleaner imports while maintaining backward compatibility
// ============================================================================

// Core primitives
export { ElectricBadge as Badge } from './badge';
export type { ElectricBadgeProps as BadgeProps } from './badge';

export { ElectricButton as Button } from './button';
export type { ElectricButtonProps as ButtonProps } from './button';

export { ElectricCheckbox as Checkbox } from './checkbox';
export type { ElectricCheckboxProps as CheckboxProps } from './checkbox';

export { ElectricDivider as Divider } from './divider';
export type { ElectricDividerProps as DividerProps } from './divider';

export { ElectricInput as Input } from './input';
export type { ElectricInputProps as InputProps } from './input';

export { ElectricProgress as Progress } from './progress';
export type { ElectricProgressProps as ProgressProps } from './progress';

export { ElectricRadioGroup as RadioGroup } from './radio-group';
export type { ElectricRadioGroupProps as RadioGroupProps, RadioOption } from './radio-group';

export { ElectricSearchInput as SearchInput } from './search-input';
export type { ElectricSearchInputProps as SearchInputProps } from './search-input';

export { ElectricSelect as Select } from './select';
export type { ElectricSelectProps as SelectProps } from './select';

export { ElectricSkeleton as Skeleton } from './skeleton';
export type { ElectricSkeletonProps as SkeletonProps } from './skeleton';

export { ElectricSlider as Slider } from './slider';
export type { ElectricSliderProps as SliderProps } from './slider';

export { ElectricSwitch as Switch } from './switch';
export type { ElectricSwitchProps as SwitchProps } from './switch';

export { ElectricTextarea as Textarea } from './textarea';
export type { ElectricTextareaProps as TextareaProps } from './textarea';

// Layout & containers
export { ElectricAlert as Alert } from './alert';
export type { ElectricAlertProps as AlertProps } from './alert';

export { ElectricBreadcrumb as Breadcrumb } from './breadcrumb';
export type { ElectricBreadcrumbProps as BreadcrumbProps, BreadcrumbItem } from './breadcrumb';

export { ElectricCard as Card, PopOutGraphic } from './card';
export type { ElectricCardProps as CardProps, PopOutGraphicProps } from './card';

export { ElectricContainer as Container } from './container';
export type { ElectricContainerProps as ContainerProps } from './container';

export { ElectricDialog as Dialog } from './dialog';
export type { ElectricDialogProps as DialogProps } from './dialog';

export { ElectricDrawer as Drawer } from './drawer';
export type { ElectricDrawerProps as DrawerProps } from './drawer';

export { ElectricEmptyState as EmptyState } from './empty-state';
export type { ElectricEmptyStateProps as EmptyStateProps } from './empty-state';

export { ElectricGrid as Grid } from './grid';
export type { ElectricGridProps as GridProps } from './grid';

export { ElectricTabs as Tabs } from './tabs';
export type { ElectricTabsProps as TabsProps, Tab } from './tabs';

// Data display
export { ElectricAvatar as Avatar } from './avatar';
export type { ElectricAvatarProps as AvatarProps } from './avatar';

export { ElectricDatePicker as DatePicker } from './date-picker';
export type { ElectricDatePickerProps as DatePickerProps } from './date-picker';

export { ElectricPagination as Pagination } from './pagination';
export type { ElectricPaginationProps as PaginationProps } from './pagination';

export { ElectricPopover as Popover } from './popover';
export type { ElectricPopoverProps as PopoverProps } from './popover';

export {
  ElectricTable as Table,
  ElectricTableHeader as TableHeader,
  ElectricTableBody as TableBody,
  ElectricTableRow as TableRow,
  ElectricTableHead as TableHead,
  ElectricTableCell as TableCell,
} from './table';
export type {
  ElectricTableProps as TableProps,
  ElectricTableHeaderProps as TableHeaderProps,
  ElectricTableBodyProps as TableBodyProps,
  ElectricTableRowProps as TableRowProps,
  ElectricTableHeadProps as TableHeadProps,
  ElectricTableCellProps as TableCellProps,
} from './table';

export { ElectricTooltip as Tooltip } from './tooltip';
export type { ElectricTooltipProps as TooltipProps } from './tooltip';
