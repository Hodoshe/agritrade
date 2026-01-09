'use client'

import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function Pricing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Simple <span className="gradient-text">Pricing</span></h1>
          <p className="text-xl text-gray-300">Choose the plan that works for you</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold mb-2">Pay Per Listing</h3>
            <div className="text-4xl font-bold gradient-text mb-4">R14.99</div>
            <p className="text-gray-300 mb-6">per listing</p>
            <ul className="space-y-2 mb-8 text-sm text-gray-300">
              <li>✓ Single listing</li>
              <li>✓ 30 days active</li>
              <li>✓ Full visibility</li>
            </ul>
            <Link href="/auth/signup" className="btn-primary text-white block text-center py-3">Get Started</Link>
          </div>

          <div className="glass-card p-8 border-2 border-agri-green">
            <h3 className="text-2xl font-bold mb-2">Starter</h3>
            <div className="text-4xl font-bold gradient-text mb-4">R199</div>
            <p className="text-gray-300 mb-6">per month</p>
            <ul className="space-y-2 mb-8 text-sm text-gray-300">
              <li>✓ 10 listings/month</li>
              <li>✓ 60 days active</li>
              <li>✓ Analytics</li>
            </ul>
            <Link href="/auth/signup" className="btn-primary text-white block text-center py-3">Start Free Trial</Link>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold mb-2">Professional</h3>
            <div className="text-4xl font-bold gradient-text mb-4">R499</div>
            <p className="text-gray-300 mb-6">per month</p>
            <ul className="space-y-2 mb-8 text-sm text-gray-300">
              <li>✓ 50 listings/month</li>
              <li>✓ 90 days active</li>
              <li>✓ Featured badge</li>
            </ul>
            <Link href="/auth/signup" className="btn-primary text-white block text-center py-3">Start Free Trial</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
