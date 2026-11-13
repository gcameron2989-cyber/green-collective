'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import Logo from '@/components/logo';

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Memoize the client so it NEVER re-instantiates on render
  const supabase = useMemo(() => createClient(), []);
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Close mobile menu whenever pathname changes (user navigates)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: '/log-action', label: 'Actions' },
    { href: '/competition', label: 'Leaderboard' },
    { href: '/initiatives', label: 'Initiatives' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/research', label: 'Research Hub' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        <Link
          href="/"
          className="shrink-0 hover:opacity-75 transition-opacity flex items-center"
          aria-label="Green Collective home"
        >
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-mono uppercase tracking-wider">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors ${
                isActive(item.href)
                  ? 'text-[#0f382c] font-medium'
                  : 'text-neutral-500 hover:text-[#0f382c]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth / Profile Action */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono uppercase tracking-wider shrink-0" suppressHydrationWarning>
          {isMounted && (
            isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className={`transition-colors ${
                    isActive('/profile')
                      ? 'text-[#0f382c] font-medium'
                      : 'text-neutral-500 hover:text-[#0f382c]'
                  }`}
                >
                  Profile
                </Link>

                <button
                  onClick={handleSignOut}
                  className="text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-neutral-500 hover:text-[#0f382c] transition-colors"
              >
                Log in
              </Link>
            )
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-neutral-700 hover:text-[#0f382c] focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-neutral-200 shadow-lg px-6 py-6 space-y-4 font-mono text-xs uppercase tracking-wider">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block py-2 transition-colors ${
                isActive(item.href)
                  ? 'text-[#0f382c] font-bold'
                  : 'text-neutral-600 hover:text-[#0f382c]'
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-4 border-t border-neutral-100 flex flex-col space-y-3" suppressHydrationWarning>
            {isMounted && (
              isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className={`block py-2 ${
                      isActive('/profile') ? 'text-[#0f382c] font-bold' : 'text-neutral-600'
                    }`}
                  >
                    Profile Hub
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-left py-2 text-neutral-500 hover:text-neutral-900"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block py-2 text-[#0f382c] font-bold"
                >
                  Log in
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
