import React, { useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { Search, Mail, Person as User } from '@mui/icons-material';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../../ui/dialog';
import {
  LayoutContainer,
  LayoutGrid,
  LayoutGridItem,
  LayoutStack,
  LayoutFlex,
  LayoutCard,
} from '../../ui/layout';
import { useTheme as useMuiTheme } from '@mui/material/styles';

interface MUITestProps {
  onBack: () => void;
}

export const MUITest: React.FC<MUITestProps> = ({ onBack }) => {
  const theme = useMuiTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  return (
    <LayoutContainer>
      <LayoutStack spacing={4}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            MUI Migration Test
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive showcase of migrated MUI components and theme integration
          </Typography>
        </Box>

        <LayoutFlex justify="space-between" align="center" wrap gap={2}>
          <Button variant="default" onClick={onBack}>
            Back to App
          </Button>
          <LayoutFlex gap={2}>
            <Button variant="outlined">Outlined Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="default" onClick={() => setDialogOpen(true)}>
              Open Dialog
            </Button>
          </LayoutFlex>
        </LayoutFlex>

        <LayoutGrid spacing={3}>
          <LayoutGridItem xs={12} md={4}>
            <Card variant="elevation">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  This is a default card with MUI styling. The theme colors and typography should be
                  applied consistently.
                </Typography>
                <LayoutFlex gap={1} wrap sx={{ mt: 2 }}>
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outlined">Outline</Badge>
                  <Badge variant="outlined">Error</Badge>
                </LayoutFlex>
              </CardContent>
            </Card>
          </LayoutGridItem>

          <LayoutGridItem xs={12} md={4}>
            <Card variant="elevation">
              <CardHeader>
                <CardTitle>Form Components</CardTitle>
              </CardHeader>
              <CardContent>
                <LayoutStack spacing={2}>
                  <Input
                    placeholder="Search with icon..."
                    InputProps={{ startAdornment: <Search sx={{ fontSize: 16, mr: 1 }} /> }}
                  />
                  <Input
                    placeholder="Email address"
                    type="email"
                    InputProps={{ startAdornment: <Mail sx={{ fontSize: 16, mr: 1 }} /> }}
                  />
                  <Input
                    placeholder="Error state example"
                    error={true}
                    InputProps={{ startAdornment: <User sx={{ fontSize: 16, mr: 1 }} /> }}
                  />
                  <Textarea placeholder="Write your message here..." rows={3} />
                </LayoutStack>
              </CardContent>
            </Card>
          </LayoutGridItem>

          <LayoutGridItem xs={12} md={4}>
            <Card variant="elevation">
              <CardHeader>
                <CardTitle>Layout Showcase</CardTitle>
              </CardHeader>
              <CardContent>
                <LayoutStack spacing={2}>
                  <LayoutCard variant="outlined">
                    <Box sx={{ p: 2 }}>
                      <Typography variant="body2">Layout Card Component</Typography>
                    </Box>
                  </LayoutCard>
                  <LayoutFlex justify="space-between" align="center">
                    <Typography variant="body2">Flex Layout</Typography>
                    <Button variant="link" size="small">
                      Action
                    </Button>
                  </LayoutFlex>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>
                      Theme: {theme.palette.mode}
                    </Typography>
                  </Box>
                </LayoutStack>
              </CardContent>
            </Card>
          </LayoutGridItem>
        </LayoutGrid>

        <Box
          sx={{
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Theme Colors
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Box
              sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 1 }}
            >
              Primary
            </Box>
            <Box
              sx={{
                p: 2,
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
                borderRadius: 1,
              }}
            >
              Secondary
            </Box>
            <Box sx={{ p: 2, bgcolor: 'error.main', color: 'error.contrastText', borderRadius: 1 }}>
              Error
            </Box>
            <Box
              sx={{ p: 2, bgcolor: 'warning.main', color: 'warning.contrastText', borderRadius: 1 }}
            >
              Warning
            </Box>
            <Box
              sx={{ p: 2, bgcolor: 'success.main', color: 'success.contrastText', borderRadius: 1 }}
            >
              Success
            </Box>
          </Stack>
        </Box>
        {/* Dialog Component Test */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogClose onClick={() => setDialogOpen(false)} />
          <DialogHeader>
            <DialogTitle>MUI Dialog Component</DialogTitle>
            <DialogDescription>
              This is a test of the migrated MUI dialog component with proper theming and
              animations.
            </DialogDescription>
          </DialogHeader>
          <DialogContent>
            <LayoutStack spacing={3}>
              <Input
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                InputProps={{ startAdornment: <User sx={{ fontSize: 16, mr: 1 }} /> }}
              />
              <Input
                placeholder="your.email@example.com"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                InputProps={{ startAdornment: <Mail sx={{ fontSize: 16, mr: 1 }} /> }}
              />
              <Textarea
                placeholder="Your message..."
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, mes_age: e.target.value })}
              />
            </LayoutStack>
          </DialogContent>
          <DialogFooter>
            <Button variant="outlined" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={() => setDialogOpen(false)}>
              Send Message
            </Button>
          </DialogFooter>
        </Dialog>
      </LayoutStack>
    </LayoutContainer>
  );
};
