import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Jar } from '../Jar';

const options = [
  { value: 'social-work', label: 'Social Worker' },
  { value: 'community', label: 'Community Officer' },
];

describe('Jar', () => {
  it('renders label and placeholder', () => {
    render(<Jar label="Preferred role" options={options} placeholder="Select role" />);

    expect(screen.getByText('Preferred role')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /select role/i })).toBeInTheDocument();
  });

  it('opens options and calls onChange on selection', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<Jar label="Role" options={options} onChange={onChange} />);

    await user.click(screen.getByRole('button'));
    const listbox = screen.getByRole('listbox');
    await user.click(within(listbox).getByText('Social Worker'));

    expect(onChange).toHaveBeenCalledWith('social-work');
  });

  it('prevents opening when disabled', async () => {
    const user = userEvent.setup();

    render(<Jar label="Role" options={options} disabled />);
    const trigger = screen.getByRole('button');

    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
