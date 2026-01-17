'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  category: string
  price: number
  views: number
  status: string
  created_at: string
  expires_at: string
  image_url: string
}

interface Profile {
  full_name: string
  subscription_plan: string
  listings_remaining: number
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/auth/login')
      return
    }

    setUser(user)
    await loadProfile(user.id)
    await loadProducts(user.id)
    setLoading(false)
  }

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data) {
      setProfile(data)
    }
  }

  const loadProducts = async (userId: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (data) {
      setProducts(data)
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (!error) {
      setProducts(products.filter(p => p.id !== productId))
    }
  }

  const totalViews = products.reduce((sum, p) => sum + p.views, 0)
  const activeListings = products.filter(p => p.status === 'active').length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl md:text-2xl gradient-text">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-8">
        <div className="glass-card p-6 md:p-8 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{profile?.full_name || 'Farmer'}</span>!
          </h1>
          <p className="text-sm md:text-base text-gray-300">Manage your listings and grow your agricultural business</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="glass-card p-4 md:p-6">
            <div className="text-2xl md:text-3xl font-bold gradient-text mb-1 md:mb-2">{activeListings}</div>
            <div className="text-xs md:text-base text-gray-300">Active Listings</div>
          </div>
          <div className="glass-card p-4 md:p-6">
            <div className="text-2xl md:text-3xl font-bold gradient-text mb-1 md:mb-2">{totalViews}</div>
            <div className="text-xs md:text-base text-gray-300">Total Views</div>
          </div>
          <div className="glass-card p-4 md:p-6">
            <div className="text-2xl md:text-3xl font-bold gradient-text mb-1 md:mb-2">{profile?.listings_remaining || 0}</div>
            <div className="text-xs md:text-base text-gray-300">Listings Left</div>
          </div>
          <div className="glass-card p-4 md:p-6">
            <div className="text-2xl md:text-3xl font-bold gradient-text mb-1 md:mb-2 capitalize">
              {profile?.subscription_plan || 'Free'}
            </div>
            <div className="text-xs md:text-base text-gray-300">Current Plan</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
          <Link href="/dashboard/add-product" className="btn-primary text-white text-center py-3 md:py-2 text-sm md:text-base">
            + Add New Listing
          </Link>
          <Link href="/pricing" className="glass-card px-6 py-3 md:py-2 hover:border-agri-green transition text-center text-sm md:text-base">
            Upgrade Plan
          </Link>
        </div>

        <div className="glass-card p-4 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Your Listings</h2>

          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-300">
              <div className="text-5xl md:text-6xl mb-4">📦</div>
              <p className="text-lg md:text-xl mb-4">No listings yet</p>
              <Link href="/dashboard/add-product" className="btn-primary text-white inline-block px-6 py-3 text-sm md:text-base">
                Create Your First Listing
              </Link>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {products.map((product) => {
                const daysUntilExpiry = product.expires_at 
                  ? Math.ceil((new Date(product.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  : null;
                  
                return (
                  <div key={product.id} className="glass-card p-4 md:p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="flex gap-3 md:gap-4 items-start flex-1">
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-xl font-bold mb-1 truncate">{product.title}</h3>
                        <p className="text-xs md:text-sm text-gray-300 mb-2">
                          {product.category} • R{product.price.toFixed(2)}
                        </p>
                        <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-gray-400">
                          <span>👁️ {product.views} views</span>
                          <span className={product.status === 'active' ? 'text-green-400' : 'text-yellow-400'}>
                            {product.status}
                          </span>
                          {daysUntilExpiry !== null && (
                            <span className={daysUntilExpiry <= 7 ? 'text-yellow-400' : 'text-gray-400'}>
                              ⏱️ {daysUntilExpiry > 0 ? `${daysUntilExpiry} days left` : 'Expired'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end md:justify-start">
                      <Link
                        href={`/dashboard/edit-product/${product.id}`}
                        className="px-3 md:px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition text-xs md:text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="px-3 md:px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition text-xs md:text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
