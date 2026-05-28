'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function SubscriptionBanner({ sellerId }: { sellerId: string }) {
  const [seller, setSeller] = useState<any>(null)
  const [listingCount, setListingCount] = useState(0)
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchData = async () => {
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
    }
    fetchData()
  }, [sellerId])

  if (!seller) return null

  const isExpired = new Date(seller.subscription_end_date) < new Date()
  const isUnlimited = seller.product_limit === null || seller.product_limit > 9999
  
  const getPlanName = () => {
    if (isExpired) return 'Expired'
    if (seller.subscription_plan === 'free_trial') return 'Free Trial'
    if (seller.subscription_price === 5) return '$5 Plan'
    if (seller.subscription_price === 10) return '$10 Plan'
    if (seller.subscription_price === 15) return '$15 Unlimited'
    return 'Active Plan'
  }
  
  return (
    <div className={`${isExpired? 'bg-red-50 border-red-400' : 'bg-blue-50 border-blue-400'} border-l-4 p-4 mb-6 rounded`}>
      <div className="flex justify-between items-center">
        <div>
          <p className={`font-bold ${isExpired? 'text-red-700' : 'text-blue-700'}`}>
            {getPlanName()}
          </p>
          <p className="text-sm text-gray-700">
            {listingCount} / {isUnlimited? '∞' : seller.product_limit} products listed
            {!isExpired && ` • Trial ends ${new Date(seller.subscription_end_date).toLocaleDateString()}`}
          </p>
        </div>
        <button 
          onClick={() => router.push('/seller/upgrade')}
          className={`${isExpired? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded text-sm`}
        >
          {isExpired? 'Reactivate' : 'Upgrade Plan'}
        </button>
      </div>
    </div>
  )
}	
