// src/design/tokens/index.ts
import tokens from './tokens.json';

// Helper to access sys tokens safely
const sys = tokens.sys;

export { tokens };

// Type-safe token accessor helper
export const getToken = (path: string) => {
  const keys = path.split('.');
  let value: any = tokens;
  for (const key of keys) {
    if (!value[key]) return undefined;
    value = value[key];
  }
  return value?.$value || value;
};

// Convenience exports for common token groups mapping to KeralaRage KrSolidarity structure
export const colors = sys.color;
export const typography = sys.type;
export const shape = sys.shape;
export const shadow = sys.shadow;
export const motion = sys.motion;

// TypeScript types for autocomplete
export type TokenPath = string;