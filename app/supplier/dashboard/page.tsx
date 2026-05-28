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
  min_seller_price: number
  stock_qty: number
  images: string[] | null
  status: string | null
  created_at: string
}

const CATEGORIES = [
  'Electronics', 'Fashion & Clothing', 'Home & Garden', 'Health & Beauty',
  'Sports & Outdoors', 'Toys & Games', 'Food & Beverages', 
  'Books & Stationery', 'Automotive', 'Other'
]

export default function SupplierDashboard() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Electronics')
  const [wholesalePrice, setWholesalePrice] = useState('')
  const [rrp, setRrp] = useState('')
  const [stockQty, setStockQty] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [markup, setMarkup] = useState(25)
  const router = useRouter()

  useEffect(() => {
    if (wholesalePrice && markup) {
      const wholesale = parseFloat(wholesalePrice)
      const calculatedRRP = wholesale * (1 + markup / 100)
      setRrp(calculatedRRP.toFixed(2))
    }
  }, [wholesalePrice, markup])

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/supplier'); return }

    const { data: supplier } = await supabase
    .from('suppliers').select('id').eq('user_id', user.id).single()

    if (!supplier) {
      setMessage('Error: Supplier profile not found.')
      return
    }

    const { data } = await supabase
  .from('products').select('*').eq('supplier_id', supplier.id)
  .order('created_at', { ascending: false })

    if (data) setProducts(data)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setImages(files)
      setImagePreviews(files.map(file => URL.createObjectURL(file)))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('You must be logged in')

      const { data: supplier } = await supabase
     .from('suppliers').select('id').eq('user_id', user.id).single()

      if (!supplier) throw new Error('Supplier profile not found')

      let imageUrls: string[] = []
      for (const image of images) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}-${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
      .from('product-images').upload(fileName, image)
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage
      .from('product-images').getPublicUrl(fileName)
        imageUrls.push(publicUrl)
      }

      const { error } = await supabase.from('products').insert({
          name, description, category,
          wholesale_price: parseFloat(wholesalePrice),
          rrp: parseFloat(rrp),
          min_seller_price: parseFloat(wholesalePrice),
          stock_qty: parseInt(stockQty),
          images: imageUrls,
          supplier_id: supplier.id,
          status: 'active', active: true
        })

      if (error) throw error
      setMessage('Product listed successfully!')
      setName(''); setDescription(''); setCategory('Electronics')
      setWholesalePrice(''); setRrp(''); setStockQty('')
      setImages([]); setImagePreviews([]); setMarkup(25)
      fetchProducts()
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally { setLoading(false) }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/supplier')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Supplier Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">Logout</button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">List New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input type="text" placeholder="iPhone 15 Pro" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" required>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wholesale Price ($)</label>
                <input type="number" step="0.01" placeholder="100.00" value={wholesalePrice} onChange={(e) => setWholesalePrice(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Markup %</label>
                <div className="flex gap-2 items-center">
                  <input type="range" min="20" max="30" value={markup} onChange={(e) => setMarkup(Number(e.target.value))} className="flex-1" />
                  <span className="w-12 text-center font-semibold text-blue-600">{markup}%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RRP - Auto Calculated ($)</label>
                <input type="number" step="0.01" value={rrp} readOnly className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-green-50 font-semibold text-green-700" />
                <p className="text-xs text-gray-500 mt-1">${wholesalePrice || 0} × {markup}% = ${rrp || 0}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <input type="number" placeholder="50" value={stockQty} onChange={(e) => setStockQty(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea placeholder="Product details..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500" rows={3} />
            </div>
            {imagePreviews.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {imagePreviews.map((preview, idx) => <img key={idx} src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border-2 border-blue-200" />)}
              </div>
            )}
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition shadow-md">
              {loading? 'Listing...' : 'List Product'}
            </button>
            {message && <div className={`p-3 rounded-lg text-sm ${message.includes('Error')? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>{message}</div>}
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Products</h2>
          {products.length === 0? <p className="text-gray-500 text-center py-8">No products listed yet</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  {product.images && product.images[0] && <img src={product.images[0]} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />}
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">{product.category}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">Wholesale: <span className="font-semibold">${product.wholesale_price}</span></p>
                    <p className="text-sm text-gray-600">RRP: <span className="font-semibold text-green-600">${product.rrp}</span></p>
                    <p className="text-sm text-gray-600">Stock: <span className="font-semibold">{product.stock_qty}</span></p>
                  </div>
                  <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full ${product.status === 'active'? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{product.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}