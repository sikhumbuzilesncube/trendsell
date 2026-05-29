export default function Terms() {
  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: May 29, 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Overview</h2>
            <p className="text-gray-700 leading-relaxed">
              TrendSell is a decentralised marketplace platform operating city-by-city across Zimbabwe. 
              We connect verified Suppliers, Resellers/Sellers, Agents, and Buyers.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Supplier Verification:</strong> TrendSell approves only verified Suppliers after 
              physically visiting their business premises to prevent fraudulent or bogus suppliers.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>How it works:</strong> When a Buyer purchases, payment is held in escrow via Paynow 
              and an automatic notification is sent to the assigned Collection Agent. The Agent travels 
              to the Supplier’s premises to collect and verify the product. After successful pickup and 
              verification, payment is released to the Supplier. Agents then deliver products to local 
              TrendSell Distribution Centres. Buyers collect their orders from their nearest Distribution 
              Centre, or request shipping from the Distribution Centre to their address.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              TrendSell facilitates payments via Paynow, coordinates logistics via Agents, 
              and operates Distribution Centres to serve local customers and suppliers in 
              each city. TrendSell does not own inventory; Suppliers retain ownership until 
              Agent pickup and verification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Escrow Payments & Payouts</h2>
            <p className="text-gray-700 leading-relaxed">
              All Buyer payments are held in escrow via Paynow immediately upon purchase. Upon Agent 
              pickup and verification of the product from the Supplier, payment is released to the 
              Supplier minus TrendSell platform fees. Agent collection fees of $1.50 are released 
              upon delivery of the product to the Distribution Centre. When a Buyer collects from 
              the Distribution Centre or confirms delivery, the remaining 70/30 split is processed 
              between Seller and Supplier.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. User Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Suppliers:</strong> Must allow TrendSell premise verification, provide accurate 
              products, and make items available for Agent pickup within 24 hours of order notification.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              <strong>Sellers:</strong> Must list products accurately and handle pre-sale customer queries.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              <strong>Agents:</strong> Must verify products at Supplier premises, collect and deliver to 
              Distribution Centres within 24 hours, and complete Buyer deliveries within agreed timeframes 
              if shipping is selected.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              <strong>Buyers:</strong> Must collect from Distribution Centres within 7 days of arrival 
              notification or confirm delivery if shipping is selected.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              TrendSell operates the platform and Distribution Centres but is not liable for product 
              quality. We will mediate disputes based on Agent verification reports.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Fraud Prevention</h2>
            <p className="text-gray-700 leading-relaxed">
              TrendSell conducts physical premise visits for all Suppliers before approval. Agent 
              verification at pickup ensures products match listings before any payment is released 
              to Suppliers. This escrow-on-pickup model protects Buyers from non-delivery and 
              protects TrendSell from bogus suppliers.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
                }
