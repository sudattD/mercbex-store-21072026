"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { crops } from "@/data/products";

interface ScanRecord {
  id: string;
  crop: string;
  disease: string;
  severity: string;
  confidence: number;
  timestamp: string;
  status?: "incomplete" | "saved" | "confirmed";
}

const severityColors: Record<string, { bg: string; text: string }> = {
  low: { bg: "bg-green-100", text: "text-green-700" },
  medium: { bg: "bg-yellow-100", text: "text-yellow-700" },
  high: { bg: "bg-orange-100", text: "text-orange-700" },
  critical: { bg: "bg-red-100", text: "text-red-700" },
};

function timeAgo(iso: string) {
  const diff = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.round(diff / 60)}h ago`;
  return `${Math.round(diff / 1440)}d ago`;
}

export default function MyDiagnoses() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const { items } = useCart();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("mercbex_crop_scans");
      if (stored) {
        const parsed = JSON.parse(stored) as ScanRecord[];
        // Deduplicate by disease name, keep most recent
        const seen = new Set<string>();
        const unique = parsed.filter((s) => {
          const key = s.disease;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setScans(unique.slice(0, 6));
      }
    } catch {}
  }, []);

  if (scans.length === 0) return null;

  // Check which diseases have products in cart
  const diseasesInCart = new Set(
    items.filter((i) => i.scanContext).map((i) => i.scanContext!.disease)
  );

  // Group scans by crop
  const grouped: Record<string, ScanRecord[]> = {};
  scans.forEach((s) => {
    if (!grouped[s.crop]) grouped[s.crop] = [];
    grouped[s.crop].push(s);
  });
  const cropGroups = Object.entries(grouped);

  const statusText = (scan: ScanRecord, inCart: boolean) => {
    if (inCart) return <span className="text-[10px] font-semibold text-amber-400">In Cart</span>;
    if (scan.status === "saved") return <span className="text-[10px] font-semibold text-blue-400">Saved</span>;
    if (scan.status === "confirmed") return <span className="text-[10px] font-semibold text-red-400">Needs Action</span>;
    return <span className="text-[10px] font-semibold text-orange-400">Incomplete</span>;
  };

  const sevDot: Record<string, string> = {
    low: "bg-green-400", medium: "bg-yellow-400", high: "bg-orange-400", critical: "bg-red-400",
  };

  return (
    <section className="py-12 bg-gradient-to-b from-[#1a2e1a] to-[#0d1f12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">My Diagnoses</h2>
            <p className="text-sm text-green-400/60 mt-0.5">{scans.length} issue{scans.length > 1 ? "s" : ""} across {cropGroups.length} crop{cropGroups.length > 1 ? "s" : ""}</p>
          </div>
          <Link href="/scan" className="text-sm font-semibold text-green-400 hover:text-green-300 transition">
            + New Scan
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
          {cropGroups.map(([cropName, cropScans]) => {
            const cropData = crops.find((c) => c.name === cropName);
            return (
              <div
                key={cropName}
                className="flex-shrink-0 w-[300px] sm:w-[340px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden snap-start"
              >
                {/* Crop header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                  {cropData?.image ? (
                    <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/20">
                      <img src={cropData.image} alt={cropName} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-green-900/50 flex items-center justify-center flex-shrink-0 text-lg">
                      {cropData?.icon || "🌿"}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-white">{cropName}</p>
                    <p className="text-[11px] text-green-400/50">{cropScans.length} issue{cropScans.length > 1 ? "s" : ""} detected</p>
                  </div>
                </div>

                {/* Disease rows */}
                <div className="divide-y divide-white/5">
                  {cropScans.map((scan) => {
                    const inCart = diseasesInCart.has(scan.disease);
                    return (
                      <Link
                        key={scan.id}
                        href="/scan"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition"
                      >
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sevDot[scan.severity] || sevDot.medium}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white/90 truncate">{scan.disease}</p>
                          <p className="text-[11px] text-white/30">{scan.confidence}% &middot; {timeAgo(scan.timestamp)}</p>
                        </div>
                        {statusText(scan, inCart)}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
