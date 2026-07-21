"use client";

import { useRef } from "react";
import Link from "next/link";
import { products, categories, testimonials, crops } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import HeroStory from "@/components/HeroStory";
import PromoBanner from "@/components/PromoBanner";
import { useLanguage } from "@/context/LanguageContext";
import CategoryIcon from "@/components/CategoryIcon";
import { useCrops } from "@/context/CropContext";
import MyDiagnoses from "@/components/MyDiagnoses";

export default function Home() {
  const { t } = useLanguage();
  const { selectedCrop, selectCrop } = useCrops();
  const scanCtaRef = useRef<HTMLAnchorElement>(null);
  const bestSellers = products.filter((p) => p.badge === "Best Seller" || p.badge === "Top Rated" || p.badge === "Recommended");
  const newProducts = products.filter((p) => p.badge === "New");

  return (
    <main className="bg-[#f5f0e8]">
      {/* Promo Banner — admin-controlled */}
      <PromoBanner />

      {/* Hero Story — How It Works */}
      <HeroStory />

      {/* My Diagnoses — scan history */}
      <MyDiagnoses />

      {/* Select Your Crop */}
      <section className="py-12 bg-gradient-to-b from-[#0d1f12] to-[#1a2e1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Select Your Crop</h2>
              <p className="text-sm text-green-400/60 mt-0.5">Tap to select, then scan for diseases</p>
            </div>
            {selectedCrop && (
              <Link
                href="/scan"
                ref={scanCtaRef}
                className="inline-flex items-center gap-2 bg-green-500 text-green-950 px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_4px_20px_rgba(74,222,128,0.3)] hover:bg-green-400 hover:-translate-y-0.5 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
                Scan
              </Link>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
            {crops.map((crop) => {
              const isSelected = selectedCrop === crop.id;
              return (
                <button
                  key={crop.id}
                  onClick={() => selectCrop(crop.id)}
                  className="flex-shrink-0 group transition-all duration-300"
                  style={{ width: "calc((100% - 2.5 * 12px) / 3.5)", scrollSnapAlign: "start" }}
                >
                  <div className={`relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-300 ${
                    isSelected
                      ? "ring-2 ring-green-400 shadow-[0_0_24px_rgba(74,222,128,0.3)]"
                      : "ring-1 ring-white/10 opacity-70 hover:opacity-100 hover:ring-white/25 hover:-translate-y-1"
                  }`}>
                    <img src={crop.image} alt={crop.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    {/* Emoji badge */}
                    <div className="absolute top-2 left-2 w-7 h-7 bg-black/40 backdrop-blur-sm rounded-lg flex items-center justify-center text-sm">
                      {crop.icon}
                    </div>

                    {/* Selected checkmark */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}

                    {/* Name */}
                    <div className="absolute bottom-0 inset-x-0 px-2.5 pb-2.5">
                      <p className={`text-xs font-semibold leading-tight ${isSelected ? "text-green-300" : "text-white/90"}`}>
                        {crop.name}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-950/90 backdrop-blur-sm py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "30+", label: t("stats.products") },
              { value: "50,000+", label: t("stats.farmersTrust") },
              { value: "48hrs", label: t("stats.delivery") },
              { value: "24/7", label: t("stats.advisory") },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{stat.value}</p>
                <p className="text-sm text-brand-300 mt-1.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t("section.shopByCategory")}</h2>
            <p className="text-base text-gray-400 mt-3 max-w-xl mx-auto">{t("section.findRightType")}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 hover:-translate-y-1 border border-white/10 transition-all duration-300 group"
              >
                <div className="text-green-400 mb-4 flex justify-center group-hover:scale-110 transition-transform">
                  <CategoryIcon name={cat.icon} className="w-9 h-9" />
                </div>
                <h3 className="font-bold text-white text-sm">{cat.name}</h3>
                <p className="text-xs text-gray-400 mt-1.5">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">{t("section.mostTrusted")}</h2>
              <p className="text-base text-gray-500 mt-3">{t("section.recommendedByFarmers")}</p>
            </div>
            <Link href="/products" className="hidden sm:inline-flex items-center gap-2 text-brand-700 font-semibold hover:text-brand-800 transition">
              {t("section.viewAll")}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why MERCBEX */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">{t("section.whyMercbex")}</h2>
            <p className="text-base text-gray-500 mt-3 max-w-xl mx-auto">
              {t("section.whySubtitle")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", titleKey: "why.govApproved", descKey: "why.govApprovedDesc" },
              { icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", titleKey: "why.labTesting", descKey: "why.labTestingDesc" },
              { icon: "M13 10V3L4 14h7v7l9-11h-7z", titleKey: "why.fastDelivery", descKey: "why.fastDeliveryDesc" },
              { icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z", titleKey: "why.expertAdvisory", descKey: "why.expertAdvisoryDesc" },
            ].map((feature) => (
              <div key={feature.titleKey} className="bg-white/80 backdrop-blur-sm rounded-2xl p-7 border border-white/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-700 mb-5 shadow-md">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} /></svg>
                </div>
                <h3 className="text-gray-900 font-bold text-lg">{t(feature.titleKey)}</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">{t("section.newArrivals")}</h2>
                <p className="text-base text-gray-500 mt-3">{t("section.latestAdditions")}</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">{t("section.farmersSaved")}</h2>
            <p className="text-base text-gray-500 mt-3 max-w-xl mx-auto">{t("section.farmerStories")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed text-sm">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-50 text-brand-700 rounded-full flex items-center justify-center font-bold text-sm">{testimonial.avatar}</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.crop} &middot; {testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency CTA */}
      <section className="bg-gradient-to-r from-red-600 to-orange-500 py-12 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{t("emergency.title")}</h2>
            <p className="text-red-100 mt-1">
              {t("emergency.subtitle")}
            </p>
          </div>
          <a
            href="tel:+911800123456"
            className="bg-white text-red-600 px-8 py-3.5 rounded-xl font-bold hover:bg-red-50 transition shadow-lg whitespace-nowrap flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            Call 1800-123-456
          </a>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{t("newsletter.title")}</h2>
              <p className="text-gray-500 mt-2">
                {t("newsletter.subtitle")}
              </p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex w-full md:w-auto gap-3">
              <input
                type="tel"
                placeholder={t("newsletter.placeholder")}
                className="flex-1 md:w-64 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
              <button type="submit" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 whitespace-nowrap">
                {t("newsletter.subscribe")}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
