import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const { orderId, amount, email, description } = await req.json()
  
  const id = process.env.PAYNOW_INTEGRATION_ID!
  const key = process.env.PAYNOW_INTEGRATION_KEY!
  
  const paymentData = {
    id: id,
    reference: orderId,
    amount: amount,
    additionalinfo: description || 'TrendSell Order',
    returnurl: 'https://trendsell.vercel.app/payment/success',
    resulturl: 'https://trendsell.vercel.app/api/paynow/ipn',
    authemail: email,
    status: 'Message'
  }
  
  const values = `${paymentData.id}${paymentData.reference}${paymentData.amount}${paymentData.additionalinfo}${paymentData.returnurl}${paymentData.resulturl}${paymentData.authemail}${paymentData.status}`
  const hash = crypto.createHash('sha512').update(values + key).digest('hex').toUpperCase()
  
  const body = new URLSearchParams({ ...paymentData, hash })
  
  const res = await fetch('https://www.paynow.co.zw/interface/initiatetransaction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  })
  
  const text = await res.text()
  const params = new URLSearchParams(text)
  
  if (params.get('status') === 'Ok') {
    return NextResponse.json({ 
      success: true,
      redirectUrl: params.get('browserurl')
    })
  } else {
    return NextResponse.json({ 
      success: false, 
      error: params.get('error') || 'Paynow failed' 
    }, { status: 400 })
  }
}
