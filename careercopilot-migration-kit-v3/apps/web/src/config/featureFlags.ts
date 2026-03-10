export type ScreenFlagKey = 'login' | 'register' | 'dashboard';

export interface ScreenFlagDefinition {
  key: ScreenFlagKey;
  route: '/login' | '/register' | '/dashboard';
  description: string;
  defaultEnabled: boolean;
}

export type FeatureFlagState = Record<ScreenFlagKey, boolean>;

export const SCREEN_FLAG_DEFINITIONS: Record<ScreenFlagKey, ScreenFlagDefinition> = {
  login: {
    key: 'login',
    route: '/login',
    description: 'Controls the first /features to /screens migration for /login.',
    defaultEnabled: false,
  },
  register: {
    key: 'register',
    route: '/register',
    description: 'Controls the second /features to /screens migration for /register.',
    defaultEnabled: false,
  },
  dashboard: {
    key: 'dashboard',
    route: '/dashboard',
    description: 'Controls the next /features to /screens migration for /dashboard.',
    defaultEnabled: false,
  },
};

export const DEFAULT_FEATURE_FLAGS: FeatureFlagState = {
  login: SCREEN_FLAG_DEFINITIONS.login.defaultEnabled,
  register: SCREEN_FLAG_DEFINITIONS.register.defaultEnabled,
  dashboard: SCREEN_FLAG_DEFINITIONS.dashboard.defaultEnabled,
};

export function getFeatureFlags(
  overrides?: Partial<FeatureFlagState>,
): FeatureFlagState {
  return {
    ...DEFAULT_FEATURE_FLAGS,
    ...overrides,
  };
}

export function isScreenEnabled(
  key: ScreenFlagKey,
  flags?: Partial<FeatureFlagState>,
): boolean {
  return getFeatureFlags(flags)[key];
}
