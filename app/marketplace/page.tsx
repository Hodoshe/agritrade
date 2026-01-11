'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

const CATEGORIES = ['All', 'Livestock', 'Crops', 'Tools', 'Materials']
const PROVINCES = ['All Provinces', 'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape']

export default function Marketplace() {
const [products, setProducts] = useState<any[]>([])
const [filtered, setFiltered] = useState<any[]>([])
const [profiles, setProfiles] = useState<any[]>([])
const [category, setCategory] = useState('All')
const [province, setProvince] = useState('All Provinces')
const [sort, setSort] = useState('featured')
const [user, setUser] = useState<any>(null)
const [loading, setLoading] = useState(true)
const [gallery, setGallery] = useState<string[]>([])
const [galleryIndex, setGalleryIndex] = useState(0)

useEffect(() => {
checkUser()
loadData()
}, [])

useEffect(() => {
filterSort()
}, [products, profiles, category, province, sort])

const checkUser = async () => {
const { data: { user } } = await supabase.auth.getUser()
setUser(user)
}

const loadData = async () => {
const { data: p } = await supabase.from('products').select('*').eq('status', 'active').order('created_at', { ascending: false })
const { data: pr } = await supabase.from('profiles').select('id, subscription_plan')
if (p) setProducts(p)
if (pr) setProfiles(pr)
setLoading(false)
}

const filterSort = () => {
let f = [...products]
if (category !== 'All') f = f.filter(x => x.category === category)
if (province !== 'All Provinces') f = f.filter(x => x.province === province)

f = f.map(x => ({ ...x, plan: profiles.find(p => p.id === x.user_id)?.subscription_plan || 'free' }))

if (sort === 'featured') {
f.sort((a, b) => {
if (a.plan === 'professional' && b.plan !== 'professional') return -1
if (b.plan === 'professional' && a.plan !== 'professional') return 1
return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
})
} else if (sort === 'price-low') {
f.sort((a, b) => {
if (a.plan === 'professional' && b.plan !== 'professional') return -1
if (b.plan === 'professional' && a.plan !== 'professional') return 1
return a.price - b.price
})
} else if (sort === 'price-high') {
f.sort((a, b) => {
if (a.plan === 'professional' && b.plan !== 'professional') return -1
if (b.plan === 'professional' && a.plan !== 'professional') return 1
return b.price - a.price
})
} else {
f.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

setFiltered(f)
}

const openGallery = (main: string, extra: string[]) => {
setGallery([main, ...(extra || [])])
setGalleryIndex(0)
}

if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-2xl gradient-text">Loading...</div></div>

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
<div><label className="block text-sm mb-2">Category</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
<div><label className="block text-sm mb-2">Province</label><select value={province} onChange={(e) => setProvince(e.target.value)} className="w-full">{PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
<div><label className="block text-sm mb-2">Sort By</label><select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full"><option value="featured">Featured First</option><option value="date">Newest</option><option value="price-low">Price Low-High</option><option value="price-high">Price High-Low</option></select></div>
</div>
</div>

{filtered.length === 0 ? (
<div className="glass-card p-12 text-center"><div className="text-6xl mb-4">🔍</div><h3 className="text-2xl font-bold">No products found</h3></div>
) : (
<div className="grid md:grid-cols-3 gap-6">
{filtered.map((p) => {
const imgs = 1 + (p.additional_images?.length || 0)
const feat = p.plan === 'professional'
return (
<div key={p.id} className={`glass-card overflow-hidden ${feat ? 'ring-2 ring-yellow-500' : ''}`}>
<div className="relative h-48 bg-gray-800">
{feat && <div className="absolute top-2 left-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold z-10">⭐ FEATURED</div>}
{p.image_url ? (
<>
<img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
<button onClick={() => openGallery(p.image_url, p.additional_images)} className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/90 px-3 py-1 rounded text-sm">🔍 View {imgs > 1 && `(${imgs})`}</button>
</>
) : <div className="flex items-center justify-center h-full text-6xl">📦</div>}
</div>
<div className="p-6">
<div className="flex justify-between mb-3">
<span className="text-xs px-3 py-1 bg-agri-green/20 text-agri-green rounded-full">{p.category}</span>
<div className="text-xs text-gray-400 text-right"><div>{p.city || 'Not specified'}</div><div>{p.province}</div></div>
</div>
<h3 className="text-xl font-bold mb-2">{p.title}</h3>
<p className="text-sm text-gray-400 mb-2">Sold by: <span className="text-white">{p.seller_name || 'Seller'}</span></p>
<p className="text-gray-300 text-sm mb-4 line-clamp-3">{p.description}</p>
<div className="text-2xl font-bold gradient-text mb-2">R{p.price.toFixed(2)}{p.is_negotiable && <span className="text-xs text-gray-400 ml-2">Negotiable</span>}</div>
<div className="text-sm text-gray-400 mb-4">🚚 {p.delivery_option || 'Contact seller'}</div>
{user ? (
<div className="space-y-1 pt-4 border-t border-gray-700 text-sm">
<div>📞 <a href={`tel:${p.contact_phone}`} className="text-agri-green hover:underline">{p.contact_phone}</a></div>
<div>✉️ <a href={`mailto:${p.contact_email}`} className="text-agri-green hover:underline break-all">{p.contact_email}</a></div>
</div>
) : (
<div className="pt-4 border-t border-gray-700"><Link href="/auth/login" className="block text-center btn-primary text-white text-sm py-2">Sign in to view contacts</Link></div>
)}
</div>
</div>
)
})}
</div>
)}
</main>

{gallery.length > 0 && (
<div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setGallery([])}>
<div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
<button onClick={() => setGallery([])} className="absolute -top-12 right-0 text-white text-2xl hover:text-agri-green">✕ Close</button>
<div className="flex gap-4">
<div className="flex-1 flex items-center justify-center">
<div className="relative">
<img src={gallery[galleryIndex]} alt="Product" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
{gallery.length > 1 && (
<>
<button onClick={() => setGalleryIndex((galleryIndex - 1 + gallery.length) % gallery.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white px-4 py-8 rounded text-2xl">‹</button>
<button onClick={() => setGalleryIndex((galleryIndex + 1) % gallery.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white px-4 py-8 rounded text-2xl">›</button>
</>
)}
</div>
</div>
{gallery.length > 1 && (
<div className="w-24 overflow-y-auto max-h-[80vh] space-y-2">
{gallery.map((img, i) => (
<button key={i} onClick={() => setGalleryIndex(i)} className={`w-full h-20 rounded overflow-hidden border-2 ${i === galleryIndex ? 'border-agri-green' : 'border-transparent opacity-60'}`}>
<img src={img} alt="" className="w-full h-full object-cover" />
</button>
))}
</div>
)}
</div>
{gallery.length > 1 && <div className="text-center mt-4 text-white">{galleryIndex + 1} / {gallery.length}</div>}
</div>
</div>
)}
</div>
)
}
