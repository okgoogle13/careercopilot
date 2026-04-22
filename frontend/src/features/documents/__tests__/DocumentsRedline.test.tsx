import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { post as axiosPost } from 'axios';

let Documents: React.ComponentType;

beforeAll(async () => {
  ({ Documents } = (await import('../Documents')) as any);
});

function getRedlineBtn(docId = 1) {
  return screen.getByTestId(`redline-btn-${docId}`);
}

function getOverlay() {
  return screen.getByTestId('redline-overlay');
}

function getFileInput() {
  return screen.getByTestId('redline-file-input') as HTMLInputElement;
}

function getEditsInput() {
  return screen.getByTestId('redline-edits-input') as HTMLTextAreaElement;
}

function makeDocxFile(name = 'test.docx') {
  return new File(['docx-content'], name, {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
}

describe('Documents — Redline overlay', () => {
  beforeEach(() => {
    (axiosPost as jest.Mock).mockReset();
    URL.createObjectURL = jest.fn(() => 'blob:test-url');
    URL.revokeObjectURL = jest.fn();
  });

  it('shows the overlay when the Redline button on a card is clicked', async () => {
    render(<Documents />);

    await userEvent.click(getRedlineBtn(1));

    expect(getOverlay()).toBeInTheDocument();
    expect(getFileInput()).toBeInTheDocument();
  });

  it('renders archive-first copy in the page header', () => {
    render(<Documents />);

    expect(screen.getByRole('heading', { name: /working papers/i })).toBeInTheDocument();
    expect(
      screen.getByText(/keep your resumes, letters, and ksc drafts ready for the next push/i)
    ).toBeInTheDocument();
  });

  it('closes the overlay when the close button is clicked', async () => {
    render(<Documents />);

    await userEvent.click(getRedlineBtn(1));
    expect(getOverlay()).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('redline-close-btn'));

    await waitFor(() => {
      expect(screen.queryByTestId('redline-overlay')).not.toBeInTheDocument();
    });
  });

  it('shows an error and does not call processRedline when JSON is invalid', async () => {
    render(<Documents />);

    await userEvent.click(getRedlineBtn(1));
    await userEvent.upload(getFileInput(), makeDocxFile());
    fireEvent.change(getEditsInput(), { target: { value: 'NOT VALID JSON {{{' } });

    await userEvent.click(screen.getByRole('button', { name: 'Apply Redlines' }));

    expect(screen.getByTestId('redline-error')).toHaveTextContent(
      'Edits field contains invalid JSON. Fix it before submitting.'
    );
    expect(axiosPost).not.toHaveBeenCalled();
  });

  it('shows tracked changes after a successful submission', async () => {
    const mockBlob = new Blob(['docx'], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    (axiosPost as jest.Mock).mockResolvedValue({
      blob: mockBlob,
      data: mockBlob,
      headers: {
        'content-disposition': 'attachment; filename=redlined_test.docx',
      },
    });

    render(<Documents />);

    await userEvent.click(getRedlineBtn(1));
    await userEvent.upload(getFileInput(), makeDocxFile());
    fireEvent.change(getEditsInput(), {
      target: { value: '[{"find":"old","replace":"new"}]' },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Apply Redlines' }));

    await waitFor(() => {
      expect(screen.getByText('Redlines Applied')).toBeInTheDocument();
    });
    expect(screen.getByText('Redlines Applied')).toBeInTheDocument();
    expect(screen.getByText('redlined_test.docx')).toBeInTheDocument();
    expect(axiosPost).toHaveBeenCalledWith(
      '/process/redline',
      expect.any(FormData),
      expect.objectContaining({
        responseType: 'blob',
      })
    );
  });

  it('shows an error when processRedline rejects', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    (axiosPost as jest.Mock).mockRejectedValue(new Error('invalid edits format'));

    try {
      render(<Documents />);

      await userEvent.click(getRedlineBtn(1));
      await userEvent.upload(getFileInput(), makeDocxFile());
      fireEvent.change(getEditsInput(), {
        target: { value: '[{"find":"x","replace":"y"}]' },
      });

      await userEvent.click(screen.getByRole('button', { name: 'Apply Redlines' }));

      await waitFor(() => {
        expect(screen.getByTestId('redline-error')).toHaveTextContent('invalid edits format');
      });
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });

  it('closes the overlay when Cancel is clicked from the upload panel', async () => {
    render(<Documents />);

    await userEvent.click(getRedlineBtn(2));
    expect(getOverlay()).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(screen.queryByTestId('redline-overlay')).not.toBeInTheDocument();
    });
  });
});
