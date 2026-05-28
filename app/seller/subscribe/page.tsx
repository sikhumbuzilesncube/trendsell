'use client'
import Link from 'next/link'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function SubscribePage() {
  const [loading, setLoading] = useState<string | null>(null)
  const sellerId = '655cf7b0-de0f-4ca8-899c-57a00e834fd1'
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const plans = [
    {
      name: 'Starter',
      price: 5,
      products: 25,
      type: 'monthly_5',
      popular: false,
      features: [
        'Resell up to 25 supplier products',
        'Keep all profit margins',
        'Share to WhatsApp/Facebook/X',
        'Your own storefront link',
        'Email support'
      ]
    },
    {
      name: 'Growth',
      price: 10,
      products: 50,
      type: 'monthly_10',
      popular: true,
      features: [
        'Resell up to 50 supplier products',
        'Keep all profit margins',
        'Share to WhatsApp/Facebook/X',
        'Your own storefront link',
        'Priority email support'
      ]
    },
    {
      name: 'Unlimited',
      price: 15,
      products: 999999,
      type: 'monthly_15',
      popular: false,
      features: [
        'Unlimited supplier products',
        'Keep all profit margins',
        'Share to WhatsApp/Facebook/X',
        'Your own storefront link',
        'Priority support + WhatsApp'
      ]
    }
  ]

  const handleSubscribe = async (planType: string, productLimit: number) => {
    setLoading(planType)
    
    // TODO: Replace this with real PayPal/Stripe payment
    // For now, this simulates successful payment
    const confirmPayment = confirm(`Confirm subscription to ${planType}? This will update your product limit.`)
    
    if (confirmPayment) {
      const { error } = await supabase.from('sellers').update({
        subscription_type: planType,
        product_limit: productLimit,
        subscription_end_date: new Date(Date.now() + 30*24*60*60*1000).toISOString()
      }).eq('id', sellerId)
      
      if (!error) {
        alert('Subscription successful! Your product limit has been updated.')
        window.location.href = '/seller/dashboard'
      } else {
        alert('Error: ' + error.message)
      }
    }
    setLoading(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <Link href="/seller/dashboard" className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h1>
          <p className="text-gray-600">Upgrade anytime. Cancel anytime. No contracts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`bg-white rounded-2xl shadow-lg border-2 p-8 relative ${
                plan.popular? 'border-blue-500 md:scale-105' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                  MOST POPULAR
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {plan.products === 999999? 'Unlimited products' : `Up to ${plan.products} products`}
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleSubscribe(plan.type, plan.products)}
                disabled={loading === plan.type}
                className={`w-full px-6 py-3 rounded-xl font-semibold transition shadow-sm ${
                  plan.popular 
                   ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-800 hover:bg-gray-900 text-white'
                } disabled:opacity-50`}
              >
                {loading === plan.type? 'Processing...' : `Subscribe $${plan.price}/mo`}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
          <p className="text-gray-700 mb-4">
            Want to list your own products too?
          </p>
          <Link 
            href="/seller/upgrade"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition shadow-sm inline-block"
          >
            Upgrade to Seller Pro $10 Lifetime →
          </Link>
        </div>
      </div>
    </div>
  )
}
