import PayNowButton from '@/components/PayNowButton'

export default function CheckoutPage() {
  // Test order data - change this later to real cart data
  const testOrder = {
    id: `TS-TEST-${Date.now()}`,
    amount: 1.00, // $1 test so you don't waste money
    buyerEmail: 'test@trendsell.co.zw', // Replace with your email
    productName: 'TrendSell Test Product - Bulawayo Pickup'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Order</h1>
        
        <div className="border-b pb-4 mb-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-mono text-sm">{testOrder.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Product:</span>
            <span className="font-semibold text-right">{testOrder.productName}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2">
            <span>Total:</span>
            <span>${testOrder.amount.toFixed(2)} USD</span>
          </div>
        </div>

        <PayNowButton 
          orderId={testOrder.id}
          amount={testOrder.amount}
          buyerEmail={testOrder.buyerEmail}
          productName={testOrder.productName}
        />

        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-xs text-yellow-800 text-center">
            <strong>Test Mode:</strong> This is a $1 test payment to verify your Paynow integration works.
          </p>
        </div>
      </div>
    </div>
  )
              }
