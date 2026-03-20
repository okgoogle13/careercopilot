import React from 'react';
import { render, screen } from '@testing-library/react';

(jest as any).unstable_mockModule('@/components/ui/KeralaRageButton', () => ({
  KeralaRageButton: ({
    children,
    startIcon: _startIcon,
    variant: _variant,
    size: _size,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    startIcon?: React.ReactNode;
    variant?: string;
    size?: string;
  }) => <button {...props}>{children}</button>,
}));

const { AssetLibrary } = await import('../AssetLibrary');

describe('AssetLibrary', () => {
  it('uses archive copy and KR shape classes on primary surfaces', () => {
    const { container } = render(<AssetLibrary />);

    expect(screen.getByRole('heading', { name: /working archive/i })).toBeInTheDocument();
    expect(
      screen.getByText(/keep your proofs, source files, and working material within reach/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload to archive/i })).toBeInTheDocument();

    const archiveCard = container.querySelector('.rounded-placard');
    const actionButton = container.querySelector('.rounded-strike');

    expect(archiveCard).not.toBeNull();
    expect(actionButton).not.toBeNull();
  });
});
