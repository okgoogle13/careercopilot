// @ts-expect-error - TS2497: esModuleInterop enabled but TS 5.9 namespace import quirk
import * as functions from 'firebase-functions';
// @ts-expect-error - TS2497: esModuleInterop enabled but TS 5.9 namespace import quirk
import * as admin from 'firebase-admin';

// Read from package.json at startup (robust, no import() needed for JSON)
const VERSION = process.env.npm_package_version ?? 'unknown';

/**
 * healthCheck
 *
 * Simple HTTP health probe for monitoring and Vercel/uptime checks.
 *
 * GET  /healthCheck
 *   → 200 { status: "ok", timestamp, version }
 *
 * Also verifies Firestore connectivity; returns 503 if unavailable.
 */
export const healthCheck = functions.https.onRequest(async (req, res) => {
  // Only allow GET
  if (req.method !== 'GET') {
    res.status(405).json({error: 'Method Not Allowed'});
    return;
  }

  const timestamp = new Date().toISOString();

  try {
    // Lightweight Firestore ping — read a non-existent doc to verify connectivity
    await admin.firestore().collection('_healthcheck').doc('ping').get();

    res.status(200).json({
      status: 'ok',
      timestamp,
      version: VERSION,
      services: {
        firestore: 'ok',
      },
    });
  } catch (error) {
    console.error('[healthCheck] Firestore connectivity error:', error);
    res.status(503).json({
      status: 'degraded',
      timestamp,
      version: VERSION,
      services: {
        firestore: 'unavailable',
      },
      error: error instanceof Error ? error.message : String(error),
    });
  }
});
