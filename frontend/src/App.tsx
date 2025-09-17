import { Typography, Button, Container, Box, Paper } from '@mui/material';
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to CareerCopilot
        </Typography>
        
        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom>
            Count: {count}
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => setCount((c) => c + 1)}
            sx={{ mr: 2 }}
          >
            Increment
          </Button>
          <Button 
            variant="outlined"
            onClick={() => setCount(0)}
          >
            Reset
          </Button>
        </Box>
        
        <Typography variant="body1" sx={{ mt: 4 }}>
          Start building your application with Material-UI
        </Typography>
      </Paper>
    </Container>
  );
}

export default App;
