import type { Meta, StoryObj } from '@storybook/react';
import { M3Select } from './M3Select';
import { useState } from 'react';

const meta: Meta<typeof M3Select> = {
  title: 'M3/Inputs/Select',
  component: M3Select,
  tags: ['autodocs'],
  argTypes: {
    multiple: {
      control: 'boolean',
    },
    searchable: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Select>;

const sampleOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
  { label: 'Elderberry', value: 'elderberry' },
  { label: 'Fig', value: 'fig' },
  { label: 'Grape', value: 'grape' },
  { label: 'Honeydew', value: 'honeydew' },
];

const jobOptions = [
  { label: 'Frontend Developer', value: 'frontend' },
  { label: 'Backend Developer', value: 'backend' },
  { label: 'Full Stack Developer', value: 'fullstack' },
  { label: 'DevOps Engineer', value: 'devops' },
  { label: 'Data Scientist', value: 'datascience' },
  { label: 'UX Designer', value: 'uxdesigner' },
  { label: 'Product Manager', value: 'pm' },
  { label: 'QA Engineer', value: 'qa', disabled: true },
];

export const Basic: Story = {
  args: {
    options: sampleOptions,
    placeholder: 'Select a fruit',
    label: 'Favorite Fruit',
    helperText: 'Choose your favorite fruit from the list',
  },
};

export const WithDefaultValue: Story = {
  args: {
    options: sampleOptions,
    defaultValue: 'banana',
    label: 'Pre-selected Fruit',
    placeholder: 'Select...',
  },
};

export const Searchable: Story = {
  args: {
    options: jobOptions,
    searchable: true,
    label: 'Job Role',
    placeholder: 'Search and select...',
    helperText: 'Type to search through options',
  },
};

export const MultiSelect: Story = {
  args: {
    options: sampleOptions,
    multiple: true,
    label: 'Select Multiple Fruits',
    placeholder: 'Choose fruits...',
    helperText: 'Select one or more options',
  },
};

export const SearchableMultiSelect: Story = {
  args: {
    options: jobOptions,
    multiple: true,
    searchable: true,
    label: 'Skills',
    placeholder: 'Search and select skills...',
    helperText: 'Select all that apply',
  },
};

export const WithDisabledOptions: Story = {
  args: {
    options: jobOptions,
    label: 'Available Positions',
    placeholder: 'Select a position',
    helperText: 'QA Engineer is currently unavailable',
  },
};

export const Disabled: Story = {
  args: {
    options: sampleOptions,
    disabled: true,
    label: 'Disabled Select',
    placeholder: 'Cannot select...',
    helperText: 'This field is disabled',
  },
};

export const WithError: Story = {
  args: {
    options: sampleOptions,
    error: true,
    label: 'Required Field',
    placeholder: 'Select...',
    helperText: 'This field is required',
  },
};

export const LargeOptionList: Story = {
  args: {
    options: Array.from({ length: 50 }, (_, i) => ({
      label: `Option ${i + 1}`,
      value: `option-${i + 1}`,
    })),
    searchable: true,
    label: 'Large List',
    placeholder: 'Search from 50 options...',
    helperText: 'Demonstrates scrolling and search',
  },
};

export const ControlledSelect: Story = {
  render: () => {
    const [value, setValue] = useState<string | number | (string | number)[]>('banana');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <M3Select
          options={sampleOptions}
          value={value}
          onChange={setValue}
          label="Controlled Select"
          placeholder="Select..."
          helperText={`Current value: ${value}`}
        />
        <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <strong>Selected Value:</strong> {String(value)}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setValue('apple')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: '#1976d2',
              color: 'white',
            }}
          >
            Set to Apple
          </button>
          <button
            onClick={() => setValue('cherry')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: '#1976d2',
              color: 'white',
            }}
          >
            Set to Cherry
          </button>
          <button
            onClick={() => setValue('')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: '#666',
              color: 'white',
            }}
          >
            Clear
          </button>
        </div>
      </div>
    );
  },
};

export const ControlledMultiSelect: Story = {
  render: () => {
    const [value, setValue] = useState<string | number | (string | number)[]>(['banana', 'cherry']);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <M3Select
          options={sampleOptions}
          value={value}
          onChange={setValue}
          multiple
          label="Controlled Multi-Select"
          placeholder="Select fruits..."
          helperText={`Selected: ${Array.isArray(value) ? value.join(', ') : value}`}
        />
        <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <strong>Selected Values:</strong> [{Array.isArray(value) ? value.join(', ') : value}]
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setValue(['apple', 'banana', 'cherry'])}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: '#1976d2',
              color: 'white',
            }}
          >
            Select Three
          </button>
          <button
            onClick={() => setValue([])}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: '#666',
              color: 'white',
            }}
          >
            Clear All
          </button>
        </div>
      </div>
    );
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
      <M3Select
        options={sampleOptions}
        label="Basic Select"
        placeholder="Select..."
      />
      <M3Select
        options={jobOptions}
        searchable
        label="Searchable"
        placeholder="Search..."
      />
      <M3Select
        options={sampleOptions}
        multiple
        label="Multi-Select"
        placeholder="Choose multiple..."
      />
      <M3Select
        options={sampleOptions}
        error
        label="Error State"
        placeholder="Select..."
        helperText="Required field"
      />
    </div>
  ),
};

export const KeyboardNavigation: Story = {
  args: {
    options: sampleOptions,
    label: 'Keyboard Navigation Demo',
    placeholder: 'Try keyboard navigation...',
    helperText: 'Use Enter/Space to open, Arrow keys to navigate, Escape to close',
  },
};

export const JobApplicationForm: Story = {
  render: () => {
    const [role, setRole] = useState<string | number | (string | number)[]>('');
    const [skills, setSkills] = useState<string | number | (string | number)[]>([]);
    const [experience, setExperience] = useState<string | number | (string | number)[]>('');

    const experienceOptions = [
      { label: '0-1 years', value: 'junior' },
      { label: '2-5 years', value: 'mid' },
      { label: '5-10 years', value: 'senior' },
      { label: '10+ years', value: 'expert' },
    ];

    const skillOptions = [
      { label: 'JavaScript', value: 'js' },
      { label: 'TypeScript', value: 'ts' },
      { label: 'React', value: 'react' },
      { label: 'Node.js', value: 'node' },
      { label: 'Python', value: 'python' },
      { label: 'SQL', value: 'sql' },
      { label: 'Docker', value: 'docker' },
      { label: 'AWS', value: 'aws' },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '500px' }}>
        <h3 style={{ margin: 0 }}>Job Application Form</h3>

        <M3Select
          options={jobOptions}
          value={role}
          onChange={setRole}
          label="Desired Role"
          placeholder="Select a role..."
          helperText="Choose the position you're applying for"
        />

        <M3Select
          options={skillOptions}
          value={skills}
          onChange={setSkills}
          multiple
          searchable
          label="Technical Skills"
          placeholder="Select your skills..."
          helperText="Select all that apply"
        />

        <M3Select
          options={experienceOptions}
          value={experience}
          onChange={setExperience}
          label="Years of Experience"
          placeholder="Select experience level..."
        />

        <div style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <strong>Form Data:</strong>
          <pre style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
            {JSON.stringify({ role, skills, experience }, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};
