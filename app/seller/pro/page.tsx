'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SellerProDashboard() {
  const [seller, setSeller] = useState<any>(null)
  const [listingCount, setListingCount] = useState(0)
  const router = useRouter()
  
  const sellerId = '655cf7b0-de0f-4ca8-899c-57a00e834fd1'
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('sellers').select('*').eq('id', sellerId).single()
      
      if (data?.seller_type !== 'pro') {
        router.push('/seller/upgrade') // Not Pro? Buy it
        return
      }
      
      const { count } = await supabase
 .from('seller_listings')
 .select('*', { count: 'exact', head: true })
 .eq('seller_id', sellerId)
 .eq('status', 'active')
      
      setSeller(data)
      setListingCount(count || 0)
    }
    fetchData()
  }, [])

  if (!seller) return <div className="p-6">Loading...</div>

  const isMonthlyActive = new Date(seller.subscription_end_date) > new Date()
  const monthlyLimit = isMonthlyActive ? seller.product_limit : 0
  const totalLimit = seller.pro_product_limit + monthlyLimit
  const isUnlimited = totalLimit > 9998

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8 mb-6">
        <h1 className="text-4xl font-bold mb-2">Seller Pro Dashboard</h1>
        <p className="text-lg">LIFETIME ✓ + Exclusive Features</p>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Your Pro Benefits</h2>
        <p className="text-gray-700 mb-2">
          {listingCount} / {isUnlimited ? '∞' : totalLimit} products used
        </p>
        <p className="text-sm text-gray-500">
          {seller.pro_product_limit} lifetime slots + {monthlyLimit} from monthly plan
        </p>
        
        <div className="flex gap-3 mt-4">
          <Link href="/seller/add-product" className="bg-purple-500 text-white px-6 py-3 rounded font-semibold">
            Add Product
          </Link>
          <Link href="/seller/upgrade" className="bg-white border-2 border-purple-500 text-purple-500 px-6 py-3 rounded font-semibold">
            Add Monthly Plan
          </Link>
        </div>
      </div>
    </div>
  )
}
