import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { genkitApi } from './genkit';

describe('genkitApi (mock mode)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  async function flushMockTimers() {
    await jest.runOnlyPendingTimersAsync();
  }

  it('generates a mock cover letter response', async () => {
    const promise = genkitApi.generateCoverLetter({
      candidate_profile: { name: 'Test User' },
      job_description: 'Case Manager role',
      style: 'professional',
    });
    await flushMockTimers();
    const result = await promise;

    expect(result.letter_content).toContain('Mock Generated');
    expect(result.analysis.readability_score).toBeGreaterThan(0);
  });

  it('generates a mock KSC response', async () => {
    const promise = genkitApi.generateKSCResponse(
      'Demonstrated leadership',
      { situation: 'A', task: 'B', action: 'C', result: 'D' },
      { name: 'Test User' }
    );
    await flushMockTimers();
    const result = await promise;

    expect(result.situation).toBe('A');
    expect(result.result.length).toBeGreaterThan(0);
  });

  it('returns mock optimized resume data', async () => {
    const promise = genkitApi.optimizeResume({
      resume_text: 'Original resume',
      missing_keywords: ['leadership', 'analysis'],
      job_description: 'Job description',
    });
    await flushMockTimers();
    const result = await promise;

    expect(result.resume_text).toContain('Integrated keywords');
    expect(result.keywords_integrated).toEqual(['leadership', 'analysis']);
  });

  it('returns mock company context', async () => {
    const promise = genkitApi.getCompanyContext({
      company_name: 'Acme',
      job_description: 'Support specialist',
    });
    await flushMockTimers();
    const result = await promise;

    expect(result.core_values.length).toBeGreaterThan(0);
    expect(result.recommended_tone).toBeTruthy();
  });

  it('returns mock job analysis from URL', async () => {
    const promise = genkitApi.analyzeJobFromUrl({ url: 'https://example.com/job/1' });
    await flushMockTimers();
    const result = await promise;

    expect(result.analysis_success).toBe(true);
    expect(result.job_details.role_title).toBeTruthy();
  });

  it('returns mock profile summary', async () => {
    const promise = genkitApi.generateProfileSummary({
      user_profile_data: { name: 'Test User' },
    });
    await flushMockTimers();
    const result = await promise;

    expect(result.summary).toContain('Mock AI Summary');
  });
});
