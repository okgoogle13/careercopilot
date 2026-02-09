# Spec: KanbanCard

## TypeScript Interface
```typescript
interface KanbanCardProps {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  onDragStart?: () => void;
  onSelect?: () => void;
}
```

## State Management
- **Interaction State**: Tracking drag status (local or parent-driven).
- **Selection State**: Visual highlight when the task is focused.

## Accessibility Spec
- **ARIA Roles**: `role="listitem"`, `aria-grabbed` (deprecated but useful for context), `aria-dropeffect`.
- **Keyboard**: Full support for moving cards between columns via keyboard (e.g., `Space` to pick up, arrows to move).

## Design Token Mapping
- **Card Body**: `bg-[#1a1a1a]`, `rounded-[16px_4px_12px_24px]`, `border-[#2a2a2a]`
- **ID Label**: `text-[10px]`, `font-mono`, `opacity-50`
- **Priority**: `text-[#F14714]` for high, `text-[#DAF674]` for medium.

## Test Stubs
```javascript
test('renders kanban card with details', () => {
  render(<KanbanCard id="1" title="Test Task" description="desc" priority="high" />);
  expect(screen.getByText('Test Task')).toBeInTheDocument();
  expect(screen.getByText('HIGH')).toBeInTheDocument();
});
```