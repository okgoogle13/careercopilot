# Component Usage Guidelines

## Authentication Components

### LoginPage

**Purpose**: Authenticate existing users

**Features**:

- Email and password validation
- Real-time error feedback
- Loading state with spinner
- Accessible form with ARIA labels
- Screen reader announcements

**Usage**:

```typescript
import { LoginPage } from "@/pages/LoginPage";

// Renders at /login route
// Automatically redirects to /dashboard if authenticated
```

**Accessibility**:

- ✅ Form validation messages announced to screen readers
- ✅ Required field indicators
- ✅ Focus management on errors
- ✅ Keyboard navigation

### RegisterPage

**Purpose**: Create new user accounts

**Features**:

- Display name, email, password fields
- Password strength validation
- Confirm password matching
- Loading state with spinner

**Usage**:

```typescript
import { RegisterPage } from "@/pages/RegisterPage";

// Renders at /register route
// Automatically redirects to /dashboard if authenticated
```

## Navigation Components

### ProtectedRoute

**Purpose**: Guard routes that require authentication

**Features**:

- Automatic redirect to login for unauthenticated users
- Loading state while checking auth status
- Preserves intended destination

**Usage**:

```typescript
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

### NotificationCenter

**Purpose**: Display user notifications with real-time updates

**Features**:

- Badge showing unread count
- Popover notification list
- Mark as read/unread
- Delete notifications
- Type-based icons (success, info, warning, error)
- Auto-polling for new notifications

**Usage**:

```typescript
import { NotificationCenter } from '@/components/NotificationCenter';

// Add to header/navigation
<NotificationCenter />
```

**Accessibility**:

- ✅ Badge announces unread count
- ✅ Popover is keyboard navigable
- ✅ Each notification has proper role and aria-live
- ✅ Delete button properly labeled

## Data Display Components

### SkeletonLoader

**Purpose**: Show placeholder while loading content

**Features**:

- Multiple skeleton types (card, table, list, profile, content)
- Shimmer animation
- Responsive grid layout
- ARIA busy state

**Usage**:

```typescript
import { SkeletonLoader } from '@/components/SkeletonLoader';

// Card skeleton
<SkeletonLoader type="card" count={3} />

// Table skeleton
<SkeletonLoader type="table" count={5} />

// List skeleton
<SkeletonLoader type="list" count={4} />
```

### DashboardPage

**Purpose**: Display user overview with stats and profiles

**Features**:

- Real-time stats from analytics service
- Profile list with ATS scores
- Recent activity feed
- Quick action buttons
- Empty state for new users

**Usage**:

```typescript
import { DashboardPage } from "@/pages/DashboardPage";

// Renders at /dashboard route
// Automatically fetches data on mount
```

**API Integration**:

- Calls `profileService.getProfiles()`
- Calls `analyticsService.getDashboardStats()`
- Calls `analyticsService.getPerformanceTrends()`

## Document Management Components

### SmartUploadModal

**Purpose**: AI-powered document upload with tag suggestion

**Features**:

- Two-step upload process (upload → tagging)
- AI-suggested tags with confidence scores
- Tag selection/deselection
- File type validation
- Error handling

**Usage**:

```typescript
import { SmartUploadModal } from '@/components/SmartUploadModal';

<SmartUploadModal
  open={isOpen}
  onClose={handleClose}
  onUploadComplete={handleUploadSuccess}
/>
```

**Accepted File Types**:

- PDF (.pdf)
- Word (.doc, .docx)
- Text (.txt)

### AssetLibraryPage

**Purpose**: Manage and browse uploaded documents

**Features**:

- Grid display of assets
- Search functionality
- Asset metadata display
- Context menu for actions
- Empty state with CTA
- Delete with confirmation

**Usage**:

```typescript
import { AssetLibraryPage } from "@/pages/AssetLibraryPage";

// Renders at /asset-library route
```

## Workflow Components

### ApplicationGeneratorModal

**Purpose**: Generate complete job application packages

**Features**:

- Step-by-step workflow (Prepare → Customize → Review → Submit)
- Visual progress tracking
- Resume, cover letter, KSC responses
- Success feedback
- Error handling

**Usage**:

```typescript
import { ApplicationGeneratorModal } from '@/components/ApplicationGeneratorModal';

<ApplicationGeneratorModal
  open={isOpen}
  onClose={handleClose}
  jobTitle="Senior Developer"
  jobDescription={description}
  companyName="TechCorp"
  onSuccess={handleSuccess}
/>
```

## API Service Components

### AuthService

**Purpose**: User authentication and profile management

**Methods**:

```typescript
// Login
login({ email, password });

// Register
register({ email, password, displayName });

// Logout
logout();

// Refresh token
refreshToken();

// Get current user
getCurrentUser();

// Update profile
updateUserProfile(updates);

// Create voice profile
createVoiceProfile(profileData);
```

### SmartIngestionService

**Purpose**: AI-powered document processing

**Methods**:

```typescript
// Upload and get tag suggestions
uploadAndTag(file);

// Extract and save document
extractAndSave({ file, selectedTags, fileName });

// Get asset library
getAssetLibrary();

// Get specific asset
getAssetById(id);

// Delete asset
deleteAsset(id);

// Search assets
searchAssets(query);

// Health check
healthCheck();
```

### ProfileService

**Purpose**: User profile CRUD operations

**Methods**:

```typescript
createProfile(profileData);
getProfiles();
getProfileById(id);
updateProfile(id, updates);
deleteProfile(id);
duplicateProfile(id);
```

### JobService

**Purpose**: Job extraction and matching

**Methods**:

```typescript
extractJobFromUrl(url);
extractJobFromText(text);
advancedJobAnalysis(jobData);
getJobMatching(userProfileId);
listJobs(filters);
getJob(jobId);
deleteJob(jobId);
```

## Best Practices

### When Building New Components

1. **Start with Accessibility**
   - Include ARIA labels and roles
   - Test with keyboard navigation
   - Ensure semantic HTML

2. **Add Loading States**
   - Use SkeletonLoader for data fetching
   - Show progress for long operations
   - Disable form submission while loading

3. **Handle Errors Gracefully**
   - Show user-friendly error messages
   - Announce errors to screen readers
   - Provide recovery options

4. **Test Responsiveness**
   - Mobile-first approach
   - Test on multiple breakpoints
   - Ensure touch-friendly tap targets (48x48px minimum)

5. **Performance Considerations**
   - Lazy load heavy components
   - Memoize expensive computations
   - Use proper key props in lists

### Component Organization

```
frontend/src/
├── components/
│   ├── ui/                 # Base UI components
│   ├── library/            # Reusable business components
│   ├── features/           # Feature-specific components
│   └── modals/             # Modal components
├── pages/                  # Page components
├── context/                # Context providers
├── api/                    # API service layer
└── utils/                  # Helper utilities
```

## Common Patterns

### Error Handling

```typescript
try {
  const data = await apiService.fetchData();
  setData(data);
} catch (err: any) {
  const message = err.response?.data?.message || "An error occurred";
  setError(message);
  announceToScreenReader(`Error: ${message}`, "assertive");
}
```

### Loading States

```typescript
if (isLoading) {
  return <SkeletonLoader type="card" count={3} />;
}

if (error) {
  return <Alert severity="error">{error}</Alert>;
}

return <YourComponent />;
```

### Form Validation

```typescript
const [fieldErrors, setFieldErrors] = useState({});

const validateForm = () => {
  const errors = {};

  if (!email) {
    errors.email = "Email is required";
  }

  setFieldErrors(errors);
  return Object.keys(errors).length === 0;
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  // Submit form
};
```

## Resources

- [Material-UI Component API](https://mui.com/material-ui/api/)
- [React Best Practices](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
