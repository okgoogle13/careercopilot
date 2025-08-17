import { vi } from 'vitest';

/**
 * Standard mock for react-router-dom components
 * Import and use this in component tests that use React Router
 */
export const mockReactRouterDom = (): void => {
  vi.mock('react-router-dom', () => ({
    NavLink: ({ children, to, className }: { children: React.ReactNode; to: string; className?: string }) => 
      `<a href="${to}" data-testid="nav-link" class="${className || ''}">${children}</a>`,
    Link: ({ children, to, className }: { children: React.ReactNode; to: string; className?: string }) => 
      `<a href="${to}" data-testid="link" class="${className || ''}">${children}</a>`,
    useNavigate: () => vi.fn(),
    useLocation: () => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    }),
    useParams: () => ({}),
    Outlet: () => `<div data-testid="outlet"></div>`,
  }));
};

/**
 * Mock for Firebase Authentication
 */
export const mockFirebaseAuth = (): void => {
  vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(() => ({
      currentUser: { uid: 'test-user-id', email: 'test@example.com' },
    })),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn((_, callback) => {
      callback({ uid: 'test-user-id', email: 'test@example.com' });
      return vi.fn();
    }),
  }));
};

/**
 * Mock for Firebase Firestore
 */
export interface MockData {
  [key: string]: unknown;
}

export const mockFirestore = (mockData: MockData = {}): void => {
  const docSnapMock = {
    exists: vi.fn().mockReturnValue(true),
    data: vi.fn().mockReturnValue({}),
    id: 'mock-doc-id',
    ...mockData,
  };

  vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(),
    collection: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn().mockResolvedValue(docSnapMock),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    getDocs: vi.fn().mockResolvedValue({
      docs: [docSnapMock],
      forEach: (callback: (doc: typeof docSnapMock) => void) => {
        callback(docSnapMock);
      },
    }),
    onSnapshot: vi.fn((_, callback) => {
      callback({
        docs: [docSnapMock],
        forEach: (cb: (doc: typeof docSnapMock) => void) => {
          cb(docSnapMock);
        },
      });
      return vi.fn();
    }),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
  }));
};
