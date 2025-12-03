import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { M3TextArea } from './M3TextArea';

/**
 * M3 Expressive TextArea Component
 *
 * Implements Material Design 3 multi-line text input.
 * Use for longer text entry, descriptions, comments, and messages.
 *
 * Features:
 * - Filled and outlined variants
 * - Multiple color roles
 * - Three size options
 * - Configurable rows and resize behavior
 * - Character count display
 * - Error state support
 * - Label and helper text
 * - Keyboard navigation
 */

const meta: Meta<typeof M3TextArea> = {
  component: M3TextArea,
  title: 'M3 Expressive/TextArea',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outlined'],
      description: 'TextArea style variant',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'error'],
      description: 'Color role from M3 palette',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'TextArea size',
    },
    rows: {
      control: 'number',
      description: 'Number of visible rows',
    },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
      description: 'Resize behavior',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, textarea is disabled',
    },
    error: {
      control: 'boolean',
      description: 'If true, textarea is in error state',
    },
    label: {
      control: 'text',
      description: 'Label text for the textarea',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the textarea',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    showCharCount: {
      control: 'boolean',
      description: 'If true, show character count',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default TextArea (Filled + Primary)
 */
export const Default: Story = {
  args: {
    variant: 'filled',
    color: 'primary',
    size: 'medium',
    rows: 4,
    placeholder: 'Enter text...',
  },
};

/**
 * All Variants
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '300px' }}>
      <M3TextArea variant="filled" placeholder="Filled textarea" label="Filled Variant" />
      <M3TextArea variant="outlined" placeholder="Outlined textarea" label="Outlined Variant" />
    </div>
  ),
};

/**
 * All Sizes
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <M3TextArea size="small" placeholder="Small textarea" label="Small" rows={3} />
      <M3TextArea size="medium" placeholder="Medium textarea" label="Medium" rows={4} />
      <M3TextArea size="large" placeholder="Large textarea" label="Large" rows={5} />
    </div>
  ),
};

/**
 * All Color Roles
 */
export const ColorRoles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <M3TextArea color="primary" placeholder="Primary" label="Primary" />
      <M3TextArea color="secondary" placeholder="Secondary" label="Secondary" />
      <M3TextArea color="tertiary" placeholder="Tertiary" label="Tertiary" />
      <M3TextArea color="error" placeholder="Error" label="Error" />
    </div>
  ),
};

/**
 * Filled Variant
 */
export const FilledVariant: Story = {
  args: {
    variant: 'filled',
    placeholder: 'Filled textarea',
    label: 'Filled TextArea',
  },
};

/**
 * Outlined Variant
 */
export const OutlinedVariant: Story = {
  args: {
    variant: 'outlined',
    placeholder: 'Outlined textarea',
    label: 'Outlined TextArea',
  },
};

/**
 * With Label
 */
export const WithLabel: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter description...',
  },
};

/**
 * With Helper Text
 */
export const WithHelperText: Story = {
  args: {
    label: 'Comments',
    placeholder: 'Enter your comments',
    helperText: 'Please provide detailed feedback',
  },
};

/**
 * With Label and Helper Text
 */
export const WithLabelAndHelper: Story = {
  args: {
    label: 'Message',
    placeholder: 'Type your message...',
    helperText: 'This message will be sent to the support team',
  },
};

/**
 * Different Row Counts
 */
export const RowCounts: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <M3TextArea rows={2} placeholder="2 rows" label="2 Rows" />
      <M3TextArea rows={4} placeholder="4 rows (default)" label="4 Rows (Default)" />
      <M3TextArea rows={6} placeholder="6 rows" label="6 Rows" />
      <M3TextArea rows={10} placeholder="10 rows" label="10 Rows" />
    </div>
  ),
};

/**
 * Resize Behaviors
 */
export const ResizeBehaviors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <M3TextArea resize="none" placeholder="No resize" label="No Resize" />
      <M3TextArea resize="vertical" placeholder="Vertical resize (default)" label="Vertical Resize (Default)" />
      <M3TextArea resize="horizontal" placeholder="Horizontal resize" label="Horizontal Resize" />
      <M3TextArea resize="both" placeholder="Both directions" label="Both Directions" />
    </div>
  ),
};

/**
 * Disabled State
 */
export const Disabled: Story = {
  args: {
    variant: 'filled',
    disabled: true,
    placeholder: 'Disabled textarea',
    value: 'Cannot edit this text',
    label: 'Disabled TextArea',
  },
};

/**
 * Error State
 */
export const ErrorState: Story = {
  args: {
    error: true,
    label: 'Required Field',
    placeholder: 'Enter text...',
    errorMessage: 'This field is required',
  },
};

/**
 * Error State with Outlined Variant
 */
export const ErrorOutlined: Story = {
  args: {
    variant: 'outlined',
    error: true,
    label: 'Description',
    errorMessage: 'Please enter a valid description',
  },
};

/**
 * With Character Count
 */
export const WithCharCount: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    maxLength: 200,
    showCharCount: true,
    helperText: 'Maximum 200 characters',
  },
};

/**
 * With Character Count and Error
 */
export const CharCountWithError: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div style={{ width: '300px' }}>
        <M3TextArea
          label="Description"
          placeholder="Enter description..."
          maxLength={100}
          showCharCount
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={value.length > 100}
          errorMessage={value.length > 100 ? 'Exceeds maximum length' : undefined}
          helperText="Maximum 100 characters"
        />
      </div>
    );
  },
};

/**
 * All Variants with Error
 */
export const VariantsWithError: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '300px' }}>
      <M3TextArea
        variant="filled"
        error
        label="Filled Error"
        errorMessage="This field has an error"
      />
      <M3TextArea
        variant="outlined"
        error
        label="Outlined Error"
        errorMessage="This field has an error"
      />
    </div>
  ),
};

/**
 * All Colors with Error
 */
export const ColorsWithError: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <M3TextArea color="primary" error errorMessage="Primary error" />
      <M3TextArea color="secondary" error errorMessage="Secondary error" />
      <M3TextArea color="tertiary" error errorMessage="Tertiary error" />
      <M3TextArea color="error" error errorMessage="Error color error" />
    </div>
  ),
};

/**
 * Long Content (Scroll Test)
 */
export const LongContent: Story = {
  args: {
    rows: 4,
    value: Array.from({ length: 20 }, (_, i) => `Line ${i + 1}: This is a long line of text that will cause scrolling when the content exceeds the visible rows.`).join('\n'),
    label: 'Long Content',
    helperText: 'Scroll to see all content',
    onChange: () => {},
  },
};

/**
 * Form Example
 */
export const FormExample: Story = {
  render: () => {
    const [description, setDescription] = useState('');
    const [comments, setComments] = useState('');

    return (
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          width: '400px',
          padding: '24px',
        }}
        onSubmit={(e) => {
          e.preventDefault();
          alert('Form submitted!');
        }}
      >
        <M3TextArea
          variant="filled"
          label="Project Description"
          placeholder="Describe your project..."
          helperText="Provide a detailed description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          required
        />
        <M3TextArea
          variant="outlined"
          label="Additional Comments"
          placeholder="Any additional comments..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={4}
          maxLength={500}
          showCharCount
        />
        <button
          type="submit"
          style={{
            padding: '12px 24px',
            backgroundColor: '#00897B',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Submit
        </button>
      </form>
    );
  },
};

/**
 * Interactive Demo
 */
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
        <M3TextArea
          variant="filled"
          color="primary"
          size="medium"
          label="Interactive TextArea"
          placeholder="Type something..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          helperText="This is an interactive demo"
          rows={4}
        />
        <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <div><strong>Character Count:</strong> {value.length}</div>
          <div><strong>Line Count:</strong> {value.split('\n').length}</div>
        </div>
      </div>
    );
  },
};

/**
 * Complete Example
 */
export const Complete: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div style={{ width: '300px' }}>
        <M3TextArea
          variant="filled"
          color="primary"
          size="medium"
          rows={6}
          resize="vertical"
          label="Complete Example"
          placeholder="Enter text..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          helperText="This is a complete example with all features"
          maxLength={200}
          showCharCount
        />
      </div>
    );
  },
};
