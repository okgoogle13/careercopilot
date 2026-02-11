export type LayerType = 'substrate' | 'atmospheric' | 'cultural' | 'resistance' | 'spiritual';

export type BlendMode = 
  | 'normal' 
  | 'multiply' 
  | 'screen' 
  | 'overlay' 
  | 'darken' 
  | 'lighten' 
  | 'color-dodge' 
  | 'color-burn' 
  | 'hard-light' 
  | 'soft-light' 
  | 'difference' 
  | 'exclusion' 
  | 'hue' 
  | 'saturation' 
  | 'color' 
  | 'luminosity';

export type PositionMode = 'cover' | 'center' | 'left' | 'right' | 'top' | 'bottom';

export interface HeroLayer {
  type: LayerType;
  asset_id: string;
  z_index: number;
  opacity: number;
  blend_mode: BlendMode;
  position: PositionMode;
}

export interface TypographyState {
  wght: number;
  wdth: number;
}

export interface Typography {
  headline: string;
  supporting: string;
  pressure_state: TypographyState;
  solidarity_state: TypographyState;
  melancholy_state: TypographyState;
}

export interface Motion {
  bezier: [number, number, number, number];
  scroll_wght_range: [number, number];
  transition_duration: number;
}

export interface HeroComposition {
  id: string;
  name: string;
  layers: HeroLayer[];
  typography: Typography;
  motion: Motion;
}

export interface HeroRegistry {
  version: string;
  registry_name: string;
  last_updated: string;
  compositions: HeroComposition[];
}

export interface ManifestAsset {
  id: string;
  name: string;
  category: string;
  layer: LayerType;
  aspect_ratio: string;
  file_path: string;
  priority: string;
  semantics: {
    functional_role: string;
    semantic_weight: string;
    layering_role: string;
  };
  usage_rules: {
    scale_suitability: string[];
    small_ui_safe: boolean;
  };
  layering_compatibility: {
    can_overlay_with: string[];
    cannot_overlay_with: string[];
  };
}

export interface SolidarityManifest {
  project: string;
  version: string;
  last_updated: string;
  strategy: string;
  total_assets: number;
  layers: LayerType[];
  assets: ManifestAsset[];
}
