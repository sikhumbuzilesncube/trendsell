'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Product = {
  id: string
  name: string
  description: string | null
  category: string
  wholesale_price: number
  rrp: number
  stock_qty: number
  images: string[] | null
}

export default function SellerBrowse() {
  const [products, setProducts] = useState<Product[]>([])
  const [sellerId, setSellerId] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [sellerPrice, setSellerPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [listedIds, setListedIds] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => { init() }, [])

  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/seller')

    let { data: seller } = await supabase
   .from('sellers').select('id').eq('user_id', user.id).single()

    if (!seller) {
      setMessage('Complete your seller profile first')
      return setTimeout(() => router.push('/seller'), 2000)
    }

    setSellerId(seller.id)
    
    // Get products - NO supplier info
    const { data: productData } = await supabase
   .from('products')
   .select('id, name, description, category, wholesale_price, rrp, stock_qty, images')
   .eq('status', 'active').gt('stock_qty', 0)

    // Get already listed
    const { data: listingData } = await supabase
   .from('seller_listings')
   .select('product_id')
   .eq('seller_id', seller.id)

    if (productData) setProducts(productData)
    if (listingData) setListedIds(new Set(listingData.map(l => l.product_id)))
  }

  const profit = selectedProduct && sellerPrice 
   ? parseFloat(sellerPrice) - selectedProduct.wholesale_price 
    : 0

  const margin = selectedProduct && sellerPrice && parseFloat(sellerPrice) > 0
   ? ((profit / parseFloat(sellerPrice)) * 100).toFixed(1)
    : 0

  const handleResell = async () => {
    if (!selectedProduct ||!sellerPrice ||!sellerId) return
    const price = parseFloat(sellerPrice)
    if (price <= selectedProduct.wholesale_price) {
      return setMessage('Error: Price must be above wholesale cost')
    }

    setLoading(true)
    const { error } = await supabase.from('seller_listings').insert({
      seller_id: sellerId,
      product_id: selectedProduct.id,
      seller_price: price,
      markup_amount: profit
    })

    if (error) setMessage(`Error: ${error.message}`)
    else {
      setMessage('Added to your store!')
      setSelectedProduct(null)
      setSellerPrice('')
      init()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Browse Products</h1>
            <p className="text-gray-600">Pick products and set your selling price</p>
          </div>
          <button onClick={() => router.push('/seller/listings')} className="bg-purple-600 text-white px-4 py-2 rounded-lg">
            My Store ({listedIds.size})
          </button>
        </div>

        {message && <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes('Error')? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{message}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-48 object-cover" />}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{p.name}</h3>
                <div className="space-y-1 mb-4 text-sm bg-gray-50 p-3 rounded">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Your Cost:</span>
                    <span className="font-semibold">${p.wholesale_price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Suggested RRP:</span>
                    <span className="font-semibold text-green-600">${p.rrp.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className="font-semibold">{p.stock_qty}</span>
                  </div>
                </div>
                {listedIds.has(p.id)? (
                  <div className="bg-green-100 text-green-800 py-2 rounded-lg text-center text-sm font-medium">Listed in Your Store</div>
                ) : (
                  <button onClick={() => setSelectedProduct(p)} className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-medium">
                    Resell This
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedProduct(null)}>
            <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-4">Set Your Selling Price</h2>
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="font-semibold">{selectedProduct.name}</p>
                <p className="text-sm text-gray-600">Cost: ${selectedProduct.wholesale_price.toFixed(2)}</p>
              </div>
              <input
                type="number"
                step="0.01"
                min={selectedProduct.wholesale_price + 0.01}
                placeholder={`Min: $${(selectedProduct.wholesale_price + 0.01).toFixed(2)}`}
                value={sellerPrice}
                onChange={(e) => setSellerPrice(e.target.value)}
                className="w-full border-2 border-purple-300 rounded-lg px-4 py-3 text-lg font-semibold mb-3"
                autoFocus
              />
              {parseFloat(sellerPrice) > selectedProduct.wholesale_price && (
                <div className="mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 font-medium mb-2">💰 You Will Make Per Sale:</p>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">${profit.toFixed(2)}</p>
                    <p className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full inline-block mt-1">{margin}% margin</p>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setSelectedProduct(null)} className="flex-1 bg-gray-200 py-3 rounded-lg">Cancel</button>
                <button onClick={handleResell} disabled={loading || profit <= 0} className="flex-1 bg-purple-600 text-white py-3 rounded-lg disabled:bg-gray-400">
                  {loading? 'Adding...' : 'Add to Store'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}