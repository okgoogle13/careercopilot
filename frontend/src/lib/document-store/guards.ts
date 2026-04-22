import { Document } from './index';

/**
 * Validation error thrown by hallucination guard.
 */
export class PerplexityValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public code: string = 'VALIDATION_ERROR'
  ) {
    super(message);
    this.name = 'PerplexityValidationError';
  }
}

/**
 * Guard against Perplexity hallucinations by validating document updates.
 *
 * Enforces invariants on document fields:
 * - status: must be one of 'draft' | 'active' | 'archived'
 * - category: must be one of 'task' | 'decision' | 'spec' | 'guide' | 'note'
 * - atsScore: must be integer in [0, 100]
 * - title: max 500 characters
 * - content: max 50000 characters
 *
 * Throws PerplexityValidationError if any constraint violated.
 * Returns updates unchanged if validation passes.
 */
export function guardAgainstHallucinations(
  updates: Partial<Document>
): Partial<Document> {
  // Validate status
  if (updates.status !== undefined) {
    const validStatuses: Array<Document['status']> = ['draft', 'active', 'archived'];
    if (!validStatuses.includes(updates.status)) {
      throw new PerplexityValidationError(
        `Invalid status: "${updates.status}". Must be one of: ${validStatuses.join(', ')}`,
        'status'
      );
    }
  }

  // Validate category
  if (updates.category !== undefined) {
    const validCategories: Array<Document['category']> = [
      'task',
      'decision',
      'spec',
      'guide',
      'note'
    ];
    if (!validCategories.includes(updates.category)) {
      throw new PerplexityValidationError(
        `Invalid category: "${updates.category}". Must be one of: ${validCategories.join(', ')}`,
        'category'
      );
    }
  }

  // Validate atsScore (if present and numeric)
  if (updates.atsScore !== undefined) {
    // Check is a number
    if (typeof updates.atsScore !== 'number') {
      throw new PerplexityValidationError(
        `Invalid atsScore: "${updates.atsScore}". Must be a number`,
        'atsScore'
      );
    }

    // Check is integer
    if (!Number.isInteger(updates.atsScore)) {
      throw new PerplexityValidationError(
        `Invalid atsScore: ${updates.atsScore}. Must be an integer`,
        'atsScore'
      );
    }

    // Check is in [0, 100]
    if (updates.atsScore < 0 || updates.atsScore > 100) {
      throw new PerplexityValidationError(
        `Invalid atsScore: ${updates.atsScore}. Must be in range [0, 100]`,
        'atsScore'
      );
    }
  }

  // Validate title length
  if (updates.title !== undefined) {
    if (typeof updates.title !== 'string') {
      throw new PerplexityValidationError(
        `Invalid title: must be a string`,
        'title'
      );
    }

    if (updates.title.length > 500) {
      throw new PerplexityValidationError(
        `Title exceeds max length: ${updates.title.length} > 500 characters`,
        'title'
      );
    }
  }

  // Validate content length
  if (updates.content !== undefined) {
    if (typeof updates.content !== 'string') {
      throw new PerplexityValidationError(
        `Invalid content: must be a string`,
        'content'
      );
    }

    if (updates.content.length > 50000) {
      throw new PerplexityValidationError(
        `Content exceeds max length: ${updates.content.length} > 50000 characters`,
        'content'
      );
    }
  }

  // All validations passed, return updates unchanged
  return updates;
}

/**
 * Validate a complete Document (used for creation).
 */
export function validateDocument(doc: Document): Document {
  guardAgainstHallucinations({
    status: doc.status,
    category: doc.category,
    atsScore: doc.atsScore,
    title: doc.title,
    content: doc.content
  });

  return doc;
}
