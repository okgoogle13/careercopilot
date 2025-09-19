import { useState } from 'react';
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Add,
  CloudUpload,
  Edit,
  Email,
  Favorite,
  Person,
  Phone,
  Share,
  Work,
} from '@mui/icons-material';

const actions = [
  { icon: <Add />, name: 'Create' },
  { icon: <Edit />, name: 'Edit' },
  { icon: <Share />, name: 'Share' },
];

function App() {
  const [count, setCount] = useState(0);
  const theme = useTheme();

  return (
    <>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Work sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CareerCopilot
          </Typography>
          <Button color="inherit" startIcon={<Person />}>
            Profile
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
        {/* Status Alert */}
        <Alert 
          severity="info" 
          sx={{ mb: 4 }}
          action={
            <Button color="inherit" size="small">
              Dismiss
            </Button>
          }
        >
          Welcome to the new Material 3 experience!
        </Alert>

        <Stack spacing={4}>
          {/* Hero Section */}
          <Paper 
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom>
              Welcome to CareerCopilot
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Your personal career development assistant
            </Typography>
            
            <Stack direction="row" spacing={2}>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                startIcon={<CloudUpload />}
                onClick={() => setCount(c => c + 1)}
                sx={{
                  background: 'linear-gradient(90deg, #9C27B0 0%, #7B1FA2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #AB47BC 0%, #8E24AA 100%)',
                  },
                }}
              >
                Upload Resume
              </Button>
              <Button 
                variant="outlined" 
                color="inherit"
                size="large"
                onClick={() => setCount(0)}
              >
                Reset Counter
              </Button>
            </Stack>
          </Paper>

          {/* Stats Section */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              icon={<Favorite color="error" />} 
              label={`${count} Likes`} 
              variant="outlined"
              sx={{ px: 2, py: 1 }}
            />
            <Chip 
              avatar={<Avatar>U</Avatar>}
              label="Active User"
              variant="outlined"
              sx={{ px: 2, py: 1 }}
            />
          </Box>

          {/* Features Grid */}
          <Box sx={{ 
            display: 'grid', 
            gap: 3, 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            '& .MuiCard-root': {
              background: 'linear-gradient(145deg, #1E1E1E 0%, #2D2D2D 100%)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              '&:hover': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}>
            <Card elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random/600x400?career"
                alt="Career Growth"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Career Planning
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Plan your career path with our intelligent tools and personalized recommendations.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
                <Button size="small">Get Started</Button>
              </CardActions>
            </Card>

            <Card elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography gutterBottom variant="h5" component="div">
                  Quick Actions
                </Typography>
                <List sx={{ flexGrow: 1 }}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <Email />
                      </ListItemIcon>
                      <ListItemText primary="Email Updates" secondary="Get the latest opportunities" />
                    </ListItemButton>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <Phone />
                      </ListItemIcon>
                      <ListItemText primary="Contact Support" secondary="We're here to help" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
        </Stack>

        {/* Speed Dial for quick actions */}
        <SpeedDial
          ariaLabel="Quick actions"
          sx={{ position: 'fixed', bottom: 32, right: 32 }}
          icon={<SpeedDialIcon />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
            />
          ))}
        </SpeedDial>
      </Container>
    </>
  );
}

export default App;
