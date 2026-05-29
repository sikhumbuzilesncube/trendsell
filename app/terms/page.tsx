export default function Terms() {
  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: May 29, 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Overview & How TrendSell Works</h2>
            <p className="text-gray-700 leading-relaxed">
              TrendSell is a decentralised marketplace platform operating city-by-city across Zimbabwe. 
              We connect four parties: verified Suppliers, Resellers/Sellers, Collection Agents, and Buyers.
            </p>
            
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Supplier Verification:</strong> TrendSell approves only verified Suppliers after 
              physically visiting their business premises to prevent fraudulent or bogus suppliers.
            </p>

            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>The Marketplace Flow:</strong>
            </p>
            <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
              <li><strong>Suppliers</strong> list products on TrendSell with a base price and proposed profit margin for Sellers.</li>
              <li><strong>Sellers</strong> open a store on TrendSell and choose which Supplier products to resell, or list their own products if on the Hybrid plan.</li>
              <li><strong>Buyers</strong> purchase from a Seller’s store and pay via Paynow. Full payment is held in escrow immediately.</li>
              <li><strong>Agents</strong> receive an automatic notification and travel to the Supplier’s premises to collect and verify the product.</li>
              <li><strong>After Agent verification:</strong> Supplier payment + Seller profit are released from escrow. Agent fee and platform fee are paid instantly.</li>
              <li><strong>Agents</strong> deliver products to local TrendSell Distribution Centres. Buyers collect from their nearest Centre or request shipping.</li>
            </ol>

            <p className="text-gray-700 leading-relaxed mt-4">
              TrendSell does not own inventory; Suppliers retain ownership until Agent pickup and verification. 
              Sellers do not handle physical stock unless on the Hybrid plan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Fees, Escrow & Payouts</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Buyer Payment:</strong> 100% of Buyer payment is held in escrow via Paynow upon purchase.
            </p>
            
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Instant Payments on Agent Verification:</strong>
            </p>
            <ul className="list-disc pl-6 mt-1 text-gray-700">
              <li>Agent Collection Fee: $1.50 USD paid instantly</li>
              <li>TrendSell Platform Fee: 4% of total sale value paid instantly</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Escrow Release After Verification:</strong>
            </p>
            <ul className="list-disc pl-6 mt-1 text-gray-700">
              <li><strong>Supplier:</strong> Receives their base price as listed</li>
              <li><strong>Seller:</strong> Receives their profit margin/markup</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Seller Subscription Plans</h2>
            <p className="text-gray-700 leading-relaxed">
              Sellers must maintain an active subscription to operate a store on TrendSell. All plans include 
              access to Supplier catalogs, storefront tools, and Seller analytics.
            </p>

            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-2 font-semibold">Plan</th>
                    <th className="py-2 font-semibold">Price</th>
                    <th className="py-2 font-semibold">Product Limit</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-200">
                    <td className="py-3">Free Trial</td>
                    <td className="py-3">$0</td>
                    <td className="py-3">14 days, up to 10 products</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3">Basic</td>
                    <td className="py-3">$5 / month</td>
                    <td className="py-3">Up to 25 products</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3">Standard</td>
                    <td className="py-3">$10 / month</td>
                    <td className="py-3">Up to 50 products</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3">Unlimited</td>
                    <td className="py-3">$15 / month</td>
                    <td className="py-3">Unlimited products</td>
                  </tr>
                  <tr>
                    <td className="py-3">Hybrid Seller</td>
                    <td className="py-3">$10 once-off</td>
                    <td className="py-3">Resell Supplier products + list own inventory</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Hybrid Seller Plan:</strong> One-time $10 USD fee allows Sellers to both resell verified 
              Supplier products AND list their own physical inventory. Hybrid Sellers must still pass TrendSell 
              premise verification for their own stock. Hybrid plan does not require monthly subscription.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              Subscription fees are non-refundable and billed monthly via Paynow. Failure to renew will 
              result in store deactivation after 7-day grace period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. User Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Suppliers:</strong> Must allow TrendSell premise verification, maintain accurate inventory, 
              and make products available for Agent pickup within 24 hours of order notification.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              <strong>Sellers:</strong> Must maintain active subscription or Hybrid status, stay within product 
              limits, list products accurately, honor listed prices, and respond to Buyer queries within 48 hours. 
              Sellers are responsible for marketing and pre-sale customer service.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              <strong>Agents:</strong> Must verify products match listing at Supplier premises before collection. 
              Must deliver to Distribution Centres within 24 hours of pickup. Must complete Buyer deliveries 
              within 2 business days if shipping is selected.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              <strong>Buyers:</strong> Must collect from Distribution Centres within 7 days of arrival 
              notification or confirm delivery within 24 hours if shipping is selected.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Fraud Prevention & Disputes</h2>
            <p className="text-gray-700 leading-relaxed">
              TrendSell conducts physical premise visits for all Suppliers and Hybrid Sellers. Agent 
              verification at pickup ensures products match listings before any Supplier or Seller payout. 
              If Agent verification fails, full escrow is refunded to Buyer. TrendSell mediates disputes 
              based on Agent verification reports, photos, and timestamps. TrendSell is not liable for 
              product quality but guarantees escrow protection for all parties.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
                      }
