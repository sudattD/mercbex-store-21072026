"use client";

import Link from "next/link";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image — MERCBEX blue barrel visual */}
      <Link href={`/products/${product.id}`} className="relative block">
        <div className="h-48 bg-gradient-to-br from-brand-50 to-blue-50 flex items-center justify-center relative overflow-hidden">
          <div className="w-20 h-24 bg-brand-900 rounded-lg flex flex-col items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <span className="text-[8px] font-extrabold text-white tracking-wider">MERCBEX</span>
            <div className="w-14 h-0.5 bg-brand-400 my-1" />
            <span className="text-[6px] text-brand-200 text-center leading-tight px-1 line-clamp-2">
              {product.activeIngredient}
            </span>
          </div>
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge && (
              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                product.badge === "Best Seller" ? "bg-orange-500 text-white" :
                product.badge === "New" ? "bg-blue-500 text-white" :
                product.badge === "Top Rated" ? "bg-amber-500 text-white" :
                product.badge === "Fast Acting" ? "bg-red-500 text-white" :
                product.badge === "Recommended" ? "bg-brand-700 text-white" :
                product.badge === "For Resistant Pests" ? "bg-purple-600 text-white" :
                product.badge === "Premium" ? "bg-indigo-600 text-white" :
                product.badge === "Popular" ? "bg-teal-500 text-white" :
                product.badge === "Value Pick" ? "bg-emerald-500 text-white" :
                "bg-brand-600 text-white"
              }`}>
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-red-500 text-white">
                {discount}% OFF
              </span>
            )}
          </div>
          {/* Stock indicator */}
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 text-[10px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              {t("product.inStock")}
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full w-fit mb-2 uppercase tracking-wide">
          {product.category}
        </span>

        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-gray-900 group-hover:text-brand-700 transition text-sm leading-snug line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-gray-400 mt-1">{product.activeIngredient}</p>

        {/* Target pests — key info for worried farmer */}
        <div className="mt-2 flex flex-wrap gap-1">
          {product.targetPests.slice(0, 3).map((pest) => (
            <span key={pest} className="text-[10px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
              {pest}
            </span>
          ))}
          {product.targetPests.length > 3 && (
            <span className="text-[10px] text-gray-400 px-1 py-0.5">
              +{product.targetPests.length - 3} more
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "text-amber-400" : "text-gray-200"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[10px] text-gray-400">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <div>
            <span className="text-lg font-bold text-brand-800">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through ml-1.5">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={() => addToCart(product, product.packSizes[0])}
            className="bg-brand-800 hover:bg-brand-900 text-white px-3 py-2 rounded-xl transition text-xs font-semibold flex items-center gap-1.5"
            aria-label={`Add ${product.name} to cart`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {t("product.add")}
          </button>
        </div>
      </div>
    </div>
  );
}
