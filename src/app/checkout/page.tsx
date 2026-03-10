"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", address: "", district: "", state: "", pin: "" });
  const [payment, setPayment] = useState("cod");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(!user?.addresses.length);

  const selectSavedAddress = (id: string) => {
    const addr = user?.addresses.find((a) => a.id === id);
    if (addr) {
      setForm({ name: addr.name, phone: addr.phone, address: addr.address, district: addr.district, state: addr.state, pin: addr.pin });
      setSelectedAddressId(id);
      setUseNewAddress(false);
    }
  };

  // Auto-select default address on mount
  useState(() => {
    if (user?.addresses.length) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      selectSavedAddress(defaultAddr.id);
    }
  });

  const updateField = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const placeOrder = () => {
    if (!form.name || !form.phone || !form.address || !form.district || !form.state || !form.pin) {
      alert("Please fill in all required fields");
      return;
    }
    const shipping = totalPrice >= 2000 ? 0 : 99;
    const orderId = "MBX" + Date.now().toString(36).toUpperCase();
    const order = {
      id: orderId,
      items: items.map((item) => ({
        name: item.product.name,
        activeIngredient: item.product.activeIngredient,
        size: item.selectedSize,
        quantity: item.quantity,
        price: item.product.price,
      })),
      subtotal: totalPrice,
      shipping,
      total: totalPrice + shipping,
      customer: form,
      payment,
      placedAt: new Date().toISOString(),
    };
    localStorage.setItem(`order_${orderId}`, JSON.stringify(order));
    clearCart();
    router.push(`/order/${orderId}`);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="text-gray-500 mt-2">Add products before checking out</p>
          <Link href="/products" className="inline-block mt-4 bg-brand-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-900 transition">
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  const shipping = totalPrice >= 2000 ? 0 : 99;
  const grandTotal = totalPrice + shipping;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">{t("checkout.title")}</h1>
          <p className="text-gray-500 mt-1">{t("checkout.subtitle")}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Saved Addresses */}
            {user && user.addresses.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="font-bold text-gray-900 mb-4">Saved Addresses</h2>
                <div className="space-y-2">
                  {user.addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${selectedAddressId === addr.id && !useNewAddress ? "border-brand-300 bg-brand-50 ring-1 ring-brand-100" : "border-gray-100 hover:border-brand-200"}`}
                    >
                      <input
                        type="radio"
                        name="savedAddress"
                        checked={selectedAddressId === addr.id && !useNewAddress}
                        onChange={() => selectSavedAddress(addr.id)}
                        className="w-4 h-4 text-brand-600 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-gray-900">{addr.name}</span>
                          {addr.label && <span className="text-[10px] font-semibold text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded-full">{addr.label}</span>}
                          {addr.isDefault && <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">Default</span>}
                        </div>
                        <p className="text-xs text-gray-500">{addr.address}, {addr.district}, {addr.state} - {addr.pin}</p>
                        <p className="text-xs text-gray-500">{addr.phone}</p>
                      </div>
                    </label>
                  ))}
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${useNewAddress ? "border-brand-300 bg-brand-50 ring-1 ring-brand-100" : "border-gray-100 hover:border-brand-200"}`}
                  >
                    <input
                      type="radio"
                      name="savedAddress"
                      checked={useNewAddress}
                      onChange={() => { setUseNewAddress(true); setSelectedAddressId(null); setForm({ name: "", phone: "", address: "", district: "", state: "", pin: "" }); }}
                      className="w-4 h-4 text-brand-600"
                    />
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      <span className="text-sm font-medium text-gray-700">Use a new address</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Shipping */}
            {(useNewAddress || !user?.addresses.length) && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-4">{t("checkout.shippingAddress")}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
                  <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" placeholder="Enter your name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Mobile Number *</label>
                  <input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" placeholder="+91" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Address *</label>
                  <input type="text" value={form.address} onChange={(e) => updateField("address", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" placeholder="Village/Street address" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">District *</label>
                  <input type="text" value={form.district} onChange={(e) => updateField("district", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" placeholder="District" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">State *</label>
                  <input type="text" value={form.state} onChange={(e) => updateField("state", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" placeholder="State" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">PIN Code *</label>
                  <input type="text" value={form.pin} onChange={(e) => updateField("pin", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" placeholder="6-digit PIN code" />
                </div>
              </div>
            </div>
            )}

            {/* Payment */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-4">{t("checkout.paymentMethod")}</h2>
              <div className="space-y-3">
                {[
                  { id: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives" },
                  { id: "upi", label: "UPI / Google Pay / PhonePe", desc: "Pay instantly via UPI" },
                  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay" },
                  { id: "netbanking", label: "Net Banking", desc: "All major banks supported" },
                ].map((method) => (
                  <label key={method.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-brand-200 transition cursor-pointer">
                    <input type="radio" name="payment" checked={payment === method.id} onChange={() => setPayment(method.id)} className="w-4 h-4 text-brand-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{method.label}</p>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-28">
              <h2 className="font-bold text-gray-900 mb-4">{t("checkout.orderSummary")}</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-900 rounded flex items-center justify-center shrink-0">
                      <span className="text-[5px] font-extrabold text-white">MERCBEX</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">{item.selectedSize} x {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("cart.subtotal")}</span>
                  <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("cart.shipping")}</span>
                  <span className={`font-medium ${shipping === 0 ? "text-green-600" : ""}`}>
                    {shipping === 0 ? t("cart.free") : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
                  <span>{t("cart.total")}</span>
                  <span className="text-brand-800">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                className="w-full mt-6 bg-brand-800 hover:bg-brand-900 text-white font-bold py-3.5 rounded-xl transition shadow-lg"
              >
                {t("checkout.placeOrder")} — ₹{grandTotal.toLocaleString()}
              </button>

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                {t("checkout.secure")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
