import type { ReactElement } from 'react';
import {
  type FeatureFlagState,
  type ScreenFlagKey,
  isScreenEnabled,
} from '../config/featureFlags';

export interface RouteGateProps {
  flag: ScreenFlagKey;
  migrated: ReactElement;
  legacy: ReactElement;
  flags?: Partial<FeatureFlagState>;
}

export function RouteGate({
  flag,
  migrated,
  legacy,
  flags,
}: RouteGateProps) {
  return isScreenEnabled(flag, flags) ? migrated : legacy;
}
