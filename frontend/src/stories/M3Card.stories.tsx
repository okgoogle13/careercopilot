import type { Meta, StoryObj } from '@storybook/react';
import { M3Card, M3CardHeader, M3CardContent, M3CardActions } from '../components/ui/M3Card';
import { M3Button } from '../components/ui/M3Button';
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
                <M3CardHeader
                    title="Job Description"
                    subtitle="Senior Software Engineer - Google"
                    icon={<Briefcase className="text-primary" />}
                    action={<Star size={20} className="text-warning" />}
                />
                <M3CardContent>
                    Full-stack development using React, Node.js and GCP. Experience with distributed systems and high-scale applications required.
                </M3CardContent>
                <M3CardActions>
                    <M3Button variant="text" color="secondary">Later</M3Button>
                    <M3Button variant="filled">Apply Now</M3Button>
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
                <M3CardHeader
                    title="Analytical Report"
                    subtitle="Match Score: 92%"
                    icon={<Star className="text-tertiary" />}
                />
                <M3CardContent>
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
                <M3Button variant="outlined" fullWidth>Add to Calendar</M3Button>
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
                <M3Button variant="tonal" size="small">View</M3Button>
            </div>
        ),
    },
};

export const AllShapes: Story = {
    render: () => (
        <div className="grid grid-cols-2 gap-8">
            <M3Card variant="pebble">
                <p className="font-bold text-center">Pebble (Default)</p>
            </M3Card>
            <M3Card variant="tech">
                <p className="font-bold text-center">Tech (Precision)</p>
            </M3Card>
            <M3Card variant="leaf">
                <p className="font-bold text-center">Leaf (Growth)</p>
            </M3Card>
            <M3Card variant="gem">
                <p className="font-bold text-center">Gem (Highlight)</p>
            </M3Card>
        </div>
    ),
};
