import type { Meta, StoryObj } from '@storybook/react';
import { M3DatePicker } from './M3DatePicker';
import { useState } from 'react';

const meta: Meta<typeof M3DatePicker> = {
  title: 'M3/Inputs/DatePicker',
  component: M3DatePicker,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3DatePicker>;

export const Basic: Story = {
  args: {
    label: 'Select Date',
    placeholder: 'Choose a date...',
    helperText: 'Pick any date from the calendar',
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: new Date(2025, 0, 15),
    label: 'Pre-selected Date',
    helperText: 'Defaults to January 15, 2025',
  },
};

export const WithMinMaxDate: Story = {
  args: {
    label: 'Date Range Restricted',
    helperText: 'Only dates in January 2025 are selectable',
    minDate: new Date(2025, 0, 1),
    maxDate: new Date(2025, 0, 31),
    defaultValue: new Date(2025, 0, 15),
  },
};

export const FutureDatesOnly: Story = {
  args: {
    label: 'Future Dates Only',
    helperText: 'Past dates are disabled',
    minDate: new Date(),
  },
};

export const PastDatesOnly: Story = {
  args: {
    label: 'Past Dates Only',
    helperText: 'Future dates are disabled',
    maxDate: new Date(),
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled DatePicker',
    disabled: true,
    defaultValue: new Date(),
    helperText: 'This field is disabled',
  },
};

export const WithError: Story = {
  args: {
    label: 'Required Date',
    error: true,
    helperText: 'Please select a date',
  },
};

export const ControlledDatePicker: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(new Date());

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <M3DatePicker
          value={date}
          onChange={setDate}
          label="Controlled DatePicker"
          helperText={date ? `Selected: ${date.toLocaleDateString()}` : 'No date selected'}
        />

        <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <strong>Selected Date:</strong> {date ? date.toLocaleDateString() : 'None'}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setDate(new Date())}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: '#1976d2',
              color: 'white',
            }}
          >
            Set to Today
          </button>
          <button
            onClick={() => setDate(new Date(2025, 11, 25))}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: '#1976d2',
              color: 'white',
            }}
          >
            Set to Christmas 2025
          </button>
          <button
            onClick={() => setDate(null)}
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

export const AppointmentForm: Story = {
  render: () => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const today = new Date();
    const maxDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '500px' }}>
        <h3 style={{ margin: 0 }}>Schedule Appointment</h3>

        <M3DatePicker
          value={startDate}
          onChange={setStartDate}
          minDate={today}
          maxDate={maxDate}
          label="Start Date"
          placeholder="Select start date..."
          helperText="Choose an appointment start date"
        />

        <M3DatePicker
          value={endDate}
          onChange={setEndDate}
          minDate={startDate || today}
          maxDate={maxDate}
          label="End Date"
          placeholder="Select end date..."
          helperText="Must be after start date"
          disabled={!startDate}
        />

        <div style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <strong>Appointment Summary:</strong>
          <pre style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
            {JSON.stringify(
              {
                start: startDate?.toLocaleDateString() || 'Not set',
                end: endDate?.toLocaleDateString() || 'Not set',
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    );
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
      <M3DatePicker
        label="Normal State"
        placeholder="Select date..."
      />
      <M3DatePicker
        label="With Value"
        defaultValue={new Date()}
      />
      <M3DatePicker
        label="Error State"
        error
        helperText="Required field"
      />
      <M3DatePicker
        label="Disabled"
        disabled
        defaultValue={new Date()}
      />
    </div>
  ),
};

export const KeyboardNavigation: Story = {
  args: {
    label: 'Keyboard Navigation Demo',
    helperText: 'Use arrow keys to navigate dates, Enter/Space to select, Escape to close',
  },
};

export const BirthdayPicker: Story = {
  render: () => {
    const [birthDate, setBirthDate] = useState<Date | null>(null);

    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18); // Minimum age 18

    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 100); // Maximum age 100

    return (
      <div style={{ maxWidth: '400px' }}>
        <M3DatePicker
          value={birthDate}
          onChange={setBirthDate}
          label="Date of Birth"
          placeholder="MM/DD/YYYY"
          helperText="You must be at least 18 years old"
          minDate={minDate}
          maxDate={maxDate}
        />
        {birthDate && (
          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
            <strong>Age:</strong> {Math.floor((new Date().getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years old
          </div>
        )}
      </div>
    );
  },
};

export const DeadlinePicker: Story = {
  render: () => {
    const [deadline, setDeadline] = useState<Date | null>(null);

    const today = new Date();
    const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const oneMonthFromNow = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

    const daysUntilDeadline = deadline
      ? Math.ceil((deadline.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
      : null;

    return (
      <div style={{ maxWidth: '400px' }}>
        <M3DatePicker
          value={deadline}
          onChange={setDeadline}
          minDate={oneWeekFromNow}
          maxDate={oneMonthFromNow}
          label="Project Deadline"
          helperText="Must be between 1 week and 1 month from now"
        />
        {deadline && daysUntilDeadline !== null && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: daysUntilDeadline <= 14 ? '#fff3e0' : '#e8f5e9',
              borderRadius: '8px',
            }}
          >
            <strong>Time remaining:</strong> {daysUntilDeadline} days
          </div>
        )}
      </div>
    );
  },
};
