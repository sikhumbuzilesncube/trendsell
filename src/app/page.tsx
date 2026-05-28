import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="TrendSell" 
                width={32} 
                height={32}
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-gray-900">TrendSell</span>
            </div>
            <div className="flex gap-3">
              <Link href="/auth/login" className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Login
              </Link>
              <Link href="/auth/signup" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Sell Online. <span className="text-blue-600">Zero Inventory.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              TrendSell connects Zimbabwean suppliers with resellers. List products, set your markup, and earn. We handle delivery and payments.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/auth/signup?role=supplier" className="rounded-lg bg-gray-900 px-6 py-3 text-base font-medium text-white hover:bg-gray-800">
                I'm a Supplier
              </Link>
              <Link href="/auth/signup?role=reseller" className="rounded-lg border border-gray-300 px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50">
                I'm a Reseller
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] w-full rounded-2xl bg-gray-100 flex items-center justify-center">
              <p className="text-gray-400">Hero image coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">How TrendSell Works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="text-3xl font-bold text-blue-600">1</div>
              <h3 className="mt-4 text-lg font-semibold">Suppliers List Products</h3>
              <p className="mt-2 text-gray-600">Upload your inventory, set wholesale prices, and reach hundreds of resellers instantly.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="text-3xl font-bold text-blue-600">2</div>
              <h3 className="mt-4 text-lg font-semibold">Resellers Add Markup</h3>
              <p className="mt-2 text-gray-600">Browse products, set your selling price, and share your store link. No upfront stock needed.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="text-3xl font-bold text-blue-600">3</div>
              <h3 className="mt-4 text-lg font-semibold">We Deliver & You Earn</h3>
              <p className="mt-2 text-gray-600">Orders go straight to suppliers. We deliver, collect payment, and split profits automatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
          © 2026 TrendSell. Built for Zimbabwe.
        </div>
      </footer>
    </main>
  )
}
