'use client'

import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Pricing() {
const [user, setUser] = useState<any>(null)

useEffect(() => {
checkUser()
}, [])

const checkUser = async () => {
const { data: { user } } = await supabase.auth.getUser()
setUser(user)
}

const plans = [
{
name: 'Pay-As-You-Go',
price: '14.99',
period: 'per listing',
description: 'Perfect for occasional sellers',
features: [
'1 listing per payment',
'30 days listing duration',
'Standard marketplace visibility',
'Contact info sharing with buyers',
'Up to 5 product images',
'Email support',
],
cta: 'Start Listing',
popular: false,
},
{
name: 'Starter',
price: '199',
period: 'per month',
description: 'Great for small farmers',
features: [
'10 active listings per month',
'60 days listing duration',
'Standard marketplace visibility',
'View count tracking',
'Contact info sharing',
'Up to 5 images per listing',
'Edit listings anytime',
'Priority email support',
],
cta: 'Get Starter',
popular: true,
},
{
name: 'Professional',
price: '499',
period: 'per month',
description: 'Best for growing businesses',
features: [
'50 active listings per month',
'90 days listing duration',
'⭐ Featured listings badge',
'⭐ Top marketplace placement',
'Featured on homepage',
'View count tracking',
'Contact info sharing',
'Unlimited product images',
'Edit listings anytime',
'Priority email & phone support',
],
cta: 'Get Professional',
popular: false,
},
]

return (
<div className="min-h-screen">
<Navbar />

<main className="max-w-7xl mx-auto px-4 py-12">
<div className="text-center mb-16">
<h1 className="text-5xl font-bold mb-4">
Simple, <span className="gradient-text">Transparent Pricing</span>
</h1>
<p className="text-xl text-gray-300 max-w-2xl mx-auto">
Choose the plan that fits your agricultural business. No hidden fees, cancel anytime.
</p>
</div>

<div className="grid md:grid-cols-3 gap-8 mb-16">
{plans.map((plan) => (
<div
key={plan.name}
className={`glass-card p-8 flex flex-col relative ${
plan.popular ? 'border-2 border-agri-green' : ''
}`}
>
{plan.popular && (
<div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-agri-green text-black px-6 py-1 rounded-full text-sm font-bold">
MOST POPULAR
</div>
)}

<h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
<p className="text-gray-400 text-sm mb-6">{plan.description}</p>

<div className="mb-6">
<div className="flex items-baseline gap-2">
<span className="text-5xl font-bold gradient-text">R{plan.price}</span>
</div>
<p className="text-gray-400 text-sm mt-1">{plan.period}</p>
</div>

<ul className="space-y-3 mb-8 flex-grow">
{plan.features.map((feature, idx) => (
<li key={idx} className="flex items-start gap-3 text-sm">
<span className="text-agri-green text-lg mt-0.5 flex-shrink-0">✓</span>
<span className="text-gray-300">{feature}</span>
</li>
))}
</ul>

{user ? (
<button
className={`w-full py-3 rounded-lg font-bold transition ${
plan.popular
? 'btn-primary text-white'
: 'glass-card hover:border-agri-green'
}`}
>
{plan.cta}
</button>
) : (
<Link
href="/auth/signup"
className={`block text-center w-full py-3 rounded-lg font-bold transition ${
plan.popular
? 'btn-primary text-white'
: 'glass-card hover:border-agri-green'
}`}
>
Get Started
</Link>
)}
</div>
))}
</div>

<div className="glass-card p-8 mb-16">
<h2 className="text-3xl font-bold text-center mb-8 gradient-text">
Frequently Asked Questions
</h2>

<div className="space-y-6 max-w-4xl mx-auto">
<div className="glass-card p-6">
<h3 className="font-bold text-lg mb-2">How does payment work?</h3>
<p className="text-gray-300">
We accept payments via bank transfer and Yoco payment links. After selecting your plan,
you'll receive payment instructions via email. Your listings go live once payment is confirmed.
</p>
</div>

<div className="glass-card p-6">
<h3 className="font-bold text-lg mb-2">What does "Featured" mean?</h3>
<p className="text-gray-300">
Professional plan listings get a gold ⭐ Featured badge and appear at the top of marketplace
search results, giving you maximum visibility to potential buyers.
</p>
</div>

<div className="glass-card p-6">
<h3 className="font-bold text-lg mb-2">Can I upgrade or downgrade my plan?</h3>
<p className="text-gray-300">
Yes! You can change your plan at any time. Upgrades take effect immediately, while downgrades
apply at the start of your next billing cycle. Unused listings from your current plan roll over.
</p>
</div>

<div className="glass-card p-6">
<h3 className="font-bold text-lg mb-2">What happens when my listings expire?</h3>
<p className="text-gray-300">
When a listing expires, it's automatically removed from the marketplace. You can renew it
anytime from your dashboard by editing and republishing. Monthly subscribers get new listing
credits each month.
</p>
</div>

<div className="glass-card p-6">
<h3 className="font-bold text-lg mb-2">Do you offer refunds?</h3>
<p className="text-gray-300">
We offer a 14-day money-back guarantee on monthly plans. If you're not satisfied, contact
us within 14 days of your first payment for a full refund. Pay-per-listing sales are
non-refundable once published.
</p>
</div>

<div className="glass-card p-6">
<h3 className="font-bold text-lg mb-2">How does support work?</h3>
<p className="text-gray-300">
All users can email support@agritrade.co.za. Starter plan users get priority email responses
within 24 hours. Professional plan users also get phone support during business hours (8am-5pm SAST).
</p>
</div>

<div className="glass-card p-6">
<h3 className="font-bold text-lg mb-2">Can I cancel my subscription?</h3>
<p className="text-gray-300">
Yes, you can cancel anytime from your profile settings. Your listings remain active until
the end of your billing period. No cancellation fees apply.
</p>
</div>
</div>
</div>

<div className="glass-card p-12 text-center">
<h2 className="text-3xl font-bold mb-4">
Ready to grow your agricultural business?
</h2>
<p className="text-gray-300 mb-8 max-w-2xl mx-auto">
Join South African farmers already using AgriTrade to connect with buyers
across all nine provinces. Start selling today!
</p>
{user ? (
<Link
href="/dashboard"
className="btn-primary text-white inline-block px-12 py-4 text-lg"
>
Go to Dashboard
</Link>
) : (
<Link
href="/auth/signup"
className="btn-primary text-white inline-block px-12 py-4 text-lg"
>
Start Free Trial
</Link>
)}
</div>
</main>
</div>
)
}
