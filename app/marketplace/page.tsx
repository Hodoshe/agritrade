'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function Marketplace() {
const [products, setProducts] = useState<any[]>([])
const [user, setUser] = useState<any>(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
checkUser()
loadProducts()
}, [])

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

if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-2xl gradient-text">Loading...</div></div>

return (
<div className="min-h-screen">
<Navbar />
<main className="max-w-7xl mx-auto px-4 py-8">
<h1 className="text-5xl font-bold mb-8 text-center"><span className="gradient-text">Marketplace</span></h1>
{products.length === 0 ? (
<div className="glass-card p-12 text-center"><div className="text-6xl mb-4">🔍</div><h3 className="text-2xl font-bold">No products found</h3></div>
) : (
<div className="grid md:grid-cols-3 gap-6">
{products.map((p) => (
<div key={p.id} className="glass-card p-6">
{p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-48 object-cover rounded mb-4" />}
<h3 className="text-xl font-bold mb-2">{p.title}</h3>
<p className="text-gray-300 mb-2">{p.description}</p>
<div className="text-2xl font-bold gradient-text mb-4">R{p.price}</div>
{user && (
<div className="text-sm">
<p>📞 {p.contact_phone}</p>
<p>✉️ {p.contact_email}</p>
</div>
)}
</div>
))}
</div>
)}
</main>
</div>
)
}
