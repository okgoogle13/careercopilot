export type HeroPageKey =
  | 'landing-page'
  | 'lens-dashboard'
  | 'jar-flow'
  | 'applications-board'
  | 'onboarding';

export const PAGE_HERO_MAP: Record<HeroPageKey, string> = {
  'landing-page': 'resistance-portrait-hero',
  'lens-dashboard': 'layered-solidarity-hero',
  'jar-flow': 'kr-hero-industrial-collective-005',
  'applications-board': 'cultural-symbol-hero-2',
  onboarding: 'devotional-anchor-hero-1',
};

export function resolvePageHeroComposition(page: HeroPageKey): string {
  return PAGE_HERO_MAP[page];
}
