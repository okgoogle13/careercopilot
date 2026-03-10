import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { DashboardScreen } from '../screens/DashboardScreen';

describe('DashboardScreen', () => {
  it('renders migrated dashboard content', () => {
    render(
      <MemoryRouter>
        <DashboardScreen />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /hold the full search in one view/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/applications in motion/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /review active roles/i }),
    ).toBeInTheDocument();
  });

  it('updates status when dashboard actions are used', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <DashboardScreen />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /open draft queue/i }));

    expect(screen.getByRole('status')).toHaveTextContent(
      /secondary dashboard workflow placeholder acknowledged/i,
    );
  });
});
