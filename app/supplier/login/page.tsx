'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SupplierLogin() {
  const [activeTab, setActiveTab] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isResetMode, setIsResetMode] = useState(false)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(`Error: ${error.message}`)
      setLoading(false)
    } else {
      router.push('/supplier/dashboard')
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Check your email to confirm your account!')
    }
    setLoading(false)
  }

  const handleResetPassword = async () => {
    if (!email) {
      setMessage('Please enter your email first')
      return
    }
    
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/supplier/reset-password`,
    })
    
    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Password reset link sent! Check your email.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-teal-950 flex items-center justify-center p-6">
      <div className="bg-teal-900/40 p-8 rounded-lg border border-teal-800 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Supplier Login
        </h1>
        <p className="text-teal-300 text-center mb-6">
          {isResetMode ? 'Reset your password' : 'Welcome back'}
        </p>

        {!isResetMode && (
          <div className="flex mb-6 bg-teal-900/60 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2 rounded-md ${activeTab === 'signup' ? 'bg-orange-500 text-white' : 'text-teal-200'}`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-2 rounded-md ${activeTab === 'signin' ? 'bg-orange-500 text-white' : 'text-teal-200'}`}
            >
              Sign In
            </button>
          </div>
        )}

        <form onSubmit={isResetMode ? (e) => { e.preventDefault(); handleResetPassword(); } : activeTab === 'signin' ? handleSignIn : handleSignUp}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-white">
              Email Address
            </label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-teal-800 border border-teal-700 rounded p-3 text-white"
              placeholder="you@example.com"
            />
          </div>

          {!isResetMode && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-white">
                Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-teal-800 border border-teal-700 rounded p-3 text-white pr-16"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-teal-300 text-sm"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded disabled:opacity-50"
          >
            {loading ? 'Loading...' : isResetMode ? 'Send Reset Link' : activeTab === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {activeTab === 'signin' && (
          <button
            type="button"
            onClick={() => {
              setIsResetMode(!isResetMode)
              setMessage('')
            }}
            className="text-sm text-orange-400 hover:underline mt-4 block mx-auto"
          >
            {isResetMode ? 'Back to Sign In' : 'Forgot Password?'}
          </button>
        )}

        {message && (
          <p className={`mt-4 text-sm text-center ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

      

    
    

    




        

            

       

