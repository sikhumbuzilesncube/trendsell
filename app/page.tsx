import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#0B3D2E] text-white px-4 py-2 font-bold text-xl">
              TrendSell
            </div>
            <div className="hidden sm:flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              <span>📍</span>
              <span className="font-medium">Bulawayo</span>
            </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-700 hover:text-[#0B3D2E] font-medium">
              Login
            </Link>
            <Link 
              href="/seller/signup"
              className="bg-[#0B3D2E] hover:bg-[#06281E] text-white font-semibold px-5 py-2 rounded-lg transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#F8FAF9] to-white px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 rounded-full px-4 py-2 mb-8 text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Escrow Protected Payments via Paynow
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            The Safest Way to<br />Sell Online in Zimbabwe
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            List your products. We secure the payment, verify delivery, and protect both parties. 
            Powered by Paynow escrow for complete peace of mind.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/seller/signup"
              className="bg-[#FF6B35] hover:bg-[#E85A2B] text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition"
            >
              Start Selling
            </Link>
            <Link 
              href="/supplier/signup"
              className="bg-white border-2 border-gray-300 hover:border-[#0B3D2E] text-gray-900 font-bold py-4 px-8 rounded-lg text-lg transition"
            >
              Become a Supplier
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span> Paynow Verified
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span> Escrow Secured
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span> Agent Delivery
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span> EcoCash Supported
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Professional */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How TrendSell Protects You
            </h2>
            <p className="text-lg text-gray-600">
              Escrow means your money is safe until delivery is confirmed
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0B3D2E] text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">List & Sell</h3>
              <p className="text-gray-600">Upload products. Set your price. Buyers pay via Paynow into secure escrow.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0B3D2E] text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">We Deliver</h3>
              <p className="text-gray-600">Our Bulawayo agents handle pickup and delivery. Buyer confirms receipt.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0B3D2E] text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">You Get Paid</h3>
              <p className="text-gray-600">Funds released from escrow to your EcoCash or bank. Disputes covered.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - PAYNOW COMPLIANCE */}
      <footer className="bg-gray-900 text-gray-300 px-6 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
          
          <div className="md:col-span-2">
            <div className="bg-white text-[#0B3D2E] inline-block px-4 py-2 font-bold text-lg mb-4">
              TrendSell
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Zimbabwe's escrow marketplace. Currently operating in Bulawayo. 
              Expanding city by city.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span>📍</span>
              <span>Active City: <strong className="text-white">Bulawayo</strong></span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/refunds" className="hover:text-white">Refund Policy</Link></li>
              <li><Link href="/escrow" className="hover:text-white">Escrow Terms</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
              <li><Link href="/fees" className="hover:text-white">Fees & Charges</Link></li>
              <li><Link href="/agents" className="hover:text-white">Delivery Agents</Link></li>
              <li><Link href="/cities" className="hover:text-white">Cities We Serve</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li>Email: sikhumbuzilesncube@gmail.com</li>
              <li>Support: Bulawayo, Zimbabwe</li>
              <li className="pt-2 text-xs text-gray-500">
                Payment processing by Paynow
              </li>
            </ul>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>© 2026 TrendSell. All payments held in escrow via Paynow until delivery confirmation. 
          Agent fees applied per delivery. Escrow services compliant with RBZ guidelines.</p>
          <p className="mt-2">Last updated: May 28, 2026</p>
        </div>
      </footer>

    </main>
  )
      }
