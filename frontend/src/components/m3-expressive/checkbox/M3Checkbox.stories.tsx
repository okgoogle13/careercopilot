import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { M3Checkbox } from './M3Checkbox';

/**
 * M3 Expressive Checkbox Component
 *
 * Implements Material Design 3 checkbox.
 * Use for binary choices, form selections, and "select all" patterns.
 *
 * Features:
 * - Checked/unchecked states
 * - Indeterminate state (for "select all")
 * - Multiple color roles
 * - Three size options
 * - Label support
 * - Keyboard navigation
 * - Disabled state
 */

const meta: Meta<typeof M3Checkbox> = {
  component: M3Checkbox,
  title: 'M3 Expressive/Checkbox',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'error'],
      description: 'Color role from M3 palette',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Checkbox size',
    },
    checked: {
      control: 'boolean',
      description: 'If true, checkbox is checked',
    },
    indeterminate: {
      control: 'boolean',
      description: 'If true, checkbox is in indeterminate state',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, checkbox is disabled',
    },
    label: {
      control: 'text',
      description: 'Label text for the checkbox',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Checkbox (Primary + Medium)
 */
export const Default: Story = {
  args: {
    color: 'primary',
    size: 'medium',
  },
};

/**
 * All Sizes
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <M3Checkbox size="small" label="Small checkbox" />
      <M3Checkbox size="medium" label="Medium checkbox" />
      <M3Checkbox size="large" label="Large checkbox" />
    </div>
  ),
};

/**
 * All Color Roles
 */
export const ColorRoles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <M3Checkbox color="primary" checked label="Primary" />
      <M3Checkbox color="secondary" checked label="Secondary" />
      <M3Checkbox color="tertiary" checked label="Tertiary" />
      <M3Checkbox color="error" checked label="Error" />
    </div>
  ),
};

/**
 * Checked State
 */
export const Checked: Story = {
  args: {
    checked: true,
    label: 'Checked checkbox',
  },
};

/**
 * Unchecked State
 */
export const Unchecked: Story = {
  args: {
    checked: false,
    label: 'Unchecked checkbox',
  },
};

/**
 * Indeterminate State
 */
export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    label: 'Indeterminate checkbox',
  },
};

/**
 * All States
 */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <M3Checkbox label="Unchecked" />
      <M3Checkbox checked label="Checked" />
      <M3Checkbox indeterminate label="Indeterminate" />
      <M3Checkbox disabled label="Disabled" />
      <M3Checkbox checked disabled label="Checked & Disabled" />
    </div>
  ),
};

/**
 * With Label
 */
export const WithLabel: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

/**
 * Disabled State
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled checkbox',
  },
};

/**
 * Disabled Checked
 */
export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    label: 'Disabled and checked',
  },
};

/**
 * All Colors with Labels
 */
export const ColorsWithLabels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <M3Checkbox color="primary" checked label="Primary checkbox" />
      <M3Checkbox color="secondary" checked label="Secondary checkbox" />
      <M3Checkbox color="tertiary" checked label="Tertiary checkbox" />
      <M3Checkbox color="error" checked label="Error checkbox" />
    </div>
  ),
};

/**
 * Interactive Demo
 */
export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
        <M3Checkbox
          checked={checked}
          indeterminate={indeterminate}
          onChange={(newChecked) => {
            setChecked(newChecked);
            setIndeterminate(false);
          }}
          label="Interactive checkbox"
        />
        <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <div><strong>Checked:</strong> {checked ? 'Yes' : 'No'}</div>
          <div><strong>Indeterminate:</strong> {indeterminate ? 'Yes' : 'No'}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              setChecked(true);
              setIndeterminate(false);
            }}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Check
          </button>
          <button
            onClick={() => {
              setChecked(false);
              setIndeterminate(false);
            }}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Uncheck
          </button>
          <button
            onClick={() => {
              setIndeterminate(true);
              setChecked(false);
            }}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Indeterminate
          </button>
        </div>
      </div>
    );
  },
};

/**
 * Select All Pattern
 */
export const SelectAllPattern: Story = {
  render: () => {
    const [selectAll, setSelectAll] = useState(false);
    const [items, setItems] = useState([
      { id: 1, label: 'Item 1', checked: false },
      { id: 2, label: 'Item 2', checked: false },
      { id: 3, label: 'Item 3', checked: false },
    ]);

    const allChecked = items.every((item) => item.checked);
    const someChecked = items.some((item) => item.checked);
    const indeterminate = someChecked && !allChecked;

    const handleSelectAll = (checked: boolean) => {
      setSelectAll(checked);
      setItems(items.map((item) => ({ ...item, checked })));
    };

    const handleItemChange = (id: number, checked: boolean) => {
      const newItems = items.map((item) =>
        item.id === id ? { ...item, checked } : item
      );
      setItems(newItems);
      setSelectAll(newItems.every((item) => item.checked));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
        <M3Checkbox
          checked={allChecked}
          indeterminate={indeterminate}
          onChange={handleSelectAll}
          label="Select all"
        />
        <div style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {items.map((item) => (
            <M3Checkbox
              key={item.id}
              checked={item.checked}
              onChange={(checked) => handleItemChange(item.id, checked)}
              label={item.label}
            />
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Form Example
 */
export const FormExample: Story = {
  render: () => {
    const [terms, setTerms] = useState(false);
    const [newsletter, setNewsletter] = useState(true);
    const [marketing, setMarketing] = useState(false);

    return (
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '300px',
          padding: '24px',
        }}
        onSubmit={(e) => {
          e.preventDefault();
          alert('Form submitted!');
        }}
      >
        <h3 style={{ margin: 0 }}>Account Settings</h3>
        <M3Checkbox
          checked={terms}
          onChange={setTerms}
          label="I agree to the terms and conditions"
          required
        />
        <M3Checkbox
          checked={newsletter}
          onChange={setNewsletter}
          label="Subscribe to newsletter"
        />
        <M3Checkbox
          checked={marketing}
          onChange={setMarketing}
          label="Receive marketing emails"
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
            marginTop: '8px',
          }}
        >
          Submit
        </button>
      </form>
    );
  },
};
