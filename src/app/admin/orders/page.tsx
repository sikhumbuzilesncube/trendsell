'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchOrders() {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  async function handleRefund(orderId: string, amount: number) {
    const res = await fetch('/api/refund', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, amount })
    })
    const data = await res.json()
    if (data.success) {
      alert('Refund successful!')
      fetchOrders()
    } else {
      alert('Refund failed: ' + data.error)
    }
  }

  if (loading) return <div className="p-8">Loading orders...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Order ID</th>
            <th className="p-2 text-left">Amount</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="p-2">{order.id.slice(0, 8)}...</td>
              <td className="p-2">${order.amount}</td>
              <td className="p-2">{order.status}</td>
              <td className="p-2">
                {order.status !== 'refunded' && (
                  <button 
                    onClick={() => handleRefund(order.id, order.amount)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Refund
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
