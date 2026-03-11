export type ScreenFlagKey =
  | 'login'
  | 'register'
  | 'dashboard'
  | 'profile'
  | 'onboarding'
  | 'welcome';

export interface ScreenFlagDefinition {
  key: ScreenFlagKey;
  route:
    | '/login'
    | '/register'
    | '/dashboard'
    | '/profile'
    | '/onboarding'
    | '/welcome';
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
  profile: {
    key: 'profile',
    route: '/profile',
    description: 'Controls the next /features to /screens migration for /profile.',
    defaultEnabled: false,
  },
  onboarding: {
    key: 'onboarding',
    route: '/onboarding',
    description: 'Controls the next /features to /screens migration for /onboarding.',
    defaultEnabled: false,
  },
  welcome: {
    key: 'welcome',
    route: '/welcome',
    description: 'Controls the next /features to /screens migration for /welcome.',
    defaultEnabled: false,
  },
};

export const DEFAULT_FEATURE_FLAGS: FeatureFlagState = {
  login: SCREEN_FLAG_DEFINITIONS.login.defaultEnabled,
  register: SCREEN_FLAG_DEFINITIONS.register.defaultEnabled,
  dashboard: SCREEN_FLAG_DEFINITIONS.dashboard.defaultEnabled,
  profile: SCREEN_FLAG_DEFINITIONS.profile.defaultEnabled,
  onboarding: SCREEN_FLAG_DEFINITIONS.onboarding.defaultEnabled,
  welcome: SCREEN_FLAG_DEFINITIONS.welcome.defaultEnabled,
};

export function getFeatureFlags(
  overrides?: Partial<FeatureFlagState>,
): FeatureFlagState {
  return {
    ...DEFAULT_FEATURE_FLAGS,
    ...overrides,
  };
}

const SCREEN_FLAG_KEYS = Object.keys(SCREEN_FLAG_DEFINITIONS) as ScreenFlagKey[];

export function getRuntimeFeatureFlags(
  search: string,
): Partial<FeatureFlagState> {
  const params = new URLSearchParams(search);
  const runtimeFlags: Partial<FeatureFlagState> = {};

  for (const key of SCREEN_FLAG_KEYS) {
    if (params.get(`screenFlag.${key}`) === '1') {
      runtimeFlags[key] = true;
    }
  }

  const compactFlags = params.get('ff');
  if (!compactFlags) {
    return runtimeFlags;
  }

  for (const rawKey of compactFlags.split(',')) {
    const key = rawKey.trim() as ScreenFlagKey;
    if (SCREEN_FLAG_KEYS.includes(key)) {
      runtimeFlags[key] = true;
    }
  }

  return runtimeFlags;
}

export function isScreenEnabled(
  key: ScreenFlagKey,
  flags?: Partial<FeatureFlagState>,
): boolean {
  return getFeatureFlags(flags)[key];
}
