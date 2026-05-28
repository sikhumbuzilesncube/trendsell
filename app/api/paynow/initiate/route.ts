import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const { orderId, amount, buyerName, buyerPhone, method } = await req.json()

  // TEST MODE: Skip real Paynow, fake success after 5 seconds
  console.log(`TEST PAYMENT: ${method} $${amount} from ${buyerPhone}`)
  
  // Auto-confirm payment after 5 seconds for demo
  setTimeout(async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    await supabase
.from('orders')
.update({ 
        status: 'paid',
        paynow_reference: 'TEST-' + Date.now(),
        paid_at: new Date().toISOString()
      })
.eq('id', orderId)
  }, 5000)

  return NextResponse.json({ 
    success: true, 
    instructions: `TEST MODE: Payment of $${amount} via ${method} will auto-confirm in 5 seconds. Check your phone for ${method} prompt.`
  })
}
