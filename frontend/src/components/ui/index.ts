/**
 * M3 Component Library - Electric Alchemist Design System
 * 
 * Exports all M3-compliant UI components for the CareerCopilot application.
 * All components use design tokens from frontend/src/theme/design-tokens.css
 */

// Core Interaction Components
export { M3Button, M3IconButton } from './M3Button';
export type { M3ButtonProps, M3ButtonVariant, M3ButtonColor, M3ButtonSize, M3IconButtonProps } from './M3Button';

export { M3Switch } from './M3Switch';
export type { M3SwitchProps } from './M3Switch';

export { M3Checkbox, M3Radio } from './M3Checkbox';
export type { M3CheckboxProps, M3RadioProps } from './M3Checkbox';

export { M3Select } from './M3Select';
export type { M3SelectProps, M3SelectOption } from './M3Select';

// Data Entry & Layout Components
export { M3TextField, M3TextArea } from './M3TextField';
export type { M3TextFieldProps, M3TextFieldVariant, M3TextFieldSize, M3TextAreaProps } from './M3TextField';

export { M3Card, M3CardHeader, M3CardContent, M3CardActions } from './M3Card';
export type { M3CardProps, M3CardVariant, M3CardElevation, M3CardPadding, M3CardHeaderProps, M3CardContentProps, M3CardActionsProps } from './M3Card';

// Overlays & Messaging
export { M3Modal } from './M3Modal';
export type { M3ModalProps } from './M3Modal';

export { M3Alert, M3AlertTitle, M3AlertDescription } from './M3Alert';
export type { M3AlertProps, M3AlertSeverity, M3AlertVariant } from './M3Alert';

export { M3Badge } from './M3Badge';
export type { M3BadgeProps } from './M3Badge';

// Shared/Semantic Utilities
export { StatusBadge } from './StatusBadge/StatusBadge';
export type { StatusBadgeProps, StatusBadgeVariant } from './StatusBadge/StatusBadge';
