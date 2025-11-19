/**
 * Animated Components Exports
 *
 * Production-ready animated UI components using framer-motion and Material-UI.
 * All components follow Material Design 3 Expressive motion principles.
 */

// Score Visualization
export { ATSScoreCircle } from '../ATSScoreCircle';
export type { ATSScoreCircleProps } from '../ATSScoreCircle';

// Loading Indicators
export {
  RotatingSpinner,
  PulsingDot,
  BouncingDots,
  GradientSpinner,
  MorphingLoader,
  LoadingSpinners,
} from '../LoadingSpinners';
export type { SpinnerProps } from '../LoadingSpinners';

// Interactive Components
export { AnimatedButton } from '../AnimatedButton';
export type { AnimatedButtonProps } from '../AnimatedButton';

export { AnimatedProgress } from '../AnimatedProgress';
export type { AnimatedProgressProps } from '../AnimatedProgress';

export { AnimatedDropdown } from '../AnimatedDropdown';
export type { AnimatedDropdownProps, DropdownItem } from '../AnimatedDropdown';

export { StaggeredList, StaggeredGrid } from '../StaggeredList';
export type { StaggeredListProps } from '../StaggeredList';

// Skeleton Loaders
export {
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  SkeletonButton,
  LoadingProfileCard,
  LoadingCard,
  LoadingDashboard,
} from '../SkeletonLoaders';
export type { SkeletonProps } from '../SkeletonLoaders';

// Animation Utilities (re-export from utils)
export {
  animations,
  transitions,
  shadowTransitions,
  animatedSx,
  hoverEffects,
  focusEffects,
  skeletonAnimation,
  pageTransitions,
  modalTransitions,
  buttonInteractions,
  inputInteractions,
} from '../../../utils/animations';
