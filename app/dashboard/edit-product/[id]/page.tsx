'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

const CATEGORIES = ['Livestock', 'Crops', 'Tools', 'Materials']

export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '', category: '', description: '', price: '', quantity: '', province: '',
    delivery_option: '', contact_phone: '', contact_email: ''
  })

  useEffect(() => {
    loadProduct()
  }, [])

  const loadProduct = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { data } = await supabase.from('products').select('*').eq('id', params.id).eq('user_id', user.id).single()
    if (data) {
      setFormData({
        title: data.title, category: data.category, description: data.description,
        price: data.price.toString(), quantity: data.quantity.toString(), province: data.province,
        delivery_option: data.delivery_option, contact_phone: data.contact_phone, contact_email: data.contact_email
      })
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('products').update({
      title: formData.title, category: formData.category, description: formData.description,
      price: parseFloat(formData.price), quantity: parseInt(formData.quantity), province: formData.province,
      delivery_option: formData.delivery_option, contact_phone: formData.contact_phone, contact_email: formData.contact_email
    }).eq('id', params.id)

    if (!error) {
      alert('Updated successfully!')
      router.push('/dashboard')
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-2xl gradient-text">Loading...</div></div>

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold gradient-text mb-8">Edit Listing</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div><label className="block text-sm mb-2">Title</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required /></div>
            <div><label className="block text-sm mb-2">Category</label><select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required><option value="">Select</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="block text-sm mb-2">Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={4} required /></div>
            <div><label className="block text-sm mb-2">Price</label><input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} step="0.01" required /></div>
            <div><label className="block text-sm mb-2">Quantity</label><input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required /></div>
            <div><label className="block text-sm mb-2">Phone</label><input type="tel" value={formData.contact_phone} onChange={(e) => setFormData({...formData, contact_phone: e.target.value})} required /></div>
            <button type="submit" className="btn-primary text-white w-full">Save Changes</button>
          </form>
        </div>
      </main>
    </div>
  )
}
