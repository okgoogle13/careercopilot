import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { KeywordTagGroup } from '../keyword-tag-group';

describe('KeywordTagGroup', () => {
  const user = userEvent.setup();

  const mockKeywords = [
    { keyword: 'React', status: 'matched' as const, id: '1' },
    { keyword: 'TypeScript', status: 'suggested' as const, id: '2' },
    { keyword: 'Testing', status: 'missing' as const, id: '3' },
    { keyword: 'Node.js', status: 'accepted' as const, id: '4' },
    { keyword: 'Python', status: 'rejected' as const, id: '5' },
  ];

  const mockProps = {
    keywords: mockKeywords,
    onAccept: jest.fn(),
    onReject: jest.fn(),
  };

  it('renders without crashing', () => {
    render(<KeywordTagGroup {...mockProps} />);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('displays all keywords', () => {
    render(<KeywordTagGroup {...mockProps} />);

    mockKeywords.forEach(({ keyword }) => {
      expect(screen.getByText(keyword)).toBeInTheDocument();
    });
  });

  it('calls onAccept when accept button is clicked', async () => {
    render(<KeywordTagGroup {...mockProps} />);

    // Find and click the accept button for the first keyword
    const acceptButtons = screen.getAllByRole('button', { name: /accept/i });
    await user.click(acceptButtons[0]);

    expect(mockProps.onAccept).toHaveBeenCalledWith(mockKeywords[0].keyword);
  });

  it('calls onReject when reject button is clicked', async () => {
    render(<KeywordTagGroup {...mockProps} />);

    // Find and click the reject button for the first keyword
    const rejectButtons = screen.getAllByRole('button', { name: /reject/i });
    await user.click(rejectButtons[0]);

    expect(mockProps.onReject).toHaveBeenCalledWith(mockKeywords[0].keyword);
  });
});
