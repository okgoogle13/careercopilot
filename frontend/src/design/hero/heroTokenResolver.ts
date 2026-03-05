import { SolidarityManifest, ManifestAsset, HeroLayer, BlendMode, PositionMode } from './heroTypes';
import { normalizeManifest } from './normalizeManifest';

export interface HeroTokenDefaults {
  blend_mode?: BlendMode;
  opacity?: number;
  position?: PositionMode;
}

export interface HeroTokenEntryV2 {
  ref?: string;
  alias_of?: string;
  layer?: string;
  status?: string;
  tags?: string[];
  defaults?: HeroTokenDefaults;
  description?: string;
}

export interface HeroTokenMapV2 {
  version: string;
  token_schema: string;
  tokens: Record<string, HeroTokenEntryV2>;
}

export interface ResolveHeroTokenOptions {
  tokenKey: string;
  tokenMap: HeroTokenMapV2;
  manifest: SolidarityManifest;
  allowAliases?: boolean;
}

export interface ResolvedTokenResult {
  asset: ManifestAsset;
  token: HeroTokenEntryV2;
  resolvedDefaults: {
    opacity: number;
    blend_mode: BlendMode;
    position: PositionMode;
  };
}

export function resolveHeroToken(options: ResolveHeroTokenOptions): ResolvedTokenResult {
  const { tokenKey, tokenMap, manifest: rawManifest, allowAliases = true } = options;
  if (!tokenKey) {
    throw new Error('tokenKey missing');
  }

  const tokenMapObj = tokenMap.tokens;
  let currentKey = tokenKey;
  let currentToken = tokenMapObj[currentKey];

  if (!currentToken) {
    throw new Error(`Token not found in map: ${currentKey}`);
  }

  // Alias resolution, max depth 3
  let depth = 0;
  while (currentToken.alias_of && allowAliases) {
    if (depth >= 3) {
      throw new Error(`Alias loop detected or max depth exceeded for token: ${tokenKey}`);
    }
    const nextKey = currentToken.alias_of;
    const nextToken = tokenMapObj[nextKey];
    if (!nextToken) {
      throw new Error(`Alias target not found: ${nextKey}`);
    }
    currentKey = nextKey;
    currentToken = nextToken;
    depth++;
  }

  if (currentToken.alias_of && !allowAliases) {
    throw new Error(`Token is an alias but allowAliases is false: ${tokenKey}`);
  }

  if (!currentToken.ref) {
    throw new Error(`Token missing ref: ${currentKey}`);
  }

  // Normalize manifest
  const manifest = normalizeManifest(rawManifest);

  // Find asset
  const asset = manifest.assets.find((a) => a.id === currentToken.ref);
  if (!asset) {
    throw new Error(`Asset ref not found in manifest: ${currentToken.ref}`);
  }

  // Merge defaults
  const resolvedDefaults = {
    opacity: currentToken.defaults?.opacity ?? 1,
    blend_mode: currentToken.defaults?.blend_mode ?? ('normal' as BlendMode),
    position: currentToken.defaults?.position ?? ('cover' as PositionMode),
  };

  return {
    asset,
    token: currentToken,
    resolvedDefaults,
  };
}

export function resolveHeroTokenToLayer(
  options: ResolveHeroTokenOptions & { z_index: number }
): HeroLayer {
  const { asset, resolvedDefaults } = resolveHeroToken(options);

  return {
    type: asset.layer,
    asset_id: asset.id,
    z_index: options.z_index,
    opacity: resolvedDefaults.opacity,
    blend_mode: resolvedDefaults.blend_mode,
    position: resolvedDefaults.position,
  };
}
