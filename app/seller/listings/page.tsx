'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type SellerListing = {
  id: string
  seller_price: number
  markup_amount: number
  product: {
    id: string
    name: string
    description: string | null
    wholesale_price: number
    images: string[] | null
  }
}

export default function SellerListings() {
  const [listings, setListings] = useState<SellerListing[]>([])
  const [sellerId, setSellerId] = useState<string>('')
  const [storeName, setStoreName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => { loadListings() }, [])

  const loadListings = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/seller')

    const { data: seller } = await supabase
.from('sellers').select('id, store_name').eq('user_id', user.id).single()

    if (!seller) {
      setMessage('Seller profile not found')
      setLoading(false)
      return
    }

    setSellerId(seller.id)
    setStoreName(seller.store_name)

    const { data, error } = await supabase
.from('seller_listings')
.select(`
        id,
        seller_price,
        markup_amount,
        product:products(id, name, description, wholesale_price, images)
      `)
.eq('seller_id', seller.id)

    if (error) setMessage(`Error: ${error.message}`)
    else setListings(data as any || [])
    setLoading(false)
  }

  const handleNativeShare = async (listing: SellerListing) => {
    const storeUrl = `${window.location.origin}/store/${sellerId}`
    const shareData = {
      title: `${listing.product.name} - $${listing.seller_price.toFixed(2)}`,
      text: `Check out ${listing.product.name} for $${listing.seller_price.toFixed(2)} at ${storeName}!`,
      url: storeUrl
    }

    try {
      // Try to fetch image and share with it
      if (listing.product.images?.[0] && navigator.canShare) {
        const response = await fetch(listing.product.images[0])
        const blob = await response.blob()
        const file = new File([blob], 'product.jpg', { type: blob.type })
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({...shareData, files: [file] })
          return
        }
      }
      // Fallback to text-only share
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Desktop fallback - copy link
        navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
        setMessage('Link copied to clipboard!')
        setTimeout(() => setMessage(''), 2000)
      }
    } catch (err) {
      console.log('Share cancelled or failed')
    }
  }

  const handleShare = (listing: SellerListing, platform: 'whatsapp' | 'facebook' | 'twitter' | 'tiktok') => {
    const storeUrl = `${window.location.origin}/store/${sellerId}`
    const text = `Check out ${listing.product.name} for $${listing.seller_price.toFixed(2)} at ${storeName}!`
    
    let url = ''
    if (platform === 'whatsapp') {
      url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + storeUrl)}`
    } else if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storeUrl)}&quote=${encodeURIComponent(text)}`
    } else if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(storeUrl)}`
    } else if (platform === 'tiktok') {
      // TikTok doesn't have direct web share - copy text for user to paste
      navigator.clipboard.writeText(`${text} ${storeUrl}`)
      setMessage('Copied! Paste this in TikTok')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    window.open(url, '_blank')
  }

  const copyLink = () => {
    const storeUrl = `${window.location.origin}/store/${sellerId}`
    navigator.clipboard.writeText(storeUrl)
    setMessage('Store link copied!')
    setTimeout(() => setMessage(''), 2000)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Store</h1>
            <p className="text-gray-600">Products you can resell</p>
          </div>
          <button onClick={copyLink} className="bg-gray-600 text-white px-4 py-2 rounded-lg">Copy Store Link</button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          💡 You can only resell products from approved suppliers. Want to list your own products? <span className="font-semibold">Upgrade to Seller Pro</span>
        </div>

        {message && <div className="mb-4 p-3 rounded-lg text-sm bg-green-50 text-green-700">{message}</div>}

        {listings.length === 0? (
          <div className="bg-white rounded-xl p-12 text-center shadow-md">
            <p className="text-gray-500 mb-4">You haven't added any products yet</p>
            <button onClick={() => router.push('/seller/browse')} className="bg-purple-600 text-white px-6 py-3 rounded-lg">Browse Supplier Products</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {listing.product.images?.[0] && (
                  <img src={listing.product.images[0]} alt={listing.product.name} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{listing.product.name}</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Cost:</span>
                      <span>${listing.product.wholesale_price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-1">
                      <span>Your Price:</span>
                      <span className="text-purple-600">${listing.seller_price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Profit:</span>
                      <span className="font-bold text-green-600">
                        +${listing.markup_amount.toFixed(2)} ({((listing.markup_amount/listing.seller_price)*100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleNativeShare(listing)} 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium mb-2 hover:opacity-90"
                  >
                    📱 Share with Image
                  </button>

                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium">Or share to:</p>
                    <div className="grid grid-cols-4 gap-2">
                      <button 
                        onClick={() => handleShare(listing, 'whatsapp')} 
                        className="bg-green-500 text-white py-2 rounded-lg text-xs hover:bg-green-600"
                      >
                        WhatsApp
                      </button>
                      <button 
                        onClick={() => handleShare(listing, 'facebook')} 
                        className="bg-blue-600 text-white py-2 rounded-lg text-xs hover:bg-blue-700"
                      >
                        Facebook
                      </button>
                      <button 
                        onClick={() => handleShare(listing, 'twitter')} 
                        className="bg-black text-white py-2 rounded-lg text-xs hover:bg-gray-800"
                      >
                        X/Twitter
                      </button>
                      <button 
                        onClick={() => handleShare(listing, 'tiktok')} 
                        className="bg-gradient-to-r from-cyan-400 to-pink-500 text-white py-2 rounded-lg text-xs hover:opacity-90"
                      >
                        TikTok
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}