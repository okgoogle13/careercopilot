# CareerCopilot M3-MUI Migration - Complete Component Updates

## Task

Convert all React components from Tailwind CSS to MUI with Material 3 tokens.

## Requirements

1. Replace ALL Tailwind classes with MUI components and sx props
2. Use Material 3 design tokens from theme (primary, secondary, surface, etc.)
3. Maintain all existing functionality and TypeScript types
4. Add proper MUI imports to each file
5. Fix any TypeScript compilation errors

## MUI Component Mappings

- div with styling → Paper, Card, Box
- button → Button (variant="contained|outlined|text")
- input → TextField
- h1,h2,h3 → Typography (variant="h1|h2|h3")
- Classes like "bg-white shadow-md rounded-lg p-6" → Paper elevation={1} sx={{p:3}}

## Theme Usage Examples

```tsx
// Use theme tokens
sx={{
  backgroundColor: 'background.paper',
  color: 'text.primary',
  borderRadius: 2,
  p: 3
}}

// Import MUI components
import {
  Box, Button, Typography, TextField, Paper, Container,
  Card, CardContent, Grid, Stack, Chip, CircularProgress
} from '@mui/material';
```
