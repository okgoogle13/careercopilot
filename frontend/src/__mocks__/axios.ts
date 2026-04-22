// ESM-compatible axios mock
const instance = {
  get: jest.fn().mockResolvedValue({ data: {}, headers: {} }),
  post: jest.fn().mockResolvedValue({ data: {}, headers: {} }),
  put: jest.fn().mockResolvedValue({ data: {}, headers: {} }),
  delete: jest.fn().mockResolvedValue({ data: {}, headers: {} }),
  patch: jest.fn().mockResolvedValue({ data: {}, headers: {} }),
  defaults: { headers: { common: {} } },
  interceptors: {
    request: { use: jest.fn().mockReturnValue(1), eject: jest.fn() },
    response: { use: jest.fn().mockReturnValue(1), eject: jest.fn() },
  },
};

const axios = {
  ...instance,
  create: jest.fn(() => ({ ...instance })),
  isAxiosError: jest.fn(() => false),
};

export default axios;
export const { get, post, put, patch, create, interceptors } = axios;
