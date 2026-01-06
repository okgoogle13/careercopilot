import type { Meta, StoryObj } from '@storybook/react';
import { Dashboard } from '../features/dashboard/Dashboard';

/**
 * Dashboard Feature Story
 * 
 * Displays the main user cockpit with:
 * - Personalized Hero Banner with Figma-spec SVG plant background
 * - Dotted-pattern Stat Cards (Metric indicators)
 * - Quick Action buttons (M3 expressive style)
 * - Application Profiles with ATS score indicators
 * 
 * Uses Framer Motion for entry animations.
 */
const meta: Meta<typeof Dashboard> = {
    title: 'Features/Dashboard',
    component: Dashboard,
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        (Story) => (
            <div className="bg-background min-h-screen">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Dashboard>;

export const Default: Story = {};

export const MobileView: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
};

export const TabletView: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'tablet',
        },
    },
};

/**
 * Visual Regression Check:
 * This story isolates the hero banner animations if we were to 
 * refactor it, but currently shows the full animated dashboard.
 */
export const AnimatedEntry: Story = {
    play: async ({ canvasElement }) => {
        // This provides a hook for future interaction testing
        // or to verify that motion elements have triggered.
    },
};
