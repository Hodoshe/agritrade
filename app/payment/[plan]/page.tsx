'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

const PLAN_DETAILS: any = {
'pay-per-listing': {
name: 'Pay-As-You-Go',
price: '14.99',
listings: 1,
yocoLink: 'https://pay.yoco.com/r/2JqrEa'
},
'starter': {
name: 'Starter',
price: '199.00',
listings: 10,
yocoLink: 'https://pay.yoco.com/r/mMLP6V'
},
'professional': {
name: 'Professional',
price: '499.00',
listings: 50,
yocoLink: 'https://pay.yoco.com/r/mdBZbl'
},
}

export default function PaymentPage({ params }: { params: { plan: string } }) {
const router = useRouter()
const [reference, setReference] = useState('')
const [submitting, setSubmitting] = useState(false)
const [error, setError] = useState('')

const plan = PLAN_DETAILS[params.plan]

if (!plan) {
return (
<div className="min-h-screen">
<Navbar />
<main className="max-w-4xl mx-auto px-4 py-16">
<div className="glass-card p-12 text-center">
<h1 className="text-3xl font-bold mb-4">Invalid Plan</h1>
<Link href="/pricing" className="btn-primary text-white inline-block">Back to Pricing</Link>
</div>
</main>
</div>
)
}

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault()
setSubmitting(true)
setError('')

try {
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
router.push('/auth/login')
return
}

if (reference.trim().length < 5) {
setError('Please enter a valid reference code')
setSubmitting(false)
return
}

const { error: insertError } = await supabase.from('payment_requests').insert({
user_id: user.id,
plan: params.plan,
amount: parseFloat(plan.price),
reference_code: reference.trim(),
status: 'pending'
})

if (insertError) throw insertError

alert('Payment request submitted! We will verify and activate your plan within 4 hours.')
router.push('/dashboard')
} catch (err: any) {
setError(err.message || 'Failed to submit request')
} finally {
setSubmitting(false)
}
}

return (
<div className="min-h-screen">
<Navbar />
<main className="max-w-4xl mx-auto px-4 py-8">
<div className="glass-card p-8">
<h1 className="text-3xl font-bold gradient-text mb-8">Complete Your Payment</h1>

<div className="glass-card p-6 bg-agri-green/10 mb-8">
<h2 className="text-xl font-bold mb-2">{plan.name} Plan</h2>
<div className="text-3xl font-bold gradient-text mb-2">R{plan.price}</div>
<p className="text-gray-300">{plan.listings} listing{plan.listings > 1 ? 's' : ''} per month</p>
</div>

<div className="mb-8">
<h3 className="text-xl font-bold mb-4">Payment Instructions:</h3>

<div className="space-y-4 text-gray-300">
<div className="glass-card p-4">
<h4 className="font-bold text-white mb-2">Option 1: Bank Transfer (EFT)</h4>
<div className="space-y-1 text-sm">
<p><strong>Bank:</strong> FNB</p>
<p><strong>Account Name:</strong> AgriTrade (Pty) Ltd</p>
<p><strong>Account Number:</strong> 62812345678</p>
<p><strong>Branch Code:</strong> 250655</p>
<p><strong>Reference:</strong> Your email address</p>
<p className="text-yellow-400 mt-2">⚠️ Use your email as reference so we can identify your payment</p>
</div>
</div>

<div className="glass-card p-4">
<h4 className="font-bold text-white mb-2">Option 2: Card Payment (Yoco)</h4>
<a
href={plan.yocoLink}
target="_blank"
rel="noopener noreferrer"
className="btn-primary text-white inline-block mt-2"
>
Pay R{plan.price} with Card →
</a>
<p className="text-xs mt-3 text-yellow-400">
⚠️ After payment, Yoco will show a reference number. Copy it and paste below.
</p>
</div>
</div>
</div>

<form onSubmit={handleSubmit} className="space-y-6">
<div>
<label className="block text-sm font-medium mb-2">
Enter Payment Reference Code *
</label>
<input
type="text"
value={reference}
onChange={(e) => setReference(e.target.value)}
placeholder="e.g., 123456789 or your bank reference"
required
className="w-full"
/>
<p className="text-xs text-gray-400 mt-2">
For card payments: Copy the reference from Yoco confirmation page<br />
For bank transfer: Use your email address as reference
</p>
</div>

{error && (
<div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
{error}
</div>
)}

<div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 text-sm">
<p className="font-bold mb-2">⏱️ Verification Process:</p>
<ul className="space-y-1 text-gray-300">
<li>1. Complete payment using one of the options above</li>
<li>2. Copy your payment reference/transaction number</li>
<li>3. Paste it in the form above and click submit</li>
<li>4. We'll verify your payment within 4 hours (8am-8pm daily)</li>
<li>5. Your plan will be activated and you'll receive email confirmation</li>
</ul>
</div>

<div className="flex gap-4">
<button
type="submit"
disabled={submitting}
className="btn-primary text-white flex-1 disabled:opacity-50"
>
{submitting ? 'Submitting...' : 'Submit Reference Code'}
</button>
<Link href="/pricing" className="glass-card px-8 py-3 text-center">
Cancel
</Link>
</div>
</form>
</div>
</main>
</div>
)
}
