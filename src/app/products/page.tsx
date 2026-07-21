"use client";

import { useState, useMemo, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { products as staticProducts, categories, getProducts } from "@/data/products";
import { analyzeCropImage, AnalysisResult } from "@/data/cropAnalysis";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import CategoryIcon from "@/components/CategoryIcon";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");
  const { t } = useLanguage();
  const { addToCart } = useCart();

  const [search, setSearch] = useState(searchParam || "");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");
  const [isListening, setIsListening] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{ file: File; preview: string } | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [products, setProducts] = useState(staticProducts);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam) setSearch(searchParam);
  }, [categoryParam, searchParam]);

  const startVoiceInput = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(t("analysis.voiceNotSupported"));
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: { results: { 0: { 0: { transcript: string } } } }) => {
      const transcript = event.results[0][0].transcript;
      setSearch((prev) => (prev ? prev + " " + transcript : transcript));
    };
    recognition.start();
  }, [t]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setUploadedImage({ file, preview });
    // Start analysis immediately
    setAnalysis({ status: "analyzing", detectedIssues: [] });
    analyzeCropImage(file).then((result) => {
      setAnalysis(result);
      // Persist scan for admin panel
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const scan = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            imageData: reader.result,
            fileName: file.name,
            fileSize: file.size,
            analysisResult: result,
            createdAt: new Date().toISOString(),
          };
          const existing = JSON.parse(localStorage.getItem("mercbex_crop_scans") || "[]");
          existing.unshift(scan);
          // Keep last 50 scans
          localStorage.setItem("mercbex_crop_scans", JSON.stringify(existing.slice(0, 50)));
        };
        reader.readAsDataURL(file);
      } catch { /* ignore storage errors */ }
    }).catch(() => {
      setAnalysis({ status: "error", detectedIssues: [] });
    });
  }, []);

  const removeImage = useCallback(() => {
    if (uploadedImage) URL.revokeObjectURL(uploadedImage.preview);
    setUploadedImage(null);
    setAnalysis(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [uploadedImage]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "all") {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) {
        result = result.filter((p) => p.category === cat.name);
      }
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.activeIngredient.toLowerCase().includes(q) ||
          p.targetPests.some((t) => t.toLowerCase().includes(q)) ||
          p.cropSuitability.some((c) => c.toLowerCase().includes(q))
      );
    }

    if (priceRange === "under500") result = result.filter((p) => p.price < 500);
    else if (priceRange === "500-1000") result = result.filter((p) => p.price >= 500 && p.price <= 1000);
    else if (priceRange === "1000-2000") result = result.filter((p) => p.price >= 1000 && p.price <= 2000);
    else if (priceRange === "above2000") result = result.filter((p) => p.price > 2000);

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [search, selectedCategory, sortBy, priceRange]);

  const categoryCount = (slug: string) => {
    const cat = categories.find((c) => c.slug === slug);
    return cat ? products.filter((p) => p.category === cat.name).length : 0;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-950 to-brand-900 py-10 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">{t("products.title")}</h1>
          <p className="text-brand-300 mt-2">
            {t("products.searchHint")}
          </p>
        </div>
      </div>

      {/* Search bar — pulled up to overlap the header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-2">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-400 ml-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={t("products.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-400 bg-transparent border-0 focus:outline-none text-base"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="p-2 text-gray-400 hover:text-gray-600 transition"
                title={t("search.clearSearch")}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}

            {/* Voice input */}
            <button
              onClick={startVoiceInput}
              className={`p-2 rounded-lg transition shrink-0 ${isListening ? "bg-red-50 text-red-500 animate-pulse" : "text-gray-400 hover:text-brand-700 hover:bg-brand-50"}`}
              title={t("search.voiceTitle")}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>

            {/* Photo upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-lg transition shrink-0 ${uploadedImage ? "text-brand-700 bg-brand-50" : "text-gray-400 hover:text-brand-700 hover:bg-brand-50"}`}
              title={t("search.uploadPhoto")}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <button
              onClick={() => {}}
              className="bg-brand-800 hover:bg-brand-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shrink-0 ml-1"
            >
              {t("hero.findSolution")}
            </button>
          </div>

          {/* Uploaded image preview */}
          {uploadedImage && (
            <div className="flex items-center gap-3 mt-2 mx-2 p-2 bg-gray-50 rounded-xl">
              <img src={uploadedImage.preview} alt="Uploaded crop" className="w-14 h-14 rounded-lg object-cover border border-gray-200" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{uploadedImage.file.name}</p>
                {analysis?.status === "analyzing" ? (
                  <p className="text-xs text-brand-600 flex items-center gap-1 mt-0.5">
                    <span className="w-3 h-3 border-2 border-brand-600 border-t-transparent rounded-full animate-spin inline-block" />
                    {t("analysis.analyzing")}
                  </p>
                ) : analysis?.status === "complete" ? (
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {analysis.detectedIssues.length} {t("analysis.issuesDetected")}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">{(uploadedImage.file.size / 1024).toFixed(0)} KB</p>
                )}
              </div>
              <button onClick={removeImage} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title={t("search.removeImage")}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}

          {/* Helper text — only show when no image uploaded */}
          {!uploadedImage && (
            <div className="flex items-center gap-3 mt-1.5 mx-3 mb-1">
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                {t("search.speakProblem")}
              </span>
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {t("search.uploadPhoto")}
              </span>
            </div>
          )}
        </div>

        {/* Analysis results — single clean panel */}
        {analysis?.status === "analyzing" && (
          <div className="mt-4 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-700 rounded-full animate-spin mx-auto mb-3" />
            <h3 className="font-bold text-gray-900">{t("analysis.analyzingTitle")}</h3>
            <p className="text-sm text-gray-400 mt-1">{t("analysis.aiIdentifying")}</p>
          </div>
        )}

        {analysis?.status === "complete" && (
          <div className="mt-4 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Title bar */}
            <div className="px-5 py-4 bg-gradient-to-r from-brand-900 to-brand-800 flex items-center gap-3">
              {uploadedImage && (
                <img src={uploadedImage.preview} alt="Crop" className="w-10 h-10 rounded-lg object-cover border-2 border-white/30 shrink-0" />
              )}
              <div>
                <h3 className="font-bold text-white">{t("analysis.prescriptionTitle")}</h3>
                {analysis.cropType && (
                  <p className="text-brand-200 text-xs">{t("analysis.cropType")}: {analysis.cropType}</p>
                )}
              </div>
            </div>

            {/* Steps — one per detected issue */}
            <div className="divide-y divide-gray-100">
              {analysis.detectedIssues.map((issue, idx) => {
                const bestProduct = products.find((p) => p.id === issue.matchingProductIds[0]);
                const altProducts = products.filter((p) => issue.matchingProductIds.slice(1).includes(p.id));

                return (
                  <div key={issue.id} className="p-5">
                    {/* Step header */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-7 h-7 rounded-full bg-brand-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-gray-900 flex items-center gap-1.5">
                          <CategoryIcon name={issue.icon} className="w-4 h-4" /> {issue.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{issue.description}</p>
                      </div>
                    </div>

                    {/* Best pick — the ONE product to buy */}
                    {bestProduct && (
                      <div className="ml-10 bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-1.5 mb-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
                          <span className="text-xs font-bold text-green-700 uppercase tracking-wide">{t("analysis.bestPick")}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <a href={`/products/${bestProduct.id}`} className="font-bold text-gray-900 text-sm hover:text-brand-700 transition">
                              {bestProduct.name}
                            </a>
                            <p className="text-xs text-gray-500 mt-0.5">{bestProduct.activeIngredient}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{bestProduct.dosage}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-lg font-bold text-brand-800">₹{bestProduct.price.toLocaleString()}</p>
                            <button
                              onClick={() => addToCart(bestProduct, bestProduct.packSizes[0])}
                              className="mt-1.5 bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold px-4 py-2 rounded-lg transition flex items-center gap-1.5"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                              {t("product.add")}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Alternatives — collapsed, secondary */}
                    {altProducts.length > 0 && (
                      <details className="ml-10 mt-2">
                        <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 transition">
                          {t("analysis.alternatives")} ({altProducts.length})
                        </summary>
                        <div className="mt-2 space-y-1.5">
                          {altProducts.map((alt) => (
                            <a
                              key={alt.id}
                              href={`/products/${alt.id}`}
                              className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-700 truncate">{alt.name}</p>
                                <p className="text-[10px] text-gray-400">{alt.activeIngredient}</p>
                              </div>
                              <span className="text-sm font-bold text-gray-600 shrink-0 ml-3">₹{alt.price.toLocaleString()}</span>
                            </a>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-sm">
              <button onClick={removeImage} className="text-gray-500 hover:text-gray-700 transition">
                {t("analysis.clearBrowse")}
              </button>
              <a href="tel:+911800123456" className="text-green-700 font-semibold hover:text-green-800 transition flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                {t("analysis.needHelp")}
              </a>
            </div>
          </div>
        )}

        {analysis?.status === "error" && (
          <div className="mt-4 bg-white rounded-2xl shadow-lg border border-red-200 p-6 text-center">
            <svg className="w-10 h-10 text-red-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            <h3 className="font-bold text-red-800">{t("analysis.failed")}</h3>
            <p className="text-sm text-red-600 mt-1">{t("analysis.failedDesc")}</p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <button onClick={() => fileInputRef.current?.click()} className="text-sm font-semibold text-brand-700 hover:text-brand-800 transition">{t("analysis.tryAnother")}</button>
              <span className="text-gray-300">|</span>
              <a href="tel:+911800123456" className="text-sm font-semibold text-green-700 hover:text-green-800 transition">{t("analysis.callExpert")}: 1800-123-456</a>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm sticky top-28 space-y-6 ${filtersOpen ? "block" : "hidden lg:block"}`}>
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">{t("products.category")}</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${selectedCategory === "all" ? "bg-brand-50 text-brand-700 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    {t("products.allProducts")} ({products.length})
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${selectedCategory === cat.slug ? "bg-brand-50 text-brand-700 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      <CategoryIcon name={cat.icon} className="w-4 h-4" />
                      {cat.name} ({categoryCount(cat.slug)})
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">{t("products.priceRange")}</h3>
                <div className="space-y-1">
                  {[
                    { value: "all", label: t("products.allPrices") },
                    { value: "under500", label: "Under ₹500" },
                    { value: "500-1000", label: "₹500 - ₹1,000" },
                    { value: "1000-2000", label: "₹1,000 - ₹2,000" },
                    { value: "above2000", label: "Above ₹2,000" },
                  ].map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setPriceRange(range.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${priceRange === range.value ? "bg-brand-50 text-brand-700 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Worried farmer help box */}
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <p className="text-sm font-bold text-red-800">{t("products.cropEmergency")}</p>
                </div>
                <p className="text-xs text-red-600 leading-relaxed">
                  {t("products.cantFind")}
                </p>
                <a
                  href="tel:+911800123456"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-red-700 hover:text-red-800 bg-red-100 px-3 py-1.5 rounded-lg transition"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  1800-123-456
                </a>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 gap-3">
              <p className="text-sm text-gray-500">
                {t("products.showing")} <span className="font-semibold text-gray-900">{filtered.length}</span> {t("products.productsLabel")}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className={`lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition ${filtersOpen ? "bg-brand-50 border-brand-200 text-brand-700" : "bg-white border-gray-200 text-gray-600"}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                  Filters
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="featured">{t("sort.featured")}</option>
                  <option value="price-low">{t("sort.priceLow")}</option>
                  <option value="price-high">{t("sort.priceHigh")}</option>
                  <option value="rating">{t("sort.rating")}</option>
                  <option value="name">{t("sort.name")}</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">{t("products.noResults")}</h3>
                <p className="text-gray-500 mt-2">{t("products.tryDifferent")}</p>
                <button
                  onClick={() => { setSearch(""); setSelectedCategory("all"); setPriceRange("all"); }}
                  className="mt-4 text-brand-700 font-semibold hover:text-brand-800 transition"
                >
                  {t("products.clearFilters")}
                </button>
                <div className="mt-6 text-sm text-gray-500">
                  {t("products.orCallExpert")}: <a href="tel:+911800123456" className="font-semibold text-brand-700">1800-123-456</a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
      <ProductsContent />
    </Suspense>
  );
}
