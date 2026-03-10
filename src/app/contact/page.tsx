"use client";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-brand-950 to-brand-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-white">Contact MERCBEX</h1>
          <p className="text-brand-300 mt-4 max-w-2xl mx-auto text-lg">
            Need help choosing a product? Our agronomists are available 24/7 to assist you.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Emergency help — first for worried farmer */}
          <div className="bg-red-50 rounded-2xl p-6 border border-red-100 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
            <h3 className="font-bold text-red-900 text-lg">Crop Emergency Helpline</h3>
            <p className="text-sm text-red-700 mt-2">Get immediate product recommendation from our agronomist</p>
            <a href="tel:+911800123456" className="inline-block mt-4 bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-700 transition">
              1800-123-456
            </a>
            <p className="text-xs text-red-500 mt-2">Toll-free &middot; Available 24/7</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
            <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Email Support</h3>
            <p className="text-sm text-gray-500 mt-2">For orders, queries, and dealer inquiries</p>
            <a href="mailto:support@mercbex.in" className="inline-block mt-4 text-brand-700 font-bold hover:text-brand-800 transition">
              support@mercbex.in
            </a>
            <p className="text-xs text-gray-400 mt-2">Response within 4 hours</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
            <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Head Office</h3>
            <p className="text-sm text-gray-500 mt-2">
              MERCBEX Agrochemicals Pvt. Ltd.<br />
              Sector 12, Gurugram<br />
              Haryana 122001
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label>
                  <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Mobile *</label>
                  <input type="tel" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" placeholder="+91" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Subject</label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                  <option>Product Inquiry</option>
                  <option>Crop Advisory Needed</option>
                  <option>Order Issue</option>
                  <option>Dealer/Distributor Inquiry</option>
                  <option>Feedback</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Crop &amp; Problem (optional)</label>
                <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" placeholder="e.g. Rice — Brown Plant Hopper attack" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Message *</label>
                <textarea rows={4} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none" placeholder="Describe your query..." />
              </div>
              <button type="submit" className="w-full bg-brand-800 hover:bg-brand-900 text-white font-bold py-3 rounded-xl transition">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
