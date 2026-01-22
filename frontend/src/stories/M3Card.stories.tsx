import type { Meta, StoryObj } from '@storybook/react';
import { M3Card, M3CardHeader, M3CardContent, M3CardActions } from '../components/ui/M3Card';
import { Pebble } from '../components/ui/M3Button';
import { Briefcase, Calendar, Star } from 'lucide-react';

const meta: Meta<typeof M3Card> = {
    title: 'M3 Components/Card',
    component: M3Card,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['pebble', 'tech', 'leaf', 'gem'],
        },
        elevation: {
            control: 'number',
            min: 0,
            max: 5,
        },
        padding: {
            control: 'select',
            options: ['none', 'sm', 'md', 'lg', 'xl'],
        },
        hoverable: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof M3Card>;

export const Default: Story = {
    args: {
        variant: 'pebble',
        elevation: 1,
        children: (
            <>
                <StoneHeader
                    title="Job Description"
                    subtitle="Senior Software Engineer - Google"
                    icon={<Briefcase className="text-primary" />}
                    action={<Star size={20} className="text-warning" />}
                />
                <StoneContent>
                    Full-stack development using React, Node.js and GCP. Experience with distributed systems and high-scale applications required.
                </M3CardContent>
                <StoneActions>
                    <Pebble variant="text" color="secondary">Later</Pebble>
                    <Pebble variant="filled">Apply Now</Pebble>
                </M3CardActions>
            </>
        ),
    },
};

export const TechVariant: Story = {
    args: {
        variant: 'tech',
        elevation: 2,
        hoverable: true,
        children: (
            <>
                <StoneHeader
                    title="Analytical Report"
                    subtitle="Match Score: 92%"
                    icon={<Star className="text-tertiary" />}
                />
                <StoneContent>
                    Your profile is highly compatible with this role. Recommended areas to highlight: Microservices architecture and Kubernetes.
                </M3CardContent>
            </>
        ),
    },
};

export const LeafVariant: Story = {
    args: {
        variant: 'leaf',
        elevation: 1,
        children: (
            <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Calendar size={32} className="text-primary" />
                </div>
                <h3 className="text-headline-small font-bold mb-2">Interview Scheduled</h3>
                <p className="text-body-medium text-on-surface-variant mb-4">
                    Jan 15, 2026 at 10:00 AM PST
                </p>
                <Pebble variant="outlined" fullWidth>Add to Calendar</Pebble>
            </div>
        ),
    },
};

export const GemVariant: Story = {
    args: {
        variant: 'gem',
        elevation: 3,
        children: (
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="text-label-large font-bold">Priority Update</h4>
                    <p className="text-body-small">New application status available</p>
                </div>
                <Pebble variant="tonal" size="small">View</Pebble>
            </div>
        ),
    },
};

export const AllShapes: Story = {
    render: () => (
        <div className="grid grid-cols-2 gap-8">
            <Stone variant="pebble">
                <p className="font-bold text-center">Pebble (Default)</p>
            </Stone>
            <Stone variant="tech">
                <p className="font-bold text-center">Tech (Precision)</p>
            </Stone>
            <Stone variant="leaf">
                <p className="font-bold text-center">Leaf (Growth)</p>
            </Stone>
            <Stone variant="gem">
                <p className="font-bold text-center">Gem (Highlight)</p>
            </Stone>
        </div>
    ),
};
