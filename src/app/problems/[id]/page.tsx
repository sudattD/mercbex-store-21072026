"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { commonProblems, products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const severityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

export default function ProblemDetailPage() {
  const { id } = useParams();
  const problem = commonProblems.find((p) => p.id === id);

  if (!problem) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Problem not found</h2>
          <Link href="/" className="inline-block mt-4 bg-brand-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-900 transition">
            Go Home
          </Link>
        </div>
      </main>
    );
  }

  const matchedProducts = products.filter((p) => problem.matchingProductIds.includes(p.id));

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-950 to-brand-900 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-brand-300 text-sm mb-4">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-white">Crop Problems</span>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-5xl">{problem.icon}</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{problem.problem}</h1>
              <p className="text-brand-200 mt-2 leading-relaxed max-w-2xl">{problem.description}</p>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${severityColors[problem.severity]}`}>
                  {problem.severity} severity
                </span>
                <span className="text-xs text-brand-300 bg-brand-800/50 px-3 py-1 rounded-full">
                  {problem.season}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Affected Crops */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>
            Affected Crops
          </h2>
          <div className="flex flex-wrap gap-2">
            {problem.affectedCrops.map((crop) => (
              <span key={crop} className="bg-brand-50 text-brand-700 text-sm font-medium px-3 py-1.5 rounded-lg border border-brand-100">
                {crop}
              </span>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            How to Identify (Symptoms)
          </h2>
          <div className="space-y-2.5">
            {problem.symptoms.map((symptom, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">{symptom}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Reference */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Visual Reference
          </h2>
          <div className="space-y-4">
            {problem.referenceImages.map((img, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={img.src}
                  alt={img.caption}
                  className="w-full h-auto"
                />
                <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-100">
                  <p className="text-xs text-gray-600">{img.caption}</p>
                </div>
              </div>
            ))}
            <div className="bg-gradient-to-br from-brand-50 to-gray-50 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4 border border-brand-100">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-semibold text-gray-700">Not sure if this matches your crop?</p>
                <p className="text-xs text-gray-500 mt-0.5">Use our AI Crop Scanner to instantly identify the problem from a photo of your affected crop.</p>
              </div>
              <Link
                href="/products"
                className="flex items-center gap-2 bg-brand-800 hover:bg-brand-900 text-white px-4 py-2 rounded-lg font-semibold text-sm transition shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Try AI Scanner
              </Link>
            </div>
          </div>
        </div>

        {/* Prevention */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            Prevention Tips
          </h2>
          <div className="space-y-2.5">
            {problem.prevention.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Products */}
        <div>
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            Recommended Products for {problem.problem}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {matchedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Help CTA */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-5 sm:p-6 border border-red-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-bold text-red-900">Not sure if this is your problem?</p>
            <p className="text-sm text-red-700 mt-1">Send a photo of your crop to our experts for free diagnosis</p>
          </div>
          <a
            href={`https://wa.me/911800123456?text=${encodeURIComponent(`Hi MERCBEX, my crop has a problem that looks like ${problem.problem}. Can you help identify and suggest a solution?`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Send Photo on WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
