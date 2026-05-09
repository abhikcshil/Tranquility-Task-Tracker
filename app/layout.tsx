import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BottomNav } from '@/components/bottom-nav';
import { RouteTransition } from '@/components/ui/route-transition';

export const metadata: Metadata = {
  title: 'Tranquility Task Tracker',
  description: 'Self-hosted personal task + habit tracker',
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#09090b',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-6">
          <RouteTransition>{children}</RouteTransition>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
