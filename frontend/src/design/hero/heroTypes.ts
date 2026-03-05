export type LayerType =
  | 'substrate'
  | 'atmospheric'
  | 'cultural'
  | 'resistance'
  | 'spiritual'
  | 'ui_kit';

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

export type ObjectFitMode = 'cover' | 'contain';
export type AnchorMode =
  | 'center'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center-left'
  | 'center-right'
  | 'bottom-center'
  | 'top-center';

export interface ResponsiveNumber {
  desktop: number;
  tablet: number;
  mobile: number;
}

export interface ResponsiveTranslate {
  desktop: { x: number; y: number };
  tablet: { x: number; y: number };
  mobile: { x: number; y: number };
}

export interface LayerPlacement {
  position: PositionMode | 'bottom' | 'top';
  objectFit: ObjectFitMode;
  anchor: AnchorMode;
  scale: ResponsiveNumber;
  translate: ResponsiveTranslate;
}

export interface HeroLayer {
  type: LayerType;
  asset_id: string; // 'auto' allowed
  z_index: number;
  opacity: number; // 0..1
  blend_mode: BlendMode;
  position: PositionMode; // legacy renderer
  placement?: LayerPlacement; // v3.1+ deterministic placement
}

export interface TypographyState {
  wght: number;
  wdth: number;
}

export type EmotionalRegister = 'defiance' | 'reflection' | 'discovery' | 'control' | 'craft';

export interface TypographyPressureProfile {
  register: EmotionalRegister;
  weight_range: [number, number];
  tracking_range: [number, number];
  contrast_ratio: number;
}

export interface ScrollRevealProfile {
  opacity_start: number;
  transform_start: string;
  duration_ms: number;
}

export interface ParallaxLayerProfile {
  layer_type: LayerType;
  speed: number; // 0..1
  direction: 'up' | 'down' | 'left' | 'right';
}

export interface AnimationProfileLegacy {
  bezier: [number, number, number, number];
  parallax: boolean;
  scroll_behavior: 'weight_shift' | 'scale_expansion' | 'blur_reveal';
  transition_duration: number;
}

export interface AnimationProfileV3 {
  easing: [number, number, number, number];
  parallax_layers?: ParallaxLayerProfile[];
  scroll_reveal?: ScrollRevealProfile;
}

export type AnimationProfile = AnimationProfileV3 | AnimationProfileLegacy;

export interface Typography {
  headline: string;
  supporting: string;
  pressure_state?: TypographyState; // legacy
  solidarity_state?: TypographyState; // legacy
  melancholy_state?: TypographyState; // legacy
  pressure_profile?: TypographyPressureProfile;
  scale_ratio?: number;
  contrast_mode?: 'extreme' | 'standard' | 'muted';
  font_family?: string;
}

export interface ColorBleedConfig {
  enabled: boolean;
  source_layer: LayerType;
  extract_mode: 'dominant-shadow' | 'dominant-highlight' | 'average';
  apply_to: 'typography-halo' | 'border-accent' | 'background-tint';
  blend_mode: BlendMode;
  opacity: number;
}

export interface KineticLayerConfig {
  enabled: boolean;
  speed_multiplier: number;
  direction: 'horizontal' | 'vertical' | 'diagonal';
}

export interface SafeZoneRect {
  x: number; // 0..1
  y: number; // 0..1
  w: number; // 0..1
  h: number; // 0..1
}

export interface SafeZones {
  text_left?: SafeZoneRect;
  cta_left?: SafeZoneRect;
  quiet_margin?: SafeZoneRect;
}

export interface RenderHints {
  scrim?: { enabled: boolean; opacity: number; blend_mode: BlendMode };
  grain_overlay_svg?: string; // asset_id (KR-UI-036)
  max_overlay_opacity_in_text_zone?: number;
  edge_weighting?: number;
}

export interface HeroComposition {
  id: string;
  name: string;
  layers: HeroLayer[];
  typography: Typography;
  emotional_register?: EmotionalRegister;
  intended_layout?: string;
  landing_default?: boolean;

  safe_zones?: SafeZones;
  render_hints?: RenderHints;

  motion?: AnimationProfileLegacy; // legacy
  animation?: AnimationProfileV3 | AnimationProfileLegacy;

  z_index_map?: Record<LayerType, number>;
  color_bleed?: ColorBleedConfig;
  kinetic?: KineticLayerConfig;
}

export interface HeroRegistry {
  version: string;
  registry_name: string;
  last_updated: string;
  manifest_version?: string;
  compositions: HeroComposition[];
}

export type AssetCategory =
  | 'devotional'
  | 'portrait'
  | 'street'
  | 'texture'
  | 'abstract'
  | 'symbol'
  | 'ui_kit'
  | string;

export interface ManifestAsset {
  id: string;
  name: string;
  category: AssetCategory;
  layer: LayerType;
  aspect_ratio: string;
  file_path: string; // relative to /assets/kr-solidarity/ unless absolute
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
