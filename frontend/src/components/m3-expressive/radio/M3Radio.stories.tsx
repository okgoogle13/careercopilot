import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { M3Radio } from './M3Radio';

/**
 * M3 Expressive Radio Component
 *
 * Implements Material Design 3 radio button.
 * Use for single selection from a group of options.
 *
 * Features:
 * - Selected/unselected states
 * - Multiple color roles
 * - Three size options
 * - Label support
 * - Keyboard navigation
 * - Disabled state
 * - Group management via name attribute
 */

const meta: Meta<typeof M3Radio> = {
  component: M3Radio,
  title: 'M3 Expressive/Radio',
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
      description: 'Radio size',
    },
    checked: {
      control: 'boolean',
      description: 'If true, radio is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, radio is disabled',
    },
    value: {
      control: 'text',
      description: 'Value of the radio button',
    },
    name: {
      control: 'text',
      description: 'Name attribute for grouping',
    },
    label: {
      control: 'text',
      description: 'Label text for the radio button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Radio (Primary + Medium)
 */
export const Default: Story = {
  args: {
    color: 'primary',
    size: 'medium',
    value: 'option1',
  },
};

/**
 * All Sizes
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <M3Radio size="small" value="small" label="Small radio" />
      <M3Radio size="medium" value="medium" label="Medium radio" />
      <M3Radio size="large" value="large" label="Large radio" />
    </div>
  ),
};

/**
 * All Color Roles
 */
export const ColorRoles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <M3Radio color="primary" checked value="primary" label="Primary" />
      <M3Radio color="secondary" checked value="secondary" label="Secondary" />
      <M3Radio color="tertiary" checked value="tertiary" label="Tertiary" />
      <M3Radio color="error" checked value="error" label="Error" />
    </div>
  ),
};

/**
 * Selected State
 */
export const Selected: Story = {
  args: {
    checked: true,
    value: 'option1',
    label: 'Selected radio',
  },
};

/**
 * Unselected State
 */
export const Unselected: Story = {
  args: {
    checked: false,
    value: 'option1',
    label: 'Unselected radio',
  },
};

/**
 * All States
 */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <M3Radio value="unselected" label="Unselected" />
      <M3Radio checked value="selected" label="Selected" />
      <M3Radio disabled value="disabled" label="Disabled" />
      <M3Radio checked disabled value="disabled-selected" label="Selected & Disabled" />
    </div>
  ),
};

/**
 * With Label
 */
export const WithLabel: Story = {
  args: {
    value: 'option1',
    label: 'Choose this option',
  },
};

/**
 * Disabled State
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'option1',
    label: 'Disabled radio',
  },
};

/**
 * Disabled Selected
 */
export const DisabledSelected: Story = {
  args: {
    checked: true,
    disabled: true,
    value: 'option1',
    label: 'Disabled and selected',
  },
};

/**
 * All Colors with Labels
 */
export const ColorsWithLabels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <M3Radio color="primary" checked value="primary" label="Primary radio" />
      <M3Radio color="secondary" checked value="secondary" label="Secondary radio" />
      <M3Radio color="tertiary" checked value="tertiary" label="Tertiary radio" />
      <M3Radio color="error" checked value="error" label="Error radio" />
    </div>
  ),
};

/**
 * Radio Group
 */
export const RadioGroup: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | number>('option1');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
        <M3Radio
          name="group1"
          value="option1"
          checked={selected === 'option1'}
          onChange={(value) => setSelected(value)}
          label="Option 1"
        />
        <M3Radio
          name="group1"
          value="option2"
          checked={selected === 'option2'}
          onChange={(value) => setSelected(value)}
          label="Option 2"
        />
        <M3Radio
          name="group1"
          value="option3"
          checked={selected === 'option3'}
          onChange={(value) => setSelected(value)}
          label="Option 3"
        />
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <strong>Selected:</strong> {selected}
        </div>
      </div>
    );
  },
};

/**
 * Interactive Demo
 */
export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | number>('');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
        <M3Radio
          checked={selected === 'option1'}
          value="option1"
          onChange={(value) => setSelected(value)}
          label="Interactive radio"
        />
        <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <div><strong>Selected Value:</strong> {selected || 'None'}</div>
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
    const [experience, setExperience] = useState<string | number>('');
    const [preference, setPreference] = useState<string | number>('');

    return (
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          width: '300px',
          padding: '24px',
        }}
        onSubmit={(e) => {
          e.preventDefault();
          alert('Form submitted!');
        }}
      >
        <h3 style={{ margin: 0 }}>Job Application</h3>
        
        <div>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold' }}>
            Years of Experience
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <M3Radio
              name="experience"
              value="0-1"
              checked={experience === '0-1'}
              onChange={setExperience}
              label="0-1 years"
            />
            <M3Radio
              name="experience"
              value="2-5"
              checked={experience === '2-5'}
              onChange={setExperience}
              label="2-5 years"
            />
            <M3Radio
              name="experience"
              value="5-10"
              checked={experience === '5-10'}
              onChange={setExperience}
              label="5-10 years"
            />
            <M3Radio
              name="experience"
              value="10+"
              checked={experience === '10+'}
              onChange={setExperience}
              label="10+ years"
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold' }}>
            Work Preference
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <M3Radio
              name="preference"
              value="remote"
              checked={preference === 'remote'}
              onChange={setPreference}
              label="Remote"
            />
            <M3Radio
              name="preference"
              value="hybrid"
              checked={preference === 'hybrid'}
              onChange={setPreference}
              label="Hybrid"
            />
            <M3Radio
              name="preference"
              value="onsite"
              checked={preference === 'onsite'}
              onChange={setPreference}
              label="On-site"
            />
          </div>
        </div>

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

        <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <strong>Form Data:</strong>
          <pre style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
            {JSON.stringify({ experience, preference }, null, 2)}
          </pre>
        </div>
      </form>
    );
  },
};

/**
 * Multiple Groups
 */
export const MultipleGroups: Story = {
  render: () => {
    const [group1, setGroup1] = useState<string | number>('a1');
    const [group2, setGroup2] = useState<string | number>('b1');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ margin: '0 0 12px 0' }}>Group 1</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <M3Radio
              name="group1"
              value="a1"
              checked={group1 === 'a1'}
              onChange={setGroup1}
              label="Option A1"
            />
            <M3Radio
              name="group1"
              value="a2"
              checked={group1 === 'a2'}
              onChange={setGroup1}
              label="Option A2"
            />
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 12px 0' }}>Group 2</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <M3Radio
              name="group2"
              value="b1"
              checked={group2 === 'b1'}
              onChange={setGroup2}
              label="Option B1"
            />
            <M3Radio
              name="group2"
              value="b2"
              checked={group2 === 'b2'}
              onChange={setGroup2}
              label="Option B2"
            />
          </div>
        </div>

        <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <div><strong>Group 1:</strong> {group1}</div>
          <div><strong>Group 2:</strong> {group2}</div>
        </div>
      </div>
    );
  },
};
