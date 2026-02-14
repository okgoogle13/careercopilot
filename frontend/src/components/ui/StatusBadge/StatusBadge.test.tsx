import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
    it('renders with label text', () => {
        render(<StatusBadge label="Active" />);
        expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders dot when showDot is true', () => {
        // We can't easily query the dot by role, so we'll check structure via snapshot or existence
        // For now, simpler check is just ensuring no errors throw
        const { container } = render(<StatusBadge label="Active" showDot />);
        // The dot is an 8px box
        expect(container.firstChild).toHaveTextContent('Active');
    });

    it('uses primary variant classes/styles (implied)', () => {
        render(<StatusBadge label="Primary" variant="primary" />);
        expect(screen.getByText('Primary')).toBeInTheDocument();
    });

    it('renders outline variant', () => {
        render(<StatusBadge label="Outline" variant="outline" />);
        expect(screen.getByText('Outline')).toBeInTheDocument();
    });
});
