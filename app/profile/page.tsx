'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface Profile {
  id: string
  email: string
  full_name: string
  company_name: string
  phone: string
  province: string
  profile_picture_url: string
  subscription_plan: string
  listings_remaining: number
}

const PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape'
]

export default function Profile() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profilePicture, setProfilePicture] = useState<File | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/auth/login')
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) {
      setProfile(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (!profile) return

      let profilePictureUrl = profile.profile_picture_url

      if (profilePicture) {
        const fileExt = profilePicture.name.split('.').pop()
        const fileName = `${profile.id}/profile.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, profilePicture, { upsert: true })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)

        profilePictureUrl = publicUrl
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          company_name: profile.company_name,
          phone: profile.phone,
          province: profile.province,
          profile_picture_url: profilePictureUrl,
        })
        .eq('id', profile.id)

      if (updateError) throw updateError

      alert('Profile updated successfully!')
      loadProfile()
    } catch (error: any) {
      alert('Error updating profile: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setProfile(prev => prev ? { ...prev, [name]: value } : null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl gradient-text">Loading profile...</div>
      </div>
    )
  }
return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold gradient-text mb-8">Profile Settings</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                {profile.profile_picture_url ? (
                  <img src={profile.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-4xl">👤</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Profile Picture</label>
                <input type="file" accept="image/*" onChange={(e) => setProfilePicture(e.target.files?.[0] || null)} className="text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <input type="text" name="full_name" value={profile.full_name || ''} onChange={handleChange} required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input type="email" value={profile.email} disabled className="opacity-50 cursor-not-allowed" />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Company/Farm Name</label>
              <input type="text" name="company_name" value={profile.company_name || ''} onChange={handleChange} placeholder="e.g., Green Valley Farms" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input type="tel" name="phone" value={profile.phone || ''} onChange={handleChange} placeholder="+27 XX XXX XXXX" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Province</label>
              <select name="province" value={profile.province || ''} onChange={handleChange}>
                <option value="">Select province</option>
                {PROVINCES.map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            <div className="glass-card p-6 bg-agri-green/10">
              <h3 className="font-bold mb-4">Subscription Details</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Current Plan:</span>
                  <span className="ml-2 font-bold capitalize">{profile.subscription_plan}</span>
                </div>
                <div>
                  <span className="text-gray-400">Listings Remaining:</span>
                  <span className="ml-2 font-bold">{profile.listings_remaining}</span>
                </div>
              </div>
              <Link href="/pricing" className="inline-block mt-4 btn-primary text-white text-sm px-6 py-2">
                Upgrade Plan
              </Link>
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={saving} className="btn-primary text-white flex-1 disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => router.push('/dashboard')} className="glass-card px-8 py-3">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
  if (!profile) return null
