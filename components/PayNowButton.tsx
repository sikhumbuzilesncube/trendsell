'use client'
import { useState } from 'react'

type PayNowProps = {
  orderId: string
  amount: number
  buyerEmail: string
  productName: string
}

export default function PayNowButton({ orderId, amount, buyerEmail, productName }: PayNowProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePayNow = async () => {
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/paynow/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount: amount.toFixed(2),
          email: buyerEmail,
          description: `TrendSell: ${productName}`
        })
      })
      
      const data = await res.json()
      
      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl // → Paynow EcoCash screen
      } else {
        setError(data.error || 'Could not start payment')
      }
    } catch (err) {
      setError('Network error. Check connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <button
        onClick={handlePayNow}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg disabled:bg-gray-400 transition"
      >
        {loading ? 'Connecting to Paynow...' : `Pay Now $${amount.toFixed(2)} USD`}
      </button>
      {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
      <p className="text-xs text-gray-500 mt-2 text-center">
        Secure payment via EcoCash, InnBucks, VISA
      </p>
    </div>
  )
                              }
