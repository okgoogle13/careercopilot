/**
 * Kerala Rage — KR Solidarity Asset Registry
 * 
 * DYNAMIC REGISTRY: This file now imports data from the canonical manifest.json.
 * 
 * @see /Users/okgoogle13/Desktop/careercopilot/frontend/public/assets/kerala-rage-kr-solidarity-manifest.json
 */

import manifest from '../../public/assets/kerala-rage-kr-solidarity-manifest.json';

export type AssetPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM';
export type AssetCategory = 'devotional' | 'portrait' | 'symbol' | 'abstract' | 'street' | 'texture';

export interface KRAssetSpecs {
  aspect_ratio: string;
  style: string;
  halo?: string;
  accents?: string;
  text_content?: string;
  framing?: string;
  subject?: string;
  color_palette?: Record<string, string>;
  symbols?: string[];
}

export interface KRAssetInteractionScale {
  min_px: number;
  ideal_px: number;
  max_density: 'single-instance' | 'once-per-page' | 'repeatable';
}

export interface KRAssetIdentityLayers {
  indian: 'dominant' | 'integrated' | 'present' | 'absent';
  australian: 'dominant' | 'integrated' | 'present' | 'absent';
  first_nations: 'dominant' | 'integrated' | 'present' | 'absent';
}

export interface KRAssetMetadata {
  id: string;
  name: string;
  category: AssetCategory;
  file_path: string;
  priority: AssetPriority;
  status: string;
  intended_context: string;
  
  // Canon-grade prescriptive fields
  functional_role: string[];
  semantic_weight: 'heavy' | 'medium' | 'light';
  interaction_scale: KRAssetInteractionScale;
  identity_layers_present: KRAssetIdentityLayers;
  allowed_overlay_types: string[];
  recommended_pairings: string[];
  review_triggers: string[];
  
  specs: KRAssetSpecs;
  components_allowed: string[];
}

/**
 * Central registry of all Kerala Rage solidarity assets.
 * Dynamically generated from manifest.json.
 */
export const KR_SOLIDARITY_ASSETS: Record<string, KRAssetMetadata> = 
  (manifest.assets as any[]).reduce((acc, asset) => {
    acc[asset.id] = asset as KRAssetMetadata;
    return acc;
  }, {} as Record<string, KRAssetMetadata>);

/**
 * Get all asset IDs in the registry.
 */
export function getAllAssetIds(): string[] {
  return Object.keys(KR_SOLIDARITY_ASSETS);
}

/**
 * Get an asset by ID (no validation).
 */
export function getAssetById(assetId: string): KRAssetMetadata | undefined {
  return KR_SOLIDARITY_ASSETS[assetId];
}

/**
 * Get all assets by category.
 */
export function getAssetsByCategory(category: AssetCategory): KRAssetMetadata[] {
  return Object.values(KR_SOLIDARITY_ASSETS).filter(asset => asset.category === category);
}

/**
 * Get all assets by priority.
 */
export function getAssetsByPriority(priority: AssetPriority): KRAssetMetadata[] {
  return Object.values(KR_SOLIDARITY_ASSETS).filter(asset => asset.priority === priority);
}

/**
 * Check if a component is allowed to use a specific asset.
 */
export function isComponentAllowed(assetId: string, componentName: string): boolean {
  const asset = KR_SOLIDARITY_ASSETS[assetId];
  if (!asset) return false;
  return asset.components_allowed.includes(componentName);
}
