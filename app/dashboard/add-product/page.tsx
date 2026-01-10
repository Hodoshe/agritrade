'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

const CATEGORIES = ['Livestock', 'Crops', 'Tools', 'Materials']
const PROVINCES = [
'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
]

export default function AddProduct() {
const router = useRouter()
const [loading, setLoading] = useState(true)
const [saving, setSaving] = useState(false)
const [profile, setProfile] = useState<any>(null)
const [mainImage, setMainImage] = useState<File | null>(null)
const [additionalImages, setAdditionalImages] = useState<File[]>([])
const [formData, setFormData] = useState({
title: '', category: '', description: '', price: '', is_negotiable: false,
quantity: '', size_weight: '', health_status: '', province: '', city: '',
seller_name: '', delivery_option: '', contact_phone: '', contact_email: '',
})

useEffect(() => {
checkUserAndProfile()
}, [])

const checkUserAndProfile = async () => {
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
router.push('/auth/login')
return
}

const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
if (data) {
setProfile(data)
setFormData(prev => ({
...prev,
seller_name: data.company_name || data.full_name || '',
contact_email: data.email || '',
contact_phone: data.phone || ''
}))
}
setLoading(false)
}

const handleAdditionalImages = (e: React.ChangeEvent<HTMLInputElement>) => {
const files = Array.from(e.target.files || [])
const totalImages = additionalImages.length + files.length

if (totalImages > 4) {
alert('Maximum 4 additional images allowed (5 total including main image)')
return
}

setAdditionalImages(prev => [...prev, ...files])
}

const removeAdditionalImage = (index: number) => {
setAdditionalImages(prev => prev.filter((_, i) => i !== index))
}

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault()

if (!profile || profile.listings_remaining <= 0) {
alert('You have no listings remaining. Please upgrade your plan to continue.')
router.push('/pricing')
return
}

setSaving(true)

try {
const { data: { user } } = await supabase.auth.getUser()
if (!user) throw new Error('Not authenticated')

let mainImageUrl = ''
const additionalImageUrls: string[] = []

// Upload main image
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

mainImageUrl = publicUrl
}

// Upload additional images
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

additionalImageUrls.push(publicUrl)
}

const { error: insertError } = await supabase.from('products').insert({
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
city: formData.city,
seller_name: formData.seller_name,
delivery_option: formData.delivery_option,
contact_phone: formData.contact_phone,
contact_email: formData.contact_email,
image_url: mainImageUrl,
additional_images: additionalImageUrls,
})

if (insertError) throw insertError

const { error: updateError } = await supabase
.from('profiles')
.update({ listings_remaining: profile.listings_remaining - 1 })
.eq('id', user.id)

if (updateError) throw updateError

alert('Listing created successfully!')
router.push('/dashboard')
} catch (error: any) {
alert('Error creating listing: ' + error.message)
} finally {
setSaving(false)
}
}

const handleChange = (e: any) => {
const { name, value, type, checked } = e.target
setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
}

if (loading) {
return (
<div className="min-h-screen flex items-center justify-center">
<div className="text-2xl gradient-text">Loading...</div>
</div>
)
}

if (!profile || profile.listings_remaining <= 0) {
return (
<div className="min-h-screen">
<Navbar />
<main className="max-w-4xl mx-auto px-4 py-16">
<div className="glass-card p-12 text-center">
<div className="text-6xl mb-6">🔒</div>
<h1 className="text-4xl font-bold mb-4">No Listings Remaining</h1>
<p className="text-xl text-gray-300 mb-8">
You need to upgrade your plan or purchase a listing to continue.
</p>
<div className="glass-card p-6 bg-yellow-500/10 mb-8 max-w-md mx-auto">
<div className="text-sm text-gray-300">
<p><strong>Current Plan:</strong> {profile?.subscription_plan || 'Free'}</p>
<p><strong>Listings Remaining:</strong> {profile?.listings_remaining || 0}</p>
</div>
</div>
<div className="flex gap-4 justify-center">
<Link href="/pricing" className="btn-primary text-white px-12 py-4 text-lg">
View Pricing Plans
</Link>
<Link href="/dashboard" className="glass-card px-12 py-4 text-lg">
Back to Dashboard
</Link>
</div>
</div>
</main>
</div>
)
}

return (
<div className="min-h-screen">
<Navbar />

<main className="max-w-4xl mx-auto px-4 py-8">
<div className="glass-card p-8">
<div className="flex justify-between items-center mb-8">
<h1 className="text-3xl font-bold gradient-text">Add New Listing</h1>
<div className="text-sm glass-card px-4 py-2">
<span className="text-gray-400">Listings Remaining: </span>
<span className="font-bold text-agri-green">{profile.listings_remaining}</span>
</div>
</div>

<form onSubmit={handleSubmit} className="space-y-6">
<div>
<label className="block text-sm font-medium mb-2">Main Product Image *</label>
<input
type="file"
accept="image/*"
onChange={(e) => setMainImage(e.target.files?.[0] || null)}
required
className="w-full"
/>
<p className="text-xs text-gray-400 mt-1">This image will be shown on the product card</p>
</div>

<div>
<label className="block text-sm font-medium mb-2">Additional Images (Optional)</label>
<input
type="file"
accept="image/*"
multiple
onChange={handleAdditionalImages}
className="w-full"
/>
<p className="text-xs text-gray-400 mt-1">
Add up to 4 more images (5 total). Buyers can view all images in the gallery.
</p>

{additionalImages.length > 0 && (
<div className="mt-3 flex gap-2 flex-wrap">
{additionalImages.map((file, idx) => (
<div key={idx} className="relative glass-card p-2">
<img
src={URL.createObjectURL(file)}
alt={`Preview ${idx + 1}`}
className="w-20 h-20 object-cover rounded"
/>
<button
type="button"
onClick={() => removeAdditionalImage(idx)}
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

<div>
<label className="block text-sm font-medium mb-2">Seller Name / Farm Name *</label>
<input
type="text"
name="seller_name"
value={formData.seller_name}
onChange={handleChange}
placeholder="e.g., Green Valley Farms or John Doe"
required
/>
<p className="text-xs text-gray-400 mt-1">This will be displayed to buyers on your listing</p>
</div>

<div>
<label className="block text-sm font-medium mb-2">Category *</label>
<select name="category" value={formData.category} onChange={handleChange} required>
<option value="">Select a category</option>
{CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
</select>
</div>

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

<div className="grid md:grid-cols-2 gap-6">
<div>
<label className="block text-sm font-medium mb-2">Province *</label>
<select name="province" value={formData.province} onChange={handleChange} required>
<option value="">Select province</option>
{PROVINCES.map(prov => <option key={prov} value={prov}>{prov}</option>)}
</select>
</div>
<div>
<label className="block text-sm font-medium mb-2">City / Town *</label>
<input
type="text"
name="city"
value={formData.city}
onChange={handleChange}
placeholder="e.g., Durban, Ulundi, Pietermaritzburg"
required
/>
<p className="text-xs text-gray-400 mt-1">Helps buyers find nearby products</p>
</div>
</div>

<div>
<label className="block text-sm font-medium mb-2">Delivery Option *</label>
<select name="delivery_option" value={formData.delivery_option} onChange={handleChange} required>
<option value="">Select option</option>
<option value="Pickup only">Pickup only</option>
<option value="Delivery available">Delivery available</option>
<option value="Both">Both pickup & delivery</option>
</select>
</div>

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

<div className="flex gap-4">
<button
type="submit"
disabled={saving}
className="btn-primary text-white flex-1 disabled:opacity-50"
>
{saving ? 'Creating Listing...' : 'Create Listing'}
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
