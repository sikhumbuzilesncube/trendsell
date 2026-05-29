export default function Privacy() {
  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: May 29, 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed">
              To operate TrendSell’s decentralised marketplace across Zimbabwe, we collect:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li><strong>Buyers:</strong> Name, phone number, email, preferred Distribution Centre location for collection.</li>
              <li><strong>Sellers:</strong> Name, phone, email, business details, subscription plan, Paynow payout details, store analytics.</li>
              <li><strong>Suppliers:</strong> Business name, owner ID, phone, email, physical business address, premise photos, inventory data, Paynow payout details. Required for premise verification.</li>
              <li><strong>Agents:</strong> Name, phone, ID number, vehicle details, GPS location during active deliveries, delivery timestamps, verification photos.</li>
              <li><strong>Payment Data:</strong> Transaction IDs, amounts, escrow status via Paynow. We do not store card details.</li>
              <li><strong>Device Data:</strong> IP address, browser type, for fraud prevention and platform security.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Supplier Verification:</strong> We use business address and premise photos to conduct physical visits before approving Suppliers or Hybrid Sellers.</li>
              <li><strong>Escrow & Payouts:</strong> We process payments via Paynow and release escrow to Suppliers/Sellers only after Agent verification at pickup.</li>
              <li><strong>Logistics:</strong> We use Agent GPS and timestamps to coordinate collections from Suppliers and deliveries to Distribution Centres.</li>
              <li><strong>Distribution Centres:</strong> We use Buyer location to assign nearest Centre and send collection notifications.</li>
              <li><strong>Seller Subscriptions:</strong> We process $5–$15 monthly fees and enforce product limits based on plan.</li>
              <li><strong>Fraud Prevention:</strong> We analyze device data, transaction patterns, and Agent verification reports to detect bogus suppliers or fraudulent activity.</li>
              <li><strong>Communication:</strong> We send SMS/WhatsApp notifications for order status, Agent pickup, Distribution Centre arrival, and subscription renewals.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Data Sharing</h2>
            <p className="text-gray-700 leading-relaxed">
              We share data only as necessary to operate the marketplace:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li><strong>Paynow:</strong> Transaction details for escrow processing and payouts.</li>
              <li><strong>Agents:</strong> Supplier address and contact for product collection. Buyer name/phone for delivery.</li>
              <li><strong>Sellers:</strong> Buyer name and order details. Supplier contact info only after purchase.</li>
              <li><strong>Suppliers:</strong> Agent name/phone for pickup coordination. Seller store name for attribution.</li>
              <li><strong>Legal:</strong> We comply with Zimbabwean law enforcement requests and Paynow compliance audits.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-2">
              We never sell your data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Data Retention & Security</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Retention:</strong> We keep Supplier premise verification photos for 5 years for fraud audits. 
              Transaction records are kept for 7 years per Zimbabwean tax law. Seller accounts inactive for 12 months 
              are archived. You may request deletion of your account via support@trendsell.co.zw.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              <strong>Security:</strong> All data is encrypted at rest via Supabase. Agent GPS is only active 
              during assigned deliveries. We conduct quarterly security audits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed">
              You may request: access to your data, correction of inaccurate info, deletion of your account, 
              or a copy of Supplier premise verification reports relating to your business. Contact 
              support@trendsell.co.zw or visit our Bulawayo office: 123 Main St, Bulawayo, Zimbabwe.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Cookies & Tracking</h2>
            <p className="text-gray-700 leading-relaxed">
              We use essential cookies for login, cart, and escrow status. We use analytics cookies to 
              improve Distribution Centre efficiency and Seller dashboards. You can disable non-essential 
              cookies in your browser.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
            }
