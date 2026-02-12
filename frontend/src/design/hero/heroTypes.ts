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

export type EmotionalRegister = 'defiance' | 'reflection' | 'discovery' | 'control' | 'craft';

export interface TypographyPressureProfile {
  register: EmotionalRegister;
  weight_range: [number, number]; // [start, end]
  tracking_range: [number, number]; // [start, end]
  contrast_ratio: number;
}

export interface AnimationProfile {
  bezier: [number, number, number, number];
  parallax: boolean;
  scroll_behavior: 'weight_shift' | 'scale_expansion' | 'blur_reveal';
  transition_duration: number;
}

export interface Typography {
  headline: string;
  supporting: string;
  pressure_state?: TypographyState; // Legacy support
  solidarity_state?: TypographyState; // Legacy support
  melancholy_state?: TypographyState; // Legacy support
  pressure_profile?: TypographyPressureProfile;
  scale_ratio?: number;
  contrast_mode?: 'extreme' | 'standard' | 'muted';
}

export interface HeroComposition {
  id: string;
  name: string;
  layers: HeroLayer[];
  typography: Typography;
  motion?: Motion; // Legacy support
  animation?: AnimationProfile;
  z_index_map?: Record<LayerType, number>;
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
