'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Supabase handles the token from the email link automatically
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMessage('You can now set your new password')
      }
    })
  }, [])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      setMessage(`Error: ${error.message}`)
      setLoading(false)
    } else {
      setMessage('Password updated! Redirecting to login...')
      setTimeout(() => router.push('/seller'), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-teal-950 flex items-center justify-center p-6">
      <div className="bg-teal-900/40 p-8 rounded-lg border border-teal-800 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Set New Password
        </h1>
        
        <form onSubmit={handleUpdatePassword}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-white">
              New Password
            </label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-teal-800 border border-teal-700 rounded p-3 text-white"
              placeholder="Min 6 characters"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-white">
              Confirm Password
            </label>
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-teal-800 border border-teal-700 rounded p-3 text-white"
              placeholder="Re-enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-sm text-center ${message.includes('Error') || message.includes('not match') ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
