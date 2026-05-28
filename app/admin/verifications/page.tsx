'use client'
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function AdminVerifications() {
  const [user, setUser] = useState<any>(null);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // TODO: Add admin check - only you can see this
      // For now, anyone logged in can see. We'll lock it down later.
      
      const { data } = await supabase
       .from('seller_verifications')
       .select('*')
       .order('created_at', { ascending: false });
      
      setVerifications(data || []);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    await supabase
     .from('seller_verifications')
     .update({ status: 'approved', verified_at: new Date().toISOString() })
     .eq('id', id);
    
    // Refresh list
    const { data } = await supabase
     .from('seller_verifications')
     .select('*')
     .order('created_at', { ascending: false });
    setVerifications(data || []);
  };

  const handleReject = async (id: string) => {
    await supabase
     .from('seller_verifications')
     .update({ status: 'rejected' })
     .eq('id', id);
    
    const { data } = await supabase
     .from('seller_verifications')
     .select('*')
     .order('created_at', { ascending: false });
    setVerifications(data || []);
  };

  const getFileUrl = async (path: string) => {
    const { data } = await supabase.storage
     .from('verification-docs')
     .createSignedUrl(path, 3600); // 1 hour link
    return data?.signedUrl;
  };

  if (loading) return <div className="min-h-screen bg-zambezi-dark text-white flex items-center justify-center">Loading...</div>;
  if (!user) return <div className="min-h-screen bg-zambezi-dark text-white flex items-center justify-center">Admin login required</div>;

  return (
    <main className="min-h-screen bg-zambezi-dark text-zambezi-text p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-heading font-bold text-3xl mb-8">Seller Verifications</h1>
        
        {verifications.length === 0? (
          <div className="bg-black/20 border border-zambezi-teal/20 rounded-xl p-8 text-center text-zambezi-text/60">
            No verification requests yet.
          </div>
        ) : (
          <div className="space-y-4">
            {verifications.map((v) => (
              <div key={v.id} className="bg-black/20 border border-zambezi-teal/20 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-white">{v.store_name}</h3>
                    <p className="text-sm text-zambezi-text/60">Submitted: {new Date(v.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    v.status === 'approved'? 'bg-green-500/20 text-green-400' :
                    v.status === 'rejected'? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {v.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    onClick={async () => window.open(await getFileUrl(v.id_document_url), '_blank')}
                    className="bg-zambezi-dark border border-zambezi-teal/40 text-zambezi-teal py-2 rounded-lg text-sm"
                  >View ID Document</button>
                  <button
                    onClick={async () => window.open(await getFileUrl(v.proof_of_residence_url), '_blank')}
                    className="bg-zambezi-dark border border-zambezi-teal/40 text-zambezi-teal py-2 rounded-lg text-sm"
                  >View Proof of Address</button>
                </div>

                <div className="flex gap-2">
                  {v.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(v.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg"
                      >✓ Approve</button>
                      <button
                        onClick={() => handleReject(v.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg"
                      >✕ Reject</button>
                    </>
                  )}
                  {v.status !== 'pending' && (
                    <div className="text-sm text-zambezi-text/60">
                      {v.status === 'approved'? `Approved on ${new Date(v.verified_at).toLocaleDateString()}` : 'Rejected'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
