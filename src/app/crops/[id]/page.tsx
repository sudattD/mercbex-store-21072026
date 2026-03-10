"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { crops, products, CropIssue } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const SEVERITY_COLORS: Record<string, string> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

const SEVERITY_BORDER: Record<string, string> = {
  low: "border-green-200",
  medium: "border-yellow-200",
  high: "border-orange-200",
  critical: "border-red-200",
};

export default function CropDetailPage() {
  const { id } = useParams();
  const crop = crops.find((c) => c.id === id);
  const [selectedIssue, setSelectedIssue] = useState<CropIssue | null>(null);

  if (!crop) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Crop not found</h2>
          <Link href="/" className="inline-block mt-4 bg-brand-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-900 transition">
            Go Home
          </Link>
        </div>
      </main>
    );
  }

  const cropShortName = crop.name.replace(/\s*\(.*\)/, "");
  const activeProductIds = selectedIssue ? selectedIssue.recommendedProductIds : crop.matchingProductIds;
  const matchingProducts = products.filter((p) => activeProductIds.includes(p.id));

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero banner */}
      <div className="relative h-64 sm:h-80 overflow-hidden bg-black">
        <img
          src={crop.image.replace("w=400", "w=1920")}
          alt={crop.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-3 transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{crop.name}</h1>
          <p className="text-white/70 mt-2 max-w-xl">{crop.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Common Issues — image cards */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Common Problems in {cropShortName}</h2>
          <p className="text-sm text-gray-500 mb-6">Tap on any issue to see symptoms, sample images, and recommended treatment</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {crop.commonIssues.map((issue) => (
              <button
                key={issue.name}
                onClick={() => setSelectedIssue(selectedIssue?.name === issue.name ? null : issue)}
                className={`bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all text-left group ${
                  selectedIssue?.name === issue.name ? `ring-2 ring-brand-500 ${SEVERITY_BORDER[issue.severity]}` : "border-gray-100"
                }`}
              >
                {/* Disease/pest reference image */}
                <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
                  <img
                    src={issue.image}
                    alt={issue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${SEVERITY_COLORS[issue.severity]}`}>
                    {issue.severity}
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-gray-900 text-sm">{issue.name}</h3>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{issue.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Expanded issue detail */}
        {selectedIssue && (
          <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-fadeIn">
            <div className="grid md:grid-cols-2">
              {/* Reference image — larger */}
              <div className="bg-gray-100">
                <img
                  src={selectedIssue.image}
                  alt={selectedIssue.name}
                  className="w-full h-full object-cover min-h-[250px]"
                />
              </div>

              {/* Issue details */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{selectedIssue.name}</h3>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${SEVERITY_COLORS[selectedIssue.severity]}`}>
                    {selectedIssue.severity}
                  </span>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">{selectedIssue.description}</p>

                {/* Symptoms checklist */}
                <div className="mt-5">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Symptoms to Look For:</h4>
                  <ul className="space-y-2">
                    {selectedIssue.symptoms.map((symptom) => (
                      <li key={symptom} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick action */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="#recommended-products"
                    className="bg-brand-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-900 transition flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
                    See Recommended Products
                  </a>
                  <Link
                    href="/products"
                    className="border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Scan with AI Camera
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recommended Products */}
        <section id="recommended-products">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {selectedIssue
                  ? `Best Products for ${selectedIssue.name}`
                  : `Recommended Products for ${cropShortName}`}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {selectedIssue
                  ? `Specifically recommended to treat ${selectedIssue.name.toLowerCase()} in ${cropShortName}`
                  : "Trusted solutions used by thousands of farmers"}
              </p>
            </div>
            <Link href="/products" className="hidden sm:inline-flex items-center gap-1.5 text-brand-700 font-semibold text-sm hover:text-brand-800 transition">
              View All Products
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {matchingProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {matchingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <p className="text-gray-500">No specific products mapped yet. Browse all products or use the AI scanner.</p>
            </div>
          )}
        </section>

        {/* AI Scanner CTA */}
        <section className="bg-gradient-to-br from-brand-900 to-brand-950 rounded-2xl p-8 sm:p-10 text-center">
          <div className="max-w-xl mx-auto">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Not sure what&apos;s wrong with your {cropShortName}?</h3>
            <p className="text-brand-300 mt-2 text-sm">
              Upload a photo of the affected crop and our AI will identify the problem and recommend the right pesticide instantly.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white text-brand-900 px-6 py-3 rounded-xl font-bold mt-6 hover:bg-gray-100 transition shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Use AI Crop Scanner
            </Link>
            <p className="text-brand-400 text-xs mt-4">
              Or call our experts: <a href="tel:+911800123456" className="text-white font-semibold underline">1800-123-456</a> (24/7)
            </p>
          </div>
        </section>

        {/* Browse other crops */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Browse Other Crops</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {crops.filter((c) => c.id !== crop.id).map((c) => (
              <Link
                key={c.id}
                href={`/crops/${c.id}`}
                className="shrink-0 bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition w-36"
              >
                <div className="h-20 overflow-hidden bg-gray-100">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-2.5 text-center">
                  <p className="text-xs font-semibold text-gray-700">{c.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
