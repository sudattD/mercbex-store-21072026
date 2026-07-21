"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useCart, type CartItem } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

function timeAgo(iso: string) {
  const diff = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.round(diff / 60)}h ago`;
  return `${Math.round(diff / 1440)}d ago`;
}

function CartItemRow({ item, updateQuantity, removeFromCart }: {
  item: CartItem;
  updateQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
}) {
  return (
    <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
      <div className="w-14 h-14 bg-brand-900 rounded-lg flex flex-col items-center justify-center shrink-0">
        <span className="text-[6px] font-extrabold text-white tracking-wider">MERCBEX</span>
        <span className="text-[5px] text-brand-200 text-center mt-0.5 px-1 line-clamp-1">{item.product.formulation}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-gray-900 truncate">{item.product.name}</h3>
        <p className="text-[11px] text-gray-400 mt-0.5">{item.selectedSize}</p>
        {item.scanContext && (
          <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-green-700">
            <span>For {item.scanContext.disease}</span>
            <span className="text-green-500/50">· {timeAgo(item.scanContext.scannedAt)}</span>
          </div>
        )}
        <p className="text-brand-700 font-bold text-sm mt-1">₹{item.product.price.toLocaleString()}</p>
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition text-sm">-</button>
          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition text-sm">+</button>
          <button onClick={() => removeFromCart(item.product.id)} className="ml-auto text-red-400 hover:text-red-600 transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, totalPrice, isCartOpen, setIsCartOpen } = useCart();
  const { t } = useLanguage();

  // Group items: scan items grouped by crop, rest in "other"
  const { cropGroups, otherItems } = useMemo(() => {
    const groups: Record<string, { crop: string; cropIcon: string; items: CartItem[] }> = {};
    const other: CartItem[] = [];

    items.forEach((item) => {
      if (item.scanContext) {
        const key = item.scanContext.crop;
        if (!groups[key]) {
          groups[key] = { crop: item.scanContext.crop, cropIcon: item.scanContext.cropIcon, items: [] };
        }
        groups[key].items.push(item);
      } else {
        other.push(item);
      }
    });

    return { cropGroups: Object.values(groups), otherItems: other };
  }, [items]);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{t("cart.title")} ({items.length})</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <p className="text-gray-500 font-medium">{t("cart.empty")}</p>
              <p className="text-sm text-gray-400 mt-1">{t("cart.emptyDesc")}</p>
            </div>
          ) : (
            <>
              {/* Crop-grouped sections */}
              {cropGroups.map((group) => (
                <div key={group.crop}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg leading-none">{group.cropIcon}</span>
                    <h3 className="text-sm font-bold text-gray-900">{group.crop}</h3>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{group.items.length} {group.items.length === 1 ? "medicine" : "medicines"}</span>
                  </div>
                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <CartItemRow key={item.product.id} item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
                    ))}
                  </div>
                </div>
              ))}

              {/* Other items (not from scan) */}
              {otherItems.length > 0 && (
                <div>
                  {cropGroups.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                      <h3 className="text-sm font-bold text-gray-900">Other Items</h3>
                    </div>
                  )}
                  <div className="space-y-3">
                    {otherItems.map((item) => (
                      <CartItemRow key={item.product.id} item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t("cart.subtotal")}</span>
              <span className="font-semibold text-gray-900">₹{totalPrice.toLocaleString()}</span>
            </div>
            {totalPrice >= 2000 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t("cart.shipping")}</span>
                <span className="font-semibold text-green-600">{t("cart.free")}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
              <span>{t("cart.total")}</span>
              <span className="text-brand-800">₹{totalPrice.toLocaleString()}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="block w-full bg-brand-800 hover:bg-brand-900 text-white text-center font-semibold py-3 rounded-xl transition"
            >
              {t("cart.checkout")}
            </Link>
            <button onClick={() => setIsCartOpen(false)} className="block w-full text-center text-sm text-gray-500 hover:text-gray-700 transition">
              {t("cart.continueShopping")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
