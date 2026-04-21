import { normalizeManifest } from '@/design/hero/normalizeManifest';
import type {
  AnimationProfile,
  HeroAssetToken,
  HeroComposition,
  HeroLayer,
  HeroRegistry,
  LayerPlacement,
  LayerType,
  RenderHints,
  SafeZones,
  SolidarityManifest,
  Typography,
} from '@/design/hero/heroTypes';

export interface ResolvedLayer {
  type: LayerType;
  assetId: string;
  assetUrl: string;
  zIndex: number;
  opacity: number;
  blendMode: HeroLayer['blend_mode'];
  position: HeroLayer['position'];
  placement?: LayerPlacement;
  semanticWeight?: string;
}

export interface CompositionResult {
  valid: boolean;
  resolvedLayers: ResolvedLayer[];
  typography: Typography;
  animation?: AnimationProfile;
  motion?: AnimationProfile;
  zIndexMap: Record<LayerType, number>;
  safeZones?: SafeZones;
  renderHints?: RenderHints;
  warnings?: string[];
  error?: string;
}

function resolveAssetUrl(filePath: string): string {
  if (filePath.startsWith('/') || filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }

  return `/assets/kr-solidarity/${filePath.replace(/^\/+/, '')}`;
}

function resolveTokenRef(
  tokens: Record<string, HeroAssetToken> | undefined,
  tokenKey: string
): string | null {
  if (!tokens) {
    return null;
  }

  let currentKey = tokenKey;
  let currentToken = tokens[currentKey];
  let depth = 0;

  while (currentToken?.alias_of) {
    if (depth >= 3) {
      return null;
    }

    currentKey = currentToken.alias_of;
    currentToken = tokens[currentKey];
    depth += 1;
  }

  return currentToken?.ref ?? null;
}

const LAYER_TYPES: LayerType[] = [
  'substrate',
  'atmospheric',
  'cultural',
  'resistance',
  'spiritual',
  'ui_kit',
];

function buildZIndexMap(layers: HeroLayer[]): Record<LayerType, number> {
  const initial = Object.fromEntries(LAYER_TYPES.map((layerType) => [layerType, 0])) as Record<
    LayerType,
    number
  >;

  return layers.reduce<Record<LayerType, number>>((acc, layer) => {
    acc[layer.type] = Math.max(acc[layer.type], layer.z_index);
    return acc;
  }, initial);
}

function invalidResult(message: string, warnings?: string[]): CompositionResult {
  return {
    valid: false,
    resolvedLayers: [],
    typography: { headline: '', supporting: '' },
    zIndexMap: buildZIndexMap([]),
    error: message,
    warnings,
  };
}

function resolveComposition(registry: HeroRegistry, compositionId: string): HeroComposition | undefined {
  return registry.compositions.find((composition) => composition.id === compositionId);
}

export function composeHero(
  rawManifest: SolidarityManifest,
  registry: HeroRegistry,
  compositionId: string
): CompositionResult {
  const manifest = normalizeManifest(rawManifest);
  const composition = resolveComposition(registry, compositionId);

  if (!composition) {
    return invalidResult(`Composition not found: ${compositionId}`);
  }

  const warnings: string[] = [];
  const resolvedLayers: ResolvedLayer[] = [];

  for (const layer of composition.layers) {
    const assetId =
      layer.asset_id !== 'auto'
        ? layer.asset_id
        : layer.asset_token
          ? resolveTokenRef(registry.tokens, layer.asset_token)
          : null;

    if (!assetId) {
      warnings.push(`Layer ${layer.type} in ${composition.id} is missing a resolvable asset reference.`);
      continue;
    }

    const asset = manifest.assets.find((candidate) => candidate.id === assetId);
    if (!asset) {
      warnings.push(`Asset ${assetId} referenced by ${composition.id} was not found in the manifest.`);
      continue;
    }

    resolvedLayers.push({
      type: layer.type,
      assetId: asset.id,
      assetUrl: resolveAssetUrl(asset.file_path),
      zIndex: layer.z_index,
      opacity: layer.opacity,
      blendMode: layer.blend_mode,
      position: layer.position,
      placement: layer.placement,
      semanticWeight: asset.semantics?.semantic_weight,
    });
  }

  if (resolvedLayers.length === 0) {
    return invalidResult(`Composition ${composition.id} did not resolve any layers.`, warnings);
  }

  return {
    valid: true,
    resolvedLayers,
    typography: composition.typography,
    animation: composition.animation ?? composition.motion,
    motion: composition.motion ?? composition.animation,
    zIndexMap: (composition.z_index_map as Record<LayerType, number> | undefined) ?? buildZIndexMap(composition.layers),
    safeZones: composition.safe_zones,
    renderHints: composition.render_hints,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}
