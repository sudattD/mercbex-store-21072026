"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface Slide {
  id: number;
  image: string;
  overlayColor: string;
  badgeText: string;
  badgeColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    // Indian farmer working in green rice paddy field
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1920&q=80",
    overlayColor: "from-black/70 via-black/50 to-black/30",
    badgeText: "Protect Your Crops Today",
    badgeColor: "bg-red-500/20 text-red-200 border-red-400/30",
  },
  {
    id: 2,
    // Farmer walking through lush green crop field
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80",
    overlayColor: "from-black/70 via-black/50 to-black/30",
    badgeText: "AI-Powered Crop Analysis",
    badgeColor: "bg-blue-500/20 text-blue-200 border-blue-400/30",
  },
  {
    id: 3,
    // Golden wheat field at sunset - harvest ready
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1920&q=80",
    overlayColor: "from-black/70 via-black/50 to-black/30",
    badgeText: "Fast & Reliable Delivery",
    badgeColor: "bg-green-500/20 text-green-200 border-green-400/30",
  },
  {
    id: 4,
    // Close-up of hands holding fresh crop/soil - farming life
    image: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&w=1920&q=80",
    overlayColor: "from-black/70 via-black/50 to-black/30",
    badgeText: "Trusted by 50,000+ Farmers",
    badgeColor: "bg-amber-500/20 text-amber-200 border-amber-400/30",
  },
];

export default function HeroCarousel() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden bg-black min-h-[520px] sm:min-h-[600px]">
      {/* Background images - all preloaded, only current one visible */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={s.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Dark overlay for text readability */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlayColor} z-10`} />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 flex flex-col justify-center min-h-[520px] sm:min-h-[600px]">
        <div className="max-w-2xl">
          <div
            key={slide.id}
            className="animate-fadeIn"
          >
            <div className={`inline-flex items-center gap-2 ${slide.badgeColor} text-sm font-medium px-4 py-1.5 rounded-full mb-6 border`}>
              <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
              {slide.badgeText}
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
            {t("hero.title1")}{" "}
            <span className="text-green-400">{t("hero.title2")}</span>
          </h1>
          <p className="mt-6 text-lg text-white/80 max-w-lg leading-relaxed drop-shadow">
            {t("hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="bg-white text-gray-900 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg shadow-black/30 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              {t("hero.findSolution")}
            </Link>
            <a
              href="tel:+911800123456"
              className="border-2 border-white/30 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/10 transition flex items-center gap-2 backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              {t("hero.talkExpert")}
            </a>
          </div>

          {/* Trust signals */}
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/60">
            {[
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", text: t("hero.cibRegistered") },
              { icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", text: t("hero.labTested") },
              { icon: "M13 10V3L4 14h7v7l9-11h-7z", text: t("hero.delivery48") },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* Carousel dots */}
        <div className="flex gap-2 mt-12">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-10 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Nav arrows */}
      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition hidden sm:flex"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition hidden sm:flex"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </section>
  );
}
