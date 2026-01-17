'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    setMenuOpen(false)
  }

  return (
    <nav className="glass-card mx-2 md:mx-4 mt-2 md:mt-4 p-3 md:p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href={user ? '/dashboard' : '/'}>
          <h1 className="text-xl md:text-2xl font-bold gradient-text cursor-pointer">AgriTrade</h1>
        </Link>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/marketplace" className="text-white hover:text-agri-green transition">
            Marketplace
          </Link>
          
          {user ? (
            <>
              <Link href="/dashboard" className="text-white hover:text-agri-green transition">
                Dashboard
              </Link>
              <Link href="/profile" className="text-white hover:text-agri-green transition">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-red-400 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/pricing" className="text-white hover:text-agri-green transition">
                Pricing
              </Link>
              <Link href="/auth/login" className="btn-primary text-white px-6 py-2">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-700 flex flex-col gap-3">
          <Link href="/marketplace" className="text-white hover:text-agri-green transition py-2" onClick={() => setMenuOpen(false)}>
            Marketplace
          </Link>
          
          {user ? (
            <>
              <Link href="/dashboard" className="text-white hover:text-agri-green transition py-2" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <Link href="/profile" className="text-white hover:text-agri-green transition py-2" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-red-400 transition text-left py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/pricing" className="text-white hover:text-agri-green transition py-2" onClick={() => setMenuOpen(false)}>
                Pricing
              </Link>
              <Link href="/auth/login" className="btn-primary text-white px-6 py-2 text-center" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
