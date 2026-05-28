'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SellerDashboard() {
  const [seller, setSeller] = useState<any>(null)
  const [myListings, setMyListings] = useState<any[]>([])
  const [supplierProducts, setSupplierProducts] = useState<any[]>([])
  const [resellProducts, setResellProducts] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'browse' | 'my-products' | 'my-store'>('browse')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  const sellerId = '655cf7b0-de0f-4ca8-899c-57a00e834fd1'
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const categories = ['all', 'Fashion', 'Electronics', 'Home & Garden', 'Beauty', 'Sports', 'Toys']

  useEffect(() => {
    const fetchData = async () => {
      const { data: sellerData } = await supabase.from('sellers').select('*').eq('id', sellerId).single()
      
      if (sellerData?.seller_type === 'pro') {
        router.push('/seller/pro')
        return
      }
      
      const { data: listingsData } = await supabase
       .from('seller_listings')
       .select('*')
       .eq('seller_id', sellerId)
       .eq('is_own_product', true)
       .eq('status', 'active')
      
      const { data: supplierData } = await supabase
       .from('products')
       .select('*')
       .eq('is_supplier_product', true)
       .limit(30)
      
      const { data: resellData } = await supabase
       .from('seller_listings')
       .select('*, products(*)')
       .eq('seller_id', sellerId)
       .eq('is_own_product', false)
       .eq('status', 'active')
      
      setSeller(sellerData)
      setMyListings(listingsData || [])
      setSupplierProducts(supplierData || [])
      setResellProducts(resellData || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    )
  }

  const isTrialActive = new Date(seller?.trial_end_date) > new Date()
  const isMonthlyActive = new Date(seller?.subscription_end_date) > new Date()
  const daysLeftInTrial = seller?.trial_end_date? Math.ceil((new Date(seller.trial_end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0
  const productLimit = seller?.product_limit || 10
  const isUnlimited = productLimit === 999999
  const hasHitLimit =!isUnlimited && resellProducts.length >= productLimit
  const slotsRemaining = isUnlimited? 999999 : productLimit - resellProducts.length
  const isTrialExpired =!isTrialActive && new Date(seller?.trial_end_date) < new Date()

  const filteredSupplierProducts = selectedCategory === 'all' 
   ? supplierProducts 
    : supplierProducts.filter(p => p.category === selectedCategory)

  const handleAddToStore = async (productId: string, wholesalePrice: number) => {
    // CHECK PRODUCT LIMIT - Trial gets 10, paid plans get their limit
    if (!isUnlimited && resellProducts.length >= productLimit) {
      alert(`You've reached your limit of ${productLimit} products. ${isTrialExpired? 'Your trial has expired.' : ''} Upgrade your plan to add more.`)
      router.push('/seller/subscribe')
      return
    }
    
    const sellingPrice = Math.ceil(wholesalePrice * 1.3)
    const { error } = await supabase.from('seller_listings').insert({
      seller_id: sellerId,
      product_id: productId,
      seller_price: sellingPrice,
      is_own_product: false,
      status: 'active'
    })
    
    if (!error) {
      window.location.reload()
    } else {
      alert('Failed to add product: ' + error.message)
    }
  }

  const handleRemoveFromStore = async (listingId: string) => {
    const { error } = await supabase
     .from('seller_listings')
     .delete()
     .eq('id', listingId)
    if (!error) window.location.reload()
  }

  const handleShare = (platform: string, productName: string, price: number) => {
    const text = `Check out ${productName} - Only $${price}!`
    const url = window.location.origin + `/store/${sellerId}`
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`)
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
    }
  }

  // TRIAL EXPIRED BLOCK - Only shows if trial ended AND no paid subscription
  if (isTrialExpired &&!isMonthlyActive) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-4xl">⏰</span>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Trial Expired</h1>
                <p className="text-gray-600 mb-2">
                  Your free trial allowed 10 products. You have {resellProducts.length} products in your store.
                </p>
                <p className="text-gray-600 mb-6">
                  Subscribe to keep selling and add more products, or upgrade to Pro to list your own.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/seller/subscribe" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition shadow-sm text-center">
                    Subscribe $5/month - 25 Products
                  </Link>
                  <Link href="/seller/upgrade" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition shadow-sm text-center">
                    Seller Pro $10 Lifetime
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {isTrialActive? 'Free Trial' : 'Seller Dashboard'}
                </h1>
                {isTrialActive && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    {daysLeftInTrial} DAYS LEFT
                  </span>
                )}
              </div>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-gray-900">{resellProducts.length}</span>
                <span className="text-gray-500">
                  / {isUnlimited? '∞' : productLimit} products in your store
                </span>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-900">
                  <strong className="font-semibold">💡 How it works:</strong> Resell supplier products for profit. 
                  {isTrialActive && ` Trial: 10 products max. `}
                  Want to list your own products? <Link href="/seller/upgrade" className="underline font-semibold">Upgrade to Seller Pro</Link> for $10 lifetime.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-56">
              <button 
                onClick={() => setActiveTab('my-store')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition text-center shadow-sm hover:shadow"
              >
                My Store ({resellProducts.length}{!isUnlimited && `/${productLimit}`})
              </button>
              <Link 
                href="/seller/subscribe"
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold transition text-center shadow-sm hover:shadow"
              >
                <div className="text-xs opacity-80 mb-0.5">Upgrade plan</div>
                View Plans
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('browse')}
                className={`flex-1 sm:flex-none px-6 py-4 font-semibold text-sm transition relative whitespace-nowrap ${
                  activeTab === 'browse'
                   ? 'text-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Browse Products
                <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {supplierProducts.length}
                </span>
                {activeTab === 'browse' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('my-store')}
                className={`flex-1 sm:flex-none px-6 py-4 font-semibold text-sm transition relative whitespace-nowrap ${
                  activeTab === 'my-store'
                   ? 'text-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Store
                <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {resellProducts.length}{!isUnlimited && `/${productLimit}`}
                </span>
                {activeTab === 'my-store' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('my-products')}
                className={`flex-1 sm:flex-none px-6 py-4 font-semibold text-sm transition relative whitespace-nowrap ${
                  activeTab === 'my-products'
                   ? 'text-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List My Products
                <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {myListings.length}
                </span>
                {activeTab === 'my-products' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            </div>
          </div>

          {activeTab === 'browse' && (
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Pick products and set your selling price</h2>
                <p className="text-sm text-gray-500">You earn the difference between your price and supplier cost</p>
              </div>

              {hasHitLimit && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-orange-900">
                    <strong>⚠️ Limit reached:</strong> You've used {resellProducts.length}/{productLimit} product slots. 
                    <Link href="/seller/subscribe" className="underline font-semibold ml-1">Upgrade to add more</Link>
                  </p>
                </div>
              )}

              {!hasHitLimit &&!isUnlimited && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6">
                  <p className="text-sm text-blue-900">
                    <strong>Slots remaining:</strong> {slotsRemaining} of {productLimit} products
                  </p>
                </div>
              )}

              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                      selectedCategory === cat
                       ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat === 'all'? 'All Categories' : cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSupplierProducts.map((product) => {
                  const isListed = resellProducts.some(rp => rp.product_id === product.id)
                  const cost = product.wholesale_price || product.price || 0
                  const suggested = product.rrp || Math.ceil(cost * 1.29)
                  
                  return (
                    <div key={product.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        {product?.images?.[0]? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-5xl opacity-40">📦</span>
                          </div>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2 truncate">{product.name}</h4>
                      
                      <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Your Cost:</span>
                          <span className="font-semibold text-gray-900">${cost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Suggested RRP:</span>
                          <span className="font-semibold text-green-600">${suggested.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Stock:</span>
                          <span className="font-semibold text-gray-900">{product.stock_qty || 0}</span>
                        </div>
                      </div>

                      {isListed? (
                        <button className="w-full bg-green-100 text-green-700 px-3 py-2.5 rounded-lg text-sm font-semibold cursor-default">
                          ✓ Listed in Your Store
                        </button>
                      ) : hasHitLimit? (
                        <button 
                          onClick={() => router.push('/seller/subscribe')}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-3 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm"
                        >
                          Upgrade to Add More
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleAddToStore(product.id, cost)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm"
                        >
                          Add to My Store
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'my-store' && (
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Your Storefront</h2>
                  <p className="text-sm text-gray-500">
                    Products you're currently reselling. {isUnlimited? 'Unlimited slots' : `${resellProducts.length}/${productLimit} slots used`}.
                  </p>
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(window.location.origin + `/store/${sellerId}`)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Copy Store Link
                </button>
              </div>

              {resellProducts.length === 0? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🛍️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Your store is empty</h3>
                  <p className="text-gray-500 mb-6">Browse products and add them to your store to start selling</p>
                  <button 
                    onClick={() => setActiveTab('browse')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {resellProducts.map((listing) => {
                    const product = listing.products
                    const cost = product?.wholesale_price || product?.price || 0
                    const profit = listing.seller_price - cost
                    const profitPercent = listing.seller_price > 0? ((profit / listing.seller_price) * 100).toFixed(1) : 0
                    
                    return (
                      <div key={listing.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all">
                        <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                          {product?.images?.[0]? (
                            <img src={product.images[0]} alt={product?.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-5xl opacity-40">📦</span>
                            </div>
                          )}
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 truncate">{product?.name || 'Unnamed Product'}</h4>
                        
                        <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Your Cost:</span>
                            <span className="font-semibold text-gray-900">${cost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 font-semibold">Your Price:</span>
                            <span className="font-bold text-purple-600">${listing.seller_price.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Your Profit:</span>
                            <span className="font-semibold text-green-600">+${profit.toFixed(2)} ({profitPercent}%)</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleShare('whatsapp', product?.name || 'Product', listing.seller_price)}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-3 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm mb-2"
                        >
                          📱 Share with Image
                        </button>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleShare('whatsapp', product?.name || 'Product', listing.seller_price)}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium"
                          >
                            WhatsApp
                          </button>
                          <button 
                            onClick={() => handleShare('facebook', product?.name || 'Product', listing.seller_price)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-medium"
                          >
                            Facebook
                          </button>
                          <button 
                            onClick={() => handleShare('twitter', product?.name || 'Product', listing.seller_price)}
                            className="flex-1 bg-black hover:bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-medium"
                          >
                            X/Twitter
                          </button>
                          <button 
                            onClick={() => handleRemoveFromStore(listing.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-xs font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'my-products' && (
            <div className="p-6">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">👑</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Seller Pro Feature</h3>
                    <p className="text-sm text-gray-700 mb-4">
                      List your own products alongside supplier items. Pay $10 once and keep 10 product slots forever.
                    </p>
                    <Link 
                      href="/seller/upgrade"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition inline-block"
                    >
                      Upgrade to Seller Pro $10
                    </Link>
                  </div>
                </div>
              </div>

              {myListings.length > 0? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {myListings.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all">
                      <div className="aspect-square bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg mb-3 flex items-center justify-center">
                        <span className="text-5xl opacity-40">📦</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1 truncate">{product.title}</h4>
                      <p className="text-2xl font-bold text-purple-600 mb-3">${product.seller_price}</p>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition">
                          Edit
                        </button>
                        <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Upgrade to Pro to start listing your own products</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
