'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

export default function AdminPayments() {
const [requests, setRequests] = useState<any[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
loadRequests()
}, [])

const loadRequests = async () => {
const { data } = await supabase
.from('payment_requests')
.select(`
*,
profiles!inner(email, full_name)
`)
.order('created_at', { ascending: false })

if (data) {
const formatted = data.map(r => ({
...r,
user_email: r.profiles.email,
user_name: r.profiles.full_name
}))
setRequests(formatted)
}
setLoading(false)
}

const approvePay = async (requestId: string, userId: string, plan: string) => {
if (!confirm('Confirm payment verification and activate plan?')) return

try {
const listings = plan === 'starter' ? 10 : plan === 'professional' ? 50 : 1

// Update user plan
const { error: profileError } = await supabase
.from('profiles')
.update({
subscription_plan: plan,
listings_remaining: listings
})
.eq('id', userId)

if (profileError) throw profileError

// Mark request as approved
const { error: requestError } = await supabase
.from('payment_requests')
.update({
status: 'approved',
approved_at: new Date().toISOString()
})
.eq('id', requestId)

if (requestError) throw requestError

alert('Payment approved and plan activated!')
loadRequests()
} catch (err: any) {
alert('Error: ' + err.message)
}
}

const rejectPay = async (requestId: string) => {
if (!confirm('Reject this payment request?')) return

const { error } = await supabase
.from('payment_requests')
.update({ status: 'rejected' })
.eq('id', requestId)

if (!error) {
alert('Request rejected')
loadRequests()
}
}

if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-2xl gradient-text">Loading...</div></div>

const pending = requests.filter(r => r.status === 'pending')
const processed = requests.filter(r => r.status !== 'pending')

return (
<div className="min-h-screen">
<Navbar />
<main className="max-w-7xl mx-auto px-4 py-8">
<div className="glass-card p-8 mb-8">
<h1 className="text-3xl font-bold gradient-text mb-2">💳 Payment Requests</h1>
<p className="text-yellow-400">⚠️ Admin Panel - Verify payments and activate plans</p>
</div>

<div className="glass-card p-8 mb-8">
<h2 className="text-2xl font-bold mb-6">Pending Requests ({pending.length})</h2>
{pending.length === 0 ? (
<p className="text-gray-400">No pending requests</p>
) : (
<div className="space-y-4">
{pending.map(r => (
<div key={r.id} className="glass-card p-6">
<div className="grid md:grid-cols-5 gap-4 items-center">
<div>
<p className="font-bold">{r.user_name}</p>
<p className="text-sm text-gray-400">{r.user_email}</p>
</div>
<div>
<p className="text-sm text-gray-400">Plan</p>
<p className="font-bold capitalize">{r.plan.replace('-', ' ')}</p>
</div>
<div>
<p className="text-sm text-gray-400">Amount</p>
<p className="font-bold text-agri-green">R{r.amount}</p>
</div>
<div>
<p className="text-sm text-gray-400">Reference</p>
<p className="font-bold">{r.reference_code}</p>
</div>
<div className="flex gap-2">
<button
onClick={() => approvePay(r.id, r.user_id, r.plan)}
className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded text-sm"
>
✓ Approve
</button>
<button
onClick={() => rejectPay(r.id)}
className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded text-sm"
>
✕ Reject
</button>
</div>
</div>
<p className="text-xs text-gray-500 mt-2">Submitted: {new Date(r.created_at).toLocaleString()}</p>
</div>
))}
</div>
)}
</div>

<div className="glass-card p-8">
<h2 className="text-2xl font-bold mb-6">Processed Requests</h2>
{processed.length === 0 ? (
<p className="text-gray-400">No processed requests yet</p>
) : (
<div className="space-y-2">
{processed.map(r => (
<div key={r.id} className="glass-card p-4 flex justify-between items-center">
<div>
<span className="font-bold">{r.user_name}</span>
<span className="text-gray-400 mx-2">•</span>
<span className="capitalize">{r.plan.replace('-', ' ')}</span>
<span className="text-gray-400 mx-2">•</span>
<span>R{r.amount}</span>
</div>
<span className={`px-3 py-1 rounded text-xs ${r.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
{r.status}
</span>
</div>
))}
</div>
)}
</div>
</main>
</div>
)
}
