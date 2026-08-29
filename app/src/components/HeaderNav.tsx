'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { LogOut, User, Bell } from 'lucide-react';

export default function HeaderNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, profile, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-between max-w-7xl mx-auto px-8 h-[72px]">
      {/* Brand Logo & Name */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-civic-blue)] text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:bg-[var(--color-civic-blue-dark)] transition-colors">
          CL
        </div>
        <div>
          <span className="text-xl font-extrabold tracking-tight text-[var(--color-civic-blue)] block leading-none">
            CivicLens
          </span>
          <span className="text-[11px] font-semibold tracking-wider text-[var(--color-text-tertiary)] uppercase block mt-1">
            Karnataka Web Platform
          </span>
        </div>
      </Link>

      {/* Nav Links (Home + Report + Nearby + Personal Rights + My Cases + Civic Map + How It Works) */}
      <nav className="flex items-center gap-5 md:gap-6">
        <Link
          href="/"
          className={`text-sm font-semibold transition-colors ${
            pathname === '/'
              ? 'text-[var(--color-civic-blue)] font-extrabold border-b-2 border-[var(--color-civic-blue)] pb-1'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-civic-blue)]'
          }`}
        >
          Home
        </Link>
        <Link
          href="/report"
          className={`text-sm font-semibold transition-colors ${
            pathname === '/report'
              ? 'text-[var(--color-civic-blue)] font-extrabold border-b-2 border-[var(--color-civic-blue)] pb-1'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-civic-blue)]'
          }`}
        >
          Report
        </Link>
        <Link
          href="/nearby"
          className={`text-sm font-semibold transition-colors ${
            pathname === '/nearby'
              ? 'text-[var(--color-civic-blue)] font-extrabold border-b-2 border-[var(--color-civic-blue)] pb-1'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-civic-blue)]'
          }`}
        >
          Nearby
        </Link>
        <Link
          href="/cases"
          className={`text-sm font-semibold transition-colors ${
            pathname === '/cases'
              ? 'text-[var(--color-civic-blue)] font-extrabold border-b-2 border-[var(--color-civic-blue)] pb-1'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-civic-blue)]'
          }`}
        >
          My Cases
        </Link>
        <Link
          href="/location"
          className={`text-sm font-semibold transition-colors ${
            pathname === '/location'
              ? 'text-[var(--color-civic-blue)] font-extrabold border-b-2 border-[var(--color-civic-blue)] pb-1'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-civic-blue)]'
          }`}
        >
          Civic Map
        </Link>
        <Link
          href="/how-it-works"
          className={`text-sm font-semibold transition-colors ${
            pathname === '/how-it-works'
              ? 'text-[var(--color-civic-blue)] font-extrabold border-b-2 border-[var(--color-civic-blue)] pb-1'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-civic-blue)]'
          }`}
        >
          How It Works
        </Link>
      </nav>

      {/* Top Right Controls */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon */}
        <button
          type="button"
          onClick={() => alert('No new notifications')}
          className="text-gray-500 hover:text-[var(--color-civic-blue)] transition-colors p-1"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        {/* User Account / Login Status */}
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            {/* User Profile Avatar Link */}
            <Link
              href="/profile"
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-all"
              title="View Civic Profile"
            >
              {profile?.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.displayName}
                  className="w-8 h-8 rounded-full object-cover border border-[var(--color-civic-blue)]"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 text-[var(--color-civic-blue)] flex items-center justify-center font-bold text-xs">
                  <User size={16} />
                </div>
              )}
              <span className="text-xs font-extrabold text-[var(--color-text-primary)] hidden lg:inline-block">
                {profile?.displayName || 'User'}
              </span>
            </Link>

            {/* Log Out Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs font-extrabold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl border border-red-200 transition-colors"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          /* Login / Sign Up Link */
          <Link
            href="/login"
            className="text-xs font-black text-[var(--color-civic-blue)] border border-[var(--color-civic-blue)] hover:bg-blue-50 px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            Login / Sign Up
          </Link>
        )}

        {/* Primary CTA Button */}
        <Link
          href="/report"
          className="bg-[var(--color-civic-blue)] text-white font-black text-xs px-6 py-3 rounded-full hover:bg-[var(--color-civic-blue-dark)] transition-colors shadow-sm active:scale-95"
        >
          Report a Problem
        </Link>
      </div>
    </div>
  );
}
