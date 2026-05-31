export default function HowItWorks() {
  const steps = [
    {
      icon: '💵',
      title: '1. Pay with EcoCash',
      desc: 'You pay TrendSell. We hold your money safely. Seller gets nothing yet.'
    },
    {
      icon: '🤝',
      title: '2. Meet Our Agent',
      desc: 'Collect & inspect your item at our Bulawayo agent. 24hrs to check.'
    },
    {
      icon: '✅',
      title: '3. We Pay the Seller',
      desc: 'Happy with item? Click "Release". We send money to Seller instantly.'
    }
  ]

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Zero Scams. 100% Escrow Protection.
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Your money is safe until you physically have your item.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="bg-blue-50 rounded-2xl p-8 h-full">
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 text-3xl text-blue-300">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-green-800 font-semibold">
            🔒 If you don't collect or item is fake → Full refund in 24hrs. Guaranteed.
          </p>
        </div>
      </div>
    </section>
  )
                  }
