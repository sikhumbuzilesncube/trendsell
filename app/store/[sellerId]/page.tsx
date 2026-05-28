import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import StoreClient from './store-client'

export default async function StorePage({ 
  params 
}: { 
  params: Promise<{ sellerId: string }>
}) {
  const { sellerId } = await params
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: seller } = await supabase
   .from('sellers')
   .select('*')
   .eq('id', sellerId)
   .single()

  const { data: products } = await supabase
   .from('seller_listings')
   .select('*, products(*)')
   .eq('seller_id', sellerId)
   .eq('status', 'active')
   .eq('is_own_product', false)

  if (!seller) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h1>
        </div>
      </div>
    )
  }

  return <StoreClient seller={seller} products={products || []} />
}
