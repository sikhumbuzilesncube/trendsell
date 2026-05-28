'use client'
import { useCartStore } from '../cart-store'
import { ShoppingCart, X, Plus, Minus, Trash2, Info, MapPin, Truck } from 'lucide-react'
import { useState } from 'react'

const COLLECTION_CENTRES = {
  bulawayo: {
    name: 'Trendsell Centre - Bulawayo',
    address: '1 Basil Place, 10th Ave between S.Pariranyatwa and J. Tongogara Street, Bulawayo',
    city: 'Bulawayo',
    hours: 'Mon-Sat 8am-6pm'
  }
  // Add 'harare': {...} later when you expand
}

export default function StoreClient({ seller, products }: any) {
  const { items, addItem, removeItem, updateQuantity, toggleCart, isOpen, total, clearCart } = useCartStore()
  const [checkingOut, setCheckingOut] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [deliveryOption, setDeliveryOption] = useState<'delivery' | 'pickup'>('delivery')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')

  // Bulawayo only for now
  const activeCentre = COLLECTION_CENTRES.bulawayo
  const deliveryFee = deliveryOption === 'delivery' ? 1.50 : 0
  const subtotal = total()
  const platformFee = subtotal * 0.08
  const grandTotal = subtotal + platformFee + deliveryFee

  const handleCheckout = async () => {
    if (deliveryOption === 'delivery' && !deliveryAddress) {
      alert('Please enter your delivery address in Bulawayo')
      return
    }
    if (!buyerPhone) {
      alert('Please enter your phone number')
      return
    }

    setCheckingOut(true)
    
    // TODO: Send to your API route to create order + PayNow payment
    const orderData = {
      items,
      delivery_option: deliveryOption,
      delivery_fee: deliveryFee,
      platform_fee: platformFee,
      subtotal,
      total: grandTotal,
      buyer_phone: buyerPhone,
      delivery_address: deliveryOption === 'delivery' ? deliveryAddress : activeCentre.address,
      collection_centre: 'bulawayo'
    }

    console.log('Order data:', orderData)
    
    // Placeholder for PayNow redirect
    alert(`Redirecting to PayNow to pay $${grandTotal.toFixed(2)}\n\nMerchant: Trendsell\n\n${deliveryOption === 'pickup' ? `Collect at: ${activeCentre.address}` : `Deliver to: ${deliveryAddress}`}`)
    
    setCheckingOut(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - same as before */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {seller.store_name?.[0] || seller.business_name?.[0] || 'S'}
                </span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {seller.store_name || seller.business_name || 'Store'}
                </h1>
                <p className="text-xs text-gray-500">{products.length} products</p>
              </div>
            </div>
            
            <button 
              onClick={toggleCart}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {items.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Products - same as before with description + stock */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((listing: any) => {
            const product = listing.products
            return (
              <div key={listing.id} className="group">
                <button 
                  onClick={() => setSelectedProduct(listing)}
                  className="w-full text-left"
                >
                  <div className="bg-gray-50 rounded-xl overflow-hidden mb-3 aspect-[4/5] relative">
                    {product?.images?.[0]? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition">
                      <Info className="w-4 h-4 text-gray-700" />
                    </div>
                  </div>
                </button>
                
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                  {product?.name || 'Product'}
                </h3>
                
                {product?.description && (
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2 min-h-[2.5rem]">
                    {product.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xl font-bold text-gray-900">
                    ${listing.seller_price.toFixed(2)}
                  </p>
                  {product?.stock_qty > 10? (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      {product.stock_qty} in stock
                    </span>
                  ) : product?.stock_qty > 0? (
                    <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                      Only {product.stock_qty} left
                    </span>
                  ) : (
                    <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                      Out of stock
                    </span>
                  )}
                </div>

                <button 
                  onClick={() => addItem({
                    id: listing.id,
                    product_id: product.id,
                    name: product.name,
                    price: listing.seller_price,
                    image: product.images?.[0] || null
                  })}
                  disabled={product?.stock_qty === 0}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg font-medium transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {product?.stock_qty === 0? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            )
          })}
        </div>
      </main>

      {/* Product Detail Modal - same as before */}
      {selectedProduct && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setSelectedProduct(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="aspect-[4/3] bg-gray-100">
                  {selectedProduct.products?.images?.[0]? (
                    <img 
                      src={selectedProduct.products.images[0]} 
                      alt={selectedProduct.products.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 bg-gray-200 rounded-xl" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedProduct.products?.name}
                </h2>
                <p className="text-3xl font-bold text-gray-900 mb-4">
                  ${selectedProduct.seller_price.toFixed(2)}
                </p>
                
                {selectedProduct.products?.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedProduct.products.description}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm text-gray-500">Stock:</span>
                  {selectedProduct.products?.stock_qty > 10? (
                    <span className="text-sm text-green-600 font-medium">
                      {selectedProduct.products.stock_qty} units available
                    </span>
                  ) : selectedProduct.products?.stock_qty > 0? (
                    <span className="text-sm text-orange-600 font-medium">
                      Only {selectedProduct.products.stock_qty} left in stock
                    </span>
                  ) : (
                    <span className="text-sm text-red-600 font-medium">Out of stock</span>
                  )}
                </div>

                <button 
                  onClick={() => {
                    addItem({
                      id: selectedProduct.id,
                      product_id: selectedProduct.products.id,
                      name: selectedProduct.products.name,
                      price: selectedProduct.seller_price,
                      image: selectedProduct.products.images?.[0] || null
                    })
                    setSelectedProduct(null)
                    toggleCart()
                  }}
                  disabled={selectedProduct.products?.stock_qty === 0}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {selectedProduct.products?.stock_qty === 0? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cart Drawer with Delivery Options */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={toggleCart} />
          <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">Shopping Cart</h2>
              <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {items.length === 0? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Your cart is empty
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                        <p className="text-gray-900 font-bold mb-2">${item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-1 hover:bg-red-50 rounded ml-auto"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t p-6 space-y-4">
                  {/* Buyer Details */}
                  <input
                    type="tel"
                    placeholder="Phone number (e.g. 0771234567)"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />

                  {/* Delivery Options */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Delivery Option</h3>
                    <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input 
                        type="radio" 
                        checked={deliveryOption === 'delivery'}
                        onChange={() => setDeliveryOption('delivery')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          <p className="font-medium text-sm">Deliver to me</p>
                        </div>
                        <p className="text-xs text-gray-500">1-2 days in Bulawayo +$1.50</p>
                        {deliveryOption === 'delivery' && (
                          <input
                            type="text"
                            placeholder="Street address, suburb"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm mt-2"
                          />
                        )}
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input 
                        type="radio" 
                        checked={deliveryOption === 'pickup'}
                        onChange={() => setDeliveryOption('pickup')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <p className="font-medium text-sm">Collect at Centre</p>
                        </div>
                        <p className="text-xs text-gray-500">Ready in 4hrs. Free</p>
                        {deliveryOption === 'pickup' && (
                          <p className="text-xs text-gray-600 mt-1">
                            {activeCentre.address}<br/>
                            {activeCentre.hours}
                          </p>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 text-sm border-t pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform fee 8%</span>
                      <span>${platformFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    disabled={checkingOut || !buyerPhone}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkingOut? 'Processing...' : `Pay $${grandTotal.toFixed(2)} with PayNow`}
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    Secure payment via Trendsell • PayNow Protected
                  </p>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
