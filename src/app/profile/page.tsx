"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, Address } from "@/context/AuthContext";

const emptyAddress = { label: "", name: "", phone: "", address: "", district: "", state: "", pin: "", isDefault: false };

export default function ProfilePage() {
  const { user, isLoading, logout, updateProfile, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "orders">("profile");
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
      </main>
    );
  }

  if (!user) {
    router.push("/auth");
    return null;
  }

  const startEditProfile = () => {
    setProfileForm({ name: user.name, email: user.email });
    setEditingProfile(true);
  };

  const saveProfile = () => {
    updateProfile(profileForm);
    setEditingProfile(false);
  };

  const startAddAddress = () => {
    setAddressForm({ ...emptyAddress, name: user.name, phone: user.phone });
    setEditingAddressId(null);
    setShowAddressForm(true);
  };

  const startEditAddress = (addr: Address) => {
    setAddressForm({ label: addr.label, name: addr.name, phone: addr.phone, address: addr.address, district: addr.district, state: addr.state, pin: addr.pin, isDefault: addr.isDefault });
    setEditingAddressId(addr.id);
    setShowAddressForm(true);
  };

  const saveAddress = () => {
    if (!addressForm.name || !addressForm.phone || !addressForm.address || !addressForm.district || !addressForm.state || !addressForm.pin) {
      alert("Please fill in all required fields");
      return;
    }
    if (editingAddressId) {
      updateAddress(editingAddressId, addressForm);
    } else {
      addAddress(addressForm);
    }
    setShowAddressForm(false);
    setEditingAddressId(null);
  };

  const cancelAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
  };

  // Get orders from localStorage
  const orders: { id: string; total: number; placedAt: string; items: { name: string }[] }[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("order_")) {
      try {
        orders.push(JSON.parse(localStorage.getItem(key)!));
      } catch { /* skip invalid */ }
    }
  }
  orders.sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "addresses" as const, label: "Addresses", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
    { id: "orders" as const, label: "Orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-brand-950 to-brand-900 py-8 sm:py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-brand-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-brand-300 text-sm">{user.phone}{user.email ? ` | ${user.email}` : ""}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === tab.id ? "bg-brand-50 text-brand-700" : "text-gray-500 hover:text-gray-700"}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-gray-900">Personal Information</h2>
              {!editingProfile && (
                <button onClick={startEditProfile} className="text-sm font-semibold text-brand-700 hover:text-brand-800 transition">
                  Edit
                </button>
              )}
            </div>

            {editingProfile ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={saveProfile} className="bg-brand-800 hover:bg-brand-900 text-white px-5 py-2 rounded-lg font-semibold text-sm transition">Save</button>
                  <button onClick={() => setEditingProfile(false)} className="text-gray-500 hover:text-gray-700 px-5 py-2 rounded-lg font-semibold text-sm transition">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Name</p>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                    <p className="text-sm font-medium text-gray-900">{user.email || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Member Since</p>
                    <p className="text-sm font-medium text-gray-900">{new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={() => { logout(); router.push("/"); }}
                    className="text-sm font-semibold text-red-600 hover:text-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === "addresses" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Saved Addresses</h2>
              <button
                onClick={startAddAddress}
                className="flex items-center gap-1.5 bg-brand-800 hover:bg-brand-900 text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Address
              </button>
            </div>

            {showAddressForm && (
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">{editingAddressId ? "Edit Address" : "New Address"}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Label (e.g. Home, Farm, Shop)</label>
                    <input
                      type="text"
                      value={addressForm.label}
                      onChange={(e) => setAddressForm((prev) => ({ ...prev, label: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="Farm Address"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
                    <input
                      type="text"
                      value={addressForm.name}
                      onChange={(e) => setAddressForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="Receiver name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Phone *</label>
                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="+91"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Address *</label>
                    <input
                      type="text"
                      value={addressForm.address}
                      onChange={(e) => setAddressForm((prev) => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="Village/Street address"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">District *</label>
                    <input
                      type="text"
                      value={addressForm.district}
                      onChange={(e) => setAddressForm((prev) => ({ ...prev, district: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="District"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">State *</label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm((prev) => ({ ...prev, state: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">PIN Code *</label>
                    <input
                      type="text"
                      value={addressForm.pin}
                      onChange={(e) => setAddressForm((prev) => ({ ...prev, pin: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="6-digit PIN"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={saveAddress} className="bg-brand-800 hover:bg-brand-900 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition">
                    {editingAddressId ? "Update Address" : "Save Address"}
                  </button>
                  <button onClick={cancelAddressForm} className="text-gray-500 hover:text-gray-700 px-5 py-2.5 rounded-lg font-semibold text-sm transition">Cancel</button>
                </div>
              </div>
            )}

            {user.addresses.length === 0 && !showAddressForm ? (
              <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="font-semibold text-gray-900">No saved addresses</h3>
                <p className="text-sm text-gray-500 mt-1">Add your farm or delivery address for faster checkout</p>
                <button onClick={startAddAddress} className="mt-4 bg-brand-800 hover:bg-brand-900 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition">
                  Add Your First Address
                </button>
              </div>
            ) : (
              user.addresses.map((addr) => (
                <div key={addr.id} className={`bg-white rounded-2xl p-5 border shadow-sm ${addr.isDefault ? "border-brand-200 ring-1 ring-brand-100" : "border-gray-100"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {addr.label && (
                          <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">{addr.label}</span>
                        )}
                        {addr.isDefault && (
                          <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Default</span>
                        )}
                      </div>
                      <p className="font-semibold text-gray-900 text-sm">{addr.name}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{addr.address}</p>
                      <p className="text-sm text-gray-500">{addr.district}, {addr.state} - {addr.pin}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{addr.phone}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!addr.isDefault && (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-xs text-gray-500 hover:text-brand-700 px-2 py-1.5 rounded-lg hover:bg-brand-50 transition"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => startEditAddress(addr)}
                        className="p-1.5 text-gray-400 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button
                        onClick={() => removeAddress(addr.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <h2 className="font-bold text-gray-900">Your Orders</h2>
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="font-semibold text-gray-900">No orders yet</h3>
                <p className="text-sm text-gray-500 mt-1">Your order history will appear here</p>
                <Link href="/products" className="inline-block mt-4 bg-brand-800 hover:bg-brand-900 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition">
                  Browse Products
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/order/${order.id}`}
                  className="block bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-brand-200 transition"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Order #{order.id}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        {" | "}
                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand-800">₹{order.total.toLocaleString()}</p>
                      <svg className="w-4 h-4 text-gray-400 ml-auto mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
