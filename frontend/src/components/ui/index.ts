/**
 * UI ATOMS BRIDGE
 * Maps standard UI names to Electric Alchemist components.
 */

// Basic Inputs
export { ElectricButton as Button } from '../electric/button/ElectricButton';
export type { ElectricButtonProps as ButtonProps } from '../electric/button/ElectricButton';

export { ElectricInput as Input } from '../electric/input/ElectricInput';
export type { ElectricInputProps as InputProps } from '../electric/input/ElectricInput';

export { ElectricTextarea as Textarea } from '../electric/textarea/ElectricTextarea';
export type { ElectricTextareaProps as TextareaProps } from '../electric/textarea/ElectricTextarea';

export { ElectricCheckbox as Checkbox } from '../electric/checkbox/ElectricCheckbox';
export type { ElectricCheckboxProps as CheckboxProps } from '../electric/checkbox/ElectricCheckbox';

export { ElectricRadioGroup as RadioGroup } from '../electric/radio-group/ElectricRadioGroup';
export type { ElectricRadioGroupProps as RadioGroupProps } from '../electric/radio-group/ElectricRadioGroup';

export { ElectricSwitch as Switch } from '../electric/switch/ElectricSwitch';
export type { ElectricSwitchProps as SwitchProps } from '../electric/switch/ElectricSwitch';

export { ElectricSelect as Select } from '../electric/select/ElectricSelect';
export type { ElectricSelectProps as SelectProps } from '../electric/select/ElectricSelect';

export { ElectricSlider as Slider } from '../electric/slider/ElectricSlider';
export type { ElectricSliderProps as SliderProps } from '../electric/slider/ElectricSlider';

// Data Display
export { ElectricAvatar as Avatar } from '../electric/avatar/ElectricAvatar';
export type { ElectricAvatarProps as AvatarProps } from '../electric/avatar/ElectricAvatar';

export { ElectricBadge as Badge } from '../electric/badge/ElectricBadge';
export type { ElectricBadgeProps as BadgeProps } from '../electric/badge/ElectricBadge';

export { ElectricCard as Card } from '../electric/card/ElectricCard';
export type { ElectricCardProps as CardProps } from '../electric/card/ElectricCard';

export { ElectricTable as Table } from '../electric/table/ElectricTable';
export type { ElectricTableProps as TableProps } from '../electric/table/ElectricTable';

export { ElectricEmptyState as EmptyState } from '../electric/empty-state/ElectricEmptyState';
export type { ElectricEmptyStateProps as EmptyStateProps } from '../electric/empty-state/ElectricEmptyState';

// Feedback
export { ElectricAlert as Alert } from '../electric/alert/ElectricAlert';
export type { ElectricAlertProps as AlertProps } from '../electric/alert/ElectricAlert';

export { ElectricProgress as Progress } from '../electric/progress/ElectricProgress';
export type { ElectricProgressProps as ProgressProps } from '../electric/progress/ElectricProgress';

export { ElectricSkeleton as Skeleton } from '../electric/skeleton/ElectricSkeleton';
export type { ElectricSkeletonProps as SkeletonProps } from '../electric/skeleton/ElectricSkeleton';

// Navigation
export { ElectricTabs as Tabs } from '../electric/tabs/ElectricTabs';
export type { ElectricTabsProps as TabsProps } from '../electric/tabs/ElectricTabs';

export { ElectricBreadcrumb as Breadcrumb } from '../electric/breadcrumb/ElectricBreadcrumb';
export type { ElectricBreadcrumbProps as BreadcrumbProps } from '../electric/breadcrumb/ElectricBreadcrumb';

export { ElectricDrawer as Drawer } from '../electric/drawer/ElectricDrawer';
export type { ElectricDrawerProps as DrawerProps } from '../electric/drawer/ElectricDrawer';

// Overlays
export { ElectricDialog as Dialog } from '../electric/dialog/ElectricDialog';
export type { ElectricDialogProps as DialogProps } from '../electric/dialog/ElectricDialog';

export { ElectricPopover as Popover } from '../electric/popover/ElectricPopover';
export type { ElectricPopoverProps as PopoverProps } from '../electric/popover/ElectricPopover';

export { ElectricTooltip as Tooltip } from '../electric/tooltip/ElectricTooltip';
export type { ElectricTooltipProps as TooltipProps } from '../electric/tooltip/ElectricTooltip';

// Layout
export { ElectricContainer as Container } from '../electric/container/ElectricContainer';
export type { ElectricContainerProps as ContainerProps } from '../electric/container/ElectricContainer';

export { ElectricDivider as Separator } from '../electric/divider/ElectricDivider';
export type { ElectricDividerProps as SeparatorProps } from '../electric/divider/ElectricDivider';

export { ElectricGrid as Grid } from '../electric/grid/ElectricGrid';
export type { ElectricGridProps as GridProps } from '../electric/grid/ElectricGrid';

// Keep only non-Electric components that don't have Electric equivalents yet
export { Label } from './Label';
export type { LabelProps } from './Label';

export { PageHeader } from './PageHeader';
export { ConfirmTagsModal } from './ConfirmTagsModal';
export { Slider } from './Slider';
export type { SliderProps } from './Slider';
export { Stepper } from './Stepper';
export type { StepperProps } from './Stepper';
export { TimelineView } from './TimelineView';
export type { TimelineViewProps, TimelineItem } from './TimelineView';
export { KeywordTag, KeywordTagGroup } from './KeywordTag';

export { ATSScoreCircle } from './ATSScoreCircle';
export type { ATSScoreCircleProps } from './ATSScoreCircle';

export { Switch } from './Switch';
export type { SwitchProps } from './Switch';

export { DatePicker } from './DatePicker';
export type { DatePickerProps } from './DatePicker';

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from './Dialog';
export type { DialogProps } from './Dialog';

export { Popover, PopoverContent, PopoverTrigger } from './Popover';
export type { PopoverProps, PopoverTriggerProps, PopoverContentProps } from './Popover';

export { Menu, MenuItem } from './Menu';
export type { MenuProps } from './Menu';

export { ImageWithFallback } from './ImageWithFallback';

export { Avatar } from './Avatar';
export type { AvatarProps } from './Avatar';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './DropdownMenu';
export type { DropdownMenuProps, DropdownMenuTriggerProps, DropdownMenuItemProps } from './DropdownMenu';

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from './AlertDialog';
export type { AlertDialogProps, AlertDialogTriggerProps, AlertDialogContentProps, AlertDialogHeaderProps, AlertDialogTitleProps, AlertDialogDescriptionProps, AlertDialogFooterProps, AlertDialogActionProps, AlertDialogCancelProps } from './AlertDialog';

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './Tooltip';
export type { TooltipProps, TooltipTriggerProps, TooltipContentProps, TooltipProviderProps } from './Tooltip';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './Table';
export type { TableProps, TableHeaderProps, TableBodyProps, TableFooterProps, TableRowProps, TableHeadProps, TableCellProps, TableCaptionProps } from './Table';

export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible';
export type { CollapsibleProps, CollapsibleTriggerProps, CollapsibleContentProps } from './Collapsible';

export { useToast, ToastProvider } from './useToast';
