import { composeHero } from '../composeHero';
import type { HeroRegistry, SolidarityManifest } from '@/design/hero/heroTypes';

describe('composeHero', () => {
  it('resolves manifest-backed layers into layered-hero data', () => {
    const manifest: SolidarityManifest = {
      project: 'kr-solidarity',
      version: '1.0.0',
      last_updated: '2026-04-19',
      strategy: 'test',
      total_assets: 1,
      layers: ['substrate', 'atmospheric'],
      assets: [
        {
          id: 'KR-SOLID-001',
          name: 'Backdrop',
          category: 'texture',
          layer: 'substrate',
          aspect_ratio: '16:9',
          file_path: '/assets/kr-solidarity/texture/backdrop.png',
          priority: 'HIGH',
          semantics: {
            functional_role: 'background',
            semantic_weight: 'grounded-grit',
            layering_role: 'base',
          },
          usage_rules: {
            scale_suitability: ['hero'],
            small_ui_safe: false,
          },
          layering_compatibility: {
            can_overlay_with: ['atmospheric'],
            cannot_overlay_with: [],
          },
        },
      ],
    };

    const registry: HeroRegistry = {
      version: '1.0.0',
      registry_name: 'test-registry',
      last_updated: '2026-04-19',
      compositions: [
        {
          id: 'landing-test',
          name: 'Landing Test',
          layers: [
            {
              type: 'substrate',
              asset_id: 'KR-SOLID-001',
              z_index: 3,
              opacity: 0.75,
              blend_mode: 'normal',
              position: 'cover',
            },
          ],
          typography: {
            headline: 'SOLIDARITY NOW',
            supporting: 'Workers build the future',
          },
          safe_zones: {
            text_left: { x: 0.08, y: 0.2, w: 0.34, h: 0.4 },
          },
          render_hints: {
            scrim: { enabled: true, opacity: 0.4, blend_mode: 'multiply' },
          },
          motion: {
            bezier: [0.34, 1.56, 0.64, 1],
            parallax: false,
            scroll_behavior: 'weight_shift',
            transition_duration: 400,
          },
        },
      ],
    };

    const result = composeHero(manifest, registry, 'landing-test');

    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
    expect(result.resolvedLayers).toEqual([
      expect.objectContaining({
        type: 'substrate',
        assetId: 'KR-SOLID-001',
        assetUrl: '/assets/kr-solidarity/texture/backdrop.png',
        zIndex: 3,
        opacity: 0.75,
        blendMode: 'normal',
        position: 'cover',
        semanticWeight: 'grounded-grit',
      }),
    ]);
    expect(result.typography.headline).toBe('SOLIDARITY NOW');
    expect(result.zIndexMap.substrate).toBe(3);
    expect(result.safeZones?.text_left?.x).toBe(0.08);
    expect(result.renderHints?.scrim?.enabled).toBe(true);
  });
});
