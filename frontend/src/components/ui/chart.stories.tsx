import type { Meta, StoryObj } from '@storybook/react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from './chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartData = [
    { month: 'January', applications: 186, interviews: 80 },
    { month: 'February', applications: 305, interviews: 200 },
    { month: 'March', applications: 237, interviews: 120 },
    { month: 'April', applications: 73, interviews: 190 },
    { month: 'May', applications: 209, interviews: 130 },
    { month: 'June', applications: 214, interviews: 140 },
];

const chartConfig = {
    applications: {
        label: 'Applications',
        color: 'hsl(var(--color-primary))',
    },
    interviews: {
        label: 'Interviews',
        color: 'hsl(var(--color-secondary))',
    },
};

const meta: Meta<typeof ChartContainer> = {
    title: 'Components/UI/Chart',
    component: ChartContainer,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ChartContainer>;

export const DefaultBarChart: Story = {
    args: {
        config: chartConfig,
        className: 'min-h-[300px] w-full max-w-[600px]',
        children: (
            <BarChart data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="applications" fill="var(--color-applications)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="interviews" fill="var(--color-interviews)" radius={[4, 4, 0, 0]} />
            </BarChart>
        ),
    },
};

export const SingleMetric: Story = {
    args: {
        config: {
            applications: chartConfig.applications,
        },
        className: 'min-h-[200px] w-full max-w-[400px]',
        children: (
            <BarChart data={chartData}>
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
                <Bar dataKey="applications" fill="var(--color-applications)" radius={8} />
            </BarChart>
        ),
    },
};
