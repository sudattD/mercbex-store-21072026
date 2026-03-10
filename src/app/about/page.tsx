export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-950 to-brand-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-white">About MERCBEX</h1>
          <p className="text-brand-300 mt-4 max-w-2xl mx-auto text-lg">
            A trusted name in Indian agriculture — manufacturing premium crop protection products since 2010.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              <p className="text-gray-600 mt-4 leading-relaxed">
                At MERCBEX, we understand that every crop is a farmer&apos;s livelihood. When pests attack, it&apos;s not just about the crop — it&apos;s about the family that depends on it. That&apos;s why we are committed to manufacturing and delivering the most effective, scientifically-formulated crop protection products at prices every farmer can afford.
              </p>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Every MERCBEX product goes through rigorous quality testing in our NABL-accredited laboratory. We don&apos;t just sell pesticides — we provide complete crop protection solutions backed by expert agronomist support.
              </p>
            </div>
            <div className="bg-brand-50 rounded-2xl p-8 border border-brand-100">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "2010", label: "Founded" },
                  { value: "30+", label: "Products" },
                  { value: "50K+", label: "Farmers Served" },
                  { value: "15+", label: "States Covered" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-bold text-brand-800">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">What We Stand For</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Quality First", desc: "Every batch is lab-tested. We never compromise on formulation quality because your crop depends on it.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { title: "Farmer First", desc: "From affordable pricing to free agronomist advisory — everything we do is designed to support the farmer.", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
              { title: "Speed When It Matters", desc: "We know pest attacks don't wait. Our 48-hour delivery ensures your solution reaches you before it's too late.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-700 mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={v.icon} /></svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{v.title}</h3>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Certifications & Registrations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["CIB Registered", "ISO 9001:2015", "GLP Certified", "BIS Compliant"].map((cert) => (
              <div key={cert} className="bg-brand-50 rounded-xl p-4 border border-brand-100">
                <svg className="w-8 h-8 text-brand-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <p className="text-sm font-bold text-brand-800">{cert}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
