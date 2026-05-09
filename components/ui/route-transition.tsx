'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type RouteTransitionProps = {
  children: ReactNode;
};

export function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname();

  return (
    <main key={pathname} className="flex-1 motion-page-enter">
      {children}
    </main>
  );
}
