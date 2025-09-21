import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/theme-tokens.css';
import './styles/enhanced-theme.css';
import './styles/theme-utility-classes.css';

createRoot(document.getElementById('root')!).render(<App />);
