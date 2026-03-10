"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PromoBannerData {
  enabled: boolean;
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
  bgColor: string;
  textColor: string;
}

export default function PromoBanner() {
  const [banner, setBanner] = useState<PromoBannerData | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("mercbex_store_settings");
      if (stored) {
        const settings = JSON.parse(stored);
        if (settings.promoBanner?.enabled) {
          setBanner(settings.promoBanner);
        }
      }
    } catch { /* ignore */ }
  }, []);

  if (!banner || dismissed) return null;

  return (
    <div
      className="relative"
      style={{ backgroundColor: banner.bgColor, color: banner.textColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-3 text-sm">
        <span className="font-bold">{banner.title}</span>
        {banner.description && (
          <span className="hidden sm:inline opacity-90">{banner.description}</span>
        )}
        {banner.linkText && banner.linkUrl && (
          <Link
            href={banner.linkUrl}
            className="font-semibold underline underline-offset-2 hover:opacity-80 transition"
          >
            {banner.linkText} &rarr;
          </Link>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition"
          aria-label="Dismiss banner"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
