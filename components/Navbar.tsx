'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="glass-card mx-4 mt-4 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href={user ? '/dashboard' : '/'}>
          <h1 className="text-2xl font-bold gradient-text cursor-pointer">AgriTrade</h1>
        </Link>
        
        <div className="flex gap-6 items-center">
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
              <Link href="/auth/login" className="btn-primary text-white">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
