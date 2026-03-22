import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

// Mock UI components
(jest as any).unstable_mockModule('@/components/ui', () => ({
  Pebble: ({ children, onClick, disabled }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid="pebble-button"
    >
      {children}
    </button>
  ),
  Signal: ({ children }: any) => <div data-testid="signal">{children}</div>,
  Stone: ({ children, className }: any) => (
    <div
      className={className}
      data-testid="stone"
    >
      {children}
    </div>
  ),
  Vessel: ({ title, children }: any) => (
    <div data-testid="vessel">
      <h3>{title}</h3>
      {children}
    </div>
  ),
}));

// Mock shared components
(jest as any).unstable_mockModule('@/components/shared/EditableField', () => ({
  EditableField: ({ label, value, onSave }: any) => (
    <div data-testid="editable-field">
      <label>{label}</label>
      <input
        defaultValue={value}
        onBlur={(e) => onSave(e.target.value)}
        data-testid={`input-${label.replace(/\s+/g, '-').toLowerCase()}`}
      />
    </div>
  ),
}));

(jest as any).unstable_mockModule('@/components/shared/StatusChip', () => ({
  StatusChip: ({ needsReview }: any) => (
    <div data-testid="status-chip">{needsReview ? 'Needs Review' : 'Verified'}</div>
  ),
}));

// Mock toast
(jest as any).unstable_mockModule('@/utils/toast', () => ({
  m3Toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock lucide-react (already handled by setupTests but let's be explicit if needed)
(jest as any).unstable_mockModule('lucide-react', () => ({
  AlertTriangle: () => <span>AlertTriangle</span>,
  BrainCircuit: () => <span>BrainCircuit</span>,
  Briefcase: () => <span>Briefcase</span>,
  Download: () => <span>Download</span>,
  Redo2: () => <span>Redo2</span>,
  ShieldCheck: () => <span>ShieldCheck</span>,
  Sparkles: () => <span>Sparkles</span>,
  Trophy: () => <span>Trophy</span>,
  Undo2: () => <span>Undo2</span>,
  User: () => <span>User</span>,
}));

// Mock URL methods
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

const { ValidationDashboard } = await import('../ValidationDashboard');

const mockData: any = {
  Personal_Information: {
    FullName: 'John Doe',
    Email: 'john@example.com',
  },
  Structured_Achievements: [
    {
      Achievement_ID: 'ach-1',
      Original_Text: 'Managed a team of 5.',
      Action_Verb: 'Managed',
      Metric: '5 people',
      Outcome: 'Successful team management',
      Needs_Review_Flag: true,
      Improvement_Suggestions: {
        Action_Verb: 'Orchestrated',
        Metric: 'cross-functional team of 5',
        Outcome: 'optimized delivery by 20%',
      },
    },
  ],
  KSC_Responses: [
    {
      KSC_ID: 'ksc-1',
      KSC_Prompt: 'Explain your leadership.',
      Situation: 'Led a project.',
      Result: 'Project completed.',
      Needs_Review_Flag: false,
      Improvement_Suggestions: {},
    },
  ],
};

describe('ValidationDashboard', () => {
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with provided data', () => {
    render(
      <ValidationDashboard
        data={mockData}
        onUpdate={mockOnUpdate}
      />
    );

    // Check for unique heading text
    expect(screen.getByText('Professional Vector')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Tactical Achievements')).toBeInTheDocument();
    expect(screen.getByText('Core Competencies')).toBeInTheDocument();
  });

  it('handles field updates', () => {
    render(
      <ValidationDashboard
        data={mockData}
        onUpdate={mockOnUpdate}
      />
    );

    const nameInput = screen.getByTestId('input-full-legal-name');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.blur(nameInput);

    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        Personal_Information: expect.objectContaining({
          FullName: 'Jane Doe',
        }),
      })
    );
  });

  it('applies AI suggestions', () => {
    render(
      <ValidationDashboard
        data={mockData}
        onUpdate={mockOnUpdate}
      />
    );

    const applyButton = screen.getByText('Apply AI Suggestions');
    fireEvent.click(applyButton);

    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        Structured_Achievements: [
          expect.objectContaining({
            Action_Verb: 'Orchestrated',
            Needs_Review_Flag: false,
          }),
        ],
      })
    );
  });

  it('handles undo/redo', () => {
    render(
      <ValidationDashboard
        data={mockData}
        onUpdate={mockOnUpdate}
      />
    );

    // Update something to populate history
    const nameInput = screen.getByTestId('input-full-legal-name');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.blur(nameInput);

    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        Personal_Information: expect.objectContaining({
          FullName: 'Jane Doe',
        }),
      })
    );

    // Undo should be enabled now
    const undoButton = screen.getByText('Undo');
    expect(undoButton).not.toBeDisabled();
    fireEvent.click(undoButton);

    // The undo should call onUpdate with original mockData
    expect(mockOnUpdate).toHaveBeenLastCalledWith(mockData);

    // Redo
    const redoButton = screen.getByText('Redo');
    fireEvent.click(redoButton);

    expect(mockOnUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        Personal_Information: expect.objectContaining({
          FullName: 'Jane Doe',
        }),
      })
    );
  });

  it('handles JSON export', () => {
    (global.URL.createObjectURL as jest.Mock).mockReturnValue('blob:mock-url');

    const appendSpy = jest.spyOn(document.body, 'appendChild');
    const removeSpy = jest.spyOn(document.body, 'removeChild');

    render(
      <ValidationDashboard
        data={mockData}
        onUpdate={mockOnUpdate}
      />
    );

    const exportButton = screen.getByText('Export Vector');
    fireEvent.click(exportButton);

    expect(global.URL.createObjectURL).toHaveBeenCalled();

    // In JSDOM, click() on an anchor might not be easily trackable without mocking either the element
    // or the click method. Since we can't easily mock the element without breaking render,
    // we'll just check if appendChild was called with an 'a' tag.

    const anchor = appendSpy.mock.calls.find(
      (call) => (call[0] as any).tagName === 'A'
    )?.[0] as HTMLAnchorElement;
    expect(anchor).toBeDefined();
    expect(anchor.download).toContain('professional-vector');

    appendSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
