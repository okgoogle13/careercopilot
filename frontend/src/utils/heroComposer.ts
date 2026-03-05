import type {
  HeroComposition,
  HeroLayer,
  HeroRegistry,
  SolidarityManifest,
  ManifestAsset,
  LayerType,
} from '../design/hero/heroTypes';

export interface CompositionValidationError {
  valid: false;
  error: string;
}

export interface CompositionValidationSuccess {
  valid: true;
  resolvedLayers: ResolvedLayer[];
  typography: HeroComposition['typography'];
  motion?: HeroComposition['motion'];
  animation?: HeroComposition['animation'];
  zIndexMap?: HeroComposition['z_index_map'];
}

export type CompositionResult = CompositionValidationError | CompositionValidationSuccess;

export interface ResolvedLayer {
  type: LayerType;
  assetUrl: string;
  zIndex: number;
  opacity: number;
  blendMode: string;
  position: string;
}

function hasSubstrate(layers: HeroLayer[]): boolean {
  return layers.some((layer) => layer.type === 'substrate');
}

function hasMultipleDevotional(layers: HeroLayer[], manifest: SolidarityManifest): boolean {
  const devotionalLayers = layers.filter((layer) => {
    const asset = manifest.assets.find((a) => a.id === layer.asset_id);
    return asset?.category === 'devotional';
  });
  return devotionalLayers.length > 1;
}

function hasMultiplePortrait(layers: HeroLayer[], manifest: SolidarityManifest): boolean {
  const portraitLayers = layers.filter((layer) => {
    const asset = manifest.assets.find((a) => a.id === layer.asset_id);
    return asset?.category === 'portrait';
  });
  return portraitLayers.length > 1;
}

function hasStreetAboveDevotional(layers: HeroLayer[], manifest: SolidarityManifest): boolean {
  const sortedLayers = [...layers].sort((a, b) => a.z_index - b.z_index);

  for (let i = 0; i < sortedLayers.length; i++) {
    const layer = sortedLayers[i];
    const asset = manifest.assets.find((a) => a.id === layer.asset_id);

    if (asset?.category === 'devotional') {
      // Check if any street layers come after this devotional
      for (let j = i + 1; j < sortedLayers.length; j++) {
        const upperLayer = sortedLayers[j];
        const upperAsset = manifest.assets.find((a) => a.id === upperLayer.asset_id);
        if (upperAsset?.category === 'street') {
          return true;
        }
      }
    }
  }
  return false;
}

function selectAutoAsset(
  layerType: LayerType,
  manifest: SolidarityManifest,
  usedAssetIds: Set<string>
): ManifestAsset | null {
  const candidates = manifest.assets.filter(
    (asset) => asset.layer === layerType && !usedAssetIds.has(asset.id)
  );

  if (candidates.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

export function composeHero(
  manifest: SolidarityManifest,
  registry: HeroRegistry,
  compositionId?: string
): CompositionResult {
  const composition = compositionId
    ? registry.compositions.find((c) => c.id === compositionId)
    : registry.compositions[0];

  if (!composition) {
    return {
      valid: false,
      error: 'No composition found',
    };
  }

  // Validate substrate requirement
  if (!hasSubstrate(composition.layers)) {
    return {
      valid: false,
      error: 'Hero must have a substrate layer',
    };
  }

  // Validate no multiple devotional
  if (hasMultipleDevotional(composition.layers, manifest)) {
    return {
      valid: false,
      error: 'Cannot stack multiple devotional layers',
    };
  }

  // Validate no multiple portrait
  if (hasMultiplePortrait(composition.layers, manifest)) {
    return {
      valid: false,
      error: 'Cannot stack multiple portrait layers',
    };
  }

  // Validate street not directly above devotional
  if (hasStreetAboveDevotional(composition.layers, manifest)) {
    return {
      valid: false,
      error: 'Street layers cannot sit directly above devotional layers',
    };
  }

  // Resolve layers
  const resolvedLayers: ResolvedLayer[] = [];
  const usedAssetIds = new Set<string>();

  for (const layer of composition.layers) {
    let asset: ManifestAsset | null = null;

    if (layer.asset_id === 'auto') {
      asset = selectAutoAsset(layer.type, manifest, usedAssetIds);
      if (!asset) {
        return {
          valid: false,
          error: `No available assets for auto-selection of layer type: ${layer.type}`,
        };
      }
    } else {
      asset = manifest.assets.find((a) => a.id === layer.asset_id) || null;
      if (!asset) {
        return {
          valid: false,
          error: `Asset not found: ${layer.asset_id}`,
        };
      }
    }

    usedAssetIds.add(asset.id);

    resolvedLayers.push({
      type: layer.type,
      assetUrl: asset.file_path,
      zIndex: layer.z_index,
      opacity: layer.opacity,
      blendMode: layer.blend_mode,
      position: layer.position,
    });
  }

  return {
    valid: true,
    resolvedLayers,
    typography: composition.typography,
    motion: composition.motion,
    animation: composition.animation,
    zIndexMap: composition.z_index_map,
  };
}
