'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

const CATEGORIES = ['Livestock', 'Crops', 'Tools', 'Materials']
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

export default function AddProduct() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    is_negotiable: false,
    quantity: '',
    size_weight: '',
    health_status: '',
    province: '',
    delivery_option: '',
    contact_phone: '',
    contact_email: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let imageUrl = ''

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)

        imageUrl = publicUrl
      }

      // Insert product
      const { error: insertError } = await supabase
        .from('products')
        .insert({
          user_id: user.id,
          title: formData.title,
          category: formData.category,
          description: formData.description,
          price: parseFloat(formData.price),
          is_negotiable: formData.is_negotiable,
          quantity: parseInt(formData.quantity),
          size_weight: formData.size_weight,
          health_status: formData.health_status,
          province: formData.province,
          delivery_option: formData.delivery_option,
          contact_phone: formData.contact_phone,
          contact_email: formData.contact_email,
          image_url: imageUrl,
        })

      if (insertError) throw insertError

      router.push('/dashboard')
    } catch (error: any) {
      alert('Error creating listing: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold gradient-text mb-8">Add New Listing</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Product Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                required
                className="w-full"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Product Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Organic Tomatoes - Grade A"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your product in detail..."
                required
              />
            </div>

            {/* Price & Negotiable */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Price (ZAR) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>
              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  name="is_negotiable"
                  checked={formData.is_negotiable}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label>Price is negotiable</label>
              </div>
            </div>

            {/* Quantity & Size */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g., 100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Size/Weight</label>
                <input
                  type="text"
                  name="size_weight"
                  value={formData.size_weight}
                  onChange={handleChange}
                  placeholder="e.g., 50kg bags"
                />
              </div>
            </div>

            {/* Health Status */}
            <div>
              <label className="block text-sm font-medium mb-2">Health Status (for livestock)</label>
              <input
                type="text"
                name="health_status"
                value={formData.health_status}
                onChange={handleChange}
                placeholder="e.g., Vaccinated, Certified healthy"
              />
            </div>

            {/* Province */}
            <div>
              <label className="block text-sm font-medium mb-2">Province *</label>
              <select name="province" value={formData.province} onChange={handleChange} required>
                <option value="">Select province</option>
                {PROVINCES.map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            {/* Delivery Option */}
            <div>
              <label className="block text-sm font-medium mb-2">Delivery Option *</label>
              <select name="delivery_option" value={formData.delivery_option} onChange={handleChange} required>
                <option value="">Select option</option>
                <option value="Pickup only">Pickup only</option>
                <option value="Delivery available">Delivery available</option>
                <option value="Both">Both pickup & delivery</option>
              </select>
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Contact Phone *</label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  placeholder="+27 XX XXX XXXX"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contact Email *</label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-white flex-1 disabled:opacity-50"
              >
                {loading ? 'Creating Listing...' : 'Create Listing'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="glass-card px-8 py-3"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
