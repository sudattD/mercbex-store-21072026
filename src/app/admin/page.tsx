"use client";

import { useState, useEffect, useMemo } from "react";
import type { Product } from "@/data/products";
import { products as hardcodedProducts, categories } from "@/data/products";

// User type — matches AuthContext
interface Address { id: string; label: string; name: string; phone: string; address: string; district: string; state: string; pin: string; isDefault: boolean; }
interface User { id: string; name: string; phone: string; email: string; addresses: Address[]; createdAt: string; }

// ─── Types ─────────────────────────────────────────────────────────────────────

interface StoreSettings { promoBanner?: { enabled: boolean; title: string; description: string; linkText: string; linkUrl: string; bgColor: string; textColor: string; }; }
interface ScanRecord { id: string; crop: string; disease: string; severity: string; confidence: number; timestamp: string; status?: string; totalIssues?: number; }
interface Order { id: string; items: { name: string; quantity: number; price: number }[]; subtotal: number; shipping: number; total: number; customer: Record<string, string>; payment: string; placedAt: string; }

type Tab = "dashboard" | "orders" | "products" | "users" | "customers" | "scans" | "promo";

function fmt(n: number) { return `₹${n.toLocaleString("en-IN")}`; }
function dt(iso: string) { return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24); return d < 30 ? `${d}d ago` : dt(iso);
}
function orderStatusTag(status: string) {
  const colors: Record<string, string> = { placed: "bg-blue-100 text-blue-700", processing: "bg-amber-100 text-amber-700", shipped: "bg-purple-100 text-purple-700", out_for_delivery: "bg-cyan-100 text-cyan-700", delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700" };
  const label = status.replace(/_/g, " ");
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${colors[status] || "bg-gray-100 text-gray-700"}`}>{label}</span>;
}

// ─── NAV ──────────────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: Tab; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
  { id: "orders", label: "Orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  { id: "products", label: "Products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { id: "users", label: "Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { id: "customers", label: "Customers", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { id: "scans", label: "Crop Scans", icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM15 13a3 3 0 11-6 0 3 3 0 016 0z" },
  { id: "promo", label: "Promo Banner", icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" },
];

// ─── SEED DATA ────────────────────────────────────────────────────────────────

function seedData() {
  if (localStorage.getItem("mercbex_admin_seeded")) return;

  const users = [
    { id: "u1", name: "Rajesh Kumar", phone: "9876543210", email: "rajesh.k@gmail.com", addresses: [{ id: "a1", label: "Farm", name: "Rajesh Kumar", phone: "9876543210", address: "Village Patti", district: "Ludhiana", state: "Punjab", pin: "142026", isDefault: true }, { id: "a2", label: "Home", name: "Rajesh Kumar", phone: "9876543210", address: "Model Town", district: "Ludhiana", state: "Punjab", pin: "141001", isDefault: false }], createdAt: "2026-07-05T08:30:00Z" },
    { id: "u2", name: "Anita Devi", phone: "9876543211", email: "anita.devi@yahoo.com", addresses: [{ id: "a3", label: "Vineyard", name: "Anita Devi", phone: "9876543211", address: "Grape Valley", district: "Nashik", state: "Maharashtra", pin: "422103", isDefault: true }], createdAt: "2026-06-28T10:15:00Z" },
    { id: "u3", name: "Suresh Patel", phone: "9876543212", email: "suresh.patel@rediffmail.com", addresses: [{ id: "a4", label: "Farm", name: "Suresh Patel", phone: "9876543212", address: "Anand Highway", district: "Anand", state: "Gujarat", pin: "388001", isDefault: true }], createdAt: "2026-06-25T14:00:00Z" },
    { id: "u4", name: "Lakshmi Narayanan", phone: "9876543213", email: "lakshmi.n@gmail.com", addresses: [{ id: "a5", label: "Home", name: "Lakshmi Narayanan", phone: "9876543213", address: "Mannargudi Road", district: "Thanjavur", state: "Tamil Nadu", pin: "613001", isDefault: true }], createdAt: "2026-06-21T16:45:00Z" },
    { id: "u5", name: "Mohammed Irfan", phone: "9876543214", email: "irfan.m@outlook.com", addresses: [{ id: "a6", label: "Farm", name: "Mohammed Irfan", phone: "9876543214", address: "Zaheerabad Highway", district: "Sangareddy", state: "Telangana", pin: "502220", isDefault: true }, { id: "a7", label: "Home", name: "Mohammed Irfan", phone: "9876543214", address: "Ameerpet", district: "Hyderabad", state: "Telangana", pin: "500016", isDefault: false }], createdAt: "2026-06-18T09:30:00Z" },
    { id: "u6", name: "Kavitha Shetty", phone: "9876543215", email: "kavitha.shetty@gmail.com", addresses: [{ id: "a8", label: "Farm", name: "Kavitha Shetty", phone: "9876543215", address: "Mangalore Road", district: "Udupi", state: "Karnataka", pin: "576101", isDefault: true }], createdAt: "2026-06-16T11:20:00Z" },
    { id: "u7", name: "Gurpreet Singh", phone: "9876543216", email: "gurpreet.s@yahoo.co.in", addresses: [{ id: "a9", label: "Farm", name: "Gurpreet Singh", phone: "9876543216", address: "Bathinda Road", district: "Bathinda", state: "Punjab", pin: "151001", isDefault: true }], createdAt: "2026-06-15T07:15:00Z" },
    { id: "u8", name: "Priya Sharma", phone: "9876543217", email: "priya.sharma@gmail.com", addresses: [{ id: "a10", label: "Home", name: "Priya Sharma", phone: "9876543217", address: "Indore-Dewas", district: "Indore", state: "Madhya Pradesh", pin: "452001", isDefault: true }, { id: "a11", label: "Farm", name: "Priya Sharma", phone: "9876543217", address: "Mhow Tehsil", district: "Indore", state: "Madhya Pradesh", pin: "453441", isDefault: false }], createdAt: "2026-06-09T13:00:00Z" },
    { id: "u9", name: "Ravi Verma", phone: "9876543218", email: "ravi.verma@gmail.com", addresses: [{ id: "a12", label: "Farm", name: "Ravi Verma", phone: "9876543218", address: "Patna Highway", district: "Patna", state: "Bihar", pin: "800001", isDefault: true }], createdAt: "2026-06-04T10:45:00Z" },
    { id: "u10", name: "Sunita Rani", phone: "9876543219", email: "sunita.rani@yahoo.com", addresses: [{ id: "a13", label: "Home", name: "Sunita Rani", phone: "9876543219", address: "Muzaffarnagar City", district: "Muzaffarnagar", state: "Uttar Pradesh", pin: "251001", isDefault: true }], createdAt: "2026-05-27T08:00:00Z" },
    { id: "u11", name: "Mohan Singh", phone: "9988776655", email: "mohan.singh@gmail.com", addresses: [{ id: "a14", label: "Farm", name: "Mohan Singh", phone: "9988776655", address: "Moga Road", district: "Ferozepur", state: "Punjab", pin: "152001", isDefault: true }], createdAt: "2026-06-16T09:00:00Z" },
    { id: "u12", name: "Ramesh Gupta", phone: "9789012345", email: "ramesh.gupta@gmail.com", addresses: [{ id: "a15", label: "Home", name: "Ramesh Gupta", phone: "9789012345", address: "Jaipur Road", district: "Ajmer", state: "Rajasthan", pin: "305001", isDefault: true }, { id: "a16", label: "Shop", name: "Ramesh Gupta", phone: "9789012345", address: "Kishangarh", district: "Ajmer", state: "Rajasthan", pin: "305801", isDefault: false }], createdAt: "2026-06-13T11:00:00Z" },
    { id: "u13", name: "Subrata Ghosh", phone: "9001234567", email: "subrata.ghosh@gmail.com", addresses: [{ id: "a17", label: "Farm", name: "Subrata Ghosh", phone: "9001234567", address: "Bardhaman Road", district: "Hooghly", state: "West Bengal", pin: "712101", isDefault: true }], createdAt: "2026-06-10T15:30:00Z" },
    { id: "u14", name: "Deepika Rani", phone: "9012345678", email: "deepika.rani@gmail.com", addresses: [{ id: "a18", label: "Farm", name: "Deepika Rani", phone: "9012345678", address: "Panipat Road", district: "Karnal", state: "Haryana", pin: "132001", isDefault: true }], createdAt: "2026-06-07T07:00:00Z" },
    { id: "u15", name: "Venkateswara Rao", phone: "9023456789", email: "venkat.rao@gmail.com", addresses: [{ id: "a19", label: "Farm", name: "Venkateswara Rao", phone: "9023456789", address: "Guntur Highway", district: "Guntur", state: "Andhra Pradesh", pin: "522001", isDefault: true }], createdAt: "2026-05-30T10:00:00Z" },
  ];
  users.forEach((u) => localStorage.setItem(`mercbex_user_${u.id}`, JSON.stringify(u)));

  const scans: (ScanRecord & { userId: string })[] = [
    { id: "s1", userId: "u1", crop: "Rice (Paddy)", disease: "Brown Plant Hopper", severity: "critical", confidence: 94, timestamp: "2026-07-20T09:15:00Z", status: "action_needed" },
    { id: "s2", userId: "u1", crop: "Rice (Paddy)", disease: "Stem Borer", severity: "high", confidence: 90, timestamp: "2026-07-18T15:20:00Z", status: "action_needed" },
    { id: "s3", userId: "u1", crop: "Cotton", disease: "Whitefly Infestation", severity: "high", confidence: 89, timestamp: "2026-07-16T14:30:00Z", status: "in_cart" },
    { id: "s4", userId: "u1", crop: "Rice (Paddy)", disease: "Rice Blast", severity: "critical", confidence: 92, timestamp: "2026-07-14T11:00:00Z", status: "in_cart" },
    { id: "s5", userId: "u2", crop: "Grapes", disease: "Powdery Mildew", severity: "high", confidence: 88, timestamp: "2026-07-13T09:45:00Z", status: "in_cart" },
    { id: "s6", userId: "u2", crop: "Grapes", disease: "Downy Mildew", severity: "critical", confidence: 91, timestamp: "2026-07-11T10:30:00Z", status: "in_cart" },
    { id: "s7", userId: "u4", crop: "Rice (Paddy)", disease: "Sheath Blight", severity: "high", confidence: 86, timestamp: "2026-07-10T08:00:00Z", status: "incomplete" },
    { id: "s8", userId: "u4", crop: "Tomato", disease: "Leaf Curl Virus", severity: "high", confidence: 91, timestamp: "2026-07-08T16:45:00Z", status: "incomplete" },
    { id: "s9", userId: "u4", crop: "Chili", disease: "Thrips Damage", severity: "medium", confidence: 85, timestamp: "2026-07-06T08:20:00Z", status: "incomplete" },
    { id: "s10", userId: "u5", crop: "Cotton", disease: "Bollworm Damage", severity: "critical", confidence: 92, timestamp: "2026-07-05T11:10:00Z", status: "action_needed" },
    { id: "s11", userId: "u5", crop: "Cotton", disease: "Aphid Infestation", severity: "high", confidence: 87, timestamp: "2026-07-03T14:00:00Z", status: "action_needed" },
    { id: "s12", userId: "u5", crop: "Sugarcane", disease: "Red Rot Disease", severity: "critical", confidence: 93, timestamp: "2026-07-01T10:30:00Z", status: "action_needed" },
    { id: "s13", userId: "u6", crop: "Rice (Paddy)", disease: "Brown Plant Hopper", severity: "critical", confidence: 95, timestamp: "2026-06-30T09:00:00Z", status: "in_cart" },
    { id: "s14", userId: "u6", crop: "Cotton", disease: "Whitefly", severity: "medium", confidence: 82, timestamp: "2026-06-28T11:30:00Z", status: "in_cart" },
    { id: "s15", userId: "u6", crop: "Chili", disease: "Anthracnose", severity: "high", confidence: 88, timestamp: "2026-06-26T14:00:00Z", status: "action_needed" },
    { id: "s16", userId: "u6", crop: "Potato", disease: "Late Blight", severity: "critical", confidence: 97, timestamp: "2026-06-24T13:00:00Z", status: "in_cart" },
    { id: "s17", userId: "u6", crop: "Mango", disease: "Mango Hopper", severity: "high", confidence: 87, timestamp: "2026-06-22T08:00:00Z", status: "incomplete" },
    { id: "s18", userId: "u9", crop: "Wheat", disease: "Yellow Rust", severity: "critical", confidence: 96, timestamp: "2026-06-20T11:00:00Z", status: "action_needed" },
    { id: "s19", userId: "u9", crop: "Soybean", disease: "Soybean Rust", severity: "high", confidence: 86, timestamp: "2026-06-18T14:30:00Z", status: "action_needed" },
    { id: "s20", userId: "u11", crop: "Wheat", disease: "Termite Damage", severity: "high", confidence: 84, timestamp: "2026-06-15T09:00:00Z", status: "in_cart" },
    { id: "s21", userId: "u12", crop: "Sugarcane", disease: "Stem Borer", severity: "critical", confidence: 91, timestamp: "2026-06-13T10:00:00Z", status: "in_cart" },
    { id: "s22", userId: "u12", crop: "Wheat", disease: "Aphid Infestation", severity: "medium", confidence: 83, timestamp: "2026-06-11T15:00:00Z", status: "incomplete" },
    { id: "s23", userId: "u12", crop: "Potato", disease: "Early Blight", severity: "high", confidence: 89, timestamp: "2026-06-09T12:00:00Z", status: "in_cart" },
    { id: "s24", userId: "u13", crop: "Rice (Paddy)", disease: "Sheath Blight", severity: "high", confidence: 88, timestamp: "2026-06-07T09:30:00Z", status: "action_needed" },
    { id: "s25", userId: "u13", crop: "Potato", disease: "Late Blight", severity: "critical", confidence: 94, timestamp: "2026-06-05T14:00:00Z", status: "action_needed" },
    { id: "s26", userId: "u14", crop: "Wheat", disease: "Yellow Rust", severity: "high", confidence: 90, timestamp: "2026-06-03T10:00:00Z", status: "incomplete" },
    { id: "s27", userId: "u14", crop: "Rice (Paddy)", disease: "Brown Plant Hopper", severity: "critical", confidence: 93, timestamp: "2026-06-01T11:00:00Z", status: "incomplete" },
    { id: "s28", userId: "u14", crop: "Sugarcane", disease: "Termite Damage", severity: "medium", confidence: 81, timestamp: "2026-05-30T15:00:00Z", status: "incomplete" },
    { id: "s29", userId: "u14", crop: "Tomato", disease: "Early Blight", severity: "high", confidence: 85, timestamp: "2026-05-28T09:00:00Z", status: "incomplete" },
    { id: "s30", userId: "u15", crop: "Cotton", disease: "Bollworm Damage", severity: "critical", confidence: 96, timestamp: "2026-05-25T10:00:00Z", status: "in_cart" },
    { id: "s31", userId: "u15", crop: "Chili", disease: "Thrips Damage", severity: "medium", confidence: 84, timestamp: "2026-05-23T14:00:00Z", status: "in_cart" },
  ];
  localStorage.setItem("mercbex_crop_scans", JSON.stringify(scans.map(({ userId: _u, ...rest }) => rest)));
  localStorage.setItem("mercbex_admin_scan_map", JSON.stringify(scans.map((s) => ({ sid: s.id, uid: s.userId, crop: s.crop }))));

  localStorage.setItem("mercbex_store_settings", JSON.stringify({
    promoBanner: { enabled: true, title: "🌾 Monsoon Offer: 20% OFF", description: "Free shipping on orders above ₹2,000", linkText: "Shop Now", linkUrl: "/products", bgColor: "#166534", textColor: "#ffffff" }
  }));

  const orders: (Order & { status: string })[] = [
    { id: "ORD001", items: [{ name: "Imidacloprid 17.1% SL", quantity: 2, price: 599 }, { name: "Clothianidin 50% WG", quantity: 1, price: 1299 }], subtotal: 2497, shipping: 0, total: 2497, customer: { name: "Rajesh Kumar", phone: "9876543210" }, payment: "COD", placedAt: "2026-07-20T06:15:00Z", status: "placed" },
    { id: "ORD011", items: [{ name: "Fipronil 0.6% WG", quantity: 1, price: 899 }], subtotal: 899, shipping: 0, total: 899, customer: { name: "Rajesh Kumar", phone: "9876543210" }, payment: "UPI", placedAt: "2026-07-19T05:00:00Z", status: "delivered" },
    { id: "ORD002", items: [{ name: "Copper Hydroxide 77% WP", quantity: 1, price: 799 }], subtotal: 799, shipping: 99, total: 898, customer: { name: "Anita Devi", phone: "9876543211" }, payment: "UPI", placedAt: "2026-07-20T07:30:00Z", status: "processing" },
    { id: "ORD003", items: [{ name: "Azoxystrobin + Tebuconazole SC", quantity: 1, price: 1599 }], subtotal: 1599, shipping: 0, total: 1599, customer: { name: "Suresh Patel", phone: "9876543212" }, payment: "COD", placedAt: "2026-07-19T22:00:00Z", status: "placed" },
    { id: "ORD005", items: [{ name: "Bifenthrin + Clothianidin SC", quantity: 2, price: 1599 }], subtotal: 3198, shipping: 0, total: 3198, customer: { name: "Mohammed Irfan", phone: "9876543214" }, payment: "Net Banking", placedAt: "2026-07-17T09:45:00Z", status: "processing" },
    { id: "ORD006", items: [{ name: "Mancozeb + Azoxystrobin OS", quantity: 1, price: 1099 }, { name: "Copper Oxychloride 50% WG", quantity: 1, price: 649 }], subtotal: 1748, shipping: 0, total: 1748, customer: { name: "Kavitha Shetty", phone: "9876543215" }, payment: "Card", placedAt: "2026-07-16T11:20:00Z", status: "shipped" },
    { id: "ORD008", items: [{ name: "Pendimethalin + Pyrazosulfuron ZC", quantity: 1, price: 999 }], subtotal: 999, shipping: 99, total: 1098, customer: { name: "Priya Sharma", phone: "9876543217" }, payment: "Net Banking", placedAt: "2026-07-13T08:00:00Z", status: "delivered" },
    { id: "ORD018", items: [{ name: "Clodinafop Propargyl 15% DF", quantity: 1, price: 549 }, { name: "Glufosinate Ammonium 13.5% SL", quantity: 1, price: 899 }], subtotal: 1448, shipping: 0, total: 1448, customer: { name: "Priya Sharma", phone: "9876543217" }, payment: "Net Banking", placedAt: "2026-07-09T16:00:00Z", status: "delivered" },
    { id: "ORD007", items: [{ name: "Clothianidin 50% WG", quantity: 1, price: 1299 }], subtotal: 1299, shipping: 99, total: 1398, customer: { name: "Mohan Singh", phone: "9988776655" }, payment: "UPI", placedAt: "2026-07-14T16:30:00Z", status: "shipped" },
    { id: "ORD020", items: [{ name: "Thiacloprid 21.7% SC", quantity: 1, price: 849 }], subtotal: 849, shipping: 99, total: 948, customer: { name: "Mohan Singh", phone: "9988776655" }, payment: "Card", placedAt: "2026-07-07T12:45:00Z", status: "delivered" },
    { id: "ORD009", items: [{ name: "Chlorfenapyr 10% SC", quantity: 1, price: 1199 }, { name: "Benzpyrimoxan 10% SC", quantity: 1, price: 1399 }], subtotal: 2598, shipping: 0, total: 2598, customer: { name: "Ramesh Gupta", phone: "9789012345" }, payment: "COD", placedAt: "2026-07-12T13:15:00Z", status: "out_for_delivery" },
    { id: "ORD019", items: [{ name: "Chlorpyriphos 75% WG", quantity: 2, price: 699 }], subtotal: 1398, shipping: 0, total: 1398, customer: { name: "Ramesh Gupta", phone: "9789012345" }, payment: "COD", placedAt: "2026-07-08T07:00:00Z", status: "delivered" },
    { id: "ORD013", items: [{ name: "Flupyrimin 10% SC", quantity: 1, price: 1499 }, { name: "Benzpyrimoxan 10% SC", quantity: 1, price: 1399 }], subtotal: 2898, shipping: 0, total: 2898, customer: { name: "Subrata Ghosh", phone: "9001234567" }, payment: "Card", placedAt: "2026-07-15T15:00:00Z", status: "delivered" },
    { id: "ORD015", items: [{ name: "Bifenthrin + Clothianidin SC", quantity: 1, price: 1599 }, { name: "Imidacloprid 17.1% SL", quantity: 2, price: 599 }], subtotal: 2797, shipping: 0, total: 2797, customer: { name: "Venkateswara Rao", phone: "9023456789" }, payment: "Net Banking", placedAt: "2026-07-12T11:00:00Z", status: "delivered" },
    { id: "ORD004", items: [{ name: "Fipronil 0.6% WG", quantity: 1, price: 899 }], subtotal: 899, shipping: 0, total: 899, customer: { name: "Harish Choudhary", phone: "9876543220" }, payment: "Card", placedAt: "2026-07-18T14:00:00Z", status: "out_for_delivery" },
    { id: "ORD010", items: [{ name: "Bifenthrin + Clothianidin SC", quantity: 1, price: 1599 }, { name: "Imidacloprid 17.1% SL", quantity: 1, price: 599 }], subtotal: 2198, shipping: 0, total: 2198, customer: { name: "Vikram Patel", phone: "9345678901" }, payment: "Net Banking", placedAt: "2026-07-11T10:00:00Z", status: "delivered" },
    { id: "ORD012", items: [{ name: "Copper Hydroxide 77% WP", quantity: 1, price: 799 }], subtotal: 799, shipping: 99, total: 898, customer: { name: "Sunita Devi", phone: "9812345678" }, payment: "UPI", placedAt: "2026-07-18T12:00:00Z", status: "delivered" },
    { id: "ORD014", items: [{ name: "Clothianidin 50% WG", quantity: 1, price: 1299 }], subtotal: 1299, shipping: 99, total: 1398, customer: { name: "Kavita Joshi", phone: "9890123456" }, payment: "COD", placedAt: "2026-07-14T09:00:00Z", status: "shipped" },
    { id: "ORD016", items: [{ name: "Azoxystrobin + Tebuconazole SC", quantity: 1, price: 1599 }], subtotal: 1599, shipping: 0, total: 1599, customer: { name: "Harish Choudhary", phone: "9876543220" }, payment: "Card", placedAt: "2026-07-11T14:00:00Z", status: "delivered" },
    { id: "ORD017", items: [{ name: "Pendimethalin + Pyrazosulfuron ZC", quantity: 1, price: 999 }], subtotal: 999, shipping: 99, total: 1098, customer: { name: "Vikram Patel", phone: "9345678901" }, payment: "UPI", placedAt: "2026-07-10T08:30:00Z", status: "placed" },
    { id: "ORD021", items: [{ name: "Chlorpyriphos 75% WG", quantity: 2, price: 699 }], subtotal: 1398, shipping: 99, total: 1497, customer: { name: "Sunita Rani", phone: "9876543219" }, payment: "COD", placedAt: "2026-07-05T09:00:00Z", status: "cancelled" },
    { id: "ORD022", items: [{ name: "Mancozeb + Azoxystrobin OS", quantity: 1, price: 1099 }], subtotal: 1099, shipping: 99, total: 1198, customer: { name: "Gurpreet Singh", phone: "9876543216" }, payment: "Card", placedAt: "2026-07-03T14:30:00Z", status: "cancelled" },
  ];
  orders.forEach((o) => localStorage.setItem(`order_${o.id}`, JSON.stringify(o)));
  localStorage.setItem("mercbex_admin_seeded", "1");
}

function loadOrders(): (Order & { status: string })[] {
  const list: (Order & { status: string })[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("order_")) {
      try { const o = JSON.parse(localStorage.getItem(key) || "{}"); list.push({ ...o, status: o.status || "placed" }); } catch {}
    }
  }
  return list.sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
}

// ─── Admin Page ───────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState<(Order & { status: string }) | null>(null);

  // Data
  const [products, setProducts] = useState<Product[]>(() => {
    // Clear old seed flag so fresh seed data always loads
    try { localStorage.removeItem("mercbex_admin_seeded"); } catch {}
    try { const s = localStorage.getItem("mercbex_products_override"); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [ordersList, setOrdersList] = useState<(Order & { status: string })[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [promo, setPromo] = useState<NonNullable<StoreSettings["promoBanner"]>>({ enabled: false, title: "", description: "", linkText: "", linkUrl: "", bgColor: "#166534", textColor: "#ffffff" });
  const [savedToast, setSavedToast] = useState(false);

  // Filters
  const [productCategory, setProductCategory] = useState("all");
  const [productSearch, setProductSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [cropFilter, setCropFilter] = useState("all");
  const [customerSearch, setCustomerSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [scanFilter, setScanFilter] = useState("all");

  useEffect(() => {
    seedData();
    const s = localStorage.getItem("mercbex_crop_scans"); if (s) try { setScans(JSON.parse(s)); } catch {}
    const u: User[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("mercbex_user_")) { try { u.push(JSON.parse(localStorage.getItem(key) || "{}")); } catch {} }
    }
    setUsers(u);
    const ss = localStorage.getItem("mercbex_store_settings"); if (ss) try { const p = JSON.parse(ss) as StoreSettings; if (p.promoBanner) setPromo(p.promoBanner); } catch {}
    setOrdersList(loadOrders());
  }, []);

  const showToast = () => { setSavedToast(true); setTimeout(() => setSavedToast(false), 2000); };

  const mergedProducts = useMemo(() => {
    const merged = hardcodedProducts.map((p) => { const o = products.find((ap) => ap.id === p.id); return o ? { ...p, ...o } : p; });
    const existingIds = new Set(hardcodedProducts.map((p) => p.id));
    return [...merged, ...products.filter((ap) => !existingIds.has(ap.id))];
  }, [products]);

  const filteredProducts = mergedProducts.filter((p) => {
    if (productCategory !== "all" && p.category !== productCategory) return false;
    if (productSearch.trim()) { const q = productSearch.toLowerCase(); return p.name.toLowerCase().includes(q) || p.id.includes(q); }
    return true;
  });

  const allLocs = useMemo(() => { const s = new Set<string>(); users.forEach((u) => u.addresses.forEach((a) => { if (a.state) s.add(a.state); })); return Array.from(s).sort(); }, [users]);
  const allCrops = useMemo(() => { const s = new Set<string>(); scans.forEach((sc) => { if (sc.crop) s.add(sc.crop); }); return Array.from(s).sort(); }, [scans]);

  const filteredCustomers = users.filter((u) => {
    if (locationFilter !== "all" && !u.addresses.some((a) => a.state === locationFilter)) return false;
    if (cropFilter !== "all" && !scans.some((s) => s.crop === cropFilter)) return false;
    if (customerSearch.trim()) { const q = customerSearch.toLowerCase(); return u.name.toLowerCase().includes(q) || u.phone.includes(q) || u.email.toLowerCase().includes(q); }
    return true;
  });

  const ordersStat = useMemo(() => {
    const counts = { placed: 0, processing: 0, shipped: 0, out_for_delivery: 0, delivered: 0 };
    ordersList.forEach((o) => { if (o.status in counts) (counts as Record<string, number>)[o.status]++; });
    return { total: ordersList.length, totalRevenue: ordersList.reduce((s, o) => s + o.total, 0), todayRevenue: ordersList.filter((o) => new Date(o.placedAt) > new Date(Date.now() - 86400000)).reduce((s, o) => s + o.total, 0), todayOrders: ordersList.filter((o) => new Date(o.placedAt) > new Date(Date.now() - 86400000)).length, avgOrder: Math.round(ordersList.reduce((s, o) => s + o.total, 0) / (ordersList.length || 1)), ...counts };
  }, [ordersList]);

  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === "all") return ordersList;
    return ordersList.filter((o) => o.status === orderStatusFilter);
  }, [ordersList, orderStatusFilter]);

  const savePromo = () => { localStorage.setItem("mercbex_store_settings", JSON.stringify({ promoBanner: promo })); showToast(); };

  const NavLink = ({ item, current }: { item: typeof NAV_ITEMS[0]; current: Tab }) => (
    <button onClick={() => { setTab(item.id); setSidebarOpen(false); }}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition w-full text-left ${current === item.id ? "bg-brand-800 text-white" : "text-brand-200 hover:bg-white/5 hover:text-white"}`}>
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} /></svg>
      {item.label}
    </button>
  );

  // ── RENDER ──

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {savedToast && <div className="fixed top-4 right-4 z-[100] bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg">✓ Saved</div>}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── SIDEBAR ── */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-brand-950 text-white flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight">MERCBEX</div>
              <div className="text-[10px] text-brand-300 tracking-wider uppercase">Admin Panel</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => <NavLink key={item.id} item={item} current={tab} />)}
        </nav>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 overflow-y-auto min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="animate-fade-in space-y-6">
          {/* ════ DASHBOARD ════ */}
          {tab === "dashboard" && (
            <>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, Admin</h1>
                <p className="text-gray-500 text-sm mt-1">Here&apos;s what&apos;s happening with your store today.</p>
              </div>

              {/* Metric cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[{ l: "Total Revenue", v: fmt(ordersStat.totalRevenue), sub: `${fmt(ordersStat.todayRevenue)} today`, color: "bg-green-50 text-green-600", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                  { l: "Total Orders", v: String(ordersStat.total), sub: `${ordersStat.todayOrders} today`, color: "bg-blue-50 text-blue-600", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
                  { l: "Users", v: String(users.length), sub: "Registered users", color: "bg-purple-50 text-purple-600", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
                  { l: "Avg Order Value", v: fmt(ordersStat.avgOrder), sub: `${ordersStat.processing} processing`, color: "bg-amber-50 text-amber-600", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
                ].map((c) => (
                  <div key={c.l} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{c.l}</span>
                      <div className={`w-8 h-8 ${c.color} rounded-lg flex items-center justify-center`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={c.icon} /></svg>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{c.v}</p>
                    <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
                  </div>
                ))}
              </div>

              {/* Order status grid */}
              <div className="grid lg:grid-cols-5 gap-3">
                {[{ l: "placed", v: ordersStat.placed, c: "bg-blue-100 text-blue-700" },
                  { l: "processing", v: ordersStat.processing, c: "bg-amber-100 text-amber-700" },
                  { l: "shipped", v: ordersStat.shipped, c: "bg-purple-100 text-purple-700" },
                  { l: "out for delivery", v: ordersStat.out_for_delivery, c: "bg-cyan-100 text-cyan-700" },
                  { l: "delivered", v: ordersStat.delivered, c: "bg-green-100 text-green-700" },
                ].map((s) => (
                  <div key={s.l} className={`rounded-lg p-3 text-center ${s.c}`}>
                    <p className="text-2xl font-bold">{s.v}</p>
                    <p className="text-xs font-medium capitalize mt-1">{s.l}</p>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl border border-gray-100">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900">Recent Orders</h2>
                  <button onClick={() => setTab("orders")} className="text-sm text-brand-700 hover:text-brand-800 font-medium">View all</button>
                </div>
                <div className="divide-y divide-gray-50">
                  {ordersList.slice(0, 8).map((o) => (
                    <div key={o.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{o.id}</span>
                          {orderStatusTag(o.status)}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{o.customer.name} - {o.items.length} item(s)</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-gray-900">{fmt(o.total)}</p>
                        <p className="text-xs text-gray-400">{timeAgo(o.placedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Customers + Payment Methods */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">Recent Customers</h2>
                    <button onClick={() => setTab("customers")} className="text-sm text-brand-700 hover:text-brand-800 font-medium">View all</button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {users.slice(0, 5).map((u) => {
                      const orderCount = ordersList.filter((o) => o.customer.phone === u.phone).length;
                      const totalSpent = ordersList.filter((o) => o.customer.phone === u.phone).reduce((s, o) => s + o.total, 0);
                      return (
                        <div key={u.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition cursor-default">
                          <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-xs font-bold text-brand-700">{u.name.charAt(0)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                            <p className="text-xs text-gray-400">{u.phone}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-semibold text-gray-700">{orderCount} order{orderCount !== 1 ? "s" : ""}</p>
                            <p className="text-xs text-gray-400">{fmt(totalSpent)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900">Payment Methods</h2>
                  </div>
                  <div className="p-5 space-y-3">
                    {[{ l: "Cash on Delivery", v: Math.round(ordersList.filter((o) => o.payment === "COD").length / (ordersList.length || 1) * 100), count: ordersList.filter((o) => o.payment === "COD").length },
                      { l: "UPI", v: Math.round(ordersList.filter((o) => o.payment === "UPI").length / (ordersList.length || 1) * 100), count: ordersList.filter((o) => o.payment === "UPI").length },
                      { l: "Card", v: Math.round(ordersList.filter((o) => o.payment === "Card").length / (ordersList.length || 1) * 100), count: ordersList.filter((o) => o.payment === "Card").length },
                      { l: "Net Banking", v: Math.round(ordersList.filter((o) => o.payment === "Net Banking").length / (ordersList.length || 1) * 100), count: ordersList.filter((o) => o.payment === "Net Banking").length },
                    ].map((pm) => (
                      <div key={pm.l} className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 w-32 shrink-0">{pm.l}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-700 rounded-full" style={{ width: `${pm.v}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 w-16 text-right">{pm.v}% ({pm.count})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ════ ORDERS ════ */}
          {tab === "orders" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
              <div className="flex gap-2 flex-wrap">
                {["all", "placed", "processing", "shipped", "out_for_delivery", "delivered"].map((s) => (
                  <button key={s} onClick={() => setOrderStatusFilter(s)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${orderStatusFilter === s ? "bg-brand-800 text-white border-brand-800" : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"}`}>
                    {s === "out_for_delivery" ? "Out for Delivery" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50 text-left">
                      <th className="px-4 py-3 font-semibold text-gray-600">Order</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Customer</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Items</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Total</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-right">Date</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 font-semibold text-gray-900">{o.id}</td>
                          <td className="px-4 py-3 text-gray-700">{o.customer.name}</td>
                          <td className="px-4 py-3 hidden sm:table-cell text-gray-500">{o.items.length} item(s)</td>
                          <td className="px-4 py-3 font-semibold">{fmt(o.total)}</td>
                          <td className="px-4 py-3">{orderStatusTag(o.status)}</td>
                          <td className="px-4 py-3 text-right text-xs text-gray-400">{dt(o.placedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredOrders.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No orders found</div>}
              </div>
            </div>
          )}

          {/* ════ PRODUCTS ════ */}
          {tab === "products" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <button className="px-4 py-2 bg-brand-800 text-white rounded-lg text-sm font-medium hover:bg-brand-900 transition">+ Add Product</button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <select value={productCategory} onChange={(e) => setProductCategory(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white">
                  <option value="all">All Categories</option>
                  {categories.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
                </select>
                <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Search products..." className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50 text-left">
                      <th className="px-4 py-3 font-semibold text-gray-600">Product</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Category</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Price</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Rating</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Stock</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Actions</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-brand-950 rounded flex items-center justify-center shrink-0"><span className="text-[4px] font-extrabold text-white">MERCBEX</span></div>
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 truncate max-w-[200px]">{p.name}</p>
                                <p className="text-xs text-gray-400 truncate max-w-[200px]">{p.activeIngredient}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell"><span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{p.category}</span></td>
                          <td className="px-4 py-3">
                            <p className="font-semibold">{fmt(p.price)}</p>
                            {p.originalPrice && <p className="text-xs text-gray-400 line-through">{fmt(p.originalPrice)}</p>}
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell"><span className="text-xs">{p.rating} ({p.reviewCount})</span></td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {p.inStock ? "In Stock" : "Out of Stock"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-brand-700 hover:text-brand-800 font-medium cursor-pointer">Edit</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════ USERS ════ */}
          {tab === "users" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">Users</h1>
              <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                <input value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} placeholder="Search by name or phone..." className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white">
                  <option value="all">All Locations</option>
                  {allLocs.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
                <select value={cropFilter} onChange={(e) => setCropFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white">
                  <option value="all">All Crops</option>
                  {allCrops.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className="text-xs text-gray-400 self-center">{users.length} total</span>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50 text-left">
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Name</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Phone Number</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Location</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Crop</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Language</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap text-right"># Scans</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Customer?</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap text-center">Orders</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap text-right">Joined On</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {users.filter((u) => {
                        if (customerSearch.trim()) { const q = customerSearch.toLowerCase(); if (!u.name.toLowerCase().includes(q) && !u.phone.includes(q)) return false; }
                        if (locationFilter !== "all" && !u.addresses.some((a) => a.state === locationFilter)) return false;
                        if (cropFilter !== "all") { const sm = JSON.parse(localStorage.getItem("mercbex_admin_scan_map") || "[]") as { sid: string; uid: string; crop: string }[]; const ids = new Set(sm.filter((m) => m.uid === u.id).map((m) => m.sid)); const us = scans.filter((s) => ids.has(s.id)); if (!us.some((s) => s.crop === cropFilter)) return false; }
                        return true;
                      }).map((u) => {
                        const userOrders = ordersList.filter((o) => o.customer.phone === u.phone);
                        const sm = JSON.parse(localStorage.getItem("mercbex_admin_scan_map") || "[]") as { sid: string; uid: string; crop: string }[];
                        const userScanIds = new Set(sm.filter((m) => m.uid === u.id).map((m) => m.sid));
                        const userScans = scans.filter((s) => userScanIds.has(s.id));
                        const cropCounts: Record<string, number> = {};
                        userScans.forEach((s) => { cropCounts[s.crop] = (cropCounts[s.crop] || 0) + 1; });
                        const scanBreakdown = Object.entries(cropCounts).map(([crop, count]) => `${count} ${crop}`).join(", ");
                        return (
                          <tr key={u.id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-xs font-bold text-brand-700">{u.name.charAt(0)}</div>
                                <p className="font-medium text-gray-900 text-sm">{u.name}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-700 text-sm whitespace-nowrap">{u.phone}</td>
                            <td className="px-4 py-3 max-w-[140px]">
                              <div className="flex flex-wrap gap-1">
                                {u.addresses.map((a) => (
                                  <span key={a.id} className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap">{a.district}, {a.state}</span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3 max-w-[120px]">
                              {userScans.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {Object.entries(cropCounts).slice(0, 2).map(([crop]) => (
                                    <span key={crop} className="text-[10px] bg-green-100 text-green-700 font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap">{crop.replace(/[()]/g, "").trim()}</span>
                                  ))}
                                  {Object.keys(cropCounts).length > 2 && <span className="text-[10px] text-gray-400">+{Object.keys(cropCounts).length - 2}</span>}
                                </div>
                              ) : <span className="text-xs text-gray-400">—</span>}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">English</td>
                            <td className="px-4 py-3 text-right">
                              {userScans.length > 0 ? (
                                <span className="text-sm font-semibold text-gray-900 relative group cursor-help whitespace-nowrap">
                                  {userScans.length}
                                  {scanBreakdown && (
                                    <span className="absolute bottom-full right-0 mb-1 hidden group-hover:block z-10">
                                      <span className="bg-gray-900 text-white text-[10px] font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap block">{scanBreakdown}</span>
                                    </span>
                                  )}
                                </span>
                              ) : <span className="text-xs text-gray-400">0</span>}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${userOrders.length > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {userOrders.length > 0 ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-sm font-semibold text-gray-900">{userOrders.length}</span>
                            </td>
                            <td className="px-4 py-3 text-right text-xs text-gray-400 whitespace-nowrap">{dt(u.createdAt)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════ CUSTOMERS ════ */}
          {tab === "customers" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
              <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                <input value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} placeholder="Search by name or phone..." className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white">
                  <option value="all">All Locations</option>
                  {allLocs.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
                <select value={cropFilter} onChange={(e) => setCropFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white">
                  <option value="all">All Crops</option>
                  {allCrops.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className="text-xs text-gray-400 self-center">{ordersList.length} orders</span>
              </div>
              {/* Status filter tabs */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: "all", label: "All", color: "bg-gray-100 text-gray-700" },
                  { key: "placed", label: "New", color: "bg-blue-100 text-blue-700" },
                  { key: "processing", label: "Processing", color: "bg-amber-100 text-amber-700" },
                  { key: "shipped", label: "Shipped", color: "bg-purple-100 text-purple-700" },
                  { key: "out_for_delivery", label: "Out for Delivery", color: "bg-cyan-100 text-cyan-700" },
                  { key: "delivered", label: "Delivered", color: "bg-green-100 text-green-700" },
                ].map((s) => (
                  <button key={s.key} onClick={() => setOrderStatusFilter(s.key)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${orderStatusFilter === s.key ? "bg-brand-800 text-white border-brand-800" : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50 text-left">
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Name</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Phone Number</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Location</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Order ID</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Placed Date</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Status</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap text-right">Amount</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Payment</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Invoice</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Pesticides</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Crop</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap text-right">Qty</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Delivery</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {(() => {
                        const filtered = ordersList.filter((o) => {
                          if (orderStatusFilter !== "all" && o.status !== orderStatusFilter) return false;
                          if (customerSearch.trim()) { const q = customerSearch.toLowerCase(); if (!o.customer.name?.toLowerCase().includes(q) && !o.customer.phone?.includes(q)) return false; }
                          if (locationFilter !== "all") { const u = users.find((u2) => u2.phone === o.customer.phone); if (!u?.addresses.some((a) => a.state === locationFilter)) return false; }
                          if (cropFilter !== "all") { const u = users.find((u2) => u2.phone === o.customer.phone); if (u) { const sm = JSON.parse(localStorage.getItem("mercbex_admin_scan_map") || "[]") as { sid: string; uid: string; crop: string }[]; const ids = new Set(sm.filter((m) => m.uid === u.id).map((m) => m.sid)); const us = scans.filter((s) => ids.has(s.id)); if (!us.some((s) => s.crop === cropFilter)) return false; } else return false; }
                          return true;
                        });
                        return filtered.map((o) => {
                          const user = users.find((u) => u.phone === o.customer.phone);
                          const locationShort = user?.addresses[0] ? `${user.addresses[0].district}, ${user.addresses[0].state}` : o.customer.address || "—";
                          const pesticides = o.items.map((i) => i.name).join(", ");
                          const sm = JSON.parse(localStorage.getItem("mercbex_admin_scan_map") || "[]") as { sid: string; uid: string; crop: string }[];
                          const userCrops = [...new Set(sm.filter((m) => m.uid === user?.id).map((m) => m.crop))].join(", ") || "—";
                          const totalQty = o.items.reduce((s, i) => s + i.quantity, 0);
                          const invoice = `MBX-${o.id.replace("ORD", "")}`;
                          const locationFull = user?.addresses.map((a) => `${a.address}, ${a.district}, ${a.state} - ${a.pin}`).join(" | ") || "—";
                          return (
                            <tr key={o.id} className="hover:bg-gray-50 transition">
                              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{o.customer.name}</td>
                              <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{o.customer.phone}</td>
                              <td className="px-4 py-3 max-w-[140px]"><span className="text-xs text-gray-600 truncate block" title={locationFull}>{locationShort}</span></td>
                              <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{o.id}</td>
                              <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{dt(o.placedAt)}</td>
                              <td className="px-4 py-3 whitespace-nowrap">{orderStatusTag(o.status)}</td>
                              <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">{fmt(o.total)}</td>
                              <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{o.payment}</td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <button onClick={() => setInvoiceOrder(o)} className="font-mono text-[10px] text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">{invoice}</button>
                              </td>
                              <td className="px-4 py-3 max-w-[200px]"><span className="text-xs text-gray-700 truncate block" title={pesticides}>{pesticides}</span></td>
                              <td className="px-4 py-3 max-w-[120px]"><span className="text-xs text-gray-700 truncate block" title={userCrops}>{userCrops}</span></td>
                              <td className="px-4 py-3 text-right text-sm font-semibold">{totalQty}</td>
                              <td className="px-4 py-3 max-w-[160px]"><span className="text-xs text-gray-500 truncate block" title={locationFull}>{locationShort}</span></td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
                {ordersList.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No customers found</div>}
              </div>
            </div>
          )}

          {/* ════ CROP SCANS ════ */}
          {tab === "scans" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">Crop Scans</h1>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { l: "Incomplete", v: scans.filter((s) => s.status === "incomplete").length, c: "bg-orange-100 text-orange-700" },
                  { l: "Action Needed", v: scans.filter((s) => s.status === "action_needed").length, c: "bg-amber-100 text-amber-700" },
                  { l: "In Cart", v: scans.filter((s) => s.status === "in_cart").length, c: "bg-green-100 text-green-700" },
                  { l: "Total", v: scans.length, c: "bg-blue-100 text-blue-700" },
                ].map((stat) => (
                  <div key={stat.l} className={`rounded-lg p-3 text-center ${stat.c}`}>
                    <p className="text-2xl font-bold">{stat.v}</p>
                    <p className="text-xs font-medium capitalize mt-1">{stat.l}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    { key: "all", label: "All" },
                    { key: "incomplete", label: "Incomplete" },
                    { key: "action_needed", label: "Action Needed" },
                    { key: "in_cart", label: "In Cart" },
                  ].map((s) => (
                    <button key={s.key} onClick={() => setScanFilter(s.key)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${scanFilter === s.key ? "bg-brand-800 text-white border-brand-800" : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50 text-left">
                      <th className="px-4 py-3 font-semibold text-gray-600">User</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Crop</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Disease</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Severity</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-right">Confidence</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Products</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-right">Date</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {scans.filter((s) => scanFilter === "all" || s.status === scanFilter).map((s) => {
                        const sm = JSON.parse(localStorage.getItem("mercbex_admin_scan_map") || "[]") as { sid: string; uid: string; crop: string }[];
                        const scanMatch = sm.find((m) => m.sid === s.id);
                        const user = scanMatch ? users.find((u) => u.id === scanMatch.uid) : null;
                        const statusColors: Record<string, string> = { incomplete: "bg-orange-100 text-orange-700", action_needed: "bg-amber-100 text-amber-700", in_cart: "bg-green-100 text-green-700", new_scan: "bg-blue-100 text-blue-700" };
                        const statusLabels: Record<string, string> = { incomplete: "Incomplete", action_needed: "Action Needed", in_cart: "In Cart", new_scan: "New Scan" };
                        // Get products added to cart for this user
                        const userOrders = ordersList.filter((o) => o.customer.phone === user?.phone);
                        const userOrderItems = [...new Set(userOrders.flatMap((o) => o.items.map((i) => i.name)))];
                        const matchedProducts = userOrderItems.length > 0 && s.status === "in_cart"
                          ? userOrderItems.slice(0, 3)
                          : [];
                        return (
                          <tr key={s.id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3">
                              {user ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center text-[10px] font-bold text-brand-700">{user.name.charAt(0)}</div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-[10px] text-gray-400">{user.phone}</p>
                                  </div>
                                </div>
                              ) : <span className="text-xs text-gray-400">—</span>}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-900">{s.crop}</td>
                            <td className="px-4 py-3 text-gray-700 max-w-[180px]"><span className="truncate block" title={s.disease}>{s.disease}</span></td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.severity === "critical" ? "bg-red-100 text-red-700" : s.severity === "high" ? "bg-orange-100 text-orange-700" : s.severity === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{s.severity}</span>
                            </td>
                            <td className="px-4 py-3 text-right font-semibold">{s.confidence}%</td>
                            <td className="px-4 py-3 max-w-[160px]">
                              {matchedProducts.length > 0 ? (
                                <div className="relative group cursor-default">
                                  <span className="text-[10px] text-gray-600 truncate block max-w-[150px]">
                                    <span className="font-medium text-emerald-600">✓</span> {matchedProducts[0].substring(0, 30)}{matchedProducts[0].length > 30 ? "..." : ""}
                                    {matchedProducts.length > 1 && <span className="text-gray-400"> +{matchedProducts.length - 1}</span>}
                                  </span>
                                  <span className="absolute bottom-full left-0 mb-1 hidden group-hover:block z-10">
                                    <span className="bg-gray-900 text-white text-[10px] font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap block max-w-xs">
                                      {matchedProducts.map((p) => `• ${p}`).join("\n")}
                                    </span>
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[10px] text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full relative group cursor-help ${statusColors[s.status || ""] || "bg-gray-100 text-gray-700"}`}>
                                {statusLabels[s.status || ""] || s.status || "Unknown"}
                                {s.status === "in_cart" && matchedProducts.length > 0 && (
                                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                                    <span className="bg-gray-900 text-white text-[10px] font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap block">
                                      Added: {matchedProducts.join(", ")}
                                    </span>
                                  </span>
                                )}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right text-xs text-gray-400 whitespace-nowrap">{dt(s.timestamp)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {scans.filter((s) => scanFilter === "all" || s.status === scanFilter).length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No scans found</div>}
              </div>
            </div>
          )}

          {/* ════ PROMO BANNER ════ */}
          {tab === "promo" && (
            <div className="max-w-2xl space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">Promo Banner</h1>
              <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" checked={promo.enabled} onChange={(e) => setPromo({ ...promo, enabled: e.target.checked })} className="sr-only peer" />
                    <div className="w-10 h-5.5 bg-gray-200 rounded-full peer-checked:bg-brand-700 transition peer-checked:after:translate-x-[18px] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-4.5 after:h-4.5 after:transition" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Enable Promo Banner</span>
                </label>
                {promo.enabled && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                      <input value={promo.title} onChange={(e) => setPromo({ ...promo, title: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                      <input value={promo.description} onChange={(e) => setPromo({ ...promo, description: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Link Text</label>
                        <input value={promo.linkText} onChange={(e) => setPromo({ ...promo, linkText: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Link URL</label>
                        <input value={promo.linkUrl} onChange={(e) => setPromo({ ...promo, linkUrl: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Background</label>
                        <div className="flex gap-2 items-center">
                          <input type="color" value={promo.bgColor} onChange={(e) => setPromo({ ...promo, bgColor: e.target.value })} className="w-9 h-9 rounded border border-gray-200 cursor-pointer" />
                          <input value={promo.bgColor} onChange={(e) => setPromo({ ...promo, bgColor: e.target.value })} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Text</label>
                        <div className="flex gap-2 items-center">
                          <input type="color" value={promo.textColor} onChange={(e) => setPromo({ ...promo, textColor: e.target.value })} className="w-9 h-9 rounded border border-gray-200 cursor-pointer" />
                          <input value={promo.textColor} onChange={(e) => setPromo({ ...promo, textColor: e.target.value })} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono" />
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-xl overflow-hidden">
                      <div className="px-4 py-2.5 flex items-center justify-center gap-3 text-sm" style={{ backgroundColor: promo.bgColor, color: promo.textColor }}>
                        <span className="font-bold">{promo.title || "Banner Title"}</span>
                        {promo.description && <span className="hidden sm:inline opacity-90">{promo.description}</span>}
                        {promo.linkText && <span className="font-semibold underline underline-offset-2">{promo.linkText} &rarr;</span>}
                      </div>
                    </div>
                  </>
                )}
                <button onClick={savePromo} className="px-5 py-2.5 bg-brand-800 text-white rounded-lg text-sm font-medium hover:bg-brand-900 transition">Save Banner</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ════ INVOICE MODAL ════ */}
      {invoiceOrder && (() => {
        const o = invoiceOrder;
        const invoice = `MBX-${o.id.replace("ORD", "")}`;
        const itemsTotal = o.items.reduce((s, i) => s + i.price * i.quantity, 0);
        const gst = Math.round(itemsTotal * 0.09);
        const deliveryCharge = o.shipping;
        const grandTotal = itemsTotal + gst * 2 + deliveryCharge;
        const wordAmount = (n: number) => `Rupees ${n.toLocaleString("en-IN")} Only`;

        return (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setInvoiceOrder(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl z-10 max-h-[95vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between z-10 rounded-t-2xl">
                <h2 className="font-bold text-gray-900">Invoice {invoice}</h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => window.print()} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 font-medium flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" /></svg>
                    Print
                  </button>
                  <button onClick={() => setInvoiceOrder(null)} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <div className="px-8 py-8 space-y-8">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center text-white font-extrabold">M</div>
                      <div><p className="text-lg font-bold text-gray-900">MERCBEX</p><p className="text-xs text-gray-400">Crop Protection Solutions</p></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-3 space-y-0.5">
                      <p>B-42, Sector 6, Noida</p><p>Uttar Pradesh 201301, India</p><p>GST: 09ABCDE1234F1Z5</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{invoice}</p>
                    <p className="text-xs text-gray-400 mt-1">Date: {dt(o.placedAt)}</p>
                    <p className="text-xs text-gray-400">Payment: {o.payment}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Bill To</p>
                  <p className="text-sm font-bold text-gray-900">{o.customer.name}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{o.customer.phone}</p>
                  <p className="text-xs text-gray-500 mt-1">{o.customer.address || (() => { const u = users.find((x) => x.phone === o.customer.phone); return u?.addresses.map((a) => `${a.address}, ${a.district}, ${a.state} - ${a.pin}`).join(", ") || "—"; })()}</p>
                </div>
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-200">
                    <th className="text-left pb-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">#</th>
                    <th className="text-left pb-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Product</th>
                    <th className="text-center pb-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Qty</th>
                    <th className="text-right pb-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Rate</th>
                    <th className="text-right pb-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Amount</th>
                  </tr></thead>
                  <tbody>
                    {o.items.map((item, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-3 text-gray-400 text-xs">{i + 1}</td>
                        <td className="py-3 text-gray-900 font-medium">{item.name}</td>
                        <td className="py-3 text-center text-gray-700">{item.quantity}</td>
                        <td className="py-3 text-right text-gray-700">{fmt(item.price)}</td>
                        <td className="py-3 text-right font-semibold text-gray-900">{fmt(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end">
                  <div className="w-72 space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-medium text-gray-900">{fmt(itemsTotal)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">CGST (9%)</span><span className="font-medium text-gray-900">{fmt(gst)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">SGST (9%)</span><span className="font-medium text-gray-900">{fmt(gst)}</span></div>
                    {deliveryCharge > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Delivery</span><span className="font-medium text-gray-900">{fmt(deliveryCharge)}</span></div>}
                    <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-bold text-lg text-emerald-700">{fmt(grandTotal)}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 text-right mt-1">{wordAmount(grandTotal)}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-6 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Payment Method</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${o.payment === "COD" ? "bg-amber-100 text-amber-700" : o.payment === "UPI" ? "bg-blue-100 text-blue-700" : o.payment === "Card" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}`}>{o.payment}</span>
                      <span className="text-xs text-gray-500">{o.payment === "COD" ? "Cash on Delivery" : o.payment === "UPI" ? "UPI Payment" : o.payment === "Card" ? "Card Payment" : "Net Banking"}</span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    <p>Terms: Net 7</p><p>E. & O. E.</p>
                    <p className="mt-2 text-[10px] text-gray-300">This is a computer-generated invoice</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
