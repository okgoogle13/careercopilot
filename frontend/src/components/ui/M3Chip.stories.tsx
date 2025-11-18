import type { Meta, StoryObj } from '@storybook/react';
import { M3Chip } from './M3Chip';
import { useState } from 'react';

const meta: Meta<typeof M3Chip> = {
  title: 'M3/Data Display/Chip',
  component: M3Chip,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outlined'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'error', 'success'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: 'boolean',
    },
    removable: {
      control: 'boolean',
    },
    selected: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Chip>;

export const Basic: Story = {
  args: {
    label: 'Chip',
  },
};

export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <M3Chip label="Primary" color="primary" />
      <M3Chip label="Secondary" color="secondary" />
      <M3Chip label="Tertiary" color="tertiary" />
      <M3Chip label="Error" color="error" />
      <M3Chip label="Success" color="success" />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <M3Chip label="Small" size="small" />
      <M3Chip label="Medium" size="medium" />
      <M3Chip label="Large" size="large" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <M3Chip label="Filled" variant="filled" />
      <M3Chip label="Outlined" variant="outlined" />
    </div>
  ),
};

export const Removable: Story = {
  render: () => {
    const [chips, setChips] = useState(['React', 'TypeScript', 'JavaScript', 'CSS']);

    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {chips.map((chip) => (
          <M3Chip
            key={chip}
            label={chip}
            removable
            onDelete={() => setChips(chips.filter((c) => c !== chip))}
          />
        ))}
      </div>
    );
  },
};

export const WithIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <M3Chip
        label="Favorite"
        icon={
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        }
      />
      <M3Chip
        label="Download"
        icon={
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" />
          </svg>
        }
      />
    </div>
  ),
};

export const WithAvatar: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <M3Chip
        label="John Doe"
        avatar={
          <div style={{ width: '100%', height: '100%', backgroundColor: '#1976d2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>
            JD
          </div>
        }
      />
      <M3Chip
        label="Jane Smith"
        avatar={
          <div style={{ width: '100%', height: '100%', backgroundColor: '#dc004e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>
            JS
          </div>
        }
      />
    </div>
  ),
};

export const Clickable: Story = {
  render: () => {
    const [clicked, setClicked] = useState<string | null>(null);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['React', 'Vue', 'Angular', 'Svelte'].map((framework) => (
            <M3Chip
              key={framework}
              label={framework}
              onClick={() => setClicked(framework)}
              selected={clicked === framework}
            />
          ))}
        </div>
        {clicked && (
          <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <strong>Selected:</strong> {clicked}
          </div>
        )}
      </div>
    );
  },
};

export const FilterChips: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['React']);

    const filters = ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'];

    const toggleFilter = (filter: string) => {
      if (selected.includes(filter)) {
        setSelected(selected.filter((f) => f !== filter));
      } else {
        setSelected([...selected, filter]);
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {filters.map((filter) => (
            <M3Chip
              key={filter}
              label={filter}
              variant="outlined"
              onClick={() => toggleFilter(filter)}
              selected={selected.includes(filter)}
            />
          ))}
        </div>
        <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <strong>Active Filters:</strong> {selected.join(', ') || 'None'}
        </div>
      </div>
    );
  },
};

export const TagInput: Story = {
  render: () => {
    const [tags, setTags] = useState(['React', 'TypeScript', 'Node.js']);
    const [input, setInput] = useState('');

    const addTag = () => {
      if (input.trim() && !tags.includes(input.trim())) {
        setTags([...tags, input.trim()]);
        setInput('');
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', minHeight: '48px' }}>
          {tags.map((tag) => (
            <M3Chip
              key={tag}
              label={tag}
              size="small"
              removable
              onDelete={() => setTags(tags.filter((t) => t !== tag))}
            />
          ))}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTag()}
            placeholder="Add tag..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              minWidth: '100px',
              fontSize: '14px',
            }}
          />
        </div>
        <button
          onClick={addTag}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#1976d2',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Add Tag
        </button>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <M3Chip label="Disabled" disabled />
      <M3Chip label="Disabled Removable" disabled removable />
      <M3Chip label="Disabled Outlined" variant="outlined" disabled />
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
      <div>
        <h4 style={{ marginTop: 0 }}>Filled</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <M3Chip label="Primary" color="primary" />
          <M3Chip label="Secondary" color="secondary" />
          <M3Chip label="Error" color="error" />
        </div>
      </div>
      <div>
        <h4 style={{ marginTop: 0 }}>Outlined</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <M3Chip label="Primary" variant="outlined" color="primary" />
          <M3Chip label="Secondary" variant="outlined" color="secondary" />
          <M3Chip label="Error" variant="outlined" color="error" />
        </div>
      </div>
      <div>
        <h4 style={{ marginTop: 0 }}>Removable</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <M3Chip label="Remove me" removable />
          <M3Chip label="Delete me" removable variant="outlined" />
          <M3Chip label="Can't remove" removable disabled />
        </div>
      </div>
    </div>
  ),
};

export const SkillTags: Story = {
  render: () => {
    const skills = [
      { name: 'React', level: 'expert', color: 'primary' as const },
      { name: 'TypeScript', level: 'advanced', color: 'secondary' as const },
      { name: 'Node.js', level: 'intermediate', color: 'tertiary' as const },
      { name: 'Python', level: 'beginner', color: 'success' as const },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ margin: 0 }}>Technical Skills</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {skills.map((skill) => (
            <M3Chip
              key={skill.name}
              label={`${skill.name} (${skill.level})`}
              color={skill.color}
              variant="outlined"
            />
          ))}
        </div>
      </div>
    );
  },
};
