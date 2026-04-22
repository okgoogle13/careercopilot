import { guardAgainstHallucinations, PerplexityValidationError } from '../guards';
import { Document } from '../index';

describe('guardAgainstHallucinations', () => {
  describe('valid updates', () => {
    it('allows valid status values', () => {
      const updates = { status: 'active' as const };
      expect(() => guardAgainstHallucinations(updates)).not.toThrow();
    });

    it('allows valid category values', () => {
      const updates = { category: 'decision' as const };
      expect(() => guardAgainstHallucinations(updates)).not.toThrow();
    });

    it('allows valid ATS score in range [0, 100]', () => {
      const testValues = [0, 1, 50, 99, 100];
      testValues.forEach((value) => {
        const updates = { atsScore: value };
        expect(() => guardAgainstHallucinations(updates)).not.toThrow();
      });
    });

    it('allows valid title (< 500 chars)', () => {
      const updates = { title: 'A valid title' };
      expect(() => guardAgainstHallucinations(updates)).not.toThrow();
    });

    it('allows valid content (< 50000 chars)', () => {
      const updates = { content: 'A valid document body' };
      expect(() => guardAgainstHallucinations(updates)).not.toThrow();
    });

    it('allows multiple valid fields together', () => {
      const updates = {
        title: 'Updated Title',
        status: 'active' as const,
        category: 'spec' as const,
        atsScore: 85,
      };
      expect(() => guardAgainstHallucinations(updates)).not.toThrow();
    });

    it('allows undefined/missing fields (partial update)', () => {
      const updates: Partial<Document> = {
        title: 'Only title updated',
        // status, category, atsScore omitted
      };
      expect(() => guardAgainstHallucinations(updates)).not.toThrow();
    });
  });

  describe('invalid status', () => {
    it('rejects invalid status values', () => {
      const updates = { status: 'invalid_status' };
      expect(() => guardAgainstHallucinations(updates)).toThrow(PerplexityValidationError);
    });

    it('error message identifies the invalid field', () => {
      const updates = { status: 'published' };
      try {
        guardAgainstHallucinations(updates);
        fail('Should have thrown');
      } catch (e) {
        if (e instanceof PerplexityValidationError) {
          expect(e.message).toContain('status');
          expect(e.field).toBe('status');
        }
      }
    });
  });

  describe('invalid category', () => {
    it('rejects invalid category values', () => {
      const updates = { category: 'blog_post' };
      expect(() => guardAgainstHallucinations(updates)).toThrow(PerplexityValidationError);
    });

    it('error includes valid category options', () => {
      const updates = { category: 'article' };
      try {
        guardAgainstHallucinations(updates);
        fail('Should have thrown');
      } catch (e) {
        if (e instanceof PerplexityValidationError) {
          expect(e.message).toContain('task');
          expect(e.message).toContain('decision');
        }
      }
    });
  });

  describe('invalid ATS score', () => {
    it('rejects negative ATS scores', () => {
      const updates = { atsScore: -1 };
      expect(() => guardAgainstHallucinations(updates)).toThrow(PerplexityValidationError);
    });

    it('rejects ATS scores > 100', () => {
      const updates = { atsScore: 101 };
      expect(() => guardAgainstHallucinations(updates)).toThrow(PerplexityValidationError);
    });

    it('rejects non-integer ATS scores', () => {
      const updates = { atsScore: 50.5 };
      expect(() => guardAgainstHallucinations(updates)).toThrow(PerplexityValidationError);
    });

    it('error includes allowed range', () => {
      const updates = { atsScore: 150 };
      try {
        guardAgainstHallucinations(updates);
        fail('Should have thrown');
      } catch (e) {
        if (e instanceof PerplexityValidationError) {
          expect(e.message).toContain('0');
          expect(e.message).toContain('100');
        }
      }
    });
  });

  describe('invalid title', () => {
    it('rejects titles > 500 characters', () => {
      const longTitle = 'a'.repeat(501);
      const updates = { title: longTitle };
      expect(() => guardAgainstHallucinations(updates)).toThrow(PerplexityValidationError);
    });

    it('allows title exactly 500 characters', () => {
      const exactTitle = 'a'.repeat(500);
      const updates = { title: exactTitle };
      expect(() => guardAgainstHallucinations(updates)).not.toThrow();
    });
  });

  describe('invalid content', () => {
    it('rejects content > 50000 characters', () => {
      const longContent = 'a'.repeat(50001);
      const updates = { content: longContent };
      expect(() => guardAgainstHallucinations(updates)).toThrow(PerplexityValidationError);
    });

    it('allows content exactly 50000 characters', () => {
      const exactContent = 'a'.repeat(50000);
      const updates = { content: exactContent };
      expect(() => guardAgainstHallucinations(updates)).not.toThrow();
    });
  });

  describe('compound validation', () => {
    it('validates first error and stops', () => {
      const updates = {
        status: 'invalid',
        atsScore: 150,
      };
      try {
        guardAgainstHallucinations(updates);
        fail('Should have thrown');
      } catch (e) {
        if (e instanceof PerplexityValidationError) {
          // Should report status error first (checked first)
          expect(e.field).toBe('status');
        }
      }
    });

    it('allows mixed valid updates', () => {
      const updates = {
        title: 'New title',
        status: 'active' as const,
        atsScore: 75,
        category: 'guide' as const,
        content: 'New content',
      };
      expect(() => guardAgainstHallucinations(updates)).not.toThrow();
    });
  });

  describe('return value', () => {
    it('returns the validated updates unchanged', () => {
      const updates = {
        title: 'Test',
        status: 'draft' as const,
        atsScore: 42,
      };
      const result = guardAgainstHallucinations(updates);
      expect(result).toEqual(updates);
    });
  });
});
