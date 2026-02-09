# Spec: LoginCard

## TypeScript Interface
```typescript
interface LoginCardProps {
  onLogin: (credentials: LoginCredentials) => void;
  onRegisterClick: () => void;
  isLoading?: boolean;
}
```

## State Management
- **Local State**: Email and password input values.
- **Validation State**: Tracking field errors for visual feedback.

## Accessibility Spec
- **ARIA Roles**: `role="form"`
- **Labels**: Explicit `<label>` for each input, or `aria-label` if stenciled.

## Design Token Mapping
- **Container**: `bg-[#1a1a1a]`, `rounded-[16px_4px_12px_24px]`
- **Inputs**: `bg-black/20`, `border-[#2a2a2a]`, `focus:border-[#DAF674]`
- **Action**: `bg-[#DAF674]`, `py-4`, `rounded-[20px_6px_16px_28px]`

## Test Stubs
```javascript
test('submits credentials on button click', () => {
  const loginSpy = jest.fn();
  render(<LoginCard onLogin={loginSpy} />);
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
  fireEvent.click(screen.getByText(/ENTER ARCHIVE/i));
  expect(loginSpy).toHaveBeenCalledWith(expect.objectContaining({ email: 'test@example.com' }));
});
```