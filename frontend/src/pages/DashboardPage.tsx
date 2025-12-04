/**
 * Dashboard Page Export
 * Re-exports from features/pages for router compatibility
 */

export { DashboardPage } from '@/features/pages/DashboardPage';

// Default export for lazy loading compatibility
import { DashboardPage as DefaultDashboardPage } from '@/features/pages/DashboardPage';
export default DefaultDashboardPage;

