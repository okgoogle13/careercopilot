/**
 * useAnalytics — L2 recommendation from docs/analysis/user-journey-analysis.md
 *
 * Lightweight analytics hook that tracks key activation milestones.
 * In development mode it logs events to the console for visibility.
 * In production it calls `window.gtag` (Google Analytics 4) if present,
 * and/or `window.posthog` if present — both are no-ops when not installed.
 *
 * Swap out the `dispatch()` implementation to route events to any analytics
 * provider (Posthog, Segment, Mixpanel, GA4) without touching call sites.
 *
 * Tracked events (as specified in the analysis):
 *   - onboarding_welcome_seen
 *   - onboarding_domain_selected
 *   - onboarding_segment_selected
 *   - resume_ingestion_started
 *   - resume_ingestion_skipped
 *   - resume_ingestion_completed
 *   - ats_score_run
 *   - cover_letter_generated
 *   - ksc_generated
 *   - document_exported
 */

export type AnalyticsEvent =
  | 'onboarding_welcome_seen'
  | 'onboarding_domain_selected'
  | 'onboarding_segment_selected'
  | 'resume_ingestion_started'
  | 'resume_ingestion_skipped'
  | 'resume_ingestion_completed'
  | 'ats_score_run'
  | 'cover_letter_generated'
  | 'ksc_generated'
  | 'document_exported';

export interface AnalyticsProperties {
  [key: string]: string | number | boolean | undefined;
}

function dispatch(event: AnalyticsEvent, properties?: AnalyticsProperties): void {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug(`[analytics] ${event}`, properties ?? {});
  }

  // Google Analytics 4
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', event, properties);
  }

  // Posthog
  if (typeof window !== 'undefined' && (window as any).posthog?.capture) {
    (window as any).posthog.capture(event, properties);
  }
}

/**
 * useAnalytics — returns a `track` function for firing analytics events.
 *
 * @example
 *   const { track } = useAnalytics();
 *   track('onboarding_domain_selected', { domain: 'social-work' });
 */
export function useAnalytics() {
  return { track: dispatch };
}

export default useAnalytics;
