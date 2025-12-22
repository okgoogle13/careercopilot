import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// This is a hypothetical component used by KscGeneratorPage
const KscCriteriaInput = ({ onAddCriterion }) => {
  const [value, setValue] = React.useState('');

  const handleAdd = () => {
    if (value.trim()) {
      onAddCriterion(value);
      setValue('');
    }
  };

  return (
    <div>
      <input
        aria-label="Criterion Input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
};

describe('KscCriteriaInput', () => {
  it('calls onAddCriterion with the input value when add button is clicked', async () => {
    const user = userEvent.setup();
    const handleAddCriterion = jest.fn();
    render(<KscCriteriaInput onAddCriterion={handleAddCriterion} />);

    const input = screen.getByLabelText('Criterion Input');
    const addButton = screen.getByRole('button', { name: /Add/i });

    await user.type(input, 'New criterion text');
    await user.click(addButton);

    expect(handleAddCriterion).toHaveBeenCalledTimes(1);
    expect(handleAddCriterion).toHaveBeenCalledWith('New criterion text');
    expect(input).toHaveValue('');
  });

  it('does not call onAddCriterion if the input is empty', async () => {
    const user = userEvent.setup();
    const handleAddCriterion = jest.fn();
    render(<KscCriteriaInput onAddCriterion={handleAddCriterion} />);

    await user.click(screen.getByRole('button', { name: /Add/i }));

    expect(handleAddCriterion).not.toHaveBeenCalled();
  });
});
