export default function Refunds() {
  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Refund Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: May 29, 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Escrow Protection & Automatic Refunds</h2>
            <p className="text-gray-700 leading-relaxed">
              All Buyer payments are held in escrow via Paynow. Refunds are processed automatically 
              in the following cases:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
              <li><strong>Agent Verification Failure:</strong> If our Collection Agent arrives at the Supplier 
              and the product does not match the listing, is damaged, or unavailable, full escrow is 
              refunded to Buyer immediately. Supplier and Seller receive no payout.</li>
              
              <li><strong>Supplier No-Show:</strong> If Supplier fails to make product available for Agent 
              pickup within 24 hours of order notification, full escrow is refunded to Buyer.</li>
              
              <li><strong>Agent Fails to Deliver to Distribution Centre:</strong> If Agent collects but 
              fails to deliver product to Distribution Centre within 24 hours, full escrow is refunded 
              to Buyer. Agent fee is not paid.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Distribution Centre Collection & Delivery</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Buyer Collection:</strong> Once product arrives at your assigned Distribution Centre, 
              you have 7 days to collect. If uncollected after 7 days, product is returned to Supplier 
              and Buyer receives 80% refund. 20% covers Agent + platform costs.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Shipping from Distribution Centre:</strong> If you select delivery, Agent ships from 
              Distribution Centre to your address within 2 business days. You must confirm delivery in-app 
              within 24 hours. After confirmation, no refunds are issued unless item is damaged in transit.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Damaged in Transit:</strong> If Agent damages item during delivery from Distribution 
              Centre to Buyer, TrendSell covers full refund or replacement. Agent is liable. Report within 
              24 hours with photos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Non-Refundable Items</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>After Buyer Collection:</strong> Once you collect from Distribution Centre and 
              do not report issues within 1 hour, sale is final. TrendSell facilitated the transaction; 
              product disputes are between Buyer and Supplier.</li>
              
              <li><strong>Subscription Fees:</strong> Seller monthly fees ($5, $10, $15) and $10 Hybrid 
              once-off fees are non-refundable. Cancel anytime to stop next billing cycle.</li>
              
              <li><strong>Platform Fee & Agent Fee:</strong> The 4% platform fee and $1.50 Agent fee are 
              non-refundable once Agent has verified and collected the product, as services were rendered.</li>
              
              <li><strong>Change of Mind:</strong> No refunds for change of mind after Agent verification. 
              Check product details carefully before purchase.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Dispute Process</h2>
            <p className="text-gray-700 leading-relaxed">
              All disputes are mediated by TrendSell using:
            </p>
            <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
              <li>Agent verification photos taken at Supplier premises</li>
              <li>Distribution Centre intake photos and timestamps</li>
              <li>Buyer collection confirmation or delivery GPS logs</li>
              <li>Supplier premise verification records</li>
            </ol>
            <p className="text-gray-700 leading-relaxed mt-3">
              Submit disputes to support@trendsell.co.zw/sikhumbuzilesncube@gmail.com within 48 hours of issue. TrendSell decision 
              is final. For fraud cases, we cooperate with Zimbabwe Republic Police and Paynow.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Supplier & Seller Claims</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Suppliers:</strong> If Agent falsely reports verification failure, you may claim 
              payout by providing CCTV or witness evidence from your premises within 24 hours.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              <strong>Sellers:</strong> If Buyer fraudulently claims non-delivery after collecting from 
              Distribution Centre, TrendSell will review Centre CCTV and sign-out logs. False claims 
              result in Buyer ban.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
              }
