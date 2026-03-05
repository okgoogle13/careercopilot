import type { Meta, StoryObj } from '@storybook/react';
import { KSCGenerator } from '../features/ksc-generator/KSCGenerator';

/**
 * KSC Generator Story
 *
 * A 3-step wizard for crafting Selection Criteria responses.
 * 1. Criteria input
 * 2. STAR method elaboration
 * 3. AI-enhanced professional response review
 */
const meta: Meta<typeof KSCGenerator> = {
  title: 'Features/KSCGenerator',
  component: KSCGenerator,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof KSCGenerator>;

export const Step1_Initial: Story = {};

export const Step2_STAR: Story = {
  // We can't easily force the step state from props since it's internal,
  // but we can document the flow.
};

export const Step3_Generated: Story = {
  // Likewise, once the user clicks "Generate", it moves to step 3.
};

export const MobileWizard: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
