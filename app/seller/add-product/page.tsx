'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function AddProductPage() {
  const [seller, setSeller] = useState<any>(null)
  const [listingCount, setListingCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const router = useRouter()
  
  const sellerId = '655cf7b0-de0f-4ca8-899c-57a00e834fd1'
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const checkAccess = async () => {
      const { data: sellerData } = await supabase
 .from('sellers')
 .select('*')
 .eq('id', sellerId)
 .single()
      
      const { count } = await supabase
 .from('seller_listings')
 .select('*', { count: 'exact', head: true })
 .eq('seller_id', sellerId)
 .eq('status', 'active')
      
      setSeller(sellerData)
      setListingCount(count || 0)
      setLoading(false)
    }
    checkAccess()
  }, [])

  const getAccessStatus = () => {
    if (!seller) return { canAdd: false, reason: 'loading' }
    
    // PATH 2: Seller Pro - always has lifetime 10 slots
    if (seller.seller_type === 'pro') {
      const isMonthlyActive = new Date(seller.subscription_end_date) > new Date()
      const monthlyLimit = isMonthlyActive ? seller.product_limit : 0
      const totalLimit = seller.pro_product_limit + monthlyLimit
      const isUnlimited = totalLimit > 9998
      const limitReached = !isUnlimited && listingCount >= totalLimit
      
      return {
        canAdd: !limitReached,
        reason: limitReached ? 'limit_reached_pro' : 'pro_active',
        totalLimit,
        proLimit: seller.pro_product_limit,
        monthlyLimit,
        isUnlimited
      }
    }
    
    // PATH 1: Trial Seller
    const trialEndDate = new Date(seller.trial_end_date)
    const isTrialActive = trialEndDate > new Date()
    const isMonthlyActive = new Date(seller.subscription_end_date) > new Date()
    
    // Trial still active
    if (isTrialActive) {
      const limitReached = listingCount >= 10
      return {
        canAdd: !limitReached,
        reason: limitReached ? 'trial_limit_reached' : 'trial_active',
        totalLimit: 10,
        daysLeft: Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      }
    }
    
    // Trial expired but has monthly subscription
    if (isMonthlyActive) {
      const isUnlimited = seller.product_limit > 9998
      const limitReached = !isUnlimited && listingCount >= seller.product_limit
      return {
        canAdd: !limitReached,
        reason: limitReached ? 'monthly_limit_reached' : 'monthly_active',
        totalLimit: seller.product_limit,
        isUnlimited
      }
    }
    
    // Trial expired and no subscription
    return {
      canAdd: false,
      reason: 'trial_expired',
      totalLimit: 0
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const status = getAccessStatus()
    
    if (!status.canAdd) {
      if (status.reason === 'trial_expired') {
        alert('Your 14-day trial expired. Subscribe to a monthly plan to continue listing.')
      } else {
        alert(`You've reached your limit of ${status.totalLimit} products. Upgrade to add more.`)
      }
      router.push('/seller/upgrade')
      return
    }
    
    const { error } = await supabase
.from('seller_listings')
.insert({
      seller_id: sellerId,
      title: title,
      seller_price: parseFloat(price),
      status: 'active'
    })
    
    if (error) {
      alert('Error adding product: ' + error.message)
    } else {
      alert('Product added!')
      router.push('/seller/dashboard')
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  const status = getAccessStatus()

  // BLOCKED: Trial expired, no subscription
  if (status.reason === 'trial_expired') {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <div className="bg-red-50 border-2 border-red-400 rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-4">⏰ Trial Expired</h1>
          <p className="text-lg text-gray-700 mb-6">
            Your 14-day free trial ended. Subscribe to continue listing products.
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => router.push('/seller/upgrade')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold"
            >
              View Monthly Plans - $5/mo
            </button>
            <button 
              onClick={() => router.push('/seller/upgrade')}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-bold"
            >
              Or Get Seller Pro - $10 Once
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        {seller.seller_type === 'pro' && (
          <span className="ml-3 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
            Seller Pro ✓
          </span>
        )}
        {status.reason === 'trial_active' && (
          <span className="ml-3 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            Free Trial: {status.daysLeft} days left
          </span>
        )}
      </div>
      
      {/* Status Banners */}
      {status.reason === 'trial_active' && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded">
          <p className="font-bold text-green-700">Free Trial Active</p>
          <p className="text-sm">{status.daysLeft} days remaining. {listingCount} / 10 products used.</p>
        </div>
      )}

      {seller.seller_type === 'pro' && !status.isUnlimited && (
        <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6 rounded">
          <p className="font-bold text-purple-700">Seller Pro Active</p>
          <p className="text-sm">
            {listingCount} / {status.totalLimit} products used 
            ({status.proLimit} lifetime + {status.monthlyLimit} monthly)
          </p>
        </div>
      )}
      
      {status.reason === 'trial_limit_reached' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
          <p className="font-bold text-yellow-700">Trial Limit Reached</p>
          <p className="text-sm">You've used all 10 free products. Subscribe to add more.</p>
        </div>
      )}

      {status.reason === 'limit_reached_pro' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
          <p className="font-bold text-yellow-700">Product Limit Reached</p>
          <p className="text-sm">Upgrade your monthly plan to add more products.</p>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded mb-6">
        <p className="text-sm text-gray-700">
          Usage: <span className="font-bold">{listingCount} / {status.isUnlimited? '∞' : status.totalLimit}</span> products
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Product Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!status.canAdd}
            className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
            placeholder="e.g. Handmade Leather Wallet"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Price ($)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={!status.canAdd}
            className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
            placeholder="29.99"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!status.canAdd}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
        >
          {!status.canAdd? 'Limit Reached - Upgrade' : 'Add Product'}
        </button>
      </form>
    </div>
  )
}
