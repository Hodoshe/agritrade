'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function AdminPayments() {
  const router = useRouter()
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const isAuth = sessionStorage.getItem('admin_authenticated') === 'true'
    if (!isAuth) {
      router.push('/admin/login')
      return
    }
    setAuthenticated(true)
    loadPayments()
  }

  const loadPayments = async () => {
    try {
      const res = await fetch('/api/admin/payments')
      const data = await res.json()
      
      if (data.payments) {
        setPayments(data.payments)
      }
    } catch (error) {
      console.error('Error loading payments:', error)
    }
    setLoading(false)
  }

  const handlePayment = async (action: string, requestId: string, userId: string, plan: string) => {
    if (action === 'approve' && !confirm('Approve this payment?')) return
    if (action === 'reject' && !confirm('Reject this payment?')) return

    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, requestId, userId, plan })
      })

      if (res.ok) {
        alert(action === 'approve' ? 'Payment approved!' : 'Payment rejected')
        loadPayments()
      }
    } catch (error) {
      alert('Error processing payment')
    }
  }

  const logout = () => {
    sessionStorage.removeItem('admin_authenticated')
    router.push('/admin/login')
  }

  if (!authenticated) return null

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-2xl gradient-text">Loading...</div></div>

  const pending = payments.filter(p => p.status === 'pending')
  const processed = payments.filter(p => p.status !== 'pending')

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="glass-card p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold gradient-text">💳 Payment Requests</h1>
              <p className="text-gray-300">Verify and approve user payments</p>
            </div>
            <div className="flex gap-4">
              <Link href="/admin" className="glass-card px-6 py-3">👥 Users</Link>
              <button onClick={logout} className="glass-card px-6 py-3 hover:border-red-500">🔓 Logout</button>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Pending ({pending.length})</h2>
          {pending.length === 0 ? (
            <p className="text-gray-400">No pending payments</p>
          ) : (
            <div className="space-y-4">
              {pending.map(p => (
                <div key={p.id} className="glass-card p-6 border-2 border-yellow-500/30">
                  <div className="grid md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="font-bold">{p.user_name}</p>
                      <p className="text-sm text-gray-400">{p.user_email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Plan</p>
                      <p className="font-bold capitalize">{p.plan.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Amount</p>
                      <p className="font-bold text-agri-green">R{p.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Reference</p>
                      <p className="font-bold break-all">{p.reference_code}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handlePayment('approve', p.id, p.user_id, p.plan)} className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded font-bold">✓ Approve</button>
                      <button onClick={() => handlePayment('reject', p.id, p.user_id, p.plan)} className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded">✕ Reject</button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{new Date(p.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-6">Processed ({processed.length})</h2>
          {processed.map(p => (
            <div key={p.id} className="glass-card p-4 mb-2 flex justify-between">
              <div>
                <span className="font-bold">{p.user_name}</span> • {p.plan.replace('-', ' ')} • R{p.amount}
              </div>
              <span className={`px-3 py-1 rounded text-xs ${p.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{p.status.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
