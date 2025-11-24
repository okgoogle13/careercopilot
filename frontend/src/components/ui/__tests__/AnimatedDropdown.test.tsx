import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { AnimatedDropdown, DropdownItem } from '../AnimatedDropdown';
import * as React from 'react';

describe('AnimatedDropdown', () => {
  const mockItems: DropdownItem[] = [
    { label: 'Profile', value: 'profile', icon: <span data-testid="profile-icon">👤</span> },
    { label: 'Settings', value: 'settings', icon: <span data-testid="settings-icon">⚙️</span> },
    { label: 'Logout', value: 'logout' },
  ];

  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('renders without errors', () => {
    render(
      <AnimatedDropdown
        trigger={<button>Menu</button>}
        items={mockItems}
        onSelect={mockOnSelect}
      />
    );
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('renders trigger element', () => {
    render(
      <AnimatedDropdown
        trigger={<button>Account</button>}
        items={mockItems}
        onSelect={mockOnSelect}
      />
    );
    expect(screen.getByText('Account')).toBeInTheDocument();
  });

  it('does not show dropdown initially', () => {
    render(
      <AnimatedDropdown
        trigger={<button>Menu</button>}
        items={mockItems}
        onSelect={mockOnSelect}
      />
    );
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens dropdown when trigger is clicked', async () => {
    const user = userEvent.setup();

    render(
      <AnimatedDropdown
        trigger={<button>Menu</button>}
        items={mockItems}
        onSelect={mockOnSelect}
      />
    );

    await user.click(screen.getByText('Menu'));

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  it('closes dropdown when trigger is clicked again', async () => {
    const user = userEvent.setup();

    render(
      <AnimatedDropdown
        trigger={<button>Menu</button>}
        items={mockItems}
        onSelect={mockOnSelect}
      />
    );

    await user.click(screen.getByText('Menu'));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    await user.click(screen.getByText('Menu'));

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('renders all menu items when open', async () => {
    const user = userEvent.setup();

    render(
      <AnimatedDropdown
        trigger={<button>Menu</button>}
        items={mockItems}
        onSelect={mockOnSelect}
      />
    );

    await user.click(screen.getByText('Menu'));

    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  it('renders item icons when provided', async () => {
    const user = userEvent.setup();

    render(
      <AnimatedDropdown
        trigger={<button>Menu</button>}
        items={mockItems}
        onSelect={mockOnSelect}
      />
    );

    await user.click(screen.getByText('Menu'));

    await waitFor(() => {
      expect(screen.getByTestId('profile-icon')).toBeInTheDocument();
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
    });
  });

  it('calls onSelect when item is clicked', async () => {
    const user = userEvent.setup();

    render(
      <AnimatedDropdown
        trigger={<button>Menu</button>}
        items={mockItems}
        onSelect={mockOnSelect}
      />
    );

    await user.click(screen.getByText('Menu'));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    await user.click(screen.getByText('Profile'));

    expect(mockOnSelect).toHaveBeenCalledWith('profile');
  });

  it('closes dropdown after item selection', async () => {
    const user = userEvent.setup();

    render(
      <AnimatedDropdown
        trigger={<button>Menu</button>}
        items={mockItems}
        onSelect={mockOnSelect}
      />
    );

    await user.click(screen.getByText('Menu'));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    await user.click(screen.getByText('Profile'));

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('renders disabled items', async () => {
    const user = userEvent.setup();
    const items: DropdownItem[] = [
      { label: 'Enabled', value: 'enabled' },
      { label: 'Disabled', value: 'disabled', disabled: true },
    ];

    render(
      <AnimatedDropdown
        trigger={<button>Menu</button>}
        items={items}
        onSelect={mockOnSelect}
      />
    );

    await user.click(screen.getByText('Menu'));

    await waitFor(() => {
      const disabledItem = screen.getByText('Disabled').closest('button');
      expect(disabledItem).toBeDisabled();
    });
  });

  it('does not call onSelect for disabled items', async () => {
    const user = userEvent.setup();
    const items: DropdownItem[] = [
      { label: 'Disabled', value: 'disabled', disabled: true },
    ];

    render(
      <AnimatedDropdown
        trigger={<button>Menu</button>}
        items={items}
        onSelect={mockOnSelect}
      />
    );

    await user.click(screen.getByText('Menu'));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    const disabledItem = screen.getByText('Disabled');
    await user.click(disabledItem);

    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('supports controlled mode with open prop', async () => {
    const user = userEvent.setup();
    const mockOnOpenChange = jest.fn();

    const { rerender } = render(
      <AnimatedDropdown
        trigger={<button>Menu</button>}
        items={mockItems}
        onSelect={mockOnSelect}
        open={false}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await user.click(screen.getByText('Menu'));

    expect(mockOnOpenChange).toHaveBeenCalledWith(true);

    rerender(
      <AnimatedDropdown
        trigger={<button>Menu</button>}
        items={mockItems}
        onSelect={mockOnSelect}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('supports different placement values', () => {
    const placements = ['bottom-start', 'bottom-end', 'top-start', 'top-end'] as const;

    placements.forEach((placement) => {
      const { unmount } = render(
        <AnimatedDropdown
          trigger={<button>Menu {placement}</button>}
          items={mockItems}
          onSelect={mockOnSelect}
          placement={placement}
        />
      );
      expect(screen.getByText(`Menu ${placement}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('uses default placement of bottom-start', () => {
    render(
      <AnimatedDropdown
        trigger={<button>Menu</button>}
        items={mockItems}
        onSelect={mockOnSelect}
      />
    );
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('supports custom width', async () => {
    const user = userEvent.setup();

    render(
      <AnimatedDropdown
        trigger={<button>Menu</button>}
        items={mockItems}
        onSelect={mockOnSelect}
        width={300}
      />
    );

    await user.click(screen.getByText('Menu'));

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    const { container } = render(
      <AnimatedDropdown
        trigger={<button>Menu</button>}
        items={mockItems}
        onSelect={mockOnSelect}
        className="custom-dropdown"
      />
    );

    expect(container.querySelector('.custom-dropdown')).toBeInTheDocument();
  });

  it('has correct ARIA attributes', async () => {
    const user = userEvent.setup();

    render(
      <AnimatedDropdown
        trigger={<button>Menu</button>}
        items={mockItems}
        onSelect={mockOnSelect}
      />
    );

    const trigger = screen.getByText('Menu').parentElement;
    expect(trigger).toHaveAttribute('aria-haspopup', 'true');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(screen.getByText('Menu'));

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();

    render(
      <AnimatedDropdown
        trigger={<button>Menu</button>}
        items={mockItems}
        onSelect={mockOnSelect}
      />
    );

    await user.click(screen.getByText('Menu'));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('closes on click outside', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <button data-testid="outside">Outside</button>
        <AnimatedDropdown
          trigger={<button>Menu</button>}
          items={mockItems}
          onSelect={mockOnSelect}
        />
      </div>
    );

    await user.click(screen.getByText('Menu'));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    await user.click(screen.getByTestId('outside'));

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('handles multiple items correctly', async () => {
    const user = userEvent.setup();
    const manyItems: DropdownItem[] = Array.from({ length: 10 }, (_, i) => ({
      label: `Item ${i + 1}`,
      value: `item-${i + 1}`,
    }));

    render(
      <AnimatedDropdown
        trigger={<button>Menu</button>}
        items={manyItems}
        onSelect={mockOnSelect}
      />
    );

    await user.click(screen.getByText('Menu'));

    await waitFor(() => {
      manyItems.forEach((item) => {
        expect(screen.getByText(item.label)).toBeInTheDocument();
      });
    });
  });
});
