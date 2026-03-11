import { BrowserRouter } from 'react-router-dom';
import {
  getRuntimeFeatureFlags,
  type FeatureFlagState,
} from '../config/featureFlags';
import { AppProviders } from './providers';
import { AppRoutes } from './routes';

export interface AppProps {
  initialFlags?: Partial<FeatureFlagState>;
}

export function App({ initialFlags }: AppProps) {
  const runtimeFlags =
    typeof window === 'undefined' ? {} : getRuntimeFeatureFlags(window.location.search);
  const mergedFlags = {
    ...initialFlags,
    ...runtimeFlags,
  };

  return (
    <AppProviders>
      <BrowserRouter>
        <AppRoutes initialFlags={mergedFlags} />
      </BrowserRouter>
    </AppProviders>
  );
}
