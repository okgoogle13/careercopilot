import type { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';

export function AppLayout({ children }: PropsWithChildren) {
  return <main className="migration-shell">{children ?? <Outlet />}</main>;
}
