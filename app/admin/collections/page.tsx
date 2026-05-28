'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Package, MapPin, Check, Camera, Phone, Clock } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Job = {
  id: string
  status: string
  created_at: string
  orders: {
    id: string
    seller_id: string
    total: number
    delivery_option: string
  }
  suppliers: {
    business_name: string
    address: string
    phone: string
  }
}

export default function CollectionsDashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'collected'>('pending')

  useEffect(() => {
    fetchJobs()
  }, [filter])

  const fetchJobs = async () => {
    setLoading(true)
    const { data } = await supabase
     .from('collection_jobs')
     .select(`
        *,
        orders (id, seller_id, total, delivery_option),
        suppliers (business_name, address, phone)
      `)
     .eq('status', filter)
     .order('created_at', { ascending: false })
    
    setJobs(data as any || [])
    setLoading(false)
  }

  const markCollected = async (jobId: string) => {
    const { error } = await supabase
     .from('collection_jobs')
     .update({ 
        status: 'collected', 
        collected_at: new Date().toISOString()
      })
     .eq('id', jobId)
    
    if (!error) {
      fetchJobs()
      alert('Marked as collected. Take to centre for QC.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="text-sm text-gray-500">Trendsell Bulawayo Centre</p>
        </div>
        
        {/* Tabs */}
        <div className="flex border-t">
          <button
            onClick={() => setFilter('pending')}
            className={`flex-1 py-3 text-sm font-medium ${
              filter === 'pending' 
               ? 'text-purple-600 border-b-2 border-purple-600' 
                : 'text-gray-500'
            }`}
          >
            Pending Pickup
          </button>
          <button
            onClick={() => setFilter('collected')}
            className={`flex-1 py-3 text-sm font-medium ${
              filter === 'collected' 
               ? 'text-purple-600 border-b-2 border-purple-600' 
                : 'text-gray-500'
            }`}
          >
            Collected
          </button>
        </div>
      </div>

      {/* Job List */}
      <div className="p-4 space-y-3">
        {loading? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : jobs.length === 0? (
          <div className="text-center py-8 text-gray-500">
            No {filter} jobs
          </div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-gray-900">
                    #{job.orders?.id.slice(0,8).toUpperCase()}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3" />
                    {new Date(job.created_at).toLocaleTimeString('en-GB', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  job.status === 'pending' 
                   ? 'bg-orange-100 text-orange-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {job.status === 'pending'? 'To Collect' : 'Collected'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-sm">
                  <Package className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{job.suppliers?.business_name}</p>
                    <p className="text-gray-600">Order value: ${job.orders?.total?.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">{job.suppliers?.address}</p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <a href={`tel:${job.suppliers?.phone}`} className="text-purple-600 font-medium">
                    {job.suppliers?.phone}
                  </a>
                </div>
              </div>

              {filter === 'pending' && (
                <div className="flex gap-2">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.suppliers?.address || '')}`}
                    target="_blank"
                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium text-center text-sm"
                  >
                    Navigate
                  </a>
                  <button 
                    onClick={() => markCollected(job.id)}
                    className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 text-sm"
                  >
                    <Check className="w-4 h-4" />
                    Mark Collected
                  </button>
                </div>
              )}

              {filter === 'collected' && (
                <div className="bg-green-50 text-green-700 text-xs p-2 rounded-lg text-center">
                  Take to centre for QC check
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
