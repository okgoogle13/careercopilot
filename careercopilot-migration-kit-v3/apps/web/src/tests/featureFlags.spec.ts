import { describe, expect, it } from 'vitest';
import { getRuntimeFeatureFlags } from '../config/featureFlags';

describe('getRuntimeFeatureFlags', () => {
  it('returns an empty override set when no runtime flag query exists', () => {
    expect(getRuntimeFeatureFlags('')).toEqual({});
    expect(getRuntimeFeatureFlags('?view=profile')).toEqual({});
  });

  it('parses compact ff query params', () => {
    expect(getRuntimeFeatureFlags('?ff=profile')).toEqual({ profile: true });
    expect(getRuntimeFeatureFlags('?ff=login,unknown,profile')).toEqual({
      login: true,
      profile: true,
    });
    expect(getRuntimeFeatureFlags('?ff=onboarding,welcome')).toEqual({
      onboarding: true,
      welcome: true,
    });
  });

  it('parses screenFlag query params and ignores disabled values', () => {
    expect(getRuntimeFeatureFlags('?screenFlag.profile=1')).toEqual({ profile: true });
    expect(
      getRuntimeFeatureFlags('?screenFlag.unknown=1&screenFlag.profile=0'),
    ).toEqual({});
    expect(
      getRuntimeFeatureFlags('?screenFlag.onboarding=1&screenFlag.welcome=1'),
    ).toEqual({
      onboarding: true,
      welcome: true,
    });
  });
});
