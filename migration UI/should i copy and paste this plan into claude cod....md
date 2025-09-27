# **Migration Plan: Tailwind CSS to Material-UI (MUI)**

**Objective**: Resolve all UI layout issues by performing a complete migration from the current Tailwind CSS and shadcn/ui system to a consistent Material-UI (MUI) v5+ implementation. The new implementation will be based on the provided Material 3 theme.ts file.

## **Phase 1: Foundational Setup (The Core Task)**

This phase establishes the new MUI design system and removes all conflicting Tailwind configurations.

1. **Uninstall Tailwind & Install MUI**:
   - **Uninstall** all Tailwind-related dev dependencies: tailwindcss, postcss, autoprefixer.
   - **Install** all necessary MUI dependencies: @mui/material, @emotion/react, @emotion/styled.
2. **Purge Tailwind Configuration**:
   - **Delete** the following configuration files from the project root:
     - tailwind.config.js
     - postcss.config.js
   - **Clear src/index.css**: Remove all content, especially the @tailwind directives. Leave only the base body styles.
3. **Implement the MUI Theme**:
   - Create a new file at src/theme.ts and use the provided theme configuration code.
   - Modify src/main.tsx to wrap the \<App /\> component.
   - Import and use MUI's \<ThemeProvider theme={theme}\> and \<CssBaseline /\>. CssBaseline is MUI's CSS reset and is critical for fixing layout issues.

## **Phase 2: Component Refactoring (Iterative Process)**

Systematically convert each component from using Tailwind className to using MUI components and the sx prop for styling. Reference the theme created in Phase 1 for all styling decisions.

### **Component Mapping Guide:**

- **Layout**: Replace div className="flex..." with \<Stack\>, \<Grid\>, or \<Box\>.
- **Typography**: Replace h1, p, etc., with \<Typography variant="..."\>.
- **Cards**: Replace custom Card components with MUI's \<Card\> and \<CardContent\>.
- **Buttons**: Replace button with MUI's \<Button variant="..."\>.

### **High-Priority Components to Migrate First:**

1. src/components/Sidebar.tsx \-\> Use \<Drawer\>, \<List\>, \<ListItemButton\>.
2. src/components/Dashboard.tsx \-\> Use \<Box\>, \<Grid\>, \<Stack\>, \<Card\>.
3. src/components/ProfileCard.tsx \-\> Use \<Card\>, \<CardContent\>, \<Avatar\>, \<Typography\>.
4. src/components/CreateProfileCard.tsx \-\> Use \<Card\> with borderStyle: 'dashed'.
5. src/components/ErrorCard.tsx \-\> Use \<Card\> and \<Alert\>.

**Refactoring Pattern Example (CreateProfileCard.tsx)**:

- **Before (Tailwind)**:
  \<Card className="glass p-6 flex flex-col items-center ..."\>
   \<h3 className="font-semibold text-foreground text-lg"\>Create New Document\</h3\>
   \<Button className="btn-gradient px-6 py-2"\>Get Started\</Button\>
  \</Card\>

- **Target (MUI)**:
  import { Card, Typography, Button } from '@mui/material';

  \<Card sx={{
      height: '100%',
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px dashed',
      borderColor: (theme) \=\> theme.palette.divider,
  }}\>
   \<Typography variant="h6"\>Create New Document\</Typography\>
   \<Button variant="contained" sx={{ mt: 2 }}\>Get Started\</Button\>
  \</Card\>

### **Remaining Components:**

- Apply the same refactoring pattern to all other components in the src/components/ directory that use Tailwind classes.

## **Phase 3: Final Cleanup**

1. **Delete shadcn/ui Components**: Remove the entire src/components/ui directory. All its functionality should now be provided by MUI.
2. **Verify package.json**: Ensure all tailwindcss, postcss, autoprefixer, and @radix-ui/\* packages have been removed.
3. **Final Review**: Manually inspect the running application to confirm that all Tailwind styles are gone and the UI is consistent under the new MUI theme.
