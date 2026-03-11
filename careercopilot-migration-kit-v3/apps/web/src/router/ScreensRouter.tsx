import { Route } from 'react-router-dom';
import type { FeatureFlagState } from '../config/featureFlags';
import { DashboardLegacy } from '../features/DashboardLegacy';
import { LoginLegacy } from '../features/LoginLegacy';
import { OnboardingLegacy } from '../features/OnboardingLegacy';
import { ProfileLegacy } from '../features/ProfileLegacy';
import { RegisterLegacy } from '../features/RegisterLegacy';
import { WelcomeLegacy } from '../features/WelcomeLegacy';
import { DashboardScreen } from '../screens/DashboardScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
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
      <Route
        path="/profile"
        element={
          <RouteGate
            flag="profile"
            flags={flags}
            migrated={<ProfileScreen />}
            legacy={<ProfileLegacy />}
          />
        }
      />
      <Route
        path="/onboarding"
        element={
          <RouteGate
            flag="onboarding"
            flags={flags}
            migrated={<OnboardingScreen />}
            legacy={<OnboardingLegacy />}
          />
        }
      />
      <Route
        path="/welcome"
        element={
          <RouteGate
            flag="welcome"
            flags={flags}
            migrated={<WelcomeScreen />}
            legacy={<WelcomeLegacy />}
          />
        }
      />
    </>
  );
}
