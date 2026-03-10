import { useCallback } from 'react';

type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

const USE_ANALYTICS_LOG = import.meta.env?.MODE !== 'production';
const MILESTONE_PREFIX = 'cc_milestone_';

export function useAnalytics() {
  const track = useCallback((event: string, payload: AnalyticsPayload = {}) => {
    if (USE_ANALYTICS_LOG) {
      console.info('[analytics]', event, payload);
    }

    // Future provider hook-in point (GA4/PostHog/etc).
    const win = window as Window & {
      gtag?: (...args: unknown[]) => void;
      posthog?: { capture?: (eventName: string, data?: AnalyticsPayload) => void };
    };

    if (typeof win.gtag === 'function') {
      win.gtag('event', event, payload);
    }
    if (win.posthog?.capture) {
      win.posthog.capture(event, payload);
    }

    try {
      switch (event) {
        case 'ats_score_run':
          localStorage.setItem(`${MILESTONE_PREFIX}run_ats`, 'true');
          break;
        case 'cover_letter_generated':
          localStorage.setItem(`${MILESTONE_PREFIX}generate_cover_letter`, 'true');
          break;
        case 'ksc_generated':
          localStorage.setItem(`${MILESTONE_PREFIX}create_ksc`, 'true');
          break;
        default:
          break;
      }
    } catch {
      // ignore storage failures in private modes
    }
  }, []);

  return { track };
}

export default useAnalytics;
