import type { Meta, StoryObj } from '@storybook/react';
import { ApplicationCard } from '../components/shared/ApplicationCard';

const meta: Meta<typeof ApplicationCard> = {
    title: 'Shared/ApplicationCard',
    component: ApplicationCard,
    argTypes: {
        currentStep: {
            control: { type: 'number', min: 0, max: 4 },
        },
    },
};

export default meta;
type Story = StoryObj<typeof ApplicationCard>;

const defaultSteps = ['Applied', 'Screening', 'Interview', 'Offer', 'Accepted'];

export const Initial: Story = {
    args: {
        title: 'Senior Frontend Engineer',
        company: 'Atlassian',
        location: 'Sydney, NSW',
        appliedDate: 'Oct 12, 2026',
        currentStep: 0,
        steps: defaultSteps,
    },
};

export const Interviewing: Story = {
    args: {
        title: 'Product Designer',
        company: 'Canva',
        location: 'Surry Hills, NSW',
        appliedDate: 'Oct 10, 2026',
        currentStep: 2,
        steps: defaultSteps,
    },
};

export const OfferReceived: Story = {
    args: {
        title: 'Staff Software Engineer',
        company: 'Google',
        location: 'Pyrmont, NSW',
        appliedDate: 'Oct 05, 2026',
        currentStep: 3,
        steps: defaultSteps,
    },
};

export const CustomSteps: Story = {
    args: {
        title: 'Intern',
        company: 'University of Sydney',
        location: 'Camperdown, NSW',
        appliedDate: 'Oct 15, 2026',
        currentStep: 1,
        steps: ['Application Sent', 'Interview 1', 'Interview 2', 'Decision'],
    },
};
