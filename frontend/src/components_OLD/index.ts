/**
 * CareerCopilot Component Library
 * Unified exports for Electric Alchemist, M3 Expressive, and Custom components
 *
 * Architecture:
 * - electric/     → Production stable baseline (184 tokens, Tailwind+Framer Motion)
 * - m3-expressive → Active migration target (342 tokens, CSS Modules)
 * - custom/       → Domain-specific CareerCopilot components
 * - common/       → Shared utilities
 */

// ============================================================================
// ELECTRIC ALCHEMIST (Production - 30 Components)
// Tailwind + Framer Motion + 184 tokens
// ============================================================================
export * from './electric';

// ============================================================================
// M3 EXPRESSIVE (Migration Target - 18 Components)
// CSS Modules + 342 tokens
// ============================================================================
// export * from './m3-expressive';

// ============================================================================
// CUSTOM/HYBRID (12 Components)
// Domain-specific compound components unique to CareerCopilot
// ============================================================================
export * from './custom';

// ============================================================================
// COMMON UTILITIES
// Shared components across all systems
// ============================================================================
export * from './common';

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================
export { AppRouter } from './layout/AppRouter';
export { ErrorBoundary } from './layout/ErrorBoundary';
export { GridCompat } from './layout/GridCompat';
