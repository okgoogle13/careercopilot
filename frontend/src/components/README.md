# Career Copilot Component Library

A comprehensive React component library built with Material-UI and Material Design 3 principles for the Career Copilot application.

## 🎨 Design System

Our components follow **Material Design 3 (M3)** guidelines with a custom Career Copilot theme that includes:

- **Dynamic Color System**: CSS variables for light/dark mode support
- **Motion & Animation**: Cubic-bezier transitions for smooth interactions
- **Typography Scale**: Comprehensive text styles optimized for career-focused content
- **Component Variants**: Interactive, selected, and contextual variants

## 🚀 Quick Start

### Prerequisites

```bash
# Install dependencies
yarn install

# Start Storybook for component development
yarn storybook
```

### Basic Usage

```tsx
import { AppLayout, PageHeader, DataTable } from '@/components';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '@/theme/theme';

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <AppLayout currentView="dashboard">
        <PageHeader
          title="My Dashboard"
          subtitle="Welcome back!"
          actions={[
            {
              id: 'create',
              label: 'Create Document',
              variant: 'contained',
              onClick: () => console.log('Create'),
            },
          ]}
        />
        {/* Your page content */}
      </AppLayout>
    </ThemeProvider>
  );
}
```

## 📦 Component Categories

### Layout Components

#### AppLayout

The main application shell providing navigation, user management, and responsive layout.

**Features:**

- Responsive navigation drawer with user profile
- Theme toggle functionality
- Mobile-optimized interactions
- Navigation state management

**Usage:**

```tsx
<AppLayout
  currentView="dashboard"
  showDemoNav={true}
  isDarkMode={false}
  onNavigate={(view) => setCurrentView(view)}
  onThemeToggle={() => toggleTheme()}
  user={{
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    avatar: '/path/to/avatar.jpg',
  }}
>
  {children}
</AppLayout>
```

#### PageHeader

Flexible page header with breadcrumbs, actions, and multiple display variants.

**Variants:**

- `default`: Standard header with full features
- `compact`: Minimal header for constrained spaces
- `detailed`: Expanded header with description

**Features:**

- Breadcrumb navigation
- Action buttons with overflow menu
- Status indicators and avatars
- Custom content slots

**Usage:**

```tsx
<PageHeader
  title="Document Overview"
  subtitle="Senior Software Engineer Resume"
  variant="default"
  breadcrumbs={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Documents', href: '/documents' },
    { label: 'Resume.pdf' },
  ]}
  actions={[
    {
      id: 'edit',
      label: 'Edit',
      icon: Edit,
      variant: 'outlined',
      onClick: () => handleEdit(),
    },
  ]}
  status={{
    label: 'Published',
    color: 'success',
  }}
  onBack={() => navigate('/documents')}
/>
```

### Data Components

#### DataTable

Comprehensive data table with sorting, filtering, pagination, and bulk operations.

**Features:**

- Column sorting and filtering
- Row selection with bulk actions
- Pagination with customizable page sizes
- Responsive design with mobile optimization
- Search and filter capabilities
- Custom cell renderers
- Loading and empty states

**Usage:**

```tsx
const columns = [
  {
    id: 'name',
    label: 'Document Name',
    sortable: true,
    render: (value) => <Typography variant="body2">{value}</Typography>,
  },
  {
    id: 'status',
    label: 'Status',
    filterable: true,
    filterOptions: ['Published', 'Draft'],
    render: (value) => <Chip label={value} color="primary" />,
  },
];

<DataTable
  data={documents}
  columns={columns}
  selectable={true}
  searchable={true}
  pagination={true}
  rowActions={[
    {
      id: 'edit',
      label: 'Edit',
      icon: Edit,
      onClick: (row) => handleEdit(row),
    },
  ]}
  bulkActions={[
    {
      id: 'delete',
      label: 'Delete Selected',
      icon: Trash2,
      color: 'error',
      onClick: (rows) => handleBulkDelete(rows),
    },
  ]}
/>;
```

### UI Components

Our UI components extend Material-UI with Career Copilot-specific styling and functionality:

- **Enhanced Inputs**: Floating label animations with smooth transitions
- **ATS Score Circles**: Specialized scoring visualizations with glow effects
- **Status Indicators**: Career-specific status chips and badges
- **Interactive Cards**: Hover states and selection variants

## 🎭 Storybook Documentation

Each component includes comprehensive Storybook stories demonstrating:

- **Default usage** with standard props
- **Variant examples** showing different configurations
- **Interactive demos** for user interactions
- **Responsive behavior** across device sizes
- **Accessibility features** and keyboard navigation

### Running Storybook

```bash
# Start Storybook development server
yarn storybook

# Build static Storybook
yarn build-storybook
```

### Story Organization

```
stories/
├── Layout/
│   ├── AppLayout.stories.tsx
│   └── PageHeader.stories.tsx
└── Components/
    └── DataTable.stories.tsx
```

## 🎨 Theming & Customization

### CSS Custom Properties

Our theme system uses CSS variables for maximum flexibility:

```css
:root {
  /* Career Copilot Brand Colors */
  --cc-color-primary: #a78bfa;
  --cc-color-secondary: #c9c3dc;
  --cc-color-tertiary: #f472b6;

  /* Material Design 3 Token System */
  --md-ref-palette-primary-100: #f4f1ff;
  --md-sys-color-surface-container: #f3f0f7;

  /* Animation Tokens */
  --md-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --md-sys-motion-duration-medium2: 300ms;
}
```

### Theme Configuration

```tsx
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: 'var(--cc-color-primary)',
    },
    // Uses CSS variables for dynamic theming
  },
  components: {
    MuiCard: {
      variants: [
        {
          props: { variant: 'interactive' },
          style: {
            cursor: 'pointer',
            transition: 'var(--md-sys-motion-duration-medium2)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 'var(--md-sys-elevation-2)',
            },
          },
        },
      ],
    },
  },
});
```

### Custom Animations

Career Copilot includes specialized animations for enhanced user experience:

```css
/* ATS Score Pulse Animation */
@keyframes pulse-score {
  0%,
  100% {
    transform: scale(1);
    text-shadow: 0 0 10px rgba(167, 139, 250, 0.5);
  }
  50% {
    transform: scale(1.05);
    text-shadow: 0 0 15px rgba(167, 139, 250, 0.7);
  }
}

/* Floating Label Animation */
@keyframes float-label {
  from {
    transform: translateY(16px) scale(1);
    color: var(--md-sys-color-on-surface-variant);
  }
  to {
    transform: translateY(-8px) scale(0.75);
    color: var(--md-sys-color-primary);
  }
}
```

## 📱 Responsive Design

All components are built mobile-first with responsive breakpoints:

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Responsive Features

- **Adaptive Navigation**: Drawer transforms to overlay on mobile
- **Flexible Layouts**: Grid and flexbox with responsive spacing
- **Touch Interactions**: Optimized touch targets (44px minimum)
- **Progressive Enhancement**: Core functionality works without JavaScript

## ♿ Accessibility

Our components follow WCAG 2.1 AA guidelines:

- **Semantic HTML**: Proper heading hierarchy and landmark regions
- **Keyboard Navigation**: Full keyboard support with visible focus indicators
- **Screen Reader Support**: ARIA labels, descriptions, and live regions
- **Color Contrast**: Meets 4.5:1 contrast ratio requirements
- **Motion Preferences**: Respects `prefers-reduced-motion`

### Accessibility Testing

```bash
# Run accessibility tests with jest-axe
yarn test:a11y

# Manual testing with screen readers
# - NVDA (Windows)
# - VoiceOver (macOS)
# - TalkBack (Android)
```

## 🧪 Testing

### Component Testing

Each component includes comprehensive tests covering:

- **Rendering**: Snapshot and visual regression tests
- **Interactions**: User event simulation and state changes
- **Props**: Validation of all component properties
- **Accessibility**: Automated a11y testing with jest-axe

```bash
# Run component tests
yarn test

# Run with coverage
yarn test:coverage

# Watch mode for development
yarn test:watch
```

### Test Structure

```typescript
// Example component test
describe('PageHeader', () => {
  it('renders with required props', () => {
    render(<PageHeader title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('handles action clicks', () => {
    const handleClick = jest.fn();
    const actions = [{ id: 'test', label: 'Test', onClick: handleClick }];

    render(<PageHeader title="Test" actions={actions} />);
    fireEvent.click(screen.getByText('Test'));

    expect(handleClick).toHaveBeenCalled();
  });
});
```

## 🚀 Performance

### Optimization Strategies

- **Code Splitting**: Lazy loading for non-critical components
- **Bundle Analysis**: Webpack bundle analyzer for size optimization
- **Virtual Scrolling**: Implemented in DataTable for large datasets
- **Memoization**: React.memo and useMemo for expensive operations

### Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

## 🔧 Development Guidelines

### Component Development

1. **Create Component**: Start with TypeScript interface
2. **Build Logic**: Implement core functionality
3. **Add Styling**: Apply M3 design tokens
4. **Write Tests**: Cover all scenarios
5. **Document**: Create Storybook stories
6. **Review**: Code review and accessibility audit

### Best Practices

- **TypeScript First**: Strict typing for all props and state
- **Performance**: Use React.memo for pure components
- **Accessibility**: Include ARIA attributes and semantic HTML
- **Testing**: Maintain > 90% test coverage
- **Documentation**: Keep Storybook stories up to date

### File Organization

```
src/components/
├── layout/           # Layout components (AppLayout, PageHeader)
├── ui/              # Reusable UI components (DataTable, inputs)
├── library/         # Career-specific components (ATSScoreCircle)
└── README.md        # This documentation
```

## 📋 Migration Guide

### From Tailwind to Material-UI

Components have been migrated from Tailwind CSS to Material-UI with M3 theming:

**Before (Tailwind):**

```tsx
<div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg">
  <h2 className="text-xl font-semibold text-gray-800">Title</h2>
</div>
```

**After (Material-UI):**

```tsx
<Card variant="interactive" sx={{ p: 2 }}>
  <Typography variant="h6" color="text.primary">
    Title
  </Typography>
</Card>
```

### Theme Migration

CSS custom properties provide backward compatibility:

```css
/* Legacy support */
--color-primary: var(--cc-color-primary);
--color-secondary: var(--cc-color-secondary);
```

## 🤝 Contributing

1. **Fork Repository**: Create your feature branch
2. **Follow Guidelines**: Use TypeScript and follow naming conventions
3. **Write Tests**: Include unit and integration tests
4. **Update Stories**: Add or update Storybook documentation
5. **Submit PR**: Include detailed description and screenshots

### Development Setup

```bash
# Clone repository
git clone [repository-url]

# Install dependencies
yarn install

# Start development environment
yarn dev

# Run tests
yarn test

# Start Storybook
yarn storybook
```

## 📚 Additional Resources

- [Material Design 3 Guidelines](https://m3.material.io/)
- [Material-UI Documentation](https://mui.com/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Storybook Documentation](https://storybook.js.org/docs/)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

For questions or support, please refer to the project documentation or create an issue in the repository.
