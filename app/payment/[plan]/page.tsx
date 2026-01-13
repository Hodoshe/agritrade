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
            <h3 className="text-xl font-bold mb-4">Choose Your Payment Method:</h3>
            
            <div className="space-y-4 text-gray-300">
              <div className="glass-card p-6 border-2 border-agri-green/30">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <span className="text-xl">💳</span> Option 1: Instant Card Payment (Recommended)
                </h4>
                <a 
                  href={plan.yocoLink} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-white inline-block mt-2"
                >
                  Pay R{plan.price} with Card - Instant Activation →
                </a>
                <div className="mt-4 space-y-2 text-sm">
                  <p className="text-agri-green">✓ Secure payment via Yoco</p>
                  <p className="text-agri-green">✓ All major cards accepted</p>
                  <p className="text-agri-green">✓ Get reference number instantly</p>
                  <p className="text-yellow-400 mt-3">
                    ⚠️ After payment, Yoco will display a reference number. Copy it and paste below to activate your plan.
                  </p>
                </div>
              </div>

              <div className="glass-card p-6">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <span className="text-xl">🏦</span> Option 2: Bank Transfer (EFT)
                </h4>
                <div className="space-y-2 text-sm bg-black/30 p-4 rounded-lg">
                  <p><strong className="text-white">Bank:</strong> Standard Bank</p>
                  <p><strong className="text-white">Account Holder:</strong> Miss TS Thwala</p>
                  <p><strong className="text-white">Account Number:</strong> 10 057 317 842</p>
                  <p><strong className="text-white">Account Type:</strong> Savings</p>
                  <p><strong className="text-white">Branch Code:</strong> 053252</p>
                  <p className="text-yellow-400 mt-3">
                    ⚠️ Important: Use your email address as the payment reference
                  </p>
                </div>
                <div className="mt-4 space-y-1 text-sm">
                  <p className="text-gray-400">• Make payment of exactly R{plan.price}</p>
                  <p className="text-gray-400">• Use your email as reference</p>
                  <p className="text-gray-400">• Submit your reference below after payment</p>
                  <p className="text-gray-400">• Allow 1-4 hours for verification</p>
                </div>
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
                placeholder="e.g., YOCO123456789 or your email address"
                required
                className="w-full"
              />
              <div className="mt-2 space-y-1 text-xs text-gray-400">
                <p>• <strong>Card payment:</strong> Copy the reference number from Yoco confirmation page</p>
                <p>• <strong>Bank transfer:</strong> Enter the email address you used as reference</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 text-sm">
              <p className="font-bold mb-2 text-blue-300">📋 What happens next?</p>
              <ul className="space-y-1 text-gray-300">
                <li>1. Complete your payment using one of the methods above</li>
                <li>2. Copy your payment reference/transaction number</li>
                <li>3. Paste it in the form above and click "Submit Reference Code"</li>
                <li>4. We'll verify your payment within 1-4 hours (8am-8pm daily)</li>
                <li>5. Your plan will be activated automatically</li>
                <li>6. You'll receive email confirmation and can start listing immediately</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary text-white flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Reference Code & Activate Plan'}
              </button>
              <Link href="/pricing" className="glass-card px-8 py-3 text-center flex items-center">
                Cancel
              </Link>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-400 mb-2">Need help? Contact us:</p>
            <a href="mailto:support@agritrade.co.za" className="text-agri-green hover:underline">
              support@agritrade.co.za
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
