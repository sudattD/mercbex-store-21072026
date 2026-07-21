"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const steps = [
  {
    image: "/images/app_flow/image1.png",
    step: 1,
    label: "Step One",
    title: "Spot the",
    titleAccent: "Problem.",
    desc: "Your crop shows signs of disease or pest damage. Don't worry — help is just a scan away.",
    tags: ["AI-Powered", "Disease Detection"],
  },
  {
    image: "/images/app_flow/image2.png",
    step: 2,
    label: "Step Two",
    title: "Scan with",
    titleAccent: "MERCBEX AI.",
    desc: "Take a photo of the affected leaf and get an instant diagnosis with treatment recommendations.",
    tags: ["Photo Scan", "Instant Results"],
  },
  {
    image: "/images/app_flow/image3.png",
    step: 3,
    label: "Step Three",
    title: "Get Medicine",
    titleAccent: "Delivered.",
    desc: "Order the exact product you need. We deliver to your field within 48 hours.",
    tags: ["48hr Delivery", "Doorstep Service"],
  },
  {
    image: "/images/app_flow/image4.png",
    step: 4,
    label: "Step Four",
    title: "Apply the",
    titleAccent: "Treatment.",
    desc: "Follow the dosage guide. Our products are lab-tested and government approved.",
    tags: ["Expert Dosage", "CIB Approved"],
  },
  {
    image: "/images/app_flow/image5.png",
    step: 5,
    label: "Step Five",
    title: "Healthy",
    titleAccent: "Harvest.",
    desc: "Watch your crops recover and thrive. Join 50,000+ farmers who trust MERCBEX.",
    tags: ["Crop Recovery", "Yield Protection"],
    cta: true,
  },
];

const AUTO_SCROLL_INTERVAL = 5000;

export default function HeroStory() {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollTo = useCallback((idx: number) => {
    if (!scrollRef.current) return;
    const child = scrollRef.current.children[idx] as HTMLElement;
    if (child) {
      scrollRef.current.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
    }
    setActiveIdx(idx);
  }, []);

  // Auto-scroll
  useEffect(() => {
    const start = () => {
      timerRef.current = setInterval(() => {
        setActiveIdx((prev) => {
          const next = (prev + 1) % steps.length;
          scrollTo(next);
          return next;
        });
      }, AUTO_SCROLL_INTERVAL);
    };
    start();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [scrollTo]);

  // Pause on interaction, resume after
  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % steps.length;
        scrollTo(next);
        return next;
      });
    }, AUTO_SCROLL_INTERVAL);
  };

  // Detect manual scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.offsetWidth;
    const idx = Math.round(scrollLeft / width);
    if (idx !== activeIdx) {
      setActiveIdx(idx);
      resetTimer();
    }
  };

  const s = steps[activeIdx];

  return (
    <section className="relative h-[70vh] min-h-[420px] max-h-[600px] overflow-hidden">
      {/* Scrollable image strip */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="absolute inset-0 flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {steps.map((step) => (
          <div
            key={step.step}
            className="flex-shrink-0 w-full h-full snap-start relative"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${step.image})`,
                filter: "brightness(0.6) saturate(0.85)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

      {/* Content — synced to active slide */}
      <div className="absolute inset-0 flex items-end z-10">
        <div className="max-w-5xl mx-auto px-6 sm:px-12 pb-10 sm:pb-14 w-full">
          {/* Step badge */}
          <div className="inline-flex items-center gap-2 bg-green-400/12 border border-green-400/35 rounded-full py-1 pl-1.5 pr-3.5 mb-4">
            <div className="w-[22px] h-[22px] bg-green-400 rounded-full flex items-center justify-center">
              <span className="text-[11px] font-bold text-green-950">{s.step}</span>
            </div>
            <span className="text-[12px] font-medium text-green-400 tracking-widest uppercase">{s.label}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {s.tags.map((tag, i) => (
              <span key={tag} className="text-[11px] text-white/45 border border-white/12 rounded px-2.5 py-1 tracking-wide">
                {i === 0 && <span className="inline-block w-[7px] h-[7px] bg-green-400 rounded-full mr-1.5 animate-pulse" />}
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-[1.1] tracking-tight mb-3">
            {s.title} <span className="text-green-400">{s.titleAccent}</span>
          </h2>

          {/* Body */}
          <p className="text-sm sm:text-[15px] font-light leading-[1.7] text-white/60 max-w-[420px] mb-6">
            {s.desc}
          </p>

          {/* CTA — only on last slide */}
          {s.cta && (
            <div className="flex items-center gap-3">
              <Link
                href="/scan"
                className="inline-flex items-center gap-2.5 bg-green-400 text-green-950 text-sm font-bold px-6 py-3 rounded-lg hover:bg-green-300 transition"
              >
                Scan Your Crop
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-white/55 text-sm px-5 py-3 rounded-lg border border-white/15 hover:border-green-400/40 hover:text-green-400 transition"
              >
                Browse Products
              </Link>
            </div>
          )}

          {/* Dots + progress */}
          <div className="flex items-center gap-2 mt-6">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => { scrollTo(i); resetTimer(); }}
                className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
                style={{ width: i === activeIdx ? 32 : 12 }}
              >
                <div className={`absolute inset-0 rounded-full ${i === activeIdx ? "bg-green-400/30" : "bg-white/20"}`} />
                {i === activeIdx && (
                  <div
                    className="absolute inset-y-0 left-0 bg-green-400 rounded-full"
                    style={{
                      animation: `progressFill ${AUTO_SCROLL_INTERVAL}ms linear`,
                    }}
                  />
                )}
              </button>
            ))}
            <span className="text-[11px] text-white/30 ml-2 tabular-nums">{activeIdx + 1}/{steps.length}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
