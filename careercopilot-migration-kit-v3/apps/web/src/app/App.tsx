import { BrowserRouter } from 'react-router-dom';
import type { FeatureFlagState } from '../config/featureFlags';
import { AppProviders } from './providers';
import { AppRoutes } from './routes';

export interface AppProps {
  initialFlags?: Partial<FeatureFlagState>;
}

export function App({ initialFlags }: AppProps) {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppRoutes initialFlags={initialFlags} />
      </BrowserRouter>
    </AppProviders>
  );
}
