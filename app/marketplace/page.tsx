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
additional_images: string[]
contact_phone: string
contact_email: string
created_at: string
expires_at: string
user_id: string
}

interface ProductWithPlan extends Product {
subscription_plan: string
}

const CATEGORIES = ['All', 'Livestock', 'Crops', 'Tools', 'Materials']
const PROVINCES = [
'All Provinces', 'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
]

export default function Marketplace() {
const [products, setProducts] = useState<ProductWithPlan[]>([])
const [filteredProducts, setFilteredProducts] = useState<ProductWithPlan[]>([])
const [selectedCategory, setSelectedCategory] = useState('All')
const [selectedProvince, setSelectedProvince] = useState('All Provinces')
const [sortBy, setSortBy] = useState('featured')
const [user, setUser] = useState<any>(null)
const [loading, setLoading] = useState(true)
const [galleryOpen, setGalleryOpen] = useState(false)
const [galleryImages, setGalleryImages] = useState<string[]>([])
const [currentImageIndex, setCurrentImageIndex] = useState(0)

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
const { data: productsData } = await supabase
.from('products')
.select('*')
.eq('status', 'active')
.or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())

if (!productsData) {
setLoading(false)
return
}

const userIds = [...new Set(productsData.map(p => p.user_id))]

const { data: profilesData } = await supabase
.from('profiles')
.select('id, subscription_plan')
.in('id', userIds)

const productsWithPlan = productsData.map(product => ({
...product,
subscription_plan: profilesData?.find(p => p.id === product.user_id)?.subscription_plan || 'free'
}))

setProducts(productsWithPlan)
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

if (sortBy === 'featured') {
filtered.sort((a, b) => {
if (a.subscription_plan === 'professional' && b.subscription_plan !== 'professional') return -1
if (b.subscription_plan === 'professional' && a.subscription_plan !== 'professional') return 1
return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
})
} else if (sortBy === 'price-low') {
filtered.sort((a, b) => {
if (a.subscription_plan === 'professional' && b.subscription_plan !== 'professional') return -1
if (b.subscription_plan === 'professional' && a.subscription_plan !== 'professional') return 1
return a.price - b.price
})
} else if (sortBy === 'price-high') {
filtered.sort((a, b) => {
if (a.subscription_plan === 'professional' && b.subscription_plan !== 'professional') return -1
if (b.subscription_plan === 'professional' && a.subscription_plan !== 'professional') return 1
return b.price - a.price
})
} else {
filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

setFilteredProducts(filtered)
}

const openGallery = (mainImage: string, additionalImages: string[]) => {
const allImages = [mainImage, ...(additionalImages || [])]
setGalleryImages(allImages)
setCurrentImageIndex(0)
setGalleryOpen(true)
}

const nextImage = () => {
setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
}

const prevImage = () => {
setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
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
<h1 className="text-5xl font-bold mb-4"><span className="gradient-text">Marketplace</span></h1>
<p className="text-xl text-gray-300">Browse {products.length} active listings from farmers across South Africa</p>
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
<option value="featured">Featured First</option>
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
{filteredProducts.map((product) => {
const totalImages = 1 + (product.additional_images?.length || 0)
const isFeatured = product.subscription_plan === 'professional'
return (
<div key={product.id} className={`glass-card overflow-hidden ${isFeatured ? 'ring-2 ring-yellow-500' : ''}`}>
<div className="relative h-48 bg-gray-800">
{isFeatured && (
<div className="absolute top-2 left-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">⭐ FEATURED</div>
)}
{product.image_url ? (
<>
<img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
<button onClick={() => openGallery(product.image_url, product.additional_images || [])} className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/90 px-3 py-1 rounded text-sm flex items-center gap-1">
🔍 View Images {totalImages > 1 && `(${totalImages})`}
</button>
</>
) : (
<div className="flex items-center justify-center h-full text-6xl">📦</div>
)}
</div>
<div className="p-6">
<div className="flex justify-between items-start mb-3">
<span className="text-xs px-3 py-1 bg-agri-green/20 text-agri-green rounded-full">{product.category}</span>
<div className="text-xs text-gray-400 text-right">
<div>{product.city || 'Location not specified'}</div>
<div>{product.province}</div>
</div>
</div>
<h3 className="text-xl font-bold mb-2 line-clamp-2">{product.title}</h3>
<p className="text-sm text-gray-400 mb-3">Sold by: <span className="text-white">{product.seller_name || 'Seller'}</span></p>
<p className="text-gray-300 text-sm mb-4 line-clamp-3">{product.description}</p>
<div className="flex justify-between items-center mb-3">
<div>
<div className="text-2xl font-bold gradient-text">R{product.price.toFixed(2)}</div>
{product.is_negotiable && <div className="text-xs text-gray-400">Negotiable</div>}
</div>
</div>
<div className="text-sm text-gray-400 mb-4">🚚 {product.delivery_option || 'Contact seller'}</div>
