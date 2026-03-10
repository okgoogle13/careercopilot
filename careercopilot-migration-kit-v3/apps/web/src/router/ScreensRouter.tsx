import { Route } from 'react-router-dom';
import type { FeatureFlagState } from '../config/featureFlags';
import { DashboardLegacy } from '../features/DashboardLegacy';
import { LoginLegacy } from '../features/LoginLegacy';
import { RegisterLegacy } from '../features/RegisterLegacy';
import { DashboardScreen } from '../screens/DashboardScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { RouteGate } from './RouteGate';

export interface ScreensRouterProps {
  flags?: Partial<FeatureFlagState>;
}

export function ScreensRouter({ flags }: ScreensRouterProps) {
  return (
    <>
      <Route
        path="/login"
        element={
          <RouteGate
            flag="login"
            flags={flags}
            migrated={<LoginScreen />}
            legacy={<LoginLegacy />}
          />
        }
      />
      <Route
        path="/register"
        element={
          <RouteGate
            flag="register"
            flags={flags}
            migrated={<RegisterScreen />}
            legacy={<RegisterLegacy />}
          />
        }
      />
      <Route
        path="/dashboard"
        element={
          <RouteGate
            flag="dashboard"
            flags={flags}
            migrated={<DashboardScreen />}
            legacy={<DashboardLegacy />}
          />
        }
      />
    </>
  );
}
