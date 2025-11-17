import { renderHook, act } from '@testing-library/react';
import { jest } from '@jest/globals';
import { {{HOOK_NAME}} } from '../{{HOOK_NAME}}';

describe('{{HOOK_NAME}}', () => {
  it('returns initial state correctly', () => {
    const { result } = renderHook(() => {{HOOK_NAME}}({{DEFAULT_ARGS}}));

    expect(result.current).toBeDefined();
    {{#if HAS_RETURN_STATE}}
    expect(result.current.{{STATE_NAME}}).toBe({{INITIAL_VALUE}});
    {{/if}}
  });

  {{#if HAS_STATE_UPDATE}}
  it('updates state when {{ACTION_NAME}} is called', () => {
    const { result } = renderHook(() => {{HOOK_NAME}}({{DEFAULT_ARGS}}));

    act(() => {
      result.current.{{ACTION_NAME}}({{NEW_VALUE}});
    });

    expect(result.current.{{STATE_NAME}}).toBe({{NEW_VALUE}});
  });
  {{/if}}

  {{#if HAS_SIDE_EFFECTS}}
  it('triggers side effects correctly', async () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => {{HOOK_NAME}}({
      ...{{DEFAULT_ARGS}},
      onSuccess: mockCallback
    }));

    await act(async () => {
      await result.current.{{ACTION_NAME}}();
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
  {{/if}}

  {{#if HAS_ASYNC_OPERATIONS}}
  it('handles async operations', async () => {
    const { result } = renderHook(() => {{HOOK_NAME}}({{DEFAULT_ARGS}}));

    expect(result.current.loading).toBe(false);

    act(() => {
      result.current.{{ASYNC_ACTION}}();
    });

    expect(result.current.loading).toBe(true);

    // Wait for async operation to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.loading).toBe(false);
  });
  {{/if}}

  {{#if HAS_ERROR_HANDLING}}
  it('handles errors correctly', async () => {
    const mockError = new Error('Test error');
    const { result } = renderHook(() => {{HOOK_NAME}}({
      ...{{DEFAULT_ARGS}},
      shouldFail: true
    }));

    await act(async () => {
      await result.current.{{ACTION_NAME}}();
    });

    expect(result.current.error).toBeDefined();
  });
  {{/if}}

  // TODO: Add cleanup tests
  it.todo('cleans up side effects on unmount');

  // TODO: Add dependency tests
  it.todo('updates when dependencies change');

  // TODO: Add edge case tests
  it.todo('handles edge cases gracefully');
});
