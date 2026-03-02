# Spec: JobList

## TypeScript Interface
```typescript
interface JobOpportunity {
  id: string;
  title: string;
  location: string;
  salary: string;
  tags: string[];
}

interface JobListProps {
  jobs: JobOpportunity[];
  onJobSelect: (id: string) => void;
  isLoading?: boolean;
}
```

## State Management
- **List State**: Local mapping of visible jobs.
- **Shared State**: Filtering and sorting criteria.

## Accessibility Spec
- **ARIA Roles**: `role="list"`, `role="listitem"`
- **Keyboard**: Arrow key navigation through list items.

## Design Token Mapping
- **List Container**: `gap-6`, `flex flex-col`
- **Job Card**: `bg-[#1a1a1a]`, `rounded-[16px_4px_12px_24px]`, `transition-all`
- **Title**: `font-weight-600`, `text-[#F5F0E8]`

## Test Stubs
```javascript
test('renders list of jobs', () => {
  const jobs = [{ id: '1', title: 'Solidarity Dev', location: 'Naarm', salary: '120k', tags: [] }];
  render(<JobList jobs={jobs} />);
  expect(screen.getByText('Solidarity Dev')).toBeInTheDocument();
});
```