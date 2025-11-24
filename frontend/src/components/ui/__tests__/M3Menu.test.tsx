import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { M3Menu, M3MenuItem } from '../M3Menu';
import * as React from 'react';

describe('M3Menu', () => {
  const mockItems: M3MenuItem[] = [
    { label: 'Edit', value: 'edit', icon: <span data-testid="edit-icon">✏️</span> },
    { label: 'Delete', value: 'delete', icon: <span data-testid="delete-icon">🗑️</span> },
    { label: 'Share', value: 'share' },
  ];

  it('renders without errors', () => {
    render(
      <M3Menu items={mockItems} trigger={<button>Menu</button>} />
    );
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('renders trigger element', () => {
    render(
      <M3Menu items={mockItems} trigger={<button>Open Menu</button>} />
    );
    expect(screen.getByText('Open Menu')).toBeInTheDocument();
  });

  it('has correct ARIA attributes on trigger', () => {
    render(
      <M3Menu items={mockItems} trigger={<button>Menu</button>} />
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens menu when trigger is clicked', async () => {
    const user = userEvent.setup();

    render(
      <M3Menu items={mockItems} trigger={<button>Menu</button>} />
    );

    await user.click(screen.getByText('Menu'));

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  it('closes menu when trigger is clicked again', async () => {
    const user = userEvent.setup();

    render(
      <M3Menu items={mockItems} trigger={<button>Menu</button>} />
    );

    await user.click(screen.getByText('Menu'));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    await user.click(screen.getByText('Menu'));
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('renders all menu items when open', async () => {
    const user = userEvent.setup();

    render(
      <M3Menu items={mockItems} trigger={<button>Menu</button>} />
    );

    await user.click(screen.getByText('Menu'));

    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
      expect(screen.getByText('Share')).toBeInTheDocument();
    });
  });

  it('renders item icons when provided', async () => {
    const user = userEvent.setup();

    render(
      <M3Menu items={mockItems} trigger={<button>Menu</button>} />
    );

    await user.click(screen.getByText('Menu'));

    await waitFor(() => {
      expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
      expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
    });
  });

  it('calls onSelect when item is clicked', async () => {
    const user = userEvent.setup();
    const mockOnSelect = jest.fn();

    render(
      <M3Menu items={mockItems} trigger={<button>Menu</button>} onSelect={mockOnSelect} />
    );

    await user.click(screen.getByText('Menu'));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    await user.click(screen.getByText('Edit'));

    expect(mockOnSelect).toHaveBeenCalledWith('edit');
  });

  it('calls item onClick handler', async () => {
    const user = userEvent.setup();
    const mockItemClick = jest.fn();
    const items: M3MenuItem[] = [
      { label: 'Action', value: 'action', onClick: mockItemClick },
    ];

    render(
      <M3Menu items={items} trigger={<button>Menu</button>} />
    );

    await user.click(screen.getByText('Menu'));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    await user.click(screen.getByText('Action'));

    expect(mockItemClick).toHaveBeenCalled();
  });

  it('closes menu after item click by default', async () => {
    const user = userEvent.setup();

    render(
      <M3Menu items={mockItems} trigger={<button>Menu</button>} />
    );

    await user.click(screen.getByText('Menu'));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    await user.click(screen.getByText('Edit'));

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('keeps menu open when closeOnSelect is false', async () => {
    const user = userEvent.setup();

    render(
      <M3Menu items={mockItems} trigger={<button>Menu</button>} closeOnSelect={false} />
    );

    await user.click(screen.getByText('Menu'));
    await user.click(screen.getByText('Edit'));

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('renders disabled items', async () => {
    const user = userEvent.setup();
    const items: M3MenuItem[] = [
      { label: 'Enabled', value: 'enabled' },
      { label: 'Disabled', value: 'disabled', disabled: true },
    ];

    render(
      <M3Menu items={items} trigger={<button>Menu</button>} />
    );

    await user.click(screen.getByText('Menu'));

    await waitFor(() => {
      const disabledItem = screen.getByText('Disabled');
      expect(disabledItem).toHaveAttribute('aria-disabled', 'true');
    });
  });

  it('does not call onSelect for disabled items', async () => {
    const user = userEvent.setup();
    const mockOnSelect = jest.fn();
    const items: M3MenuItem[] = [
      { label: 'Disabled', value: 'disabled', disabled: true },
    ];

    render(
      <M3Menu items={items} trigger={<button>Menu</button>} onSelect={mockOnSelect} />
    );

    await user.click(screen.getByText('Menu'));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    await user.click(screen.getByText('Disabled'));

    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('renders dividers', async () => {
    const user = userEvent.setup();
    const items: M3MenuItem[] = [
      { label: 'First', value: 'first' },
      { label: 'Second', value: 'second', divider: true },
      { label: 'Third', value: 'third' },
    ];

    render(
      <M3Menu items={items} trigger={<button>Menu</button>} />
    );

    await user.click(screen.getByText('Menu'));

    await waitFor(() => {
      const divider = screen.getByRole('separator');
      expect(divider).toBeInTheDocument();
    });
  });

  it('supports controlled mode', async () => {
    const user = userEvent.setup();
    const mockOnOpenChange = jest.fn();

    const { rerender } = render(
      <M3Menu items={mockItems} trigger={<button>Menu</button>} open={false} onOpenChange={mockOnOpenChange} />
    );

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await user.click(screen.getByText('Menu'));

    expect(mockOnOpenChange).toHaveBeenCalledWith(true);

    rerender(
      <M3Menu items={mockItems} trigger={<button>Menu</button>} open={true} onOpenChange={mockOnOpenChange} />
    );

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('supports different placement values', () => {
    const placements = ['top', 'bottom', 'left', 'right', 'bottom-start', 'bottom-end', 'top-start', 'top-end'] as const;

    placements.forEach((placement) => {
      const { unmount } = render(
        <M3Menu items={mockItems} trigger={<button>Menu {placement}</button>} placement={placement} />
      );
      expect(screen.getByText(`Menu ${placement}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('applies custom className', () => {
    const { container } = render(
      <M3Menu items={mockItems} trigger={<button>Menu</button>} className="custom-menu" />
    );

    expect(container.querySelector('.custom-menu')).toBeInTheDocument();
  });

  it('has correct data-testid', () => {
    render(
      <M3Menu items={mockItems} trigger={<button>Menu</button>} />
    );

    expect(screen.getByTestId('m3-menu')).toBeInTheDocument();
  });

  it('supports keyboard navigation - Arrow Down', async () => {
    const user = userEvent.setup();

    render(
      <M3Menu items={mockItems} trigger={<button>Menu</button>} />
    );

    const trigger = screen.getByRole('button');
    trigger.focus();

    await user.keyboard('{ArrowDown}');

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  it('supports keyboard navigation - Escape closes menu', async () => {
    const user = userEvent.setup();

    render(
      <M3Menu items={mockItems} trigger={<button>Menu</button>} />
    );

    await user.click(screen.getByText('Menu'));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('supports keyboard navigation - Enter to select', async () => {
    const user = userEvent.setup();
    const mockOnSelect = jest.fn();

    render(
      <M3Menu items={mockItems} trigger={<button>Menu</button>} onSelect={mockOnSelect} />
    );

    const trigger = screen.getByRole('button');
    trigger.focus();

    await user.keyboard('{Enter}');
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    await user.keyboard('{Enter}');

    expect(mockOnSelect).toHaveBeenCalled();
  });

  it('closes on click outside', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <button data-testid="outside">Outside</button>
        <M3Menu items={mockItems} trigger={<button>Menu</button>} />
      </div>
    );

    await user.click(screen.getByText('Menu'));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    await user.click(screen.getByTestId('outside'));

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });
});
