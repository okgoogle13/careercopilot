import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { {{COMPONENT_NAME}} } from '../{{COMPONENT_NAME}}';

describe('{{COMPONENT_NAME}}', () => {
  it('renders without errors', () => {
    render(<{{COMPONENT_NAME}} {{DEFAULT_PROPS}} />);
    expect(screen.getByRole('{{COMPONENT_ROLE}}')).toBeInTheDocument();
  });

  {{#if HAS_TEXT_CONTENT}}
  it('displays the correct content', () => {
    const testContent = '{{TEST_CONTENT}}';
    render(<{{COMPONENT_NAME}} {{DEFAULT_PROPS}}>{testContent}</{{COMPONENT_NAME}}>);
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });
  {{/if}}

  {{#if HAS_EVENT_HANDLERS}}
  it('handles {{EVENT_NAME}} event', async () => {
    const user = userEvent.setup();
    const mock{{EVENT_HANDLER}} = jest.fn();
    render(<{{COMPONENT_NAME}} {{EVENT_PROP}}={mock{{EVENT_HANDLER}}} {{DEFAULT_PROPS}} />);

    await user.{{USER_ACTION}}(screen.getByRole('{{COMPONENT_ROLE}}'));
    expect(mock{{EVENT_HANDLER}}).toHaveBeenCalledTimes(1);
  });
  {{/if}}

  {{#if HAS_DISABLED_STATE}}
  it('is disabled when the disabled prop is true', async () => {
    const user = userEvent.setup();
    const mockHandler = jest.fn();
    render(
      <{{COMPONENT_NAME}}
        {{EVENT_PROP}}={mockHandler}
        disabled
        {{DEFAULT_PROPS}}
      />
    );

    const element = screen.getByRole('{{COMPONENT_ROLE}}');
    expect(element).toBeDisabled();

    await user.{{USER_ACTION}}(element);
    expect(mockHandler).not.toHaveBeenCalled();
  });
  {{/if}}

  {{#if HAS_LOADING_STATE}}
  it('displays loading state', () => {
    render(<{{COMPONENT_NAME}} loading {{DEFAULT_PROPS}} />);
    // TODO: Assert loading indicator is visible
    expect(screen.getByRole('{{COMPONENT_ROLE}}')).toBeInTheDocument();
  });
  {{/if}}

  {{#if HAS_ERROR_STATE}}
  it('displays error state', () => {
    const errorMessage = 'Test error message';
    render(<{{COMPONENT_NAME}} error={errorMessage} {{DEFAULT_PROPS}} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
  {{/if}}

  {{#if HAS_VARIANTS}}
  // TODO: Add tests for different variants
  it.todo('renders with different variants');
  {{/if}}

  {{#if HAS_SIZES}}
  // TODO: Add tests for different sizes
  it.todo('renders with different sizes');
  {{/if}}

  // TODO: Add accessibility tests
  it.todo('is accessible via keyboard navigation');

  // TODO: Add edge case tests
  it.todo('handles empty props gracefully');
  it.todo('handles very long content');

  // TODO: Add snapshot test (optional)
  it.todo('matches snapshot');
});
