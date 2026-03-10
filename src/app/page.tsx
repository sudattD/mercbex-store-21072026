"use client";

import Link from "next/link";
import { products, categories, testimonials, crops } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import PromoBanner from "@/components/PromoBanner";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const bestSellers = products.filter((p) => p.badge === "Best Seller" || p.badge === "Top Rated" || p.badge === "Recommended");
  const newProducts = products.filter((p) => p.badge === "New");

  return (
    <main>
      {/* Promo Banner — admin-controlled */}
      <PromoBanner />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Select Your Crop */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{t("crop.title") !== "crop.title" ? t("crop.title") : "What Crop Are You Growing?"}</h2>
            <p className="text-gray-500 mt-2">{t("crop.subtitle") !== "crop.subtitle" ? t("crop.subtitle") : "Select your crop to find the right protection products"}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {crops.map((crop) => (
              <Link
                key={crop.id}
                href={`/crops/${crop.id}`}
                className="bg-gray-50 hover:bg-brand-50 border border-gray-100 hover:border-brand-200 rounded-xl overflow-hidden transition-all group"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={crop.image}
                    alt={crop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 text-center">
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-brand-700 transition">{crop.name}</p>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{crop.description}</p>
                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                    {crop.commonIssues.slice(0, 2).map((issue) => (
                      <span key={issue.name} className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full">{issue.name}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "30+", label: t("stats.products") },
              { value: "50,000+", label: t("stats.farmersTrust") },
              { value: "48hrs", label: t("stats.delivery") },
              { value: "24/7", label: t("stats.advisory") },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-brand-300 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">{t("section.shopByCategory")}</h2>
            <p className="text-gray-500 mt-2">{t("section.findRightType")}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-lg hover:border-brand-200 border border-gray-100 transition-all group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm">{cat.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{t("section.mostTrusted")}</h2>
              <p className="text-gray-500 mt-2">{t("section.recommendedByFarmers")}</p>
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
      <section className="bg-brand-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">{t("section.whyMercbex")}</h2>
            <p className="text-brand-300 mt-3 max-w-2xl mx-auto">
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
              <div key={feature.titleKey} className="bg-brand-800/50 backdrop-blur-sm rounded-2xl p-6 border border-brand-700/30">
                <div className="w-12 h-12 bg-brand-600/30 rounded-xl flex items-center justify-center text-brand-300 mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} /></svg>
                </div>
                <h3 className="text-white font-bold">{t(feature.titleKey)}</h3>
                <p className="text-brand-300 text-sm mt-2 leading-relaxed">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{t("section.newArrivals")}</h2>
                <p className="text-gray-500 mt-2">{t("section.latestAdditions")}</p>
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
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{t("section.farmersSaved")}</h2>
            <p className="text-gray-500 mt-2">{t("section.farmerStories")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
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
      <section className="bg-gradient-to-r from-red-600 to-orange-500 py-10">
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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-50 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8 border border-brand-100">
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
              <button type="submit" className="bg-brand-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-900 transition whitespace-nowrap">
                {t("newsletter.subscribe")}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
