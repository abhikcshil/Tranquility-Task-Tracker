'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/tasks', label: 'Tasks' },
  { href: '/habits', label: 'Habits' },
  { href: '/notes', label: 'Notes' },
];

export function BottomNav() {
  const pathname = usePathname();
  const activeIndex = Math.max(
    0,
    navItems.findIndex((item) => pathname === item.href),
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-zinc-800 bg-zinc-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="relative mx-auto grid max-w-md grid-cols-4 items-center gap-1 px-2 py-2">
        <span
          className="pointer-events-none absolute bottom-2 top-2 w-[calc((100%_-_1rem)/4)] rounded-xl border border-zinc-700/60 bg-zinc-800/80 shadow-[0_0_18px_rgba(125,211,252,0.08)] transition-transform duration-200 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(calc(${activeIndex} * (100% + 0.25rem) + 0.5rem))` }}
          aria-hidden="true"
        />
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <li key={item.href} className="relative z-10">
              <Link
                href={item.href}
                className={`tap-target flex min-h-11 items-center justify-center rounded-xl px-2 py-2 text-sm transition duration-150 ease-out active:scale-[0.98] ${
                  active ? 'text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
