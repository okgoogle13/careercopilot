/**
 * Kerala Rage — Asset Governance Runtime Guards
 * 
 * Enforces component placement rules for KR Solidarity assets.
 * In DEV mode, logs warnings when components attempt to use assets they're not authorized for.
 * 
 * ENFORCEMENT PHILOSOPHY:
 * - DEV-only warnings (soft enforcement)
 * - No production errors or blocking (additive system)
 * - Guidance, not gatekeeping
 * 
 * USAGE:
 * 
 * ```tsx
 * import { useKRAsset } from '@/utils/assetGuards';
 * 
 * function MyComponent() {
 *   const assetPath = useKRAsset('KR-SOLID-001', 'MyComponent');
 *   return <img src={assetPath} alt="..." />;
 * }
 * ```
 * 
 * FUTURE ENHANCEMENT:
 * Consider supporting route/layout IDs (e.g., 'route:/' or 'layout:KrDarkShell')
 * to make the system more resilient to component renames.
 * 
 * @see /Users/okgoogle13/Desktop/careercopilot/docs/ASSET_GOVERNANCE.md
 */

import { useMemo } from 'react';
import { KR_SOLIDARITY_ASSETS, type KRAssetMetadata } from '@/lib/krSolidarityAssets';

/**
 * Validates asset access and logs DEV-mode warnings for violations.
 * 
 * @param assetId - The asset ID (e.g., 'KR-SOLID-001')
 * @param componentName - The name of the requesting component
 * @param context - Optional context for debugging (e.g., 'header', 'background')
 * @returns The asset's file path, or an empty string if invalid
 */
function validateAssetAccess(
  assetId: string,
  componentName: string,
  context?: string
): { asset: KRAssetMetadata | null; filePath: string } {
  const asset = KR_SOLIDARITY_ASSETS[assetId];

  // Unknown asset ID
  if (!asset) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[Asset Guard] ❌ Unknown asset ID: "${assetId}" requested by component "${componentName}".\n` +
        `Available asset IDs: ${Object.keys(KR_SOLIDARITY_ASSETS).join(', ')}`,
        context ? `\nContext: ${context}` : ''
      );
    }
    return { asset: null, filePath: '' };
  }

  // Component not in allowed list
  if (!asset.components_allowed.includes(componentName)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[Asset Guard] ⚠️  GOVERNANCE VIOLATION\n` +
        `Asset: "${assetId}" (${asset.name})\n` +
        `Requested by: "${componentName}"\n` +
        `Allowed components: ${asset.components_allowed.join(', ')}\n` +
        `Cultural intent: ${asset.intended_context}` +
        (context ? `\nContext: ${context}` : '') +
        `\n\nℹ️  If "${componentName}" should be allowed, add it to components_allowed in krSolidarityAssets.ts`
      );

      // Special warning for First Nations asset
      if (assetId === 'KR-SOLID-009') {
        console.error(
          `[Asset Guard] 🚨 CRITICAL: First Nations imagery (${asset.name}) is restricted to in-situ contexts only.\n` +
          `This asset MUST only appear in the LandingPage Acknowledgement section.\n` +
          `See docs/ASSET_GOVERNANCE.md for cultural respect protocols.`
        );
      }
    }
  }

  return { asset, filePath: asset.file_path };
}

/**
 * React hook for validated asset access.
 * 
 * Use this in React components to request assets with automatic governance enforcement.
 * 
 * @example
 * ```tsx
 * function ManifestoCard() {
 *   const shivaStatue = useKRAsset('KR-SOLID-001', 'ManifestoCard', 'background motif');
 *   return (
 *     <div style={{ backgroundImage: `url(${shivaStatue})` }}>
 *       {/* content *\/}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @param assetId - The asset ID to request
 * @param componentName - The name of your component (for governance tracking)
 * @param context - Optional usage context for debugging
 * @returns The asset file path (or empty string if invalid)
 */
export function useKRAsset(
  assetId: string,
  componentName: string,
  context?: string
): string {
  return useMemo(() => {
    const { filePath } = validateAssetAccess(assetId, componentName, context);
    return filePath;
  }, [assetId, componentName, context]);
}

/**
 * Non-hook version for use outside React components.
 * 
 * Use this in utility functions, services, or class components.
 * 
 * @example
 * ```ts
 * const assetPath = getKRAsset('KR-SOLID-008', 'Stone', 'texture overlay');
 * ```
 */
export function getKRAsset(
  assetId: string,
  componentName: string,
  context?: string
): string {
  const { filePath } = validateAssetAccess(assetId, componentName, context);
  return filePath;
}

/**
 * Get asset metadata without validation (no warnings).
 * 
 * Use this when you need to inspect asset properties but aren't actually rendering it.
 * For example, in documentation or developer tools.
 */
export function getAssetMetadata(assetId: string): KRAssetMetadata | null {
  return KR_SOLIDARITY_ASSETS[assetId] || null;
}

/**
 * Check if a component is authorized to use an asset (silent check, no warnings).
 * 
 * Useful for conditional rendering logic.
 * 
 * @example
 * ```tsx
 * if (isAuthorized('KR-SOLID-009', 'LandingPage')) {
 *   // Render First Nations placard
 * }
 * ```
 */
export function isAuthorized(assetId: string, componentName: string): boolean {
  const asset = KR_SOLIDARITY_ASSETS[assetId];
  if (!asset) return false;
  return asset.components_allowed.includes(componentName);
}

/**
 * Get all assets available to a specific component.
 * 
 * Useful for component documentation or developer tools.
 */
export function getComponentAssets(componentName: string): KRAssetMetadata[] {
  return Object.values(KR_SOLIDARITY_ASSETS).filter(asset =>
    asset.components_allowed.includes(componentName)
  );
}
