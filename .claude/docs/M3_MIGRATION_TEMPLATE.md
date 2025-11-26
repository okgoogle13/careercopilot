# Component Migration Template

## Pattern 1: Styled Component Color & Spacing

```tsx
// BEFORE
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#1E1E23',
  color: '#F8FAFC',
  padding: '20px',
  margin: '12px',
  borderColor: '#48464F',
}));

// AFTER
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.surface.container,
  color: theme.palette.text.primary,
  padding: theme.spacing(4),      // 16px
  margin: theme.spacing(3),       // 12px
  borderColor: theme.palette.divider,
}));
```

## Pattern 2: Typography Component

```tsx
// BEFORE
<div style={{ fontSize: '24px', fontWeight: 600, margin: '12px 0' }}>
  Heading Text
</div>

// AFTER
<Typography variant="h4" sx={{ mb: 3 }}>
  Heading Text
</Typography>
```

## Pattern 3: Inline Styles

```tsx
// BEFORE
<Box sx={{ color: '#F8FAFC', padding: '20px', gap: '8px' }}>
  Content
</Box>

// AFTER
<Box sx={{
  color: theme.palette.text.primary,
  padding: theme.spacing(4),
  gap: theme.spacing(2),
}}>
  Content
</Box>
```

## Pattern 4: Hover & Focus States

```tsx
// BEFORE
<Button sx={{
  backgroundColor: '#A78BFA',
  '&:hover': { backgroundColor: '#C084FC' },
}}>

// AFTER
<Button sx={{
  backgroundColor: theme.palette.primary.main,
  '&:hover': { backgroundColor: theme.palette.primary.light },
}}>
```

Key color mappings:
- Primary → `theme.palette.primary.*`
- Text → `theme.palette.text.*`
- Borders → `theme.palette.divider`
- Backgrounds → `theme.palette.surface.*` or `background.*`
- Spacing → `theme.spacing(n)` where n = multiple of 1
