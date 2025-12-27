import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';

const meta: Meta<typeof Accordion> = {
    title: 'Components/UI/Accordion',
    component: Accordion,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
    render: () => (
        <Accordion type="single" collapsible className="w-full max-w-[500px]">
            <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled with Tailwind?</AccordionTrigger>
                <AccordionContent>
                    Yes. It uses Tailwind CSS under the hood for maximum flexibility.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Can I use it for FAQs?</AccordionTrigger>
                <AccordionContent>
                    Absolutely! This is one of the most common use cases for the Accordion component.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
};

export const Multiple: Story = {
    render: () => (
        <Accordion type="multiple" className="w-full max-w-[500px]">
            <AccordionItem value="section-1">
                <AccordionTrigger>Career Analysis Features</AccordionTrigger>
                <AccordionContent>
                    Includes AI resume parsing, skill gap analysis, and personalized job matching.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="section-2">
                <AccordionTrigger>Automated Tracking</AccordionTrigger>
                <AccordionContent>
                    Track your applications across 50+ job boards automatically with our browser extension.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
};
