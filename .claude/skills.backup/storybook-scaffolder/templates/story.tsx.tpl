import type { Meta, StoryObj } from '@storybook/react';
import { {{COMPONENT_NAME}} } from '{{COMPONENT_PATH}}';

const meta: Meta<typeof {{COMPONENT_NAME}}> = {
  title: 'Components/{{STORY_TITLE}}',
  component: {{COMPONENT_NAME}},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // TODO: Define arg types
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    // TODO: Add default args for the component's props
  },
};
