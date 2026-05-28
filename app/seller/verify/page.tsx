'use client'
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export default function VerifyStore() {
  const [user, setUser] = useState<any>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [billFile, setBillFile] = useState<File | null>(null);
  const [ecocashNumber, setEcocashNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1); // 1: upload, 2: payment

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user?.user_metadata?.phone) setEcocashNumber(user.user_metadata.phone);
    };
    getUser();
  }, []);

  const handleUploadDocs = async () => {
    if (!idFile ||!billFile ||!user) return;
    setLoading(true);
    setMessage('');

    try {
      // Upload ID
      const idPath = `${user.id}/id-${Date.now()}.${idFile.name.split('.').pop()}`;
      const { error: idError } = await supabase.storage
       .from('verification-docs')
       .upload(idPath, idFile);
      if (idError) throw idError;

      // Upload Bill
      const billPath = `${user.id}/bill-${Date.now()}.${billFile.name.split('.').pop()}`;
      const { error: billError } = await supabase.storage
       .from('verification-docs')
       .upload(billPath, billFile);
      if (billError) throw billError;

      // Create verification record
      const { error: dbError } = await supabase
       .from('seller_verifications')
       .insert({
          user_id: user.id,
          store_name: user.user_metadata?.store_name || 'Store',
          id_document_url: idPath,
          proof_of_residence_url: billPath,
          status: 'pending',
          payment_status: 'unpaid'
        });
      if (dbError) throw dbError;

      setMessage('Documents uploaded! Now pay $5 to complete.');
      setStep(2);
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    }
    setLoading(false);
  };

  const handlePayment = async () => {
    setLoading(true);
    setMessage('Redirecting to EcoCash...');
    
    // For now we just mark as pending. PayNow integration comes next.
    // In production, you'd generate PayNow URL here for $5
    const { error } = await supabase
     .from('seller_verifications')
     .update({ 
        payment_status: 'paid', 
        ecocash_reference: `TEST-${Date.now()}`,
        status: 'pending' 
      })
     .eq('user_id', user.id);

    if (error) {
      setMessage('Error: ' + error.message);
      setLoading(false);
      return;
    }

    setMessage('Payment recorded! We will verify within 24 hours.');
    setTimeout(() => {
      window.location.href = '/seller/dashboard';
    }, 2000);
  };

  if (!user) return <div className="min-h-screen bg-zambezi-dark text-white flex items-center justify-center">Please log in</div>;

  return (
    <main className="min-h-screen bg-zambezi-dark text-zambezi-text p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <button 
            onClick={() => window.location.href = '/seller/dashboard'}
            className="text-zambezi-teal text-sm mb-4"
          >← Back to Dashboard</button>
          <h1 className="font-heading font-bold text-3xl mb-2">Verify Your Store 🛡️</h1>
          <p className="text-zambezi-text/70">Get the badge. Build trust. Sell 3x more.</p>
        </div>

        <div className="bg-black/20 border border-zambezi-teal/20 rounded-xl p-6">
          
          {step === 1 && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">1. National ID / Passport Photo</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setIdFile(e.target.files?.[0] || null)}
                  className="w-full bg-zambezi-dark border border-zambezi-teal/40 rounded-lg px-4 py-3 text-white file:bg-zambezi-teal file:text-zambezi-dark file:border-0 file:rounded file:px-3 file:py-1 file:mr-3"
                />
                <p className="text-xs text-zambezi-text/60 mt-2">Take a clear photo. Front only.</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">2. Proof of Address</label>
                <input 
                  type="file" 
                  accept="image/*,.pdf"
                  onChange={(e) => setBillFile(e.target.files?.[0] || null)}
                  className="w-full bg-zambezi-dark border border-zambezi-teal/40 rounded-lg px-4 py-3 text-white file:bg-zambezi-teal file:text-zambezi-dark file:border-0 file:rounded file:px-3 file:py-1 file:mr-3"
                />
                <p className="text-xs text-zambezi-text/60 mt-2">ZESA bill, water bill, or bank statement. Last 3 months.</p>
              </div>

              <button 
                onClick={handleUploadDocs}
                disabled={!idFile ||!billFile || loading}
                className="w-full bg-zambezi-orange hover:bg-zambezi-orange/90 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold py-4 rounded-lg"
              >
                {loading? 'Uploading...' : 'Upload Documents'}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-6 p-4 bg-zambezi-teal/10 border border-zambezi-teal/30 rounded-lg">
                <p className="font-bold text-white mb-1">Verification Fee: $5 USD</p>
                <p className="text-sm text-zambezi-text/80">One-time payment. Lifetime badge.</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">EcoCash Number</label>
                <input 
                  type="tel" 
                  value={ecocashNumber}
                  onChange={(e) => setEcocashNumber(e.target.value)}
                  placeholder="077 123 4567"
                  className="w-full bg-zambezi-dark border border-zambezi-teal/40 rounded-lg px-4 py-3 text-white placeholder-zambezi-text/50"
                />
              </div>

              <button 
                onClick={handlePayment}
                disabled={!ecocashNumber || loading}
                className="w-full bg-zambezi-orange hover:bg-zambezi-orange/90 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold py-4 rounded-lg"
              >
                {loading? 'Processing...' : 'Pay $5 with EcoCash'}
              </button>
              <p className="text-xs text-zambezi-text/60 text-center mt-3">
                Test mode: Click to simulate payment. Real PayNow coming next.
              </p>
            </>
          )}

          {message && (
            <div className="mt-4 text-sm text-center p-3 rounded-lg bg-zambezi-teal/20 text-zambezi-teal">
              {message}
            </div>
          )}
        </div>

        <div className="mt-6 text-xs text-zambezi-text/60 text-center">
          Your documents are encrypted and only used for verification. We never share them.
        </div>
      </div>
    </main>
  );
}
