/**
 * KR Asset Resolver
 * Stage 3 mockup generator resolver for KR-UI assets
 * Resolves asset_ref (KR-UI-### or token name) to SVG path with render mode
 */

import tokenMap from '../../public/assets/kr-solidarity-ui-token-map.json';

export type RenderMode =
  | 'backgroundZ0'
  | 'watermarkZ0'
  | 'overlayContained'
  | 'frameAccent'
  | 'inline24'
  | 'stateStamp'
  | 'overlay'
  | 'chartFill'
  | 'frame'
  | 'tile';

export interface ResolvedAsset {
  id: string;
  path: string;
  renderMode: RenderMode;
  opacity?: number;
  scale?: number;
  zIndex?: number;
  description?: string;
}

interface AssetRefInput {
  ref: string; // KR-UI-### or token name
  renderMode?: RenderMode;
  opacity?: number;
  scale?: number;
  zIndex?: number;
}

/**
 * Resolve KR-UI asset reference to full asset info
 */
export function resolveKrAsset(input: AssetRefInput): ResolvedAsset {
  const { ref, renderMode, opacity, scale, zIndex } = input;

  // Normalize ref: accept KR-UI-### or token name
  let assetId = ref;
  if (!ref.startsWith('KR-UI-') && !ref.startsWith('KR-SOLID-')) {
    // Assume it's a token name, lookup the ref
    const token = Object.values(tokenMap.tokens).find(
      (t: any) => t.id === ref || t.name === ref
    );
    if (token) {
      assetId = (token as any).ref;
    }
  }

  // Find token entry
  const tokenEntry = Object.values(tokenMap.tokens).find(
    (t: any) => t.ref === assetId
  ) as any;

  if (!tokenEntry) {
    throw new Error(
      `KR Asset Resolver: Asset not found for ref "${ref}". Check token map.`
    );
  }

  const path = tokenEntry.canonical_svg_path || tokenEntry.path;
  if (!path || path === 'null') {
    throw new Error(
      `KR Asset Resolver: Asset "${assetId}" has no valid path in token map.`
    );
  }

  // Infer render mode if not provided
  let finalRenderMode: RenderMode = renderMode || inferRenderMode(tokenEntry);

  return {
    id: assetId,
    path,
    renderMode: finalRenderMode,
    opacity: opacity ?? tokenEntry.opacity_default,
    scale: scale ?? 1.0,
    zIndex: zIndex ?? inferZIndex(finalRenderMode),
    description: tokenEntry.description,
  };
}

/**
 * Infer render mode from token metadata
 */
function inferRenderMode(token: any): RenderMode {
  if (token.render_mode) {
    return token.render_mode as RenderMode;
  }

  // Fallback based on kind
  const kind = token.kind as string;
  if (kind?.includes('pattern')) return 'backgroundZ0';
  if (kind?.includes('overlay')) return 'overlayContained';
  if (kind?.includes('glyph') || kind?.includes('icon')) return 'inline24';
  if (kind?.includes('corner')) return 'frameAccent';
  if (kind?.includes('stamp')) return 'stateStamp';

  // Ultimate fallback
  return 'overlayContained';
}

/**
 * Infer z-index from render mode
 */
function inferZIndex(mode: RenderMode): number {
  switch (mode) {
    case 'backgroundZ0':
    case 'watermarkZ0':
      return 0;
    case 'overlayContained':
    case 'frameAccent':
      return 1;
    case 'inline24':
    case 'stateStamp':
    case 'overlay':
      return 2;
    default:
      return 1;
  }
}

/**
 * Validate render mode slots (for mockup generator enforcement)
 */
export function validateRenderModeSlot(mode: RenderMode): void {
  const VALID_MODES: RenderMode[] = [
    'backgroundZ0',
    'watermarkZ0',
    'overlayContained',
    'frameAccent',
    'inline24',
    'stateStamp',
    'overlay',
    'chartFill',
    'frame',
    'tile',
  ];

  if (!VALID_MODES.includes(mode)) {
    throw new Error(
      `Invalid render_mode "${mode}". Must be one of: ${VALID_MODES.join(', ')}`
    );
  }
}

/**
 * Batch resolve multiple asset refs
 */
export function resolveKrAssets(inputs: AssetRefInput[]): ResolvedAsset[] {
  return inputs.map(resolveKrAsset);
}
