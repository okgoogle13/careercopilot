import type { Meta, StoryObj } from '@storybook/react';
import { Settings } from '../features/settings/Settings';

const meta: Meta<typeof Settings> = {
    title: 'Features/Settings',
    component: Settings,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof Settings>;

export const Default: Story = {};

export const MobileSettings: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
};

export const TabletSettings: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'tablet',
        },
    },
};
