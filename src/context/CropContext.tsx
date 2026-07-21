"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CropContextType {
  selectedCrop: string | null;
  selectCrop: (id: string) => void;
  clearCrop: () => void;
}

const CropContext = createContext<CropContextType>({
  selectedCrop: null,
  selectCrop: () => {},
  clearCrop: () => {},
});

export function CropProvider({ children }: { children: ReactNode }) {
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("mercbex_my_crop");
      if (stored) setSelectedCrop(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("mercbex_my_crop", JSON.stringify(selectedCrop));
    } catch {}
  }, [selectedCrop]);

  const selectCrop = (id: string) => {
    setSelectedCrop((prev) => (prev === id ? null : id));
  };

  const clearCrop = () => setSelectedCrop(null);

  return (
    <CropContext.Provider value={{ selectedCrop, selectCrop, clearCrop }}>
      {children}
    </CropContext.Provider>
  );
}

export const useCrops = () => useContext(CropContext);
