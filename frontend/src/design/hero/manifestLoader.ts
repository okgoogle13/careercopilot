import { SolidarityManifest } from './heroTypes';
import { normalizeManifest } from './normalizeManifest';

let cachedManifest: SolidarityManifest | null = null;

export async function loadManifest(forceReload: boolean = false): Promise<SolidarityManifest> {
  if (cachedManifest && !forceReload) {
    return cachedManifest;
  }

  const base = (import.meta as any).env?.BASE_URL || '';
  const url = `${base}/assets/kerala-rage-kr-solidarity-manifest.json`.replace(/\/\/+/g, '/');

  const response = await fetch(url, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error('Failed to load Solidarity Manifest');
  }

  const rawJson = (await response.json()) as SolidarityManifest;
  cachedManifest = normalizeManifest(rawJson);

  return cachedManifest;
}
