import { RouterProvider } from 'react-router';
import { router } from './routes';

// ============================================================================
// APP — KERALA RAGE / SOLIDARITY MODE
// Data-mode router. Charcoal canvas (#0F0F0F) — no white backgrounds, ever.
// ============================================================================

export default function App() {
  return <RouterProvider router={router} />;
}
