import { render, screen, fireEvent } from '@testing-library/react';
import { ApplicationForm } from '../ApplicationForm';
import React from 'react';

describe('ApplicationForm', () => {
  it('renders correctly as a deposition station', () => {
    const onUpload = jest.fn();
    render(<ApplicationForm onUpload={onUpload} />);
    expect(screen.getByText(/DEPOSIT HISTORY/i)).toBeDefined();
    expect(screen.getByText(/DROP PDF HERE/i)).toBeDefined();
  });

  it('shows verifying state when isVerifying is true', () => {
    render(<ApplicationForm onUpload={jest.fn()} isVerifying={true} />);
    expect(screen.getByText(/Verifying Integrity/i)).toBeDefined();
  });
});
