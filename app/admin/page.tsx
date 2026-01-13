'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function Admin() {
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const isAuth = sessionStorage.getItem('admin_authenticated') === 'true'
    if (!isAuth) {
      router.push('/admin/login')
      return
    }
    setAuthenticated(true)
    loadUsers()
  }

  const loadUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setUsers(data)
    setLoading(false)
  }

  const updatePlan = async (userId: string, plan: string, listings: number) => {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        subscription_plan: plan, 
        listings_remaining: listings 
      })
      .eq('id', userId)

    if (!error) {
      alert('User updated!')
      loadUsers()
    } else {
      alert('Error: ' + error.message)
    }
  }

  const logout = () => {
    sessionStorage.removeItem('admin_authenticated')
    router.push('/admin/login')
  }

  if (!authenticated) return null

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-2xl gradient-text">Loading...</div></div>

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="glass-card p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">🔧 Admin Panel - User Management</h1>
              <p className="text-yellow-400">⚠️ Protected Access Only</p>
            </div>
            <div className="flex gap-4">
              <Link href="/admin/payments" className="btn-primary text-white">
                💳 Payment Requests
              </Link>
              <button onClick={logout} className="glass-card px-6 py-3 hover:border-red-500 transition">
                🔓 Logout
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-6">All Users ({users.length})</h2>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="glass-card p-6">
                <div className="grid md:grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="font-bold">{user.full_name || 'No Name'}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Current Plan</p>
                    <p className="font-bold capitalize">{user.subscription_plan}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Listings Left</p>
                    <p className="font-bold text-agri-green">{user.listings_remaining}</p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button 
                      onClick={() => updatePlan(user.id, 'pay-per-listing', user.listings_remaining + 1)}
                      className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-sm"
                    >
                      +1 Listing
                    </button>
                    <button 
                      onClick={() => updatePlan(user.id, 'starter', 10)}
                      className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 rounded text-sm"
                    >
                      Starter (10)
                    </button>
                    <button 
                      onClick={() => updatePlan(user.id, 'professional', 50)}
                      className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 rounded text-sm"
                    >
                      Pro (50)
                    </button>
                    <button 
                      onClick={() => updatePlan(user.id, 'free', 0)}
                      className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-sm"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
