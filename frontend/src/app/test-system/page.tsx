/**
 * TEST SYSTEM PAGE
 *
 * Public route for the Electric Alchemist Design System visual audit.
 * Renders the comprehensive design system preview component.
 */

import { DesignSystemPreview } from '@/features/design-system/Preview';

/**
 * Test System Page Component
 *
 * Serves as the public route for the Design System audit.
 * The DesignSystemPreview component already includes the AppShell layout.
 */
export default function TestSystemPage() {
  return <DesignSystemPreview />;
}
