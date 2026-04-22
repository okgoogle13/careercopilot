import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { applicationService, type Application } from '@/api/applicationService';

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

const baseApplication = (overrides: Partial<Application> = {}): Application => ({
  id: 'app-1',
  userId: 'user-1',
  jobTitle: 'Case Worker',
  companyName: 'Community First',
  jobDescription: 'Support clients across intake and planning.',
  source: 'manual',
  status: 'applied',
  appliedDate: '2026-03-10T00:00:00.000Z',
  createdAt: '2026-03-10T00:00:00.000Z',
  updatedAt: '2026-03-10T00:00:00.000Z',
  ...overrides,
});

async function renderTracker() {
  const { ApplicationTracker } = await import('../ApplicationTracker');
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ApplicationTracker />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

describe('ApplicationTracker', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  it('renders the empty state when the API returns no applications', async () => {
    jest.spyOn(applicationService, 'listApplications').mockResolvedValue([]);

    await renderTracker();

    expect(await screen.findByText('No applications yet')).toBeInTheDocument();
  });

  it('renders an error state when the applications query fails', async () => {
    jest
      .spyOn(applicationService, 'listApplications')
      .mockRejectedValue(new Error('backend unavailable'));

    await renderTracker();

    expect(await screen.findByText(/Failed to load application data/i)).toBeInTheDocument();
  });

  it('opens the detail panel when a tracker card is selected', async () => {
    jest.spyOn(applicationService, 'listApplications').mockResolvedValue([
      baseApplication(),
      baseApplication({
        id: 'app-2',
        jobTitle: 'Support Coordinator',
        status: 'interviewing',
      }),
    ]);
    const getApplicationSpy = jest
      .spyOn(applicationService, 'getApplication')
      .mockResolvedValue(baseApplication());

    await renderTracker();

    const detailButtons = await screen.findAllByRole('button', { name: 'DETAILS' });
    fireEvent.click(detailButtons[0]);

    await waitFor(() => {
      expect(getApplicationSpy).toHaveBeenCalledWith('app-1');
    });
    expect(await screen.findByText(/Status actions/i)).toBeInTheDocument();
  });

  it('updates status and refreshes the tracker board after a move action', async () => {
    const listApplicationsSpy = jest
      .spyOn(applicationService, 'listApplications')
      .mockResolvedValueOnce([baseApplication()])
      .mockResolvedValueOnce([baseApplication({ status: 'interviewing' })]);
    const updateApplicationSpy = jest
      .spyOn(applicationService, 'updateApplication')
      .mockResolvedValue(baseApplication({ status: 'interviewing' }));

    await renderTracker();

    const card = await screen.findByTestId('tracker-card-app-1');
    const targetColumn = screen.getByTestId('tracker-column-interviewing');
    const dataTransfer = {
      value: '',
      setData: jest.fn((_: string, value: string) => {
        dataTransfer.value = value;
      }),
      getData: jest.fn(() => dataTransfer.value),
    };

    fireEvent.dragStart(card, { dataTransfer });
    fireEvent.dragOver(targetColumn, { dataTransfer });
    fireEvent.drop(targetColumn, { dataTransfer });

    await waitFor(() => {
      expect(updateApplicationSpy).toHaveBeenCalledWith('app-1', { status: 'interviewing' });
    });
    await waitFor(() => {
      expect(listApplicationsSpy).toHaveBeenCalledTimes(2);
    });
  });
});
