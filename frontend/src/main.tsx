import { createRoot } from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import ThemeWrapper from './theme/ThemeWrapper';
import App from './App';
import './styles/globals.css';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StyledEngineProvider injectFirst>
    <ThemeWrapper>
      <App />
    </ThemeWrapper>
  </StyledEngineProvider>
);
