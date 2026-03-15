# Spec: ManifestoCard

## TypeScript Interface
```typescript
interface ManifestoCardProps {
  title: string;
  content: string;
  actionLabel?: string;
  onAction?: () => void;
  showMotif?: boolean; // Default: true
  className?: string;
}
```

## State Management
- **Hover State**: Local boolean for bloom effect (weight/shadow).
- **Press State**: Local boolean for active scaling.

## Accessibility Spec
- **ARIA Roles**: `role="article"`
- **Keyboard**: Button must be reachable via `Tab`, triggered via `Enter/Space`.

## Design Token Mapping
- **Container**: `bg-[#1a1a1a]`, `rounded-[16px_4px_12px_24px]`, `shadow-[4px_4px_0px_#2a2a2a]`
- **Title**: `text-[48px]`, `font-weight-800`, `text-[#F14714]`
- **Content**: `text-[18px]`, `font-weight-450`, `text-[#F5F0E8]/80`
- **Button**: `bg-[#DAF674]`, `text-[#1a1a1a]`, `rounded-[20px_6px_16px_28px]`

## Test Stubs
```javascript
test('renders manifesto title and content', () => {
  render(<ManifestoCard title="REVOLT" content="Backwaters to Brunswick" />);
  expect(screen.getByText('REVOLT')).toBeInTheDocument();
});

test('calls onAction when button clicked', () => {
  const handler = jest.fn();
  render(<ManifestoCard title="T" content="C" onAction={handler} />);
  fireEvent.click(screen.getByRole('button'));
  expect(handler).toHaveBeenCalled();
});
```
