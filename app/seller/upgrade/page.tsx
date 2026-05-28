'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

// Seller Pro is one-time $10 = 10 products lifetime
const SELLER_PRO = {
  name: 'Seller Pro',
  price: 10,
  limit: 10,
  features: [
    '10 product listings forever',
    'Seller dashboard & analytics', 
    'Access to supplier network',
    'Lifetime status - never expires'
  ]
}

// Monthly plans ADD to your Pro limit
const MONTHLY_PLANS = [
  {
    name: 'Starter',
    price: 5,
    addLimit: 15, // 10 + 15 = 25 total
    features: ['+15 extra products', 'Email support', 'Basic analytics']
  },
  {
    name: 'Growth',
    price: 10,
    addLimit: 40, // 10 + 40 = 50 total
    features: ['+40 extra products', 'Priority support', 'Advanced analytics', 'Bulk import']
  },
  {
    name: 'Pro',
    price: 15,
    addLimit: 9999, // 10 + 9999 = unlimited
    features: ['Unlimited products', '24/7 support', 'Full analytics', 'API access', 'Featured listings']
  }
]

export default function UpgradePage() {
  const [seller, setSeller] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  const sellerId = '655cf7b0-de0f-4ca8-899c-57a00e834fd1'
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchSeller = async () => {
      const { data } = await supabase
.from('sellers')
.select('*')
.eq('id', sellerId)
.single()
      setSeller(data)
      setLoading(false)
    }
    fetchSeller()
  }, [])

  const handleBuySellerPro = async () => {
    const confirmed = confirm('Purchase Seller Pro for $10? This is a one-time payment for lifetime access.')
    if (!confirmed) return
    
    const { error } = await supabase
.from('sellers')
.update({
      is_seller_pro: true,
      pro_product_limit: 10
    })
.eq('id', sellerId)
    
    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('Welcome to Seller Pro! You now have 10 product slots forever.')
      router.refresh()
    }
  }

  const handleUpgradeMonthly = async (plan: typeof MONTHLY_PLANS[0]) => {
    const confirmed = confirm(`Subscribe to ${plan.name} for $${plan.price}/month? This adds +${plan.addLimit} products.`)
    if (!confirmed) return
    
    const { error } = await supabase
.from('sellers')
.update({
      subscription_plan: plan.name.toLowerCase(),
      subscription_price: plan.price,
      product_limit: plan.addLimit,
      subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    })
.eq('id', sellerId)
    
    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert(`Subscribed to ${plan.name}! Your total limit is now ${seller.pro_product_limit + plan.addLimit} products.`)
      router.push('/seller/dashboard')
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  const isPro = seller?.is_seller_pro || false
  const isMonthlyActive = new Date(seller?.subscription_end_date) > new Date()
  const monthlyLimit = isMonthlyActive? seller?.product_limit || 0 : 0
  const totalLimit = seller?.pro_product_limit + monthlyLimit
  const currentMonthlyPrice = seller?.subscription_price || 0

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Upgrade Your Store</h1>
        <p className="text-gray-600">Start with Seller Pro, then scale with monthly plans</p>
      </div>

      {/* SELLER PRO - One Time */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-center">Step 1: Get Seller Pro</h2>
        <div className={`bg-white rounded-lg shadow-lg border-2 p-8 max-w-md mx-auto ${
          isPro? 'border-green-500' : 'border-blue-500'
        }`}>
          {isPro && (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold inline-block mb-4">
              ACTIVATED ✓
            </div>
          )}
          
          <h3 className="text-2xl font-bold mb-2">{SELLER_PRO.name}</h3>
          <div className="mb-4">
            <span className="text-4xl font-bold">${SELLER_PRO.price}</span>
            <span className="text-gray-500"> once</span>
          </div>
          
          <p className="text-2xl font-bold text-blue-600 mb-4">
            {SELLER_PRO.limit} products forever
          </p>
          
          <ul className="space-y-2 mb-6">
            {SELLER_PRO.features.map((feature) => (
              <li key={feature} className="text-sm text-gray-600 flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={handleBuySellerPro}
            disabled={isPro}
            className={`w-full py-3 rounded font-semibold text-lg ${
              isPro
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isPro? 'Seller Pro Activated' : 'Buy Seller Pro - $10'}
          </button>
        </div>
      </div>

      {/* MONTHLY PLANS */}
      <div className={!isPro? 'opacity-50 pointer-events-none' : ''}>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Step 2: Monthly Plans {!isPro && '(Unlock with Seller Pro)'}
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Current total limit: <span className="font-bold">{totalLimit} products</span>
          {isPro && (
            <span className="text-sm block">
              {seller.pro_product_limit} from Pro + {monthlyLimit} from monthly
            </span>
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MONTHLY_PLANS.map((plan) => {
            const isCurrent = plan.price === currentMonthlyPrice && isMonthlyActive
            const isPopular = plan.price === 10
            const totalWithPlan = seller.pro_product_limit + plan.addLimit
            
            return (
              <div 
                key={plan.name}
                className={`bg-white rounded-lg shadow border-2 p-6 relative ${
                  isCurrent? 'border-blue-500' : isPopular? 'border-green-500' : 'border-gray-200'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    POPULAR
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    ACTIVE
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                
                <div className="mb-6">
                  <p className="text-lg font-bold text-blue-600 mb-1">
                    +{plan.addLimit} products
                  </p>
                  <p className="text-sm text-gray-500">
                    = {plan.addLimit > 9998? '∞' : totalWithPlan} total
                  </p>
                  <ul className="space-y-2 mt-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="text-sm text-gray-600 flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleUpgradeMonthly(plan)}
                  disabled={!isPro || isCurrent}
                  className={`w-full py-3 rounded font-semibold ${
                  !isPro || isCurrent
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {!isPro? 'Buy Pro First' : isCurrent? 'Current Plan' : 'Subscribe'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
