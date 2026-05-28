'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Login() {
  const [email, setEmail] = useState('sikhumbuzilesncube@gmail.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const login = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else window.location.href = '/agent'
    setLoading(false)
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Agent Login</h1>
      <input 
        type="email" 
        value={email} 
        onChange={e => setEmail(e.target.value)}
        className="w-full border p-2 mb-3 rounded" 
        placeholder="Email" 
      />
      <input 
        type="password" 
        value={password} 
        onChange={e => setPassword(e.target.value)}
        className="w-full border p-2 mb-3 rounded" 
        placeholder="Password" 
      />
      <button 
        onClick={login} 
        disabled={loading}
        className="w-full bg-black text-white p-2 rounded hover:bg-gray-800"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  )
}
