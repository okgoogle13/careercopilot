// src/design/tokens/index.ts
<<<<<<< HEAD
import motionTokens from './motion-tokens.json';
import tokens from './tokens.json';

export { motionTokens, tokens };
=======
import tokens from './tokens.json';

// Helper to access sys tokens safely
const sys = tokens.sys;

export { tokens };
>>>>>>> restoration-KR-Rage-Figma-v2.0

// Type-safe token accessor helper
export const getToken = (path: string) => {
  const keys = path.split('.');
  let value: any = tokens;
  for (const key of keys) {
<<<<<<< HEAD
=======
    if (!value[key]) return undefined;
>>>>>>> restoration-KR-Rage-Figma-v2.0
    value = value[key];
  }
  return value?.$value || value;
};

<<<<<<< HEAD
// Convenience exports for common token groups
export const colors = tokens.color;
export const typography = tokens.typography;
export const spacing = tokens.spacing;
export const motion = motionTokens;

// TypeScript types for autocomplete
export type TokenPath = string; // TODO: Generate from schema
=======
// Convenience exports for common token groups mapping to KeralaRage KrSolidarity structure
export const colors = sys.color;
export const typography = sys.type;
export const shape = sys.shape;
export const shadow = sys.shadow;
export const motion = sys.motion;

// TypeScript types for autocomplete
export type TokenPath = string;
>>>>>>> restoration-KR-Rage-Figma-v2.0
