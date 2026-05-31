export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Received!</h1>
        <p className="text-gray-700 mb-4">
          Your money is secured in TrendSell escrow.
        </p>
        <p className="text-gray-700 mb-4">
          Our Agent will now collect & verify your item from the Supplier.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          You’ll get an SMS when it’s ready for pickup at your Distribution Centre in Bulawayo.
        </p>
        <a 
          href="/" 
          className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
        >
          Continue Shopping
        </a>
      </div>
    </div>
  )
}
