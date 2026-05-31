import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Buy & Sell Safely in Bulawayo
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Pay with EcoCash. We hold your money until you collect your item. 
            Zero scams. 100% escrow protection.
          </p>
          
          {/* Join Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/buyer/signup"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition"
            >
              🛍️ Join as Buyer
            </Link>
            <Link 
              href="/supplier/signup"
              className="bg-white hover:bg-gray-100 text-blue-700 font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition"
            >
              🏪 Join as Supplier
            </Link>
          </div>
          
          <p className="text-sm mt-6 text-blue-200">
            ✅ EcoCash • ✅ InnBucks • ✅ Agent Verified
          </p>
        </div>
      </section>
    </main>
  )
}
