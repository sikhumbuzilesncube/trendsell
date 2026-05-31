import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// This runs every time Paynow sends you a payment update
export async function POST(req: NextRequest) {
  try {
    // 1. Get the raw text Paynow sent
    const body = await req.text()
    const params = new URLSearchParams(body)
    
    // 2. SECURITY CHECK: Verify this really came from Paynow
    const paynowKey = process.env.PAYNOW_INTEGRATION_KEY!
    const paynowHash = params.get('hash')
    params.delete('hash') // Paynow rule: remove hash before checking
    
    // Paynow rule: Sort all fields A-Z, join with &, add your key
    const fields = Array.from(params.keys()).sort()
    const stringToHash = fields.map(key => `${key}=${params.get(key)}`).join('&') + paynowKey
    const calculatedHash = crypto.createHash('sha512').update(stringToHash).digest('hex').toUpperCase()
    
    if (calculatedHash !== paynowHash) {
      console.log('Paynow IPN: HASH FAILED. Blocked fake payment.')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // 3. Extract the payment info
    const status = params.get('status')           // Paid | Cancelled | Failed
    const orderId = params.get('reference')       // Your TrendSell order ID
    const amount = params.get('amount')           // "25.00"
    const paynowRef = params.get('paynowreference') // Paynow’s transaction ID

    // 4. If payment succeeded, do your business logic
    if (status === 'Paid') {
      console.log(`PAYMENT OK: Order ${orderId} | $${amount} | Paynow: ${paynowRef}`)
      
      // PLACEHOLDER: We’ll add Supabase code here next
      // 1. Update order in DB: status = 'paid_escrow'
      // 2. SMS Agent: "Go collect Order #${orderId}"
      // 3. Email Buyer: "Payment received"
      
    } else {
      console.log(`Payment ${status} for order ${orderId}`)
    }

    // 5. CRITICAL: Always reply 200 OK or Paynow keeps retrying
    return new NextResponse('OK', { status: 200 })
    
  } catch (error) {
    console.error('IPN Error:', error)
    return new NextResponse('Error', { status: 500 })
  }
}

// Paynow pings this with GET to check if your URL works
export async function GET() {
  return NextResponse.json({ 
    status: 'TrendSell IPN is live',
    integration_id: process.env.PAYNOW_INTEGRATION_ID 
  })
  }
