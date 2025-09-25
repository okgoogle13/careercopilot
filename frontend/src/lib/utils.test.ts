import { cn, formatFileSize, formatDate } from './utils';

describe('Utils', () => {
  describe('cn', () => {
    it('should combine class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3');
    });

    it('should handle objects with boolean values', () => {
      expect(cn({ 'class1': true, 'class2': false, 'class3': true })).toBe('class1 class3');
    });

    it('should handle mixed inputs', () => {
      expect(cn('class1', { 'class2': true, 'class3': false }, 'class4')).toBe('class1 class2 class4');
    });

    it('should handle empty input', () => {
      expect(cn()).toBe('');
    });

    it('should handle null and undefined', () => {
      expect(cn(null, undefined, 'valid-class')).toBe('valid-class');
    });
  });

  describe('formatFileSize', () => {
    it('should format 0 bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
    });

    it('should format bytes correctly', () => {
      expect(formatFileSize(500)).toBe('500 Bytes');
      expect(formatFileSize(1023)).toBe('1023 Bytes');
    });

    it('should format KB correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(2048)).toBe('2 KB');
    });

    it('should format MB correctly', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
      expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB');
    });

    it('should format GB correctly', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
      expect(formatFileSize(2.5 * 1024 * 1024 * 1024)).toBe('2.5 GB');
    });

    it('should handle decimal places correctly', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB'); // 1.5 * 1024
      expect(formatFileSize(1843.2)).toBe('1.8 KB'); // Should round to 2 decimal places
    });

    it('should handle very large numbers', () => {
      const largeNumber = 1024 * 1024 * 1024 * 1024; // TB would require extending the sizes array
      expect(formatFileSize(largeNumber)).toContain('GB'); // Will format as GB since TB is not in the sizes array
    });
  });

  describe('formatDate', () => {
    beforeAll(() => {
      // Mock timezone to ensure consistent test results
      jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(
        () => ({
          format: (date: Date) => {
            const options: Intl.DateTimeFormatOptions = {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            };
            return new Intl.DateTimeFormat('en-US', options).format(date);
          },
        }) as any
      );
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Jan \d{1,2}, 2024/);
    });

    it('should handle different months', () => {
      const marchDate = new Date('2024-03-10');
      const formatted = formatDate(marchDate);
      expect(formatted).toMatch(/Mar \d{1,2}, 2024/);
    });

    it('should handle different years', () => {
      const date = new Date('2023-12-25');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Dec \d{1,2}, 2023/);
    });

    it('should handle leap year dates', () => {
      const leapDate = new Date('2024-02-29');
      const formatted = formatDate(leapDate);
      expect(formatted).toMatch(/Feb \d{1,2}, 2024/);
    });

    it('should handle start of year', () => {
      const newYearDate = new Date('2024-01-01');
      const formatted = formatDate(newYearDate);
      expect(formatted).toMatch(/Jan \d{1,2}, 2024/);
    });

    it('should handle end of year', () => {
      const endYearDate = new Date('2024-12-31');
      const formatted = formatDate(endYearDate);
      expect(formatted).toMatch(/Dec \d{1,2}, 2024/);
    });
  });

  describe('edge cases and error handling', () => {
    it('cn should handle arrays', () => {
      expect(cn(['class1', 'class2'])).toBe('class1 class2');
    });

    it('formatFileSize should handle negative numbers', () => {
      expect(formatFileSize(-1024)).toBe('-1 KB');
    });

    it('formatDate should handle invalid dates gracefully', () => {
      const invalidDate = new Date('invalid');
      expect(() => formatDate(invalidDate)).toThrow();
    });
  });
});