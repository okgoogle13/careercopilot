import { vi } from 'vitest';

/**
 * Minimal helper: mock react-router-dom so component tests can run.
 * Keep firebase mocks in src/test-utils/global-mocks.ts (hoisted by Vitest).
 */
export const mockReactRouterDom = (): void => {
  vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      NavLink: ({ children, to, className }: { children: React.ReactNode; to: string; className?: string }): string =>
        `<a href="${to}" data-testid="nav-link" class="${className || ''}">${children}</a>`,
      Link: ({ children, to, className }: { children: React.ReactNode; to: string; className?: string }): string =>
        `<a href="${to}" data-testid="link" class="${className || ''}">${children}</a>`,
      useNavigate: (): (() => void) => vi.fn(),
      useLocation: (): { pathname: string; search: string; hash: string; state: unknown; key: string } => ({ pathname: '/', search: '', hash: '', state: null, key: 'default' }),
      useParams: (): Record<string, string> => ({}),
      Outlet: (): string => `<div data-testid="outlet"></div>`,
    };
  });
};
