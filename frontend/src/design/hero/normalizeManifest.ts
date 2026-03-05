import { SolidarityManifest, LayerType, ManifestAsset } from './heroTypes';

/**
 * Normalizes the raw SolidarityManifest loaded from JSON.
 * - Converts "ui-kit" -> "ui_kit" everywhere to match canonical names
 * - Returns a new manifest object
 */
export function normalizeManifest(raw: SolidarityManifest): SolidarityManifest {
  const normalizeLayer = (layer: string): string => {
    if (layer === 'ui-kit') return 'ui_kit';
    return layer;
  };

  const normalizedLayers = raw.layers.map(normalizeLayer) as LayerType[];

  const normalizedAssets: ManifestAsset[] = raw.assets.map((asset) => ({
    ...asset,
    layer: normalizeLayer(asset.layer) as LayerType,
    category: normalizeLayer(asset.category),
    layering_compatibility: asset.layering_compatibility
      ? {
          can_overlay_with: asset.layering_compatibility.can_overlay_with.map(normalizeLayer),
          cannot_overlay_with: asset.layering_compatibility.cannot_overlay_with.map(normalizeLayer),
        }
      : { can_overlay_with: [], cannot_overlay_with: [] },
  }));

  return {
    ...raw,
    layers: normalizedLayers,
    assets: normalizedAssets,
  };
}
