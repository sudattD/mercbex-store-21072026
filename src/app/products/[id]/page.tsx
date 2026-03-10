"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { getProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import type { Product } from "@/data/products";

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const all = getProducts();
    setProduct(all.find((p) => p.id === params.id) || null);
    setLoading(false);
  }, [params.id]);
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
          <Link href="/products" className="mt-4 inline-block text-brand-700 font-semibold">{t("nav.products")}</Link>
        </div>
      </main>
    );
  }

  const size = selectedSize || product.packSizes[0];
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const allProducts = getProducts();
  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-brand-700 transition">{t("nav.home")}</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-brand-700 transition">{t("nav.products")}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-48 h-60 bg-brand-900 rounded-xl mx-auto flex flex-col items-center justify-center shadow-2xl border-2 border-brand-600/50">
                <span className="text-sm font-extrabold text-white tracking-[0.15em]">MERCBEX</span>
                <div className="w-32 h-0.5 bg-brand-400 my-3" />
                <span className="text-[10px] text-brand-200 text-center px-4 leading-relaxed">
                  {product.activeIngredient}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                {product.badge && (
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-brand-100 text-brand-800">{product.badge}</span>
                )}
                <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full" /> {t("product.shipsToday")}
                </span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full uppercase tracking-wide">
              {product.category} &middot; {product.formulation}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">{product.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Active: {product.activeIngredient}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-brand-800">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Save {discount}%</span>
                </>
              )}
            </div>

            <p className="mt-5 text-gray-600 leading-relaxed">{product.description}</p>

            {/* Pack Size */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">{t("product.packSize")}</h3>
              <div className="flex flex-wrap gap-2">
                {product.packSizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                      (selectedSize || product.packSizes[0]) === s
                        ? "border-brand-600 bg-brand-50 text-brand-700"
                        : "border-gray-200 text-gray-600 hover:border-brand-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-gray-50 transition text-gray-600 font-medium">-</button>
                <span className="px-4 py-3 font-semibold text-gray-900 min-w-[48px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:bg-gray-50 transition text-gray-600 font-medium">+</button>
              </div>
              <button
                onClick={() => addToCart(product, size, quantity)}
                className="flex-1 bg-brand-800 hover:bg-brand-900 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                {t("product.addToCart")}
              </button>
            </div>

            {/* Delivery info */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-xl p-3 border border-green-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <div>
                  <p className="text-xs font-bold text-green-800">{t("product.expressDelivery")}</p>
                  <p className="text-[10px] text-green-600">{t("product.shipsIn48")}</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <div>
                  <p className="text-xs font-bold text-blue-800">{t("product.genuine")}</p>
                  <p className="text-[10px] text-blue-600">{t("product.cibProduct")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Tabs */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {/* Target Pests */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              </span>
              {t("product.targetPests")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.targetPests.map((pest) => (
                <span key={pest} className="text-sm bg-red-50 text-red-700 px-3 py-1 rounded-full border border-red-100">
                  {pest}
                </span>
              ))}
            </div>
          </div>

          {/* Suitable Crops */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </span>
              {t("product.suitableCrops")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.cropSuitability.map((crop) => (
                <span key={crop} className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100">
                  {crop}
                </span>
              ))}
            </div>
          </div>

          {/* Dosage & Features */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </span>
              {t("product.application")}
            </h3>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mb-3">
              <span className="font-semibold text-gray-900">{t("product.dosage")}:</span> {product.dosage}
            </p>
            <ul className="space-y-2">
              {product.features.map((f) => (
                <li key={f} className="text-sm text-gray-600 flex items-start gap-2">
                  <svg className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Expert help CTA */}
        <div className="mt-8 bg-amber-50 rounded-2xl p-6 border border-amber-100 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-amber-900">{t("product.notSure")}</h3>
            <p className="text-sm text-amber-700 mt-1">{t("product.expertCanHelp")}</p>
          </div>
          <a href="tel:+911800123456" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-2 shadow-md">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            {t("product.callExpert")}
          </a>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("product.relatedProducts")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition group"
                >
                  <div className="w-16 h-20 bg-brand-900 rounded-lg mx-auto flex flex-col items-center justify-center mb-3">
                    <span className="text-[6px] font-extrabold text-white tracking-wider">MERCBEX</span>
                    <span className="text-[5px] text-brand-200 text-center mt-0.5 px-1 line-clamp-1">{p.formulation}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-brand-700 transition line-clamp-2">{p.name}</h3>
                  <p className="text-brand-700 font-bold mt-1 text-sm">₹{p.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
