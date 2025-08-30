import '@testing-library/jest-dom';
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal', () => {
  it('renders children when open', () => {
    render(<Modal isOpen={true} onClose={() => {}}><div>Modal Content</div></Modal>);
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render children when closed', () => {
    render(<Modal isOpen={false} onClose={() => {}}><div>Hidden Content</div></Modal>);
    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
  });
});
