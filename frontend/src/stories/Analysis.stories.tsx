import type { Meta, StoryObj } from '@storybook/react';
import { Analysis } from '../features/analysis/Analysis';
import { Toaster } from 'sonner';

/**
 * Analysis Feature Story
 * 
 * Demonstrates the 4-Quadrant Intelligence System.
 * Includes:
 * - AI Analysis trigger interface
 * - Real-time charting (ATS score over time)
 * - Application status pie charts
 * - Missing/Matched keyword analysis
 * - Verified sources from Google Search Grounding
 */
const meta: Meta<typeof Analysis> = {
    title: 'Features/Analysis',
    component: Analysis,
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        (Story) => (
            <div className="bg-background min-h-screen">
                <Toaster position="top-right" />
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Analysis>;

export const InitialState: Story = {};

export const Analyzing: Story = {
    decorators: [
        (Story) => {
            // Direct mock of fetch to prevent API errors
            window.fetch = () => new Promise(() => { });
            return <Story />;
        },
    ],
};

export const AnalysisComplete: Story = {
    // In this state, we rely on the mock data hardcoded in the component
    // but we can simulate the "results visible" state by mocking the analyze callback.
    play: async () => {
        // We could simulate clicking the analyze button here to show the results transition
    }
};

export const WithVerifiedSources: Story = {
    // The component shows verified sources if jobAnalysis.sources is present.
};

export const MobileView: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
};
