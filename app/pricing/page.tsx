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
      name: 'Pay Per Listing',
      price: '14.99',
      period: 'per listing',
      features: [
        'Single product listing',
        'Active for 30 days',
        'Full marketplace visibility',
        'Contact details visible to buyers',
        'Basic support',
      ],
      cta: 'List a Product',
      highlighted: false,
    },
    {
      name: 'Starter',
      price: '199',
      period: 'per month',
      listings: '10 listings/month',
      features: [
        '10 active listings per month',
        'Priority marketplace placement',
        'Extended listing duration (60 days)',
        'Analytics & view tracking',
        'Email support',
        'Edit listings anytime',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Professional',
      price: '499',
      period: 'per month',
      listings: '50 listings/month',
      features: [
        '50 active listings per month',
        'Featured listings badge',
        'Extended listing duration (90 days)',
        'Advanced analytics dashboard',
        'Priority email & phone support',
        'Promotional tools',
        'Featured on homepage',
      ],
      cta: 'Start Free Trial',
      highlighted: false,
    },
    {
      name: 'Enterprise',
      price: '999',
      period: 'per month',
      listings: 'Unlimited listings',
      features: [
        'Unlimited active listings',
        'Premium featured placement',
        'Listings never expire',
        'Dedicated account manager',
        '24/7 priority support',
        'Custom branding options',
        'API access',
        'Monthly performance reports',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the plan that works best for your agricultural business.
            All plans include access to our full marketplace.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass-card p-8 flex flex-col ${
                plan.highlighted ? 'border-2 border-agri-green relative' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-agri-green text-black px-4 py-1 rounded-full text-sm font-bold">
                  POPULAR
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold gradient-text">R{plan.price}</span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>
                {plan.listings && (
                  <div className="text-sm text-agri-green mt-2">{plan.listings}</div>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-agri-green mt-1">✓</span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {user ? (
                <button className={`w-full py-3 rounded-lg font-bold transition ${
                  plan.highlighted
                    ? 'btn-primary text-white'
                    : 'glass-card hover:border-agri-green'
                }`}>
                  {plan.cta}
                </button>
              ) : (
                <Link
                  href="/auth/signup"
                  className={`block text-center w-full py-3 rounded-lg font-bold transition ${
                    plan.highlighted
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

        {/* FAQ Section */}
        <div className="glass-card p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 gradient-text">
            Frequently Asked Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-2">How does payment work?</h3>
              <p className="text-gray-300 text-sm">
                We'll be integrating Yoco payment links soon. For now, contact us directly
                to activate your subscription.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Can I change plans?</h3>
              <p className="text-gray-300 text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes take
                effect on your next billing cycle.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">What happens when I run out of listings?</h3>
              <p className="text-gray-300 text-sm">
                You can either upgrade to a higher plan or purchase individual listings
                at R14.99 each.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Is there a free trial?</h3>
              <p className="text-gray-300 text-sm">
                Yes! Monthly plans come with a 7-day free trial. No credit card required
                to start.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Do listings expire?</h3>
              <p className="text-gray-300 text-sm">
                Yes, listings expire based on your plan. Pay-per-listing: 30 days,
                Starter: 60 days, Professional: 90 days, Enterprise: never.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Can I get a refund?</h3>
              <p className="text-gray-300 text-sm">
                We offer a 30-day money-back guarantee on all monthly subscriptions.
                No questions asked.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass-card p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to grow your agricultural business?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of South African farmers already using AgriTrade to connect
            with buyers across all nine provinces.
          </p>
          {user ? (
            <Link href="/dashboard" className="btn-primary text-white inline-block px-12 py-4 text-lg">
              Go to Dashboard
            </Link>
          ) : (
            <Link href="/auth/signup" className="btn-primary text-white inline-block px-12 py-4 text-lg">
              Start Free Trial
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}
