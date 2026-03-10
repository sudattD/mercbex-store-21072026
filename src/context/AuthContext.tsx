"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  district: string;
  state: string;
  pin: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  addresses: Address[];
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, password: string) => { success: boolean; error?: string };
  signup: (data: { name: string; phone: string; email: string; password: string }) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, "name" | "email">>) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  getDefaultAddress: () => Address | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem("mercbex_session");
    if (session) {
      const userId = JSON.parse(session).userId;
      const stored = localStorage.getItem(`mercbex_user_${userId}`);
      if (stored) setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const persistUser = useCallback((u: User) => {
    localStorage.setItem(`mercbex_user_${u.id}`, JSON.stringify(u));
    localStorage.setItem("mercbex_session", JSON.stringify({ userId: u.id }));
    setUser(u);
  }, []);

  const signup = useCallback((data: { name: string; phone: string; email: string; password: string }) => {
    const existing = localStorage.getItem(`mercbex_phone_${data.phone}`);
    if (existing) return { success: false, error: "An account with this phone number already exists" };

    const newUser: User = {
      id: generateId(),
      name: data.name,
      phone: data.phone,
      email: data.email,
      addresses: [],
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(`mercbex_phone_${data.phone}`, JSON.stringify({ userId: newUser.id, password: data.password }));
    persistUser(newUser);
    return { success: true };
  }, [persistUser]);

  const login = useCallback((phone: string, password: string) => {
    const stored = localStorage.getItem(`mercbex_phone_${phone}`);
    if (!stored) return { success: false, error: "No account found with this phone number" };

    const creds = JSON.parse(stored);
    if (creds.password !== password) return { success: false, error: "Incorrect password" };

    const userData = localStorage.getItem(`mercbex_user_${creds.userId}`);
    if (!userData) return { success: false, error: "Account data not found" };

    const u = JSON.parse(userData);
    persistUser(u);
    return { success: true };
  }, [persistUser]);

  const logout = useCallback(() => {
    localStorage.removeItem("mercbex_session");
    setUser(null);
  }, []);

  const updateProfile = useCallback((data: Partial<Pick<User, "name" | "email">>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem(`mercbex_user_${updated.id}`, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addAddress = useCallback((address: Omit<Address, "id">) => {
    setUser((prev) => {
      if (!prev) return prev;
      const newAddr = { ...address, id: generateId() };
      if (prev.addresses.length === 0) newAddr.isDefault = true;
      const updated = { ...prev, addresses: [...prev.addresses, newAddr] };
      localStorage.setItem(`mercbex_user_${updated.id}`, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateAddress = useCallback((id: string, address: Omit<Address, "id">) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        addresses: prev.addresses.map((a) => (a.id === id ? { ...address, id } : a)),
      };
      localStorage.setItem(`mercbex_user_${updated.id}`, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeAddress = useCallback((id: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      let addresses = prev.addresses.filter((a) => a.id !== id);
      if (addresses.length > 0 && !addresses.some((a) => a.isDefault)) {
        addresses = addresses.map((a, i) => (i === 0 ? { ...a, isDefault: true } : a));
      }
      const updated = { ...prev, addresses };
      localStorage.setItem(`mercbex_user_${updated.id}`, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const setDefaultAddress = useCallback((id: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        addresses: prev.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
      };
      localStorage.setItem(`mercbex_user_${updated.id}`, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getDefaultAddress = useCallback(() => {
    return user?.addresses.find((a) => a.isDefault) || user?.addresses[0];
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, signup, logout, updateProfile, addAddress, updateAddress, removeAddress, setDefaultAddress, getDefaultAddress }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
