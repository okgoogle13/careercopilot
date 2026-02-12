import { calculatePressure, DEFAULT_PROFILES } from '../typographyPressure';

describe('typographyPressure', () => {
  describe('calculatePressure', () => {
    it('returns default values when no profile is provided', () => {
      const result = calculatePressure(0.5);
      expect(result.weight).toBe(550); // 400 + (0.5 * 300)
      expect(result.tracking).toBe(100);
      expect(result.contrast).toBe(1);
    });

    it('interpolates defiance profile correctly', () => {
      const profile = DEFAULT_PROFILES.defiance;
      
      // Start (0)
      const start = calculatePressure(0, profile);
      expect(start.weight).toBe(900);
      expect(start.tracking).toBe(75);
      
      // End (1)
      const end = calculatePressure(1, profile);
      expect(end.weight).toBe(800);
      expect(end.tracking).toBe(120);
      
      // Mid (0.5)
      const mid = calculatePressure(0.5, profile);
      expect(mid.weight).toBe(850);
      expect(mid.tracking).toBe(97.5);
    });

    it('handles reflection profile with breathing effect', () => {
      const profile = DEFAULT_PROFILES.reflection;
      
      const mid = calculatePressure(0.5, profile);
      // Math.sin(0.5 * Math.PI * 4) = Math.sin(2 * PI) = 0
      expect(mid.weight).toBe(488); // 475 + (500-475)*0.5 = 487.5 ~ 488
      
      const quarter = calculatePressure(0.125, profile);
      // Math.sin(0.125 * Math.PI * 4) = Math.sin(0.5 * PI) = 1
      // base weight = 475 + (25 * 0.125) = 478.125
      // breathing = 1 * 25 = 25
      // total = 503.125 ~ 503
      expect(quarter.weight).toBe(503);
    });

    it('clamps scroll progress between 0 and 1', () => {
      const profile = DEFAULT_PROFILES.defiance;
      
      const negative = calculatePressure(-1, profile);
      expect(negative.weight).toBe(900);
      
      const excessive = calculatePressure(2, profile);
      expect(excessive.weight).toBe(800);
    });
  });
});
