// src/design/tokens/index.ts
import motionTokens from './motion-tokens.json';
import tokens from './tokens.json';

export { motionTokens, tokens };

// Type-safe token accessor helper
export const getToken = (path: string) => {
  const keys = path.split('.');
  let value: any = tokens;
  for (const key of keys) {
    value = value[key];
  }
  return value?.$value || value;
};

// Convenience exports for common token groups
export const colors = tokens.color;
export const typography = tokens.typography;
export const spacing = tokens.spacing;
export const motion = motionTokens;

// TypeScript types for autocomplete
export type TokenPath = string; // TODO: Generate from schema
