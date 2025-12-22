import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { M3Select, type M3SelectOption } from './M3Select';

/**
 * M3 Expressive Select Component
 *
 * Implements Material Design 3 dropdown select.
 * Use for single-value selection from a list of options.
 *
 * Features:
 * - Filled and outlined variants
 * - Multiple color roles
 * - Three size options
 * - Keyboard navigation
 * - Error state support
 * - Label and helper text
 * - Disabled state
 */

const meta: Meta<typeof M3Select> = {
  component: M3Select,
  title: 'M3 Expressive/Select',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outlined'],
      description: 'Select style variant',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'error'],
      description: 'Color role from M3 palette',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Select size',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, select is disabled',
    },
    error: {
      control: 'boolean',
      description: 'If true, select is in error state',
    },
    label: {
      control: 'text',
      description: 'Label text for the select',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the select',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleOptions: M3SelectOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
  { label: 'Elderberry', value: 'elderberry' },
  { label: 'Fig', value: 'fig' },
  { label: 'Grape', value: 'grape' },
  { label: 'Honeydew', value: 'honeydew' },
];

const jobOptions: M3SelectOption[] = [
  { label: 'Frontend Developer', value: 'frontend' },
  { label: 'Backend Developer', value: 'backend' },
  { label: 'Full Stack Developer', value: 'fullstack' },
  { label: 'DevOps Engineer', value: 'devops' },
  { label: 'Data Scientist', value: 'datascience' },
  { label: 'UX Designer', value: 'uxdesigner' },
  { label: 'Product Manager', value: 'pm' },
  { label: 'QA Engineer', value: 'qa', disabled: true },
];

/**
 * Default Select (Filled + Primary)
 */
export const Default: Story = {
  args: {
    variant: 'filled',
    color: 'primary',
    size: 'medium',
    options: sampleOptions,
    placeholder: 'Select an option',
  },
};

/**
 * All Variants
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '300px' }}>
      <M3Select
        variant="filled"
        options={sampleOptions}
        placeholder="Filled select"
        label="Filled Variant"
      />
      <M3Select
        variant="outlined"
        options={sampleOptions}
        placeholder="Outlined select"
        label="Outlined Variant"
      />
    </div>
  ),
};

/**
 * All Sizes
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <M3Select size="small" options={sampleOptions} placeholder="Small select" label="Small" />
      <M3Select size="medium" options={sampleOptions} placeholder="Medium select" label="Medium" />
      <M3Select size="large" options={sampleOptions} placeholder="Large select" label="Large" />
    </div>
  ),
};

/**
 * All Color Roles
 */
export const ColorRoles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <M3Select color="primary" options={sampleOptions} placeholder="Primary" label="Primary" />
      <M3Select color="secondary" options={sampleOptions} placeholder="Secondary" label="Secondary" />
      <M3Select color="tertiary" options={sampleOptions} placeholder="Tertiary" label="Tertiary" />
      <M3Select color="error" options={sampleOptions} placeholder="Error" label="Error" />
    </div>
  ),
};

/**
 * Filled Variant
 */
export const FilledVariant: Story = {
  args: {
    variant: 'filled',
    options: sampleOptions,
    placeholder: 'Filled select',
    label: 'Filled Select',
  },
};

/**
 * Outlined Variant
 */
export const OutlinedVariant: Story = {
  args: {
    variant: 'outlined',
    options: sampleOptions,
    placeholder: 'Outlined select',
    label: 'Outlined Select',
  },
};

/**
 * With Label
 */
export const WithLabel: Story = {
  args: {
    options: sampleOptions,
    label: 'Favorite Fruit',
    placeholder: 'Select a fruit',
  },
};

/**
 * With Helper Text
 */
export const WithHelperText: Story = {
  args: {
    options: sampleOptions,
    label: 'Select Option',
    placeholder: 'Choose an option',
    helperText: 'Please select an option from the list',
  },
};

/**
 * With Label and Helper Text
 */
export const WithLabelAndHelper: Story = {
  args: {
    options: sampleOptions,
    label: 'Job Role',
    placeholder: 'Select a role',
    helperText: 'Choose the position you are applying for',
  },
};

/**
 * Disabled State
 */
export const Disabled: Story = {
  args: {
    variant: 'filled',
    disabled: true,
    options: sampleOptions,
    placeholder: 'Disabled select',
    value: 'apple',
    label: 'Disabled Select',
  },
};

/**
 * Error State
 */
export const ErrorState: Story = {
  args: {
    error: true,
    options: sampleOptions,
    label: 'Required Field',
    placeholder: 'Select an option',
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
    options: sampleOptions,
    label: 'Email',
    errorMessage: 'Please select a valid option',
  },
};

/**
 * All Variants with Error
 */
export const VariantsWithError: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '300px' }}>
      <M3Select
        variant="filled"
        error
        options={sampleOptions}
        label="Filled Error"
        errorMessage="This field has an error"
      />
      <M3Select
        variant="outlined"
        error
        options={sampleOptions}
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
      <M3Select color="primary" error errorMessage="Primary error" options={sampleOptions} />
      <M3Select color="secondary" error errorMessage="Secondary error" options={sampleOptions} />
      <M3Select color="tertiary" error errorMessage="Tertiary error" options={sampleOptions} />
      <M3Select color="error" error errorMessage="Error color error" options={sampleOptions} />
    </div>
  ),
};

/**
 * With Disabled Options
 */
export const WithDisabledOptions: Story = {
  args: {
    options: jobOptions,
    label: 'Available Positions',
    placeholder: 'Select a position',
    helperText: 'QA Engineer is currently unavailable',
  },
};

/**
 * Large Option List (Scrolling)
 */
export const LargeOptionList: Story = {
  args: {
    options: Array.from({ length: 50 }, (_, i) => ({
      label: `Option ${i + 1}`,
      value: `option-${i + 1}`,
    })),
    label: 'Large List',
    placeholder: 'Select from 50 options...',
    helperText: 'Demonstrates scrolling behavior',
  },
};

/**
 * Form Example
 */
export const FormExample: Story = {
  render: () => {
    const [role, setRole] = useState<string | number>('');
    const [experience, setExperience] = useState<string | number>('');

    const experienceOptions: M3SelectOption[] = [
      { label: '0-1 years', value: 'junior' },
      { label: '2-5 years', value: 'mid' },
      { label: '5-10 years', value: 'senior' },
      { label: '10+ years', value: 'expert' },
    ];

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
        <M3Select
          variant="filled"
          options={jobOptions}
          value={role}
          onChange={setRole}
          label="Desired Role"
          placeholder="Select a role..."
          helperText="Choose the position you're applying for"
          required
        />
        <M3Select
          variant="outlined"
          options={experienceOptions}
          value={experience}
          onChange={setExperience}
          label="Years of Experience"
          placeholder="Select experience level..."
          required
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
    const [value, setValue] = useState<string | number>('');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
        <M3Select
          variant="filled"
          color="primary"
          size="medium"
          options={sampleOptions}
          value={value}
          onChange={setValue}
          label="Interactive Select"
          placeholder="Type something..."
          helperText={`Selected: ${value || 'None'}`}
        />
        <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <strong>Selected Value:</strong> {value || 'None'}
        </div>
      </div>
    );
  },
};

/**
 * Keyboard Navigation Demo
 */
export const KeyboardNavigation: Story = {
  args: {
    options: sampleOptions,
    label: 'Keyboard Navigation Demo',
    placeholder: 'Try keyboard navigation...',
    helperText: 'Use Enter/Space to open, Arrow keys to navigate, Escape to close',
  },
};

/**
 * Complete Example
 */
export const Complete: Story = {
  render: () => {
    const [value, setValue] = useState<string | number>('banana');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
        <M3Select
          variant="filled"
          color="primary"
          size="medium"
          options={sampleOptions}
          value={value}
          onChange={setValue}
          label="Complete Example"
          placeholder="Select..."
          helperText="This is a complete example with all features"
        />
        <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <strong>Selected:</strong> {value}
        </div>
      </div>
    );
  },
};
