import { describe, it, expect, jest, beforeEach } from '@jest/globals';

(jest as any).unstable_mockModule('@/config/firebase', () => ({
  auth: {
    currentUser: {
      getIdToken: jest.fn().mockResolvedValue('test-token'),
    },
  },
  db: {},
  storage: {},
}));

const { realApi } = await import('../api');

// Mock global fetch
global.fetch = jest.fn() as any;

describe('realApi Service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('getAnalysisData calls the correct endpoint', async () => {
    const mockData = { atsScoreHistory: [], applicationStatus: [] };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await realApi.getAnalysisData();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/analysis/'),
      expect.any(Object)
    );
    expect(result).toEqual(mockData);
  });

  it('getApplications handles error responses', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
    });

    await expect(realApi.getApplications()).rejects.toThrow('Failed to fetch applications');
  });

  it('getOpportunities returns mapped data', async () => {
    const mockOpps = [{ id: 1, title: 'Job' }];
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockOpps),
    });

    const result = await realApi.getOpportunities();
    expect(result).toEqual(mockOpps);
  });
});
