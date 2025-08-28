import '@testing-library/jest-dom';
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Input } from '../input';

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />);
  // @ts-expect-error jest-dom matcher not recognized by TS
  expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with value', () => {
    render(<Input value="test value" onChange={() => {}} />);
  // @ts-expect-error jest-dom matcher not recognized by TS
  expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
  });

  it('renders as disabled', () => {
    render(<Input disabled />);
  // @ts-expect-error jest-dom matcher not recognized by TS
  expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
