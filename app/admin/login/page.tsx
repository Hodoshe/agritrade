'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password === 'Simelane1*') {
      // Set admin session
      sessionStorage.setItem('admin_authenticated', 'true')
      router.push('/admin')
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900">
      <div className="glass-card p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold gradient-text mb-6 text-center">Admin Access</h1>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              className="w-full"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="btn-primary text-white w-full"
          >
            Access Admin Panel
          </button>
        </form>
      </div>
    </div>
  )
}
