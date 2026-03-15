# Spec: ProfileHeader

## TypeScript Interface
```typescript
interface ProfileHeaderProps {
  name: string;
  bio: string;
  avatarUrl?: string;
  identityTags: string[];
  landAcknowledgment?: string; // Default: Wurundjeri Woi-wurrung Country
}
```

## State Management
- **Local State**: Interaction tracking for the "flicker" effect on tags.

## Accessibility Spec
- **ARIA Roles**: `role="banner"`, `aria-label` for the portrait.
- **Keyboard**: No complex interactions, ensuring readable order for screen readers.

## Design Token Mapping
- **Container**: `bg-[#1a1a1a]`, `py-12`, `px-8`
- **Name**: `font-weight-900`, `text-[72px]`, `tracking-tight`
- **Tags**: `rounded-[8px_4px_10px_6px]`, `bg-[#48F0E5]/10`, `text-[#48F0E5]`

## Test Stubs
```javascript
test('renders user identity correctly', () => {
  render(<ProfileHeader name="Abhi" bio="Migrant Dev" identityTags={['Tech']} />);
  expect(screen.getByText('Abhi')).toBeInTheDocument();
  expect(screen.getByText(/Migrant Dev/i)).toBeInTheDocument();
});
```
