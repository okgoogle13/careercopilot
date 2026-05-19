import type {
  BlendMode,
  HeroComposition,
  HeroLayer,
  HeroRegistry,
  LayerPlacement,
  LayerType,
  PositionMode,
  RenderHints,
  SafeZones,
  SolidarityManifest,
  Typography,
  AnimationProfile,
  AnimationProfileLegacy,
} from '../design/hero/heroTypes';
import { normalizeManifest } from '../design/hero/normalizeManifest';

export interface ResolvedLayer {
  type: LayerType;
  assetId: string;
  assetUrl: string;
  zIndex: number;
  opacity: number;
  blendMode: BlendMode;
  position: PositionMode;
  placement?: LayerPlacement;
  semanticWeight?: string;
}

export interface CompositionResult {
  valid: boolean;
  compositionId: string;
  resolvedLayers: ResolvedLayer[];
  typography: Typography;
  animation?: AnimationProfile;
  motion?: AnimationProfileLegacy;
  zIndexMap?: Record<LayerType, number>;
  safeZones?: SafeZones;
  renderHints?: RenderHints;
  warnings?: string[];
  error?: string;
}

function getBaseUrl(): string {
  // Vite injects import.meta.env.BASE_URL; Node scripts won't have it.
  const baseUrl = (import.meta as any)?.env?.BASE_URL;
  if (typeof baseUrl !== 'string' || baseUrl.trim() === '') return '';
  return baseUrl.replace(/\/+$/, '');
}

function toAssetUrl(filePath: string): string {
  if (filePath.startsWith('/')) return filePath;
  const baseUrl = getBaseUrl();
  const prefix = `${baseUrl}/assets/kr-solidarity/`.replace(/\/+/g, '/');
  return `${prefix}${filePath}`.replace(/\/+/g, '/');
}

function resolveLayerAssetId(layer: HeroLayer, registry: HeroRegistry): string | null {
  if (layer.asset_id && layer.asset_id !== 'auto') return layer.asset_id;
  if (layer.asset_token && registry.tokens?.[layer.asset_token]?.ref) {
    return registry.tokens[layer.asset_token].ref;
  }
  return null;
}

function resolveComposition(registry: HeroRegistry, compositionId: string): HeroComposition | null {
  const found = registry.compositions.find((c) => c.id === compositionId);
  if (found) return found;

  // Compatibility fallback for legacy registry variants
  const legacyFound = (registry.compositions as any[]).find(
    (c) => c.composition_id === compositionId || c.hero_id === compositionId
  );
  return (legacyFound as HeroComposition | undefined) ?? null;
}

export function composeHero(
  rawManifest: SolidarityManifest,
  registry: HeroRegistry,
  compositionId: string
): CompositionResult {
  const warnings: string[] = [];
  const manifest = normalizeManifest(rawManifest);

  const composition = resolveComposition(registry, compositionId);
  if (!composition) {
    return {
      valid: false,
      compositionId,
      resolvedLayers: [],
      typography: {
        headline: '',
        supporting: '',
      },
      warnings,
      error: `Unknown composition id: ${compositionId}`,
    };
  }

  const resolvedLayers: ResolvedLayer[] = [];
  for (const layer of composition.layers) {
    const assetId = resolveLayerAssetId(layer, registry);
    if (!assetId) {
      warnings.push(`Missing asset reference for layer type "${layer.type}"`);
      continue;
    }

    const asset = manifest.assets.find((a) => a.id === assetId);
    if (!asset) {
      warnings.push(`Manifest missing asset id "${assetId}"`);
      continue;
    }

    resolvedLayers.push({
      type: layer.type,
      assetId,
      assetUrl: toAssetUrl(asset.file_path),
      zIndex: layer.z_index,
      opacity: layer.opacity,
      blendMode: layer.blend_mode,
      position: layer.position,
      placement: layer.placement,
      semanticWeight: asset.semantics?.semantic_weight,
    });
  }

  const animation: AnimationProfile | undefined =
    composition.animation ?? (composition.motion as AnimationProfileLegacy | undefined);

  const valid = resolvedLayers.length === composition.layers.length && warnings.length === 0;

  return {
    valid,
    compositionId: composition.id,
    resolvedLayers,
    typography: composition.typography,
    animation,
    motion: composition.motion,
    zIndexMap: composition.z_index_map,
    safeZones: composition.safe_zones,
    renderHints: composition.render_hints,
    warnings: warnings.length ? warnings : undefined,
    error: !valid && warnings.length ? warnings[0] : undefined,
  };
}

