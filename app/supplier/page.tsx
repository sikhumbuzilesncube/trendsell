'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SupplierAuth() {
  const [isSignUp, setIsSignUp] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const [businessName, setBusinessName] = useState('')
  const [website, setWebsite] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [ecocashNumber, setEcocashNumber] = useState('')
  const [tradingHours, setTradingHours] = useState('Mon-Fri: 8AM-5PM')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isSignUp) {
        if (password!== confirmPassword) throw new Error('Passwords do not match')
        if (password.length < 6) throw new Error('Password must be at least 6 characters')

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email, password,
        })
        if (authError) throw authError
        if (!authData.user) throw new Error('Signup failed')

        const { error: supplierError } = await supabase
       .from('suppliers')
       .insert({
            user_id: authData.user.id,
            business_name: businessName,
            website: website,
            phone_number: phoneNumber,
            address: address,
            ecocash_number: ecocashNumber,
            trading_hours: tradingHours,
            status: 'active'
          })
        
        if (supplierError) throw supplierError
        setMessage('Account created! Check your email to verify, then sign in.')
        setIsSignUp(false)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/supplier/dashboard')
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 to-cyan-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-teal-950/50 backdrop-blur rounded-2xl shadow-2xl p-8 border border-teal-800">
        <h1 className="text-3xl font-bold text-white text-center mb-2">Supplier Login</h1>
        <p className="text-teal-200 text-center mb-6">Welcome back</p>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setIsSignUp(true)} className={`flex-1 py-2 rounded-lg font-medium transition ${isSignUp? 'bg-orange-500 text-white' : 'bg-teal-900 text-teal-200'}`}>Sign Up</button>
          <button onClick={() => setIsSignUp(false)} className={`flex-1 py-2 rounded-lg font-medium transition ${!isSignUp? 'bg-orange-500 text-white' : 'bg-teal-900 text-teal-200'}`}>Sign In</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-teal-100 mb-1">Work Email</label>
            <input type="email" placeholder="supplier@company.co.zw" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-teal-900/50 border border-teal-700 rounded-lg px-4 py-3 text-white placeholder-teal-400 focus:ring-2 focus:ring-orange-500" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-teal-100 mb-1">Password</label>
            <div className="relative">
              <input type={showPassword? 'text' : 'password'} placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-teal-900/50 border border-teal-700 rounded-lg px-4 py-3 text-white placeholder-teal-400 focus:ring-2 focus:ring-orange-500" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-teal-300 text-sm">{showPassword? 'Hide' : 'Show'}</button>
            </div>
          </div>

          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-medium text-teal-100 mb-1">Confirm Password</label>
                <input type={showPassword? 'text' : 'password'} placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-teal-900/50 border border-teal-700 rounded-lg px-4 py-3 text-white placeholder-teal-400 focus:ring-2 focus:ring-orange-500" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-100 mb-1">Business Name</label>
                <input type="text" placeholder="ABC Suppliers Ltd" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full bg-teal-900/50 border border-teal-700 rounded-lg px-4 py-3 text-white placeholder-teal-400 focus:ring-2 focus:ring-orange-500" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-100 mb-1">Website (Optional)</label>
                <input type="url" placeholder="https://yourcompany.co.zw" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full bg-teal-900/50 border border-teal-700 rounded-lg px-4 py-3 text-white placeholder-teal-400 focus:ring-2 focus:ring-orange-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-100 mb-1">Phone Number</label>
                <input type="tel" placeholder="0242xxxxxxx" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-teal-900/50 border border-teal-700 rounded-lg px-4 py-3 text-white placeholder-teal-400 focus:ring-2 focus:ring-orange-500" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-100 mb-1">Ecocash Number</label>
                <input type="tel" placeholder="0771234567" value={ecocashNumber} onChange={(e) => setEcocashNumber(e.target.value)} className="w-full bg-teal-900/50 border border-teal-700 rounded-lg px-4 py-3 text-white placeholder-teal-400 focus:ring-2 focus:ring-orange-500" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-100 mb-1">Trading Hours</label>
                <input type="text" placeholder="Mon-Fri: 8AM-5PM" value={tradingHours} onChange={(e) => setTradingHours(e.target.value)} className="w-full bg-teal-900/50 border border-teal-700 rounded-lg px-4 py-3 text-white placeholder-teal-400 focus:ring-2 focus:ring-orange-500" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-100 mb-1">Address</label>
                <input type="text" placeholder="123 Industrial Rd, Harare" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-teal-900/50 border border-teal-700 rounded-lg px-4 py-3 text-white placeholder-teal-400 focus:ring-2 focus:ring-orange-500" required />
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:bg-gray-600 font-semibold transition shadow-lg">
            {loading? 'Loading...' : isSignUp? 'Sign Up' : 'Sign In'}
          </button>

          {message && <div className={`p-3 rounded-lg text-sm text-center ${message.includes('Error')? 'bg-red-900/50 text-red-200 border border-red-700' : 'bg-green-900/50 text-green-200 border border-green-700'}`}>{message}</div>}
        </form>
      </div>
    </div>
  )
}