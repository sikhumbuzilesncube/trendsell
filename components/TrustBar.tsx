import Link from 'next/link'

export default function TrustBar() {
  return (
    <section className="py-12 px-4 bg-blue-700 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-10">
          <div>
            <div className="text-3xl mb-2">🔒</div>
            <p className="font-bold">Paynow Secured</p>
            <p className="text-sm text-blue-200">Bank-level payments</p>
          </div>
          <div>
            <div className="text-3xl mb-2">📱</div>
            <p className="font-bold">SMS Verified</p>
            <p className="text-sm text-blue-200">Real Sellers only</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🤝</div>
            <p className="font-bold">Agent Verified</p>
            <p className="text-sm text-blue-200">Physical pickup</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🇿🇼</div>
            <p className="font-bold">Bulawayo First</p>
            <p className="text-sm text-blue-200">Local & trusted</p>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="bg-white/10 rounded-xl p-8 text-center backdrop-blur">
          <h3 className="text-2xl font-bold mb-3">Questions? Talk to us on WhatsApp</h3>
          <p className="text-blue-100 mb-6">
            Get instant help from a real person. Mon-Sat 8am-6pm
          </p>
          <Link 
            href="https://wa.me/263XXXXXXXXX?text=Hi%20TrendSell,%20I%20need%20help"
            target="_blank"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition"
          >
            💬 Chat on WhatsApp
          </Link>
        </div>
      </div>
    </section>
  )
}
