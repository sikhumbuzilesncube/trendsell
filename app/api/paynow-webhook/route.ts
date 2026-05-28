import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Important: service role for server
)

function generatePickupCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function verifyPaynowHash(payload: any, hash: string) {
  const integrationKey = process.env.PAYNOW_INTEGRATION_KEY!
  const values = []
  for (const key in payload) {
    if (key!== 'hash') values.push(payload[key])
  }
  values.push(integrationKey)
  const stringToHash = values.join('')
  const calculatedHash = crypto.createHash('sha512').update(stringToHash).digest('hex').toUpperCase()
  return calculatedHash === hash
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData()
    const payload: any = {}
    body.forEach((value, key) => { payload[key] = value.toString() })

    // 1. Verify PayNow signature
    if (!verifyPaynowHash(payload, payload.hash)) {
      return NextResponse.json({ error: 'Invalid hash' }, { status: 400 })
    }

    // 2. Check payment success
    if (payload.status!== 'Paid') {
      return NextResponse.json({ message: 'Payment not completed' })
    }

    const orderId = payload.reference // You send this when creating payment
    
    // 3. Get order details
    const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*, order_items(*, products(supplier_id, cost_price))')
    .eq('id', orderId)
    .single()

    if (orderError ||!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.payment_status === 'paid') {
      return NextResponse.json({ message: 'Already processed' })
    }

    // 4. Calculate escrow split
    const subtotal = order.subtotal
    const supplierCost = order.order_items.reduce((sum: number, item: any) => 
      sum + (item.products.cost_price * item.quantity), 0
    )
    const platformFee = subtotal * 0.08
    const deliveryFee = order.delivery_fee || 0
    const sellerProfit = subtotal - supplierCost - platformFee - deliveryFee
    const pickupCode = order.delivery_option === 'pickup'? generatePickupCode() : null

    // 5. Update order to paid + store split
    const { error: updateError } = await supabase
    .from('orders')
    .update({
        payment_status: 'paid',
        status: 'paid',
        supplier_cost: supplierCost,
        platform_fee: platformFee,
        seller_profit: sellerProfit,
        pickup_code: pickupCode,
        paid_at: new Date().toISOString()
      })
    .eq('id', orderId)

    if (updateError) throw updateError

    // 6. Create collection job for each supplier in order
    const supplierIds = [...new Set(order.order_items.map((i: any) => i.products.supplier_id))]
    
    for (const supplierId of supplierIds) {
      const { error: jobError } = await supabase
      .from('collection_jobs')
      .insert({
          order_id: orderId,
          supplier_id: supplierId,
          status: 'pending'
        })
      if (jobError) console.error('Collection job error:', jobError)
    }

    // 7. TODO: Send SMS to buyer with pickup code or delivery confirmation
    // 8. TODO: Send WhatsApp to agent: "New collection job"

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
