import { beforeEach, describe, expect, it, jest } from '@jest/globals';

const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

(jest as any).unstable_mockModule('@/api/axiosConfig', () => ({
  axiosInstance: mockAxiosInstance,
}));

const { applicationService } = await import('../applicationService');

describe('applicationService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('listApplications uses the shared api prefix and forwards filters', async () => {
    const responseData = [{ id: 'app-1', jobTitle: 'Case Worker' }];
    mockAxiosInstance.get.mockResolvedValue({ data: responseData });

    const result = await applicationService.listApplications('user-1', {
      status: 'applied',
      company: 'Community First',
    });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/applications/', {
      params: {
        userId: 'user-1',
        status: 'applied',
        company: 'Community First',
      },
    });
    expect(result).toEqual(responseData);
  });

  it('updateApplication uses the canonical /api/applications route', async () => {
    const responseData = { id: 'app-1', status: 'interviewing' };
    mockAxiosInstance.put.mockResolvedValue({ data: responseData });

    const result = await applicationService.updateApplication('app-1', {
      status: 'interviewing',
    });

    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/applications/app-1', {
      status: 'interviewing',
    });
    expect(result).toEqual(responseData);
  });
});
