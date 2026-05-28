import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B3D2E] text-white">
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex justify-between items-center mb-16">
          <div className="bg-black px-3 py-1 text-xl font-bold">TrendSell</div>
          <div>🇿🇼 Zimbabwe</div>
        </header>
        
        <div className="text-center py-20">
          <div className="inline-block bg-green-900 px-4 py-2 rounded-full mb-6">
            Escrow Split Protected • 70/30 Auto-Pay
          </div>
          <h1 className="text-6xl font-bold mb-6">Sell Without<br/>Stock.</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            List products. Set prices. We handle delivery + payments via Paynow. You focus on selling.
          </p>
          <button className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold">
            Join as Seller
          </button>
        </div>

        <footer className="mt-32 border-t border-green-800 pt-8 flex gap-6 text-sm text-green-200">
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/refunds">Refunds</Link>
          <Link href="/contact">Contact</Link>
        </footer>
      </div>
    </div>
  )
}
