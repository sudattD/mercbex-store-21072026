"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface OrderItem {
  name: string;
  activeIngredient: string;
  size: string;
  quantity: number;
  price: number;
}

interface OrderStatusChange {
  status: string;
  timestamp: string;
  changedBy: string;
  note?: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: { name: string; phone: string; address: string; district: string; state: string; pin: string };
  payment: string;
  placedAt: string;
  status?: string;
  statusHistory?: OrderStatusChange[];
  trackingNumber?: string;
}

const trackingSteps = [
  { key: "placed", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", label: "Order Placed", desc: "Your order has been confirmed" },
  { key: "processing", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", label: "Processing", desc: "Order is being packed at warehouse" },
  { key: "shipped", icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0", label: "Shipped", desc: "On the way to your location" },
  { key: "outForDelivery", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z", label: "Out for Delivery", desc: "Will be delivered today" },
  { key: "delivered", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1", label: "Delivered", desc: "Order delivered successfully" },
];

const STATUS_TO_STEP: Record<string, number> = {
  placed: 0,
  confirmed: 0,
  processing: 1,
  shipped: 2,
  out_for_delivery: 3,
  delivered: 4,
  cancelled: -1,
  returned: -1,
};

function getActiveStep(order: Order): number {
  // Use admin-set status if available
  if (order.status) {
    return STATUS_TO_STEP[order.status] ?? 0;
  }
  // Fallback to time-based tracking
  const elapsed = Date.now() - new Date(order.placedAt).getTime();
  const hours = elapsed / (1000 * 60 * 60);
  if (hours < 1) return 0;
  if (hours < 6) return 1;
  if (hours < 24) return 2;
  if (hours < 36) return 3;
  return 4;
}

function getEstimatedDelivery(placedAt: string): string {
  const date = new Date(placedAt);
  date.setDate(date.getDate() + 2);
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

export default function OrderTrackingPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`order_${id}`);
    if (stored) {
      setOrder(JSON.parse(stored));
    } else {
      setNotFound(true);
    }
  }, [id]);

  if (notFound) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900">Order not found</h2>
          <p className="text-gray-500 mt-2">We couldn&apos;t find an order with ID: {id}</p>
          <Link href="/products" className="inline-block mt-4 bg-brand-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-900 transition">
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
      </main>
    );
  }

  const activeStep = getActiveStep(order);
  const isCancelled = order.status === "cancelled" || order.status === "returned";
  const estimatedDelivery = getEstimatedDelivery(order.placedAt);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-950 to-brand-900 py-8 sm:py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-brand-300 text-sm mb-3">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-white">Order Tracking</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Order #{order.id}</h1>
              <p className="text-brand-300 mt-1 text-sm">
                Placed on {new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <div className="bg-brand-800/50 border border-brand-700/30 rounded-xl px-4 py-2.5">
              <p className="text-xs text-brand-300">Estimated Delivery</p>
              <p className="text-white font-bold">{estimatedDelivery}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Cancelled/Returned Banner */}
        {isCancelled && (
          <div className={`rounded-2xl p-5 border ${order.status === "cancelled" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
            <p className={`font-bold ${order.status === "cancelled" ? "text-red-700" : "text-amber-700"}`}>
              Order {order.status === "cancelled" ? "Cancelled" : "Returned"}
            </p>
            {order.statusHistory && order.statusHistory.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {order.statusHistory[order.statusHistory.length - 1].note || `This order has been ${order.status}.`}
              </p>
            )}
          </div>
        )}

        {/* Tracking Number */}
        {order.trackingNumber && (
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex items-center gap-3">
            <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
            <div>
              <p className="text-xs text-blue-600 font-medium">Tracking Number</p>
              <p className="text-sm font-bold text-blue-900">{order.trackingNumber}</p>
            </div>
          </div>
        )}

        {/* Tracking Timeline */}
        {!isCancelled && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-6">Order Status</h2>
          <div className="space-y-0">
            {trackingSteps.map((step, idx) => {
              const isActive = idx === activeStep;
              const isCompleted = idx < activeStep;
              const isPending = idx > activeStep;

              return (
                <div key={step.key} className="flex gap-4">
                  {/* Vertical line + circle */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isCompleted ? "bg-green-100 text-green-600" :
                      isActive ? "bg-brand-100 text-brand-700 ring-4 ring-brand-50" :
                      "bg-gray-100 text-gray-400"
                    }`}>
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={step.icon} /></svg>
                      )}
                    </div>
                    {idx < trackingSteps.length - 1 && (
                      <div className={`w-0.5 h-12 ${isCompleted ? "bg-green-300" : "bg-gray-200"}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`pt-2 pb-6 ${isPending ? "opacity-40" : ""}`}>
                    <p className={`font-semibold text-sm ${isActive ? "text-brand-700" : isCompleted ? "text-green-700" : "text-gray-500"}`}>
                      {step.label}
                      {isActive && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
                          Current
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-brand-900 rounded-lg flex flex-col items-center justify-center shrink-0">
                  <span className="text-[6px] font-extrabold text-white tracking-wider">MERCBEX</span>
                  <span className="text-[5px] text-brand-200 text-center mt-0.5 px-1 line-clamp-1">{item.activeIngredient}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.size} x {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-gray-900 shrink-0">₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">₹{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className={`font-medium ${order.shipping === 0 ? "text-green-600" : ""}`}>
                {order.shipping === 0 ? "Free" : `₹${order.shipping}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
              <span>Total</span>
              <span className="text-brand-800">₹{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery & Payment Info */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-3 text-sm">Delivery Address</h2>
            <p className="text-sm text-gray-700 font-medium">{order.customer.name}</p>
            <p className="text-sm text-gray-500 mt-1">{order.customer.address}</p>
            <p className="text-sm text-gray-500">{order.customer.district}, {order.customer.state} - {order.customer.pin}</p>
            <p className="text-sm text-gray-500 mt-1">{order.customer.phone}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-3 text-sm">Payment</h2>
            <p className="text-sm text-gray-700 font-medium capitalize">{order.payment}</p>
            <p className="text-sm text-gray-500 mt-1">Amount: ₹{order.total.toLocaleString()}</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1.5 rounded-lg w-fit">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Confirmed
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="bg-brand-50 rounded-2xl p-5 sm:p-6 border border-brand-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-gray-900">Need help with your order?</p>
              <p className="text-sm text-gray-500 mt-1">Our team is available 24/7 to assist you</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/911800123456?text=${encodeURIComponent(`Hi MERCBEX, I need help with my order #${order.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shrink-0"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
              <a
                href="tel:+911800123456"
                className="flex items-center gap-2 bg-brand-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-900 transition shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Call
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
