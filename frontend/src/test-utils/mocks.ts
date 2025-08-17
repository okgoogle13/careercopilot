import { vi } from 'vitest';

/**
 * Minimal helper: only mock react-router-dom here.
 * Firebase mocks are hoisted in src/test-utils/global-mocks.ts
 */
export const mockReactRouterDom = (): void => {
  vi.mock('react-router-dom', () => ({
    NavLink: ({ children, to, className }: { children: React.ReactNode; to: string; className?: string }) =>
      `<a href="${to}" data-testid="nav-link" class="${className || ''}">${children}</a>`,
    Link: ({ children, to, className }: { children: React.ReactNode; to: string; className?: string }) =>
      `<a href="${to}" data-testid="link" class="${className || ''}">${children}</a>`,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null, key: 'default' }),
    useParams: () => ({}),
    Outlet: () => `<div data-testid="outlet"></div>`,
  }));
};
