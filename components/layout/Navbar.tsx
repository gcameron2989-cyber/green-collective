'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      setLoadingAuth(false)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
      setLoadingAuth(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const isActive = (path: string) => pathname === path

  // Only show the guest bar if NOT loading, NOT authenticated, AND NOT on the homepage
  const showGuestBanner = !loadingAuth && !isAuthenticated && pathname !== '/'

  return (
    <div className="w-full sticky top-0 z-50">
      {showGuestBanner && (
        <div className="bg-emerald-900 text-emerald-100 text-xs py-2 px-6 flex justify-between items-center border-b border-emerald-950/20">
          <span className="font-medium">Previewing Green Collective as a guest</span>
          <Link href="/login" className="underline hover:text-white font-semibold transition">
            ← Back to Guest Preview
          </Link>
        </div>
      )}

      {/* Main Navbar Header */}
      <header className="px-6 py-4 border-b border-emerald-900/10 backdrop-blur-md bg-background/80 flex justify-between items-center max-w-6xl mx-auto w-full shadow-sm">
        <Link href="/" className="font-bold text-xl tracking-tight text-[#0f382c] flex items-center gap-2 hover:opacity-80 transition">
          <span className="size-3 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Green Collective
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
          <Link href="/" className={`transition ${isActive('/') ? 'text-[#0f382c] font-bold' : 'hover:text-[#0f382c]'}`}>Home</Link>
          <Link href="/initiatives" className={`transition ${isActive('/initiatives') ? 'text-[#0f382c] font-bold' : 'hover:text-[#0f382c]'}`}>Initiatives</Link>
          <Link href="/about" className={`transition ${isActive('/about') ? 'text-[#0f382c] font-bold' : 'hover:text-[#0f382c]'}`}>About</Link>
          <Link href="/contact" className={`transition ${isActive('/contact') ? 'text-[#0f382c] font-bold' : 'hover:text-[#0f382c]'}`}>Contact</Link>
        </nav>

        <div className="flex gap-4 items-center text-xs font-semibold">
          {!loadingAuth && (
            isAuthenticated ? (
              <>
                <Link href="/profile" className="text-emerald-800 hover:underline font-bold">
                  👤 My Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-red-600 hover:underline font-medium px-2 py-1"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-foreground hover:text-[#0f382c] transition px-3 py-2">
                  Log In
                </Link>
                <Link href="/login" className="text-sm font-semibold bg-[#0f382c] text-white px-5 py-2.5 rounded-full hover:bg-emerald-900 transition shadow-md shadow-emerald-900/10">
                  Get Started
                </Link>
              </>
            )
          )}
        </div>
      </header>
    </div>
  )
}
