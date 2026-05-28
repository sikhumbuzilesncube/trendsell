'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SellerAuth() {
  const [isSignUp, setIsSignUp] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const [firstName, setFirstName] = useState('')
  const [surname, setSurname] = useState('')
  const [storeName, setStoreName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [ecocashNumber, setEcocashNumber] = useState('')

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

        const { error: sellerError } = await supabase
       .from('sellers')
       .insert({
            user_id: authData.user.id,
            first_name: firstName,
            surname: surname,
            store_name: storeName,
            phone_number: phoneNumber,
            address: address,
            ecocash_number: ecocashNumber,
          })
        
        if (sellerError) throw sellerError
        setMessage('Account created! Check email to verify, then sign in.')
        setIsSignUp(false)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/seller/browse')
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-teal-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-emerald-950/50 backdrop-blur rounded-2xl shadow-2xl p-8 border border-emerald-800">
        <h1 className="text-3xl font-bold text-white text-center mb-2">Seller Login</h1>
        <p className="text-emerald-200 text-center mb-6">Resell products for profit</p>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setIsSignUp(true)} className={`flex-1 py-2 rounded-lg font-medium ${isSignUp? 'bg-orange-500 text-white' : 'bg-emerald-900 text-emerald-200'}`}>Sign Up</button>
          <button onClick={() => setIsSignUp(false)} className={`flex-1 py-2 rounded-lg font-medium ${!isSignUp? 'bg-orange-500 text-white' : 'bg-emerald-900 text-emerald-200'}`}>Sign In</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-emerald-900/50 border border-emerald-700 rounded-lg px-4 py-3 text-white placeholder-emerald-400" required />
          
          <div className="relative">
            <input type={showPassword? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-emerald-900/50 border border-emerald-700 rounded-lg px-4 py-3 text-white placeholder-emerald-400" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-emerald-300 text-sm">{showPassword? 'Hide' : 'Show'}</button>
          </div>

          {isSignUp && (
            <>
              <input type={showPassword? 'text' : 'password'} placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-emerald-900/50 border border-emerald-700 rounded-lg px-4 py-3 text-white placeholder-emerald-400" required />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-emerald-900/50 border border-emerald-700 rounded-lg px-4 py-3 text-white placeholder-emerald-400" required />
                <input type="text" placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} className="w-full bg-emerald-900/50 border border-emerald-700 rounded-lg px-4 py-3 text-white placeholder-emerald-400" required />
              </div>
              <input type="text" placeholder="Store Name" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full bg-emerald-900/50 border border-emerald-700 rounded-lg px-4 py-3 text-white placeholder-emerald-400" required />
              <input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-emerald-900/50 border border-emerald-700 rounded-lg px-4 py-3 text-white placeholder-emerald-400" required />
              <input type="tel" placeholder="Ecocash Number" value={ecocashNumber} onChange={(e) => setEcocashNumber(e.target.value)} className="w-full bg-emerald-900/50 border border-emerald-700 rounded-lg px-4 py-3 text-white placeholder-emerald-400" required />
              <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-emerald-900/50 border border-emerald-700 rounded-lg px-4 py-3 text-white placeholder-emerald-400" required />
            </>
          )}

          <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:bg-gray-600 font-semibold">
            {loading? 'Loading...' : isSignUp? 'Sign Up' : 'Sign In'}
          </button>

          {message && <div className={`p-3 rounded-lg text-sm text-center ${message.includes('Error')? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>{message}</div>}
        </form>
      </div>
    </div>
  )
}