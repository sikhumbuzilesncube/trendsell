import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B3D2E] text-white">
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex justify-between items-center">
          <div className="bg-black px-3 py-1 text-xl font-bold rounded">
            TrendSell
          </div>
          <div>🇿🇼 Zimbabwe</div>
        </header>

        <div className="text-center py-20">
          <div className="inline-block bg-green-900 px-4 py-2 rounded-full text-sm mb-6">
            Escrow Split Protected • 70/30 Auto-Pay
          </div>
          <h1 className="text-6xl font-bold mb-6">Sell More. Stress Less.</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-200">
            List products. Set prices. We handle delivery + payments via Paynow. You focus on selling.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/seller">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg w-full sm:w-auto transition-colors">
                Join as Seller
              </button>
            </Link>
            <Link href="/supplier">
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg w-full sm:w-auto transition-colors">
                Join as Supplier
              </button>
            </Link>
          </div>
        </div>

        <footer className="mt-32 border-t border-green-800 pt-8 pb-4 text-center">
          <div className="flex gap-6 justify-center mb-4 text-gray-300">
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/refunds" className="hover:text-white">Refunds</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
          <p className="text-sm text-gray-400">© 2026 TrendSell Zimbabwe. Escrow payments by Paynow.</p>
        </footer>
      </div>
    </div>
  )
}
