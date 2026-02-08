import type { Meta, StoryObj } from '@storybook/react';
import { ApplicationCard } from './ApplicationCard';

const meta = {
    title: 'Shared/ApplicationCard',
    component: ApplicationCard,
    parameters: {
        layout: 'padded',
        backgrounds: {
            default: 'dark',
            values: [
                { name: 'dark', value: '#121212' },
                { name: 'light', value: '#FFFFFF' },
            ],
        },
    },
    tags: ['autodocs'],
    argTypes: {
        currentStep: {
            control: { type: 'number', min: 0, max: 3 },
            description: 'Current step in the application process',
        },
    },
} satisfies Meta<typeof ApplicationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default ApplicationCard showing a job application in the initial "Applied" state
 */
export const Applied: Story = {
    args: {
        title: 'Senior Full Stack Engineer',
        company: 'TechCorp Innovations',
        location: 'Sydney, NSW',
        appliedDate: '2026-01-02',
        currentStep: 0,
        steps: ['Applied', 'Screening', 'Interview', 'Offer'],
        onUpdateStatus: () => console.log('Update status clicked'),
    },
};

/**
 * ApplicationCard in the screening phase
 */
export const Screening: Story = {
    args: {
        title: 'Product Designer',
        company: 'Design Studio Co',
        location: 'Melbourne, VIC',
        appliedDate: '2025-12-28',
        currentStep: 1,
        steps: ['Applied', 'Screening', 'Interview', 'Offer'],
        onUpdateStatus: () => console.log('Update status clicked'),
    },
};

/**
 * ApplicationCard in the interview stage
 */
export const Interview: Story = {
    args: {
        title: 'DevOps Engineer',
        company: 'Cloud Infrastructure Ltd',
        location: 'Brisbane, QLD',
        appliedDate: '2025-12-20',
        currentStep: 2,
        steps: ['Applied', 'Screening', 'Interview', 'Offer'],
        onUpdateStatus: () => console.log('Update status clicked'),
    },
};

/**
 * ApplicationCard with an offer received
 */
export const Offer: Story = {
    args: {
        title: 'Machine Learning Engineer',
        company: 'AI Research Labs',
        location: 'Remote',
        appliedDate: '2025-12-15',
        currentStep: 3,
        steps: ['Applied', 'Screening', 'Interview', 'Offer'],
        onUpdateStatus: () => console.log('Update status clicked'),
    },
};

/**
 * ApplicationCard without the update button
 */
export const WithoutUpdateButton: Story = {
    args: {
        title: 'Frontend Developer',
        company: 'StartupHub',
        location: 'Perth, WA',
        appliedDate: '2026-01-01',
        currentStep: 1,
        steps: ['Applied', 'Screening', 'Interview', 'Offer'],
    },
};

/**
 * ApplicationCard with custom application steps
 */
export const CustomSteps: Story = {
    args: {
        title: 'UX Researcher',
        company: 'User Experience Agency',
        location: 'Adelaide, SA',
        appliedDate: '2025-12-25',
        currentStep: 2,
        steps: ['Applied', 'Phone Screen', 'Take-Home', 'Technical', 'Final', 'Offer'],
        onUpdateStatus: () => console.log('Update status clicked'),
    },
};