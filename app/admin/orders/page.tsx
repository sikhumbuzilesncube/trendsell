'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Check } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setOrders(data || [])
  }

  const markPaid = async (orderId: string) => {
    const res = await fetch('/api/test-mark-paid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId })
    })
    const data = await res.json()
    if (data.success) {
      alert(`Paid! ${data.pickupCode? 'Pickup Code: ' + data.pickupCode : 'Delivery order'}`)
      fetchOrders()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6">Admin - Orders</h1>
      <div className="space-y-3">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold">#{order.id.slice(0,8)}</p>
                <p className="text-sm">${order.total} | {order.delivery_option} | {order.payment_status}</p>
                {order.pickup_code && <p className="text-sm">Code: {order.pickup_code}</p>}
              </div>
              {order.payment_status!== 'paid' && (
                <button 
                  onClick={() => markPaid(order.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Mark Paid - Cash
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
