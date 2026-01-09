'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function Profile() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (data) setProfile(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    
    const { error } = await supabase.from('profiles').update({
      full_name: profile.full_name,
      company_name: profile.company_name,
      phone: profile.phone,
    }).eq('id', profile.id)

    if (!error) alert('Profile updated!')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-2xl gradient-text">Loading...</div></div>
  if (!profile) return null

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold gradient-text mb-8">Profile Settings</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input type="text" value={profile.full_name || ''} onChange={(e) => setProfile({...profile, full_name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <input type="text" value={profile.company_name || ''} onChange={(e) => setProfile({...profile, company_name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input type="tel" value={profile.phone || ''} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
            </div>
            <button type="submit" className="btn-primary text-white w-full">Save Changes</button>
          </form>
        </div>
      </main>
    </div>
  )
}
