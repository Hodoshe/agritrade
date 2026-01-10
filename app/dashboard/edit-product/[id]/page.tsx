'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

const CATEGORIES = ['Livestock', 'Crops', 'Tools', 'Materials']
const PROVINCES = [
'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
]

export default function EditProduct({ params }: { params: { id: string } }) {
const router = useRouter()
const [loading, setLoading] = useState(true)
const [saving, setSaving] = useState(false)
const [mainImage, setMainImage] = useState<File | null>(null)
const [additionalImages, setAdditionalImages] = useState<File[]>([])
const [existingAdditionalImages, setExistingAdditionalImages] = useState<string[]>([])
const [formData, setFormData] = useState({
title: '', category: '', description: '', price: '', is_negotiable: false,
quantity: '', size_weight: '', health_status: '', province: '', city: '',
seller_name: '', delivery_option: '', contact_phone: '', contact_email: '', image_url: ''
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
price: data.price.toString(), is_negotiable: data.is_negotiable,
quantity: data.quantity.toString(), size_weight: data.size_weight || '',
health_status: data.health_status || '', province: data.province,
city: data.city || '', seller_name: data.seller_name || '',
delivery_option: data.delivery_option, contact_phone: data.contact_phone,
contact_email: data.contact_email, image_url: data.image_url || ''
})
setExistingAdditionalImages(data.additional_images || [])
} else {
alert('Product not found')
router.push('/dashboard')
}
setLoading(false)
}

const handleAdditionalImages = (e: React.ChangeEvent<HTMLInputElement>) => {
const files = Array.from(e.target.files || [])
const totalImages = existingAdditionalImages.length + additionalImages.length + files.length

if (totalImages > 4) {
alert('Maximum 4 additional images allowed')
return
}

setAdditionalImages(prev => [...prev, ...files])
}

const removeNewImage = (index: number) => {
setAdditionalImages(prev => prev.filter((_, i) => i !== index))
}

const removeExistingImage = (index: number) => {
setExistingAdditionalImages(prev => prev.filter((_, i) => i !== index))
}

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault()
setSaving(true)

try {
const { data: { user } } = await supabase.auth.getUser()
if (!user) throw new Error('Not authenticated')

let imageUrl = formData.image_url
const newAdditionalUrls: string[] = []

// Upload new main image if provided
if (mainImage) {
const fileExt = mainImage.name.split('.').pop()
const fileName = `${user.id}/${Date.now()}_main.${fileExt}`

const { error: uploadError } = await supabase.storage
.from('product-images')
.upload(fileName, mainImage)

if (uploadError) throw uploadError

const { data: { publicUrl } } = supabase.storage
.from('product-images')
.getPublicUrl(fileName)

imageUrl = publicUrl
}

// Upload new additional images
for (let i = 0; i < additionalImages.length; i++) {
const file = additionalImages[i]
const fileExt = file.name.split('.').pop()
const fileName = `${user.id}/${Date.now()}_${i}.${fileExt}`

const { error: uploadError } = await supabase.storage
.from('product-images')
.upload(fileName, file)

if (uploadError) throw uploadError

const { data: { publicUrl } } = supabase.storage
.from('product-images')
.getPublicUrl(fileName)

newAdditionalUrls.push(publicUrl)
}

// Combine existing and new additional images
const allAdditionalImages = [...existingAdditionalImages, ...newAdditionalUrls]

const { error } = await supabase.from('products').update({
title: formData.title, category: formData.category, description: formData.description,
price: parseFloat(formData.price), is_negotiable: formData.is_negotiable,
quantity: parseInt(formData.quantity), size_weight: formData.size_weight,
health_status: formData.health_status, province: formData.province,
city: formData.city, seller_name: formData.seller_name,
delivery_option: formData.delivery_option, contact_phone: formData.contact_phone,
contact_email: formData.contact_email, image_url: imageUrl,
additional_images: allAdditionalImages,
updated_at: new Date().toISOString()
}).eq('id', params.id)

if (!error) {
alert('Updated successfully!')
router.push('/dashboard')
}
} catch (error: any) {
alert('Error: ' + error.message)
} finally {
setSaving(false)
}
}

const handleChange = (e: any) => {
const { name, value, type, checked } = e.target
setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
}

if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-2xl gradient-text">Loading...</div></div>

return (
<div className="min-h-screen">
<Navbar />
<main className="max-w-4xl mx-auto px-4 py-8">
<div className="glass-card p-8">
<h1 className="text-3xl font-bold gradient-text mb-8">Edit Listing</h1>
<form onSubmit={handleSubmit} className="space-y-6">
{formData.image_url && (
<div>
<label className="block text-sm font-medium mb-2">Current Main Image</label>
<img src={formData.image_url} alt="Current" className="w-48 h-48 object-cover rounded-lg" />
</div>
)}

<div>
<label className="block text-sm font-medium mb-2">Upload New Main Image (optional)</label>
<input type="file" accept="image/*" onChange={(e) => setMainImage(e.target.files?.[0] || null)} />
</div>

{existingAdditionalImages.length > 0 && (
<div>
<label className="block text-sm font-medium mb-2">Current Additional Images</label>
<div className="flex gap-2 flex-wrap">
{existingAdditionalImages.map((img, idx) => (
<div key={idx} className="relative">
<img src={img} alt={`Additional ${idx}`} className="w-24 h-24 object-cover rounded" />
<button
type="button"
onClick={() => removeExistingImage(idx)}
className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
>
✕
</button>
</div>
))}
</div>
</div>
)}

<div>
<label className="block text-sm font-medium mb-2">Add More Images (optional)</label>
<input type="file" accept="image/*" multiple onChange={handleAdditionalImages} />
{additionalImages.length > 0 && (
<div className="mt-3 flex gap-2 flex-wrap">
{additionalImages.map((file, idx) => (
<div key={idx} className="relative">
<img src={URL.createObjectURL(file)} alt={`New ${idx}`} className="w-24 h-24 object-cover rounded" />
<button
type="button"
onClick={() => removeNewImage(idx)}
className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
>
✕
</button>
</div>
))}
</div>
)}
</div>

<div>
<label className="block text-sm font-medium mb-2">Title *</label>
<input type="text" name="title" value={formData.title} onChange={handleChange} required />
</div>

<div>
<label className="block text-sm font-medium mb-2">Seller Name / Farm Name *</label>
<input type="text" name="seller_name" value={formData.seller_name} onChange={handleChange} required />
</div>

<div>
<label className="block text-sm font-medium mb-2">Category *</label>
<select name="category" value={formData.category} onChange={handleChange} required>
<option value="">Select</option>
{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
</select>
</div>

<div>
<label className="block text-sm font-medium mb-2">Description *</label>
<textarea name="description" value={formData.description} onChange={handleChange} rows={4} required />
</div>

<div className="grid md:grid-cols-2 gap-6">
<div>
<label className="block text-sm font-medium mb-2">Price *</label>
<input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" required />
</div>
<div className="flex items-center pt-8">
<input type="checkbox" name="is_negotiable" checked={formData.is_negotiable} onChange={handleChange} className="mr-2" />
<label>Negotiable</label>
</div>
</div>

<div className="grid md:grid-cols-2 gap-6">
<div>
<label className="block text-sm font-medium mb-2">Quantity *</label>
<input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
</div>
<div>
<label className="block text-sm font-medium mb-2">Size/Weight</label>
<input type="text" name="size_weight" value={formData.size_weight} onChange={handleChange} />
</div>
</div>

<div>
<label className="block text-sm font-medium mb-2">Health Status</label>
<input type="text" name="health_status" value={formData.health_status} onChange={handleChange} />
</div>

<div className="grid md:grid-cols-2 gap-6">
<div>
<label className="block text-sm font-medium mb-2">Province *</label>
<select name="province" value={formData.province} onChange={handleChange} required>
<option value="">Select</option>
{PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
</select>
</div>
<div>
<label className="block text-sm font-medium mb-2">City/Town *</label>
<input type="text" name="city" value={formData.city} onChange={handleChange} required />
</div>
</div>

<div>
<label className="block text-sm font-medium mb-2">Delivery Option *</label>
<select name="delivery_option" value={formData.delivery_option} onChange={handleChange} required>
<option value="">Select</option>
<option value="Pickup only">Pickup only</option>
<option value="Delivery available">Delivery available</option>
<option value="Both">Both</option>
</select>
</div>

<div className="grid md:grid-cols-2 gap-6">
<div>
<label className="block text-sm font-medium mb-2">Phone *</label>
<input type="tel" name="contact_phone" value={formData.contact_phone} onChange={handleChange} required />
</div>
<div>
<label className="block text-sm font-medium mb-2">Email *</label>
<input type="email" name="contact_email" value={formData.contact_email} onChange={handleChange} required />
</div>
</div>

<div className="flex gap-4">
<button type="submit" disabled={saving} className="btn-primary text-white flex-1 disabled:opacity-50">
{saving ? 'Saving...' : 'Save Changes'}
</button>
<button type="button" onClick={() => router.push('/dashboard')} className="glass-card px-8 py-3">Cancel</button>
</div>
</form>
</div>
</main>
</div>
)
}
