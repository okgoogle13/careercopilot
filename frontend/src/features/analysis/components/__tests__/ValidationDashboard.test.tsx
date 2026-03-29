import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

// Mock individual UI component paths (component uses direct imports, not barrel)
(jest as any).unstable_mockModule('@/components/ui/Vessel', () => ({
  Vessel: ({ title, children }: any) => (
    <div data-testid="vessel">
      <h3>{title}</h3>
      {children}
    </div>
  ),
}));

(jest as any).unstable_mockModule('@/components/ui/Placard', () => ({
  Placard: ({ children, header }: any) => (
    <div data-testid="placard">
      {header}
      {children}
    </div>
  ),
}));

(jest as any).unstable_mockModule('@/components/ui/Strike', () => ({
  Strike: ({ children, onClick, disabled }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid="strike-button"
    >
      {children}
    </button>
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

// Mock sub-components to avoid loading their lucide/framer dependencies
(jest as any).unstable_mockModule('@/features/analysis/components/ValidationStats', () => ({
  ValidationStats: () => <div data-testid="validation-stats" />,
}));

(jest as any).unstable_mockModule('@/features/analysis/components/AuditLogList', () => ({
  AuditLogList: () => <div data-testid="audit-log-list" />,
}));

(jest as any).unstable_mockModule('@/features/analysis/components/SourceVerificationGrid', () => ({
  SourceVerificationGrid: () => <div data-testid="source-verification-grid" />,
}));

// Mock toast
(jest as any).unstable_mockModule('@/utils/toast', () => ({
  m3Toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock lucide-react — includes CheckCircle2 used in achievement header
(jest as any).unstable_mockModule('lucide-react', () => ({
  AlertTriangle: () => <span>AlertTriangle</span>,
  BrainCircuit: () => <span>BrainCircuit</span>,
  Briefcase: () => <span>Briefcase</span>,
  CheckCircle2: () => <span>CheckCircle2</span>,
  ChevronDown: () => <span>ChevronDown</span>,
  Download: () => <span>Download</span>,
  Loader2: () => <span>Loader2</span>,
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

    expect(screen.getByText('AI STUDIO HARVEST')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByText('ACHIEVEMENTS')).toBeInTheDocument();
  });

  it('handles field updates', () => {
    render(
      <ValidationDashboard
        data={mockData}
        onUpdate={mockOnUpdate}
      />
    );

    const nameInput = screen.getByTestId('input-full-name');
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

  it('handles needs-review flag update', () => {
    render(
      <ValidationDashboard
        data={mockData}
        onUpdate={mockOnUpdate}
      />
    );

    const flagInput = screen.getByTestId('input-needs-review-flag');
    fireEvent.change(flagInput, { target: { value: 'false' } });
    fireEvent.blur(flagInput);

    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        Structured_Achievements: [
          expect.objectContaining({
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

    // Make a change to populate history
    const nameInput = screen.getByTestId('input-full-name');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.blur(nameInput);

    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        Personal_Information: expect.objectContaining({ FullName: 'Jane Doe' }),
      })
    );

    // Undo should be enabled after a change
    const undoButton = screen.getByRole('button', { name: /UNDO/i });
    expect(undoButton).not.toBeDisabled();
    fireEvent.click(undoButton);

    expect(mockOnUpdate).toHaveBeenLastCalledWith(mockData);

    // Redo
    const redoButton = screen.getByRole('button', { name: /REDO/i });
    fireEvent.click(redoButton);

    expect(mockOnUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        Personal_Information: expect.objectContaining({ FullName: 'Jane Doe' }),
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

    const exportButton = screen.getByRole('button', { name: /EXPORT CANON/i });
    fireEvent.click(exportButton);

    expect(global.URL.createObjectURL).not.toHaveBeenCalled();

    const anchor = appendSpy.mock.calls.find(
      (call) => (call[0] as any).tagName === 'A'
    )?.[0] as HTMLAnchorElement;
    expect(anchor).toBeDefined();
    expect(anchor.download).toContain('validated_career_data.json');

    appendSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
