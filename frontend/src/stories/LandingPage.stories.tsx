import type { Meta, StoryObj } from '@storybook/react';
import { LandingPage } from '../features/landing/LandingPage';

const meta: Meta<typeof LandingPage> = {
    title: 'Features/LandingPage',
    component: LandingPage,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof LandingPage>;

export const Default: Story = {};

export const MobileView: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
};
