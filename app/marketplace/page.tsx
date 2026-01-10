'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface Product {
id: string
title: string
category: string
description: string
price: number
is_negotiable: boolean
province: string
city: string
seller_name: string
delivery_option: string
image_url: string
contact_phone: string
contact_email: string
created_at: string
user_id: string
}

const CATEGORIES = ['All', 'Livestock', 'Crops', 'Tools', 'Materials']
const PROVINCES = [
'All Provinces', 'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
]

export default function Marketplace() {
const [products, setProducts] = useState<Product[]>([])
const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
const [selectedCategory, setSelectedCategory] = useState('All')
const [selectedProvince, setSelectedProvince] = useState('All Provinces')
const [sortBy, setSortBy] = useState('date')
const [user, setUser] = useState<any>(null)
const [loading, setLoading] = useState(true)
const [selectedImage, setSelectedImage] = useState<string | null>(null)

useEffect(() => {
checkUser()
loadProducts()
}, [])

useEffect(() => {
filterAndSortProducts()
}, [products, selectedCategory, selectedProvince, sortBy])

const checkUser = async () => {
const { data: { user } } = await supabase.auth.getUser()
setUser(user)
}

const loadProducts = async () => {
const { data } = await supabase
.from('products')
.select('*')
.eq('status', 'active')
.order('created_at', { ascending: false })

if (data) setProducts(data)
setLoading(false)
}

const filterAndSortProducts = () => {
let filtered = [...products]

if (selectedCategory !== 'All') {
filtered = filtered.filter(p => p.category === selectedCategory)
}

if (selectedProvince !== 'All Provinces') {
filtered = filtered.filter(p => p.province === selectedProvince)
}

if (sortBy === 'price-low') {
filtered.sort((a, b) => a.price - b.price)
} else if (sortBy === 'price-high') {
filtered.sort((a, b) => b.price - a.price)
} else {
filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

setFilteredProducts(filtered)
}

if (loading) {
return (
<div className="min-h-screen flex items-center justify-center">
<div className="text-2xl gradient-text">Loading marketplace...</div>
</div>
)
}

return (
<div className="min-h-screen">
<Navbar />

<main className="max-w-7xl mx-auto px-4 py-8">
<div className="text-center mb-8">
<h1 className="text-5xl font-bold mb-4">
<span className="gradient-text">Marketplace</span>
</h1>
<p className="text-xl text-gray-300">
Browse {products.length} active listings from farmers across South Africa
</p>
</div>

<div className="glass-card p-6 mb-8">
<div className="grid md:grid-cols-3 gap-4">
<div>
<label className="block text-sm font-medium mb-2">Category</label>
<select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full">
{CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
</select>
</div>

<div>
<label className="block text-sm font-medium mb-2">Province</label>
<select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} className="w-full">
{PROVINCES.map(prov => <option key={prov} value={prov}>{prov}</option>)}
</select>
</div>

<div>
<label className="block text-sm font-medium mb-2">Sort By</label>
<select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full">
<option value="date">Newest First</option>
<option value="price-low">Price: Low to High</option>
<option value="price-high">Price: High to Low</option>
</select>
</div>
</div>
</div>

{filteredProducts.length === 0 ? (
<div className="glass-card p-12 text-center">
<div className="text-6xl mb-4">🔍</div>
<h3 className="text-2xl font-bold mb-2">No products found</h3>
<p className="text-gray-300">Try adjusting your filters</p>
</div>
) : (
<div className="grid md:grid-cols-3 gap-6">
{filteredProducts.map((product) => (
<div key={product.id} className="glass-card overflow-hidden">
<div className="relative h-48 bg-gray-800">
{product.image_url ? (
<>
<img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
<button
onClick={() => setSelectedImage(product.image_url)}
className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/90 px-3 py-1 rounded text-sm"
>
🔍 View Full Image
</button>
</>
) : (
<div className="flex items-center justify-center h-full text-6xl">📦</div>
)}
</div>

<div className="p-6">
<div className="flex justify-between items-start mb-3">
<span className="text-xs px-3 py-1 bg-agri-green/20 text-agri-green rounded-full">
{product.category}
</span>
<div className="text-xs text-gray-400 text-right">
<div>{product.city || 'Location not specified'}</div>
<div>{product.province}</div>
</div>
</div>

<h3 className="text-xl font-bold mb-2 line-clamp-2">{product.title}</h3>

<p className="text-sm text-gray-400 mb-3">
Sold by: <span className="text-white">{product.seller_name || 'Seller'}</span>
</p>

<p className="text-gray-300 text-sm mb-4 line-clamp-3">{product.description}</p>

<div className="flex justify-between items-center mb-3">
<div>
<div className="text-2xl font-bold gradient-text">R{product.price.toFixed(2)}</div>
{product.is_negotiable && <div className="text-xs text-gray-400">Negotiable</div>}
</div>
</div>

<div className="text-sm text-gray-400 mb-4">
🚚 {product.delivery_option || 'Contact seller'}
</div>

{user ? (
<div className="space-y-2 pt-4 border-t border-gray-700">
<div className="text-sm">
<span className="text-gray-400">📞 </span>
<a href={`tel:${product.contact_phone}`} className="text-agri-green hover:underline">
{product.contact_phone}
</a>
</div>
<div className="text-sm">
<span className="text-gray-400">✉️ </span>
<a href={`mailto:${product.contact_email}`} className="text-agri-green hover:underline break-all">
{product.contact_email}
</a>
</div>
</div>
) : (
<div className="pt-4 border-t border-gray-700">
<Link href="/auth/login" className="block text-center btn-primary text-white text-sm py-2">
Sign in to view contact details
</Link>
</div>
)}
</div>
</div>
))}
</div>
)}
</main>

{/* Image Modal */}
{selectedImage && (
<div
className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
onClick={() => setSelectedImage(null)}
>
<div className="relative max-w-4xl max-h-[90vh]">
<button
onClick={() => setSelectedImage(null)}
className="absolute -top-12 right-0 text-white text-2xl hover:text-agri-green"
>
✕ Close
</button>
<img
src={selectedImage}
alt="Product"
className="max-w-full max-h-[90vh] object-contain rounded-lg"
/>
</div>
</div>
)}
</div>
)
}
