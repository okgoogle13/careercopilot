# Spec: SkillBreakdownCard

## TypeScript Interface
```typescript
interface SkillCategory {
  label: string;
  value: number; // 0-100
  details?: string[];
}

interface SkillBreakdownCardProps {
  overallScore: number;
  categories: SkillCategory[];
  onAction?: (type: 'strengthen' | 'archive') => void;
  isLoading?: boolean;
}
```

## State Management
- **Local State**: Expanded/Collapsed state for categories.
- **Animation State**: Managing the gauge filling transition on mount.

## Accessibility Spec
- **ARIA Roles**: `role="status"` for the scores, `aria-valuemin`, `aria-valuemax`, `aria-valuenow` for bars/gauges.
- **Labels**: High-contrast labels for all technical metrics.

## Design Token Mapping
- **Container**: `bg-[#1a1a1a]`, `rounded-[16px_4px_12px_24px]`, `overflow-hidden`
- **Score**: `text-[48px]`, `font-weight-800`, `text-[#DAF674]`
- **Categories**: `border-[#2a2a2a]`, `p-4`, `mb-2`

## Test Stubs
```javascript
test('renders overall score and categories', () => {
  render(<SkillBreakdownCard overallScore={88} categories={[{ label: 'Tech', value: 92 }]} />);
  expect(screen.getByText('88%')).toBeInTheDocument();
  expect(screen.getByText(/Tech/i)).toBeInTheDocument();
});
```
