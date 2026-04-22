import { composeHero } from '../composeHero';
import type { HeroRegistry, SolidarityManifest } from '../../design/hero/heroTypes';

const MOCK_MANIFEST: SolidarityManifest = {
  project: 'test-manifest',
  version: '1.0.0',
  last_updated: '2026-02-12',
  strategy: 'test',
  total_assets: 6,
  layers: ['substrate', 'atmospheric', 'resistance', 'spiritual'],
  assets: [
    {
      id: 'SUBSTRATE-1',
      name: 'Test Substrate',
      category: 'texture',
      layer: 'substrate',
      aspect_ratio: '16:9',
      file_path: '/test/substrate.png',
      priority: 'HIGH',
      semantics: {
        functional_role: 'material-base',
        semantic_weight: 'material',
        layering_role: 'background-base',
      },
      usage_rules: {
        scale_suitability: ['hero-background'],
        small_ui_safe: false,
      },
      layering_compatibility: {
        can_overlay_with: [],
        cannot_overlay_with: ['substrate'],
      },
    },
    {
      id: 'DEVOTIONAL-1',
      name: 'Devotional A',
      category: 'devotional',
      layer: 'spiritual',
      aspect_ratio: '1:1',
      file_path: '/test/devotional-1.png',
      priority: 'CRITICAL',
      semantics: {
        functional_role: 'symbolic-anchor',
        semantic_weight: 'mythic',
        layering_role: 'foreground',
      },
      usage_rules: {
        scale_suitability: ['hero-only'],
        small_ui_safe: false,
      },
      layering_compatibility: {
        can_overlay_with: ['substrate', 'atmospheric'],
        cannot_overlay_with: ['spiritual', 'resistance'],
      },
    },
    {
      id: 'DEVOTIONAL-2',
      name: 'Devotional B',
      category: 'devotional',
      layer: 'spiritual',
      aspect_ratio: '1:1',
      file_path: '/test/devotional-2.png',
      priority: 'CRITICAL',
      semantics: {
        functional_role: 'symbolic-anchor',
        semantic_weight: 'mythic',
        layering_role: 'foreground',
      },
      usage_rules: {
        scale_suitability: ['hero-only'],
        small_ui_safe: false,
      },
      layering_compatibility: {
        can_overlay_with: ['substrate', 'atmospheric'],
        cannot_overlay_with: ['spiritual'],
      },
    },
    {
      id: 'PORTRAIT-1',
      name: 'Portrait A',
      category: 'portrait',
      layer: 'resistance',
      aspect_ratio: '3:4',
      file_path: '/test/portrait-1.png',
      priority: 'CRITICAL',
      semantics: {
        functional_role: 'editorial-hero',
        semantic_weight: 'heroic',
        layering_role: 'foreground',
      },
      usage_rules: {
        scale_suitability: ['hero-only'],
        small_ui_safe: false,
      },
      layering_compatibility: {
        can_overlay_with: ['substrate', 'atmospheric'],
        cannot_overlay_with: ['resistance'],
      },
    },
    {
      id: 'PORTRAIT-2',
      name: 'Portrait B',
      category: 'portrait',
      layer: 'resistance',
      aspect_ratio: '3:4',
      file_path: '/test/portrait-2.png',
      priority: 'CRITICAL',
      semantics: {
        functional_role: 'editorial-hero',
        semantic_weight: 'heroic',
        layering_role: 'foreground',
      },
      usage_rules: {
        scale_suitability: ['hero-only'],
        small_ui_safe: false,
      },
      layering_compatibility: {
        can_overlay_with: ['substrate', 'atmospheric'],
        cannot_overlay_with: ['resistance'],
      },
    },
    {
      id: 'ATMOSPHERIC-1',
      name: 'Atmospheric A',
      category: 'abstract',
      layer: 'atmospheric',
      aspect_ratio: '1:1',
      file_path: '/test/atmospheric-1.png',
      priority: 'HIGH',
      semantics: {
        functional_role: 'background-texture',
        semantic_weight: 'atmospheric',
        layering_role: 'overlay',
      },
      usage_rules: {
        scale_suitability: ['hero'],
        small_ui_safe: true,
      },
      layering_compatibility: {
        can_overlay_with: ['substrate'],
        cannot_overlay_with: ['atmospheric'],
      },
    },
    {
      id: 'STREET-1',
      name: 'Street Placard',
      category: 'street',
      layer: 'resistance',
      aspect_ratio: '1:1',
      file_path: '/test/street-1.png',
      priority: 'HIGH',
      semantics: {
        functional_role: 'contextual-motif',
        semantic_weight: 'activist',
        layering_role: 'mid-layer',
      },
      usage_rules: {
        scale_suitability: ['hero'],
        small_ui_safe: true,
      },
      layering_compatibility: {
        can_overlay_with: ['substrate', 'atmospheric'],
        cannot_overlay_with: ['resistance'],
      },
    },
  ],
};

const MOCK_REGISTRY: HeroRegistry = {
  version: '1.0.0',
  registry_name: 'test-registry',
  last_updated: '2026-02-12',
  compositions: [
    {
      id: 'valid-hero',
      name: 'Valid Hero',
      layers: [
        {
          type: 'substrate',
          asset_id: 'SUBSTRATE-1',
          z_index: 1,
          opacity: 0.6,
          blend_mode: 'normal',
          position: 'cover',
        },
        {
          type: 'atmospheric',
          asset_id: 'ATMOSPHERIC-1',
          z_index: 2,
          opacity: 0.3,
          blend_mode: 'overlay',
          position: 'center',
        },
      ],
      typography: {
        headline: 'Test Hero',
        supporting: 'Test Supporting',
        pressure_state: { wght: 900, wdth: 75 },
        solidarity_state: { wght: 800, wdth: 120 },
        melancholy_state: { wght: 475, wdth: 97.5 },
      },
      motion: {
        bezier: [0.34, 1.56, 0.64, 1],
        transition_duration: 400,
      },
    },
    {
      id: 'no-substrate',
      name: 'No Substrate',
      layers: [
        {
          type: 'atmospheric',
          asset_id: 'ATMOSPHERIC-1',
          z_index: 1,
          opacity: 0.3,
          blend_mode: 'overlay',
          position: 'center',
        },
      ],
      typography: {
        headline: 'Test',
        supporting: 'Test',
        pressure_state: { wght: 900, wdth: 75 },
        solidarity_state: { wght: 800, wdth: 120 },
        melancholy_state: { wght: 475, wdth: 97.5 },
      },
      motion: {
        bezier: [0.34, 1.56, 0.64, 1],
        transition_duration: 400,
      },
    },
    {
      id: 'double-portrait',
      name: 'Double Portrait',
      layers: [
        {
          type: 'substrate',
          asset_id: 'SUBSTRATE-1',
          z_index: 1,
          opacity: 0.6,
          blend_mode: 'normal',
          position: 'cover',
        },
        {
          type: 'resistance',
          asset_id: 'PORTRAIT-1',
          z_index: 2,
          opacity: 1,
          blend_mode: 'normal',
          position: 'center',
        },
        {
          type: 'resistance',
          asset_id: 'PORTRAIT-2',
          z_index: 3,
          opacity: 1,
          blend_mode: 'normal',
          position: 'center',
        },
      ],
      typography: {
        headline: 'Test',
        supporting: 'Test',
        pressure_state: { wght: 900, wdth: 75 },
        solidarity_state: { wght: 800, wdth: 120 },
        melancholy_state: { wght: 475, wdth: 97.5 },
      },
      motion: {
        bezier: [0.34, 1.56, 0.64, 1],
        transition_duration: 400,
      },
    },
    {
      id: 'double-devotional',
      name: 'Double Devotional',
      layers: [
        {
          type: 'substrate',
          asset_id: 'SUBSTRATE-1',
          z_index: 1,
          opacity: 0.6,
          blend_mode: 'normal',
          position: 'cover',
        },
        {
          type: 'spiritual',
          asset_id: 'DEVOTIONAL-1',
          z_index: 2,
          opacity: 1,
          blend_mode: 'normal',
          position: 'center',
        },
        {
          type: 'spiritual',
          asset_id: 'DEVOTIONAL-2',
          z_index: 3,
          opacity: 1,
          blend_mode: 'normal',
          position: 'center',
        },
      ],
      typography: {
        headline: 'Test',
        supporting: 'Test',
        pressure_state: { wght: 900, wdth: 75 },
        solidarity_state: { wght: 800, wdth: 120 },
        melancholy_state: { wght: 475, wdth: 97.5 },
      },
      motion: {
        bezier: [0.34, 1.56, 0.64, 1],
        transition_duration: 400,
      },
    },
    {
      id: 'street-above-devotional',
      name: 'Street Above Devotional',
      layers: [
        {
          type: 'substrate',
          asset_id: 'SUBSTRATE-1',
          z_index: 1,
          opacity: 0.6,
          blend_mode: 'normal',
          position: 'cover',
        },
        {
          type: 'spiritual',
          asset_id: 'DEVOTIONAL-1',
          z_index: 2,
          opacity: 1,
          blend_mode: 'normal',
          position: 'center',
        },
        {
          type: 'resistance',
          asset_id: 'STREET-1',
          z_index: 3,
          opacity: 1,
          blend_mode: 'normal',
          position: 'center',
        },
      ],
      typography: {
        headline: 'Test',
        supporting: 'Test',
        pressure_state: { wght: 900, wdth: 75 },
        solidarity_state: { wght: 800, wdth: 120 },
        melancholy_state: { wght: 475, wdth: 97.5 },
      },
      motion: {
        bezier: [0.34, 1.56, 0.64, 1],
        transition_duration: 400,
      },
    },
    {
      id: 'registry-specified-ids',
      name: 'Registry Specified IDs',
      layers: [
        {
          type: 'substrate',
          asset_id: 'SUBSTRATE-1',
          z_index: 1,
          opacity: 0.6,
          blend_mode: 'normal',
          position: 'cover',
        },
        {
          type: 'spiritual',
          asset_id: 'DEVOTIONAL-1',
          z_index: 2,
          opacity: 1,
          blend_mode: 'normal',
          position: 'center',
        },
      ],
      typography: {
        headline: 'Test',
        supporting: 'Test',
        pressure_state: { wght: 900, wdth: 75 },
        solidarity_state: { wght: 800, wdth: 120 },
        melancholy_state: { wght: 475, wdth: 97.5 },
      },
      motion: {
        bezier: [0.34, 1.56, 0.64, 1],
        scroll_wght_range: [300, 800],
        transition_duration: 400,
      },
    },
  ],
};

describe('heroComposer', () => {
  describe('composeHero', () => {
    it('returns a valid stack for valid composition', () => {
      const result = composeHero(MOCK_MANIFEST, MOCK_REGISTRY, 'valid-hero');

      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.resolvedLayers).toHaveLength(2);
        expect(result.resolvedLayers[0].assetUrl).toBe('/test/substrate.png');
        expect(result.resolvedLayers[1].assetUrl).toBe('/test/atmospheric-1.png');
      }
    });

    it('blocks composition without substrate', () => {
      const result = composeHero(MOCK_MANIFEST, MOCK_REGISTRY, 'no-substrate');

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toContain('substrate');
      }
    });

    it('blocks portrait+portrait', () => {
      const result = composeHero(MOCK_MANIFEST, MOCK_REGISTRY, 'double-portrait');

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toContain('Compatibility fail: resistance cannot overlay resistance');
      }
    });

    it('blocks devotional+devotional', () => {
      const result = composeHero(MOCK_MANIFEST, MOCK_REGISTRY, 'double-devotional');

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toContain('Compatibility fail: spiritual cannot overlay spiritual');
      }
    });

    it('blocks street directly above devotional', () => {
      const result = composeHero(MOCK_MANIFEST, MOCK_REGISTRY, 'street-above-devotional');

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toContain('Compatibility fail: resistance cannot overlay spiritual');
      }
    });

    it('uses registry-specified IDs when present', () => {
      const result = composeHero(MOCK_MANIFEST, MOCK_REGISTRY, 'registry-specified-ids');

      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.resolvedLayers).toHaveLength(2);
        expect(result.resolvedLayers[0].assetUrl).toBe('/test/substrate.png');
        expect(result.resolvedLayers[1].assetUrl).toBe('/test/devotional-1.png');
      }
    });
  });
});
