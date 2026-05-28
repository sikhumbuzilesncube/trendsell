import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function generatePickupCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  const { orderId } = await request.json()

  const { data: order } = await supabase
  .from('orders')
  .select('*, order_items(*, products(supplier_id, cost_price))')
  .eq('id', orderId)
  .single()

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  const supplierCost = order.order_items.reduce((sum: number, item: any) => 
    sum + (item.products.cost_price * item.quantity), 0
  )
  const platformFee = order.subtotal * 0.08
  const sellerProfit = order.subtotal - supplierCost - platformFee - order.delivery_fee
  const pickupCode = order.delivery_option === 'pickup'? generatePickupCode() : null

  await supabase.from('orders').update({
    payment_status: 'paid',
    status: 'paid',
    supplier_cost: supplierCost,
    platform_fee: platformFee,
    seller_profit: sellerProfit,
    pickup_code: pickupCode,
    paid_at: new Date().toISOString()
  }).eq('id', orderId)

  const supplierIds = [...new Set(order.order_items.map((i: any) => i.products.supplier_id))]
  for (const supplierId of supplierIds) {
    await supabase.from('collection_jobs').insert({
      order_id: orderId,
      supplier_id: supplierId,
      status: 'pending'
    })
  }

  return NextResponse.json({ success: true, pickupCode })
}
