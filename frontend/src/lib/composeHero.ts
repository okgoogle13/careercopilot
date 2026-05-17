import type {
  HeroComposition,
  HeroLayer,
  HeroRegistry,
  SolidarityManifest,
  ManifestAsset,
  LayerType,
  BlendMode,
  PositionMode,
} from '../design/hero/heroTypes';

export interface ResolvedLayer {
  type: LayerType;
  assetId: string;
  assetUrl: string;
  zIndex: number;
  opacity: number;
  blendMode: BlendMode;
  position: PositionMode;
  placement?: HeroLayer['placement'];
}

export interface CompositionValidationError {
  valid: false;
  error: string;
  warnings?: string[];
}

export interface CompositionValidationSuccess {
  valid: true;
  resolvedLayers: ResolvedLayer[];
  typography: HeroComposition['typography'];
  motion?: HeroComposition['motion'];
  animation?: HeroComposition['animation'];
  zIndexMap?: HeroComposition['z_index_map'];
  safeZones?: HeroComposition['safe_zones'];
  renderHints?: HeroComposition['render_hints'];
  warnings: string[];
}

export type CompositionResult = CompositionValidationError | CompositionValidationSuccess;

export interface ComposeHeroOptions {
  assetsBasePath?: string; // default: '/assets/kr-solidarity/'
  seed?: string;
  strict?: boolean;
}

const SAFE_BLEND_MODES: ReadonlySet<BlendMode> = new Set([
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity',
]);

/**
 * FNV-1a non-cryptographic hash for deterministic selection.
 */
function hash32(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

import { normalizeManifest } from '../design/hero/normalizeManifest';

export function composeHero(
  rawManifest: SolidarityManifest,
  registry: HeroRegistry,
  compositionId?: string,
  options: ComposeHeroOptions = {}
): CompositionResult {
  const warnings: string[] = [];
  const isDev = Boolean((import.meta as any)?.env?.DEV);

  // 1) Normalize the manifest
  const manifest = normalizeManifest(rawManifest);

  // 1b) Build a manifest index once
  const assetById = new Map(manifest.assets.map((a) => [a.id, a]));

  const composition = compositionId
    ? registry.compositions.find((c) => c.id === compositionId)
    : registry.compositions[0];

  if (!composition) {
    return { valid: false, error: 'No composition found' };
  }

  // 2) Validation rules check: duplicate z_index values exist
  const zIndices = new Set<number>();
  for (const layer of composition.layers) {
    if (zIndices.has(layer.z_index)) {
      const error = `duplicate z_index values exist: ${layer.z_index}`;
      console.error(`[composeHero] Validation Fail:`, error);
      return { valid: false, error };
    }
    zIndices.add(layer.z_index);
  }

  // 3) Resolve layers in a SINGLE PASS
  const usedAssetIds = new Set<string>();
  const resolved: Array<{ layer: HeroLayer; asset: ManifestAsset }> = [];

  let hasSubstrate = false;
  let minZ = Infinity;

  // First pass to resolve assets and basic validation
  for (let i = 0; i < composition.layers.length; i++) {
    const rawLayer = composition.layers[i];
    const effectiveLayer = { ...rawLayer };

    // 3a) Resolve asset_token (v3.2+)
    if (rawLayer.asset_token && registry.tokens?.[rawLayer.asset_token]) {
      const token = registry.tokens[rawLayer.asset_token];
      const resolvedToken = token.alias_of ? registry.tokens[token.alias_of] : token;

      if (resolvedToken?.ref) {
        effectiveLayer.asset_id = resolvedToken.ref;
        // Inherit defaults if not explicitly override in composition
        if (resolvedToken.defaults) {
          // We use simple field presence check; in reality, we might check if they vary from compositional defaults
          if (rawLayer.blend_mode === 'normal' && resolvedToken.defaults.blend_mode) {
            effectiveLayer.blend_mode = resolvedToken.defaults.blend_mode;
          }
          if (rawLayer.opacity === 1 && resolvedToken.defaults.opacity !== undefined) {
            effectiveLayer.opacity = resolvedToken.defaults.opacity;
          }
          if (rawLayer.position === 'center' && resolvedToken.defaults.position) {
            effectiveLayer.position = resolvedToken.defaults.position;
          }
        }
      }
    }

    // Resolve asset_id "auto" deterministically
    let asset: ManifestAsset | undefined;
    if (effectiveLayer.asset_id === 'auto') {
      const seed = options.seed ?? `${composition.id}:${effectiveLayer.type}:${i}`;
      const candidates = manifest.assets
        .filter((a) => a.layer === effectiveLayer.type && !usedAssetIds.has(a.id))
        .sort((a, b) => a.id.localeCompare(b.id));

      if (candidates.length === 0) {
        const error = `No available assets for layer type: ${effectiveLayer.type}`;
        console.error(`[composeHero] Resolution Fail:`, error);
        return { valid: false, error };
      }

      const idx = hash32(seed) % candidates.length;
      asset = candidates[idx];
    } else {
      asset = assetById.get(effectiveLayer.asset_id);
    }

    if (!asset) {
      const error = `Asset not found: ${effectiveLayer.asset_id} (Resolved from token: ${rawLayer.asset_token || 'N/A'})`;
      console.error(`[composeHero] Resolution Fail:`, error);
      return { valid: false, error };
    }

    usedAssetIds.add(asset.id);

    // Validate opacity range 0..1
    if (effectiveLayer.opacity < 0 || effectiveLayer.opacity > 1) {
      return { valid: false, error: `Invalid opacity for layer: ${effectiveLayer.opacity}` };
    }

    // Validate blend_mode allowlist
    if (!SAFE_BLEND_MODES.has(effectiveLayer.blend_mode)) {
      return { valid: false, error: `Invalid blend_mode for layer: ${effectiveLayer.blend_mode}` };
    }

    if (effectiveLayer.type === 'substrate') hasSubstrate = true;
    if (effectiveLayer.z_index < minZ) minZ = effectiveLayer.z_index;

    resolved.push({ layer: effectiveLayer, asset });
  }

  // 4) Validation rules
  if (!hasSubstrate) {
    const error = 'no substrate layer exists';
    console.error(`[composeHero] Validation Fail:`, error);
    return { valid: false, error };
  }

  const substrateLayers = resolved.filter((r) => r.layer.type === 'substrate');
  if (!substrateLayers.some((r) => r.layer.z_index === minZ)) {
    return { valid: false, error: 'substrate is not lowest z-index' };
  }

  // Compatibility tracking
  const sortedByZ = [...resolved].sort((a, b) => a.layer.z_index - b.layer.z_index);
  for (let i = 0; i < sortedByZ.length - 1; i++) {
    const lower = sortedByZ[i];
    const upper = sortedByZ[i + 1];

    if (lower.asset.layering_compatibility.cannot_overlay_with.includes(upper.asset.layer)) {
      return {
        valid: false,
        error: `Compatibility fail: ${upper.asset.layer} cannot overlay ${lower.asset.layer}`,
      };
    }

    if (lower.asset.layering_compatibility.can_overlay_with.length > 0) {
      if (!lower.asset.layering_compatibility.can_overlay_with.includes(upper.asset.layer)) {
        warnings.push(
          `Compatibility warning: ${upper.asset.layer} not in can_overlay_with of ${lower.asset.layer}`
        );
      }
    }
  }

  // 6) Return warnings (non-fatal)
  for (const r of resolved) {
    if (r.layer.type === 'atmospheric') {
      if (r.layer.blend_mode === 'screen' && r.layer.opacity > 0.28) {
        warnings.push(`atmospheric blend_mode screen with opacity > 0.28`);
      }
      if (r.layer.opacity > 0.4) {
        warnings.push(`atmospheric opacity > 0.40`);
      }
    }
  }

  // 7) Output structure
  const assetsBasePath =
    (registry as any).resolver?.assets_base_path ||
    options.assetsBasePath ||
    '/assets/kr-solidarity/';

  const resolvedLayers: ResolvedLayer[] = sortedByZ.map(({ layer, asset }) => {
    // 7) Asset URL Resolution
    // Use layer.src if provided, else asset.file_path, prepend base path if relative
    let assetUrl = (layer as any).src || asset.file_path;
    if (assetUrl && !assetUrl.startsWith('/') && !assetUrl.startsWith('http')) {
      assetUrl = `${assetsBasePath}${assetUrl}`.replace(/\/+/g, '/');
    }

    return {
      type: layer.type,
      assetId: asset.id,
      assetUrl: assetUrl,
      zIndex: layer.z_index,
      opacity: layer.opacity,
      blendMode: layer.blend_mode,
      position: layer.position,
      placement: layer.placement,
    };
  });

  if (warnings.length > 0 && (options.strict || isDev)) {
    console.warn(`[composeHero] Composition "${composition.id}" has warnings:`, warnings);
  }

  return {
    valid: true,
    resolvedLayers,
    typography: composition.typography,
    motion: composition.motion,
    animation: composition.animation,
    zIndexMap: composition.z_index_map,
    safeZones: composition.safe_zones,
    renderHints: composition.render_hints,
    warnings,
  };
}
