import React from 'react';
import { render, screen } from '@testing-library/react';
import { Label } from '../../label/label';

describe('Label', () => {
  describe('Rendering', () => {
    it('renders label with children', () => {
      render(<Label>Label Text</Label>);
      expect(screen.getByText('Label Text')).toBeInTheDocument();
    });

    it('renders as label element', () => {
      const { container } = render(<Label>Label</Label>);
      expect(container.querySelector('label')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLLabelElement>();
      render(<Label ref={ref}>Label</Label>);
      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    });
  });

  describe('Props', () => {
    it('passes through additional props', () => {
      render(<Label data-testid="custom-label">Label</Label>);
      expect(screen.getByTestId('custom-label')).toBeInTheDocument();
    });

    it('accepts htmlFor prop', () => {
      render(<Label htmlFor="input-id">Label</Label>);
      const label = screen.getByText('Label');
      expect(label).toHaveAttribute('for', 'input-id');
    });

    it('accepts className prop', () => {
      render(<Label className="custom-class">Label</Label>);
      const label = screen.getByText('Label');
      expect(label.className).toContain('custom-class');
    });

    it('accepts id prop', () => {
      render(<Label id="custom-id">Label</Label>);
      const label = screen.getByText('Label');
      expect(label).toHaveAttribute('id', 'custom-id');
    });

    it('accepts required prop', () => {
      render(<Label required>Required Label</Label>);
      expect(screen.getByText('Required Label')).toBeInTheDocument();
    });

    it('accepts disabled prop', () => {
      render(<Label disabled>Disabled Label</Label>);
      expect(screen.getByText('Disabled Label')).toBeInTheDocument();
    });
  });

  describe('Integration with Form Controls', () => {
    it('associates with input using htmlFor', () => {
      render(
        <>
          <Label htmlFor="username">Username</Label>
          <input id="username" type="text" />
        </>
      );

      const label = screen.getByText('Username');
      const input = screen.getByRole('textbox');

      expect(label).toHaveAttribute('for', 'username');
      expect(input).toHaveAttribute('id', 'username');
    });

    it('can wrap form controls', () => {
      render(
        <Label>
          Checkbox Label
          <input type="checkbox" />
        </Label>
      );

      expect(screen.getByText('Checkbox Label')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('works with multiple inputs', () => {
      render(
        <>
          <Label htmlFor="first-name">First Name</Label>
          <input id="first-name" type="text" />
          <Label htmlFor="last-name">Last Name</Label>
          <input id="last-name" type="text" />
        </>
      );

      expect(screen.getByText('First Name')).toHaveAttribute('for', 'first-name');
      expect(screen.getByText('Last Name')).toHaveAttribute('for', 'last-name');
    });
  });

  describe('Accessibility', () => {
    it('provides accessible name for associated input', () => {
      render(
        <>
          <Label htmlFor="email">Email Address</Label>
          <input id="email" type="email" />
        </>
      );

      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    });

    it('supports aria-label on associated input', () => {
      render(
        <>
          <Label htmlFor="search">Search</Label>
          <input id="search" type="text" aria-label="Search input" />
        </>
      );

      expect(screen.getByLabelText('Search input')).toBeInTheDocument();
    });

    it('indicates required fields', () => {
      render(
        <>
          <Label htmlFor="required-field" required>
            Required Field
          </Label>
          <input id="required-field" type="text" required />
        </>
      );

      expect(screen.getByText('Required Field')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeRequired();
    });
  });

  describe('Edge Cases', () => {
    it('renders with empty children', () => {
      render(<Label></Label>);
      const labels = document.querySelectorAll('label');
      expect(labels.length).toBeGreaterThan(0);
    });

    it('renders with React node children', () => {
      render(
        <Label>
          <span>Complex</span> <strong>Label</strong>
        </Label>
      );

      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Label')).toBeInTheDocument();
    });

    it('renders with very long text', () => {
      const longText = 'This is a very long label text that should wrap properly without breaking the layout';
      render(<Label>{longText}</Label>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles special characters', () => {
      render(<Label>Label with special chars: !@#$%^&*()</Label>);
      expect(screen.getByText(/special chars/i)).toBeInTheDocument();
    });

    it('renders with icon', () => {
      render(
        <Label>
          <svg data-testid="label-icon" /> Label with Icon
        </Label>
      );
      expect(screen.getByTestId('label-icon')).toBeInTheDocument();
      expect(screen.getByText(/Label with Icon/i)).toBeInTheDocument();
    });
  });
});
