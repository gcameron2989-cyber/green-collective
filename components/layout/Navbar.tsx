
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import Logo from '@/components/logo';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsAuthenticated(!!session);
      setLoadingAuth(false);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setLoadingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: '/habits', label: 'Actions' },
    { href: '/initiatives', label: 'Initiatives' },
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

        <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider shrink-0">
          {!loadingAuth && (
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
      </div>
    </header>
  );
}
