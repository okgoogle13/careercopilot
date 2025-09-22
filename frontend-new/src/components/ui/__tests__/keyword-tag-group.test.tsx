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
    onTagAccept: jest.fn(),
    onTagReject: jest.fn(),
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

  it('calls onTagAccept when accept button is clicked', async () => {
    render(<KeywordTagGroup {...mockProps} />);

    // Find and click the accept button for the suggested keyword (TypeScript)
    const typeScriptTag = screen.getByText('TypeScript').closest('div');
    const acceptButton = typeScriptTag?.querySelector('button');
    
    if (acceptButton) {
      await user.click(acceptButton);
      expect(mockProps.onTagAccept).toHaveBeenCalledWith('TypeScript');
    } else {
      throw new Error('Accept button not found');
    }
  });

  it('calls onTagReject when reject button is clicked', async () => {
    render(<KeywordTagGroup {...mockProps} />);

    // Find and click the reject button for the suggested keyword (TypeScript)
    const typeScriptTag = screen.getByText('TypeScript').closest('div');
    const buttons = typeScriptTag?.querySelectorAll('button');
    const rejectButton = buttons?.[1]; // Second button is the reject button
    
    if (rejectButton) {
      await user.click(rejectButton);
      expect(mockProps.onTagReject).toHaveBeenCalledWith('TypeScript');
    } else {
      throw new Error('Reject button not found');
    }
  });
});
