# Spec: PathSelectionCard

## TypeScript Interface
```typescript
interface PathSelectionCardProps {
  title: string;
  description: string;
  onSelect: () => void;
  isSelected?: boolean;
}
```

## State Management
- **Interaction State**: Hover/Active states mapped to animation patterns.

## Accessibility Spec
- **ARIA Roles**: `role="button"`, `aria-pressed` for selection status.
- **Keyboard**: Must be fully navigable via `Tab` and selectable via `Enter`.

## Design Token Mapping
- **Container**: `bg-[#1a1a1a]`, `rounded-[16px_4px_12px_24px]`, `border-2`, `border-transparent`
- **Title**: `text-[#48F0E5]`, `font-bold`, `text-[72px]`, `leading-none`
- **Select**: `bg-[#DAF674]`, `p-4`, `rounded-[20px_6px_16px_28px]`

## Test Stubs
```javascript
test('renders path title and selection button', () => {
  render(<PathSelectionCard title="Tech" description="dev" onSelect={() => {}} />);
  expect(screen.getByText('Tech')).toBeInTheDocument();
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```
