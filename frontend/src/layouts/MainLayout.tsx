import type { ReactNode } from 'react';

export default function MainLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="app-shell">{children}</div>;
}
