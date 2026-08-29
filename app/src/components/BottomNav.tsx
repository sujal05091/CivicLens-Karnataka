'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, MapPin, FileText, User } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/report', label: 'Report', icon: Camera },
  { href: '/nearby', label: 'Nearby', icon: MapPin },
  { href: '/cases', label: 'Cases', icon: FileText },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Hide bottom nav on focused flow pages if desired, or keep navigation clean
  const flowPages = ['/analyze', '/location', '/intelligence', '/review', '/submitted'];
  if (flowPages.some(p => pathname.startsWith(p))) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[var(--color-outline-variant)] md:hidden shadow-lg"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-14 px-2 max-w-md mx-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[48px] rounded-xl px-2 py-1 transition-all duration-200 ${
                isActive
                  ? 'text-[var(--color-civic-blue)] bg-[var(--color-civic-blue-container)] font-semibold'
                  : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-civic-blue)]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
