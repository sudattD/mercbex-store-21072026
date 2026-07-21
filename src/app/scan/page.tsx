"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { crops, products } from "@/data/products";
import { simulateMultiDetection, type DetectionResult } from "@/data/aiDetection";
import { useCrops } from "@/context/CropContext";
import { useCart, type ScanContext } from "@/context/CartContext";

type Phase = "crops" | "camera" | "analyzing" | "results";

export default function ScanPage() {
  const { selectedCrop, selectCrop } = useCrops();
  const { addToCart } = useCart();

  const [phase, setPhase] = useState<Phase>("crops");
  const [search, setSearch] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [results, setResults] = useState<DetectionResult[]>([]);
  const [expandedIdx, setExpandedIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [diagnosisSaved, setDiagnosisSaved] = useState(false);
  const [rejectedDiseases, setRejectedDiseases] = useState<Set<number>>(new Set());

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const filteredCrops = useMemo(() => {
    if (!search.trim()) return crops;
    const q = search.toLowerCase();
    return crops.filter((c) => c.name.toLowerCase().includes(q) || c.id.includes(q));
  }, [search]);

  // Compress image to thumbnail for storage (base64 images can be huge)
  const compressImage = (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxW = 320;
        const scale = maxW / img.width;
        canvas.width = maxW;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.5));
        } else {
          resolve("");
        }
      };
      img.onerror = () => resolve("");
      img.src = dataUrl;
    });
  };

  // Archive incomplete session to scan history
  const archiveSession = (session: string) => {
    try {
      const s = JSON.parse(session);
      if (s.results?.length > 0) {
        const scans = JSON.parse(localStorage.getItem("mercbex_crop_scans") || "[]");
        const isSaved = s.diagnosisSaved || false;
        s.results.forEach((r: DetectionResult) => {
          const exists = scans.some((sc: { disease: string }) => sc.disease === r.disease);
          if (!exists && isSaved) {
            scans.unshift({
              id: Date.now().toString() + r.disease,
              crop: r.crop,
              disease: r.disease,
              severity: r.severity,
              confidence: r.confidence,
              timestamp: new Date().toISOString(),
              status: "incomplete",
            });
          }
        });
        localStorage.setItem("mercbex_crop_scans", JSON.stringify(scans.slice(0, 50)));
      }
    } catch {}
  };

  // Restore last scan session on mount — or start fresh if crop changed
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mercbex_scan_session");
      if (saved) {
        const s = JSON.parse(saved);
        const savedCrop = s.selectedCrop || null;
        // If crop changed, archive old session and start fresh
        if (selectedCrop && savedCrop && savedCrop !== selectedCrop) {
          archiveSession(saved);
          localStorage.removeItem("mercbex_scan_session");
          return; // start fresh
        }
        if (s.results?.length > 0) {
          setResults(s.results);
          setImageUrl(s.imageUrl || null);
          setExpandedIdx(s.expandedIdx ?? 0);
          setDiagnosisSaved(s.diagnosisSaved || false);
          setRejectedDiseases(new Set(s.rejectedDiseases || []));
          setAddedProducts(new Set(s.addedProducts || []));
          setQuantities(s.quantities || {});
          setPhase("results");
        }
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save scan session whenever results change
  useEffect(() => {
    if (results.length > 0 && phase === "results") {
      const save = async () => {
        try {
          const thumb = imageUrl ? await compressImage(imageUrl) : null;
          localStorage.setItem("mercbex_scan_session", JSON.stringify({
            selectedCrop,
            results,
            imageUrl: thumb,
            expandedIdx,
            diagnosisSaved,
            rejectedDiseases: Array.from(rejectedDiseases),
            addedProducts: Array.from(addedProducts),
            quantities,
          }));
        } catch (e) {
          console.warn("Could not save scan session:", e);
        }
      };
      save();
    }
  }, [results, imageUrl, expandedIdx, diagnosisSaved, rejectedDiseases, addedProducts, quantities, phase]);

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // --- Camera ---
  const startCamera = async () => {
    setPhase("camera");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      alert("Camera not available. Please upload a photo instead.");
      stopCamera();
      setPhase("crops");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      setImageUrl(dataUrl);
      stopCamera();
      startAnalysis();
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageUrl(ev.target?.result as string);
      startAnalysis();
    };
    reader.readAsDataURL(file);
  };

  // --- Analysis ---
  const startAnalysis = () => {
    setPhase("analyzing");
    setProgress(0);
    const steps = [
      { progress: 15, delay: 300 },
      { progress: 35, delay: 700 },
      { progress: 55, delay: 1200 },
      { progress: 75, delay: 1800 },
      { progress: 90, delay: 2300 },
      { progress: 100, delay: 2800 },
    ];
    steps.forEach(({ progress: p, delay }) => {
      setTimeout(() => setProgress(p), delay);
    });
    setTimeout(() => {
      const detections = simulateMultiDetection(
        selectedCrop ? [selectedCrop] : undefined
      );
      setResults(detections);
      setExpandedIdx(0);
      setPhase("results");
      // Save scans to localStorage
      try {
        const scans = JSON.parse(localStorage.getItem("mercbex_crop_scans") || "[]");
        detections.forEach((d) => {
          scans.unshift({
            id: Date.now().toString() + d.disease,
            crop: d.crop,
            disease: d.disease,
            severity: d.severity,
            confidence: d.confidence,
            timestamp: new Date().toISOString(),
            status: "new_scan",
            totalIssues: detections.length,
          });
        });
        localStorage.setItem("mercbex_crop_scans", JSON.stringify(scans.slice(0, 50)));
      } catch {}
    }, 3000);
  };

  const getQty = (pid: string) => quantities[pid] || 1;

  const setQty = (pid: string, val: number) => {
    setQuantities((prev) => ({ ...prev, [pid]: Math.max(1, Math.min(10, val)) }));
  };

  const handleAddToCart = (productId: string, forDisease?: DetectionResult) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const qty = getQty(productId);
    const ctx: ScanContext | undefined = forDisease
      ? { crop: forDisease.crop, cropIcon: forDisease.cropIcon, disease: forDisease.disease, severity: forDisease.severity, scannedAt: new Date().toISOString() }
      : undefined;
    addToCart(product, product.packSizes[0], qty, ctx);
    setAddedProducts((prev) => new Set(prev).add(productId));
    // Update scan records from action_needed to in_cart
    try {
      const scans = JSON.parse(localStorage.getItem("mercbex_crop_scans") || "[]");
      let changed = false;
      scans.forEach((s: { disease: string; status: string }) => {
        if (forDisease && s.disease === forDisease.disease && s.status === "action_needed") {
          s.status = "in_cart";
          changed = true;
        }
      });
      if (changed) localStorage.setItem("mercbex_crop_scans", JSON.stringify(scans));
    } catch {}
  };

  const handleRescan = () => {
    // Archive current session as incomplete before clearing
    try {
      const saved = localStorage.getItem("mercbex_scan_session");
      if (saved) archiveSession(saved);
      localStorage.removeItem("mercbex_scan_session");
    } catch {}
    setPhase("crops");
    setImageUrl(null);
    setResults([]);
    setExpandedIdx(0);
    setProgress(0);
    setAddedProducts(new Set());
    setQuantities({});
    setDiagnosisSaved(false);
    setRejectedDiseases(new Set());
  };

  const severityColors: Record<string, { bg: string; text: string; label: string }> = {
    low: { bg: "bg-green-100", text: "text-green-700", label: "Low" },
    medium: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Medium" },
    high: { bg: "bg-orange-100", text: "text-orange-700", label: "High" },
    critical: { bg: "bg-red-100", text: "text-red-700", label: "Critical" },
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      <canvas ref={canvasRef} className="hidden" />

      {/* ===== PHASE: CROP SELECTION ===== */}
      {phase === "crops" && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
              AI Crop Scanner
            </div>
            <h1 className="text-3xl font-bold text-gray-900">What crops are you growing?</h1>
            <p className="text-gray-500 mt-2">Select your crops, then scan a photo to detect diseases and get treatment recommendations</p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-6">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search crops..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Crop grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
            {filteredCrops.map((crop) => {
              const isSelected = selectedCrop === crop.id;
              return (
                <button
                  key={crop.id}
                  onClick={() => selectCrop(crop.id)}
                  className={`relative rounded-xl overflow-hidden aspect-square group transition-all ${
                    isSelected ? "ring-3 ring-green-500 ring-offset-2" : "hover:ring-2 hover:ring-gray-300"
                  }`}
                >
                  <img src={crop.image} alt={crop.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <p className="absolute bottom-2 left-2 right-2 text-xs font-semibold text-white">{crop.name}</p>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {filteredCrops.length === 0 && (
            <p className="text-center text-gray-400 py-8">No crops found for &quot;{search}&quot;</p>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {selectedCrop && (
              <p className="text-sm text-gray-500">
                {crops.find((c) => c.id === selectedCrop)?.name} selected
              </p>
            )}
            <button
              onClick={startCamera}
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
              Open Camera
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-gray-700 px-8 py-3 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Upload Photo
            </button>
          </div>

          {/* How it works */}
          <div className="mt-12 max-w-2xl mx-auto">
            <h3 className="font-bold text-gray-900 text-center mb-6">How AI Crop Scanner Works</h3>
            <div className="grid sm:grid-cols-4 gap-4">
              {[
                { step: 1, title: "Select Crops", desc: "Choose which crops you grow", color: "bg-green-50 border-green-200", numColor: "bg-green-600" },
                { step: 2, title: "Take a Photo", desc: "Photograph the affected leaf or plant", color: "bg-blue-50 border-blue-200", numColor: "bg-blue-600" },
                { step: 3, title: "AI Diagnosis", desc: "Our AI identifies the disease in seconds", color: "bg-purple-50 border-purple-200", numColor: "bg-purple-600" },
                { step: 4, title: "Get Medicine", desc: "Get the exact product to treat it", color: "bg-orange-50 border-orange-200", numColor: "bg-orange-600" },
              ].map((item) => (
                <div key={item.step} className={`${item.color} border rounded-xl p-4 text-center`}>
                  <div className={`w-8 h-8 ${item.numColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <span className="text-white text-sm font-bold">{item.step}</span>
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== PHASE: CAMERA ===== */}
      {phase === "camera" && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <video ref={videoRef} autoPlay playsInline muted className="flex-1 object-cover w-full" />
          {/* Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
              <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-white rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-white rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-white rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-white rounded-br-xl" />
            </div>
            <div className="absolute top-20 left-0 right-0 text-center">
              <p className="text-white/90 text-sm font-medium">Point camera at the affected crop</p>
              <p className="text-white/50 text-xs mt-1">Position the leaf inside the frame</p>
            </div>
          </div>
          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pb-10 pt-16 px-6">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <button onClick={() => { stopCamera(); setPhase("crops"); }} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button onClick={capturePhoto} className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white" />
              </button>
              <button onClick={() => { stopCamera(); fileInputRef.current?.click(); }} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== PHASE: ANALYZING ===== */}
      {phase === "analyzing" && (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center px-6">
          {imageUrl && (
            <div className="w-48 h-48 rounded-3xl overflow-hidden mb-8 shadow-2xl ring-4 ring-white/10">
              <img src={imageUrl} alt="Scanned crop" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="w-full max-w-[320px] mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-xs font-medium">Analyzing image...</span>
              <span className="text-green-400 text-xs font-bold">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="space-y-3 w-full max-w-[320px]">
            {[
              { label: "Processing image", threshold: 15 },
              { label: "Detecting crop type", threshold: 35 },
              { label: "Analyzing symptoms", threshold: 55 },
              { label: "Identifying disease", threshold: 75 },
              { label: "Finding treatments", threshold: 90 },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                {progress >= step.threshold ? (
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : progress >= step.threshold - 20 ? (
                  <div className="w-5 h-5 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                )}
                <span className={`text-sm ${progress >= step.threshold ? "text-white" : "text-white/40"}`}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== PHASE: RESULTS ===== */}
      {phase === "results" && results.length > 0 && (
        <div className="min-h-screen pb-12">
          {/* Hero header with image */}
          <div className="relative h-56 bg-gray-900">
            {imageUrl && <img src={imageUrl} alt="Scanned crop" className="w-full h-full object-cover opacity-50" />}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
            <div className="absolute top-6 left-4 right-4 flex items-center justify-between">
              <button onClick={handleRescan} className="text-white/80 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-white/60 text-sm">AI Scan Results</span>
              <div className="w-6" />
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{results[0].cropIcon}</span>
                <span className="text-white/70 text-sm">{results[0].crop}</span>
              </div>
              <h2 className="text-white font-bold text-xl">
                {results.length === 1 ? "1 issue detected" : `${results.length} issues detected`}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                {results.map((r, i) => (
                  <span key={i} className={`${severityColors[r.severity].bg} ${severityColors[r.severity].text} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                    {severityColors[r.severity].label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">
            {/* Disease cards */}
            {results.map((result, idx) => {
              const isOpen = expandedIdx === idx;
              const isRejected = rejectedDiseases.has(idx);
              return (
                <div key={idx} className={`rounded-2xl shadow-sm overflow-hidden transition-all ${isRejected ? "bg-gray-100 opacity-50" : "bg-white"}`}>
                  <button
                    onClick={() => !isRejected && setExpandedIdx(isOpen ? -1 : idx)}
                    className={`w-full flex items-center gap-3 p-4 text-left transition ${isRejected ? "cursor-default" : "hover:bg-gray-50"}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isRejected ? "bg-gray-200" : result.severity === "critical" ? "bg-red-100" : result.severity === "high" ? "bg-orange-100" : "bg-yellow-100"
                    }`}>
                      {isRejected ? (
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      ) : (
                        <span className="text-sm font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${isRejected ? "text-gray-400 line-through" : "text-gray-900"}`}>{result.disease}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {isRejected ? (
                          <span className="bg-gray-200 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full">Rejected</span>
                        ) : (
                          <span className={`${severityColors[result.severity].bg} ${severityColors[result.severity].text} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                            {severityColors[result.severity].label}
                          </span>
                        )}
                        {!isRejected && <span className="text-[11px] text-gray-400">{result.confidence}% match</span>}
                      </div>
                    </div>
                    {!isRejected && (
                      <svg className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>

                  {isOpen && !isRejected && (
                    <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
                      <div className="pt-3">
                        <p className="text-gray-600 text-sm leading-relaxed">{result.description}</p>
                        {result.cause && (
                          <div className="mt-3 bg-amber-50 rounded-xl p-3">
                            <p className="text-[10px] text-amber-600 font-semibold mb-0.5">CAUSE</p>
                            <p className="text-amber-800 text-xs">{result.cause}</p>
                          </div>
                        )}
                      </div>

                      {result.referenceImages?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">Reference images</h4>
                          <p className="text-[11px] text-gray-400 mb-2">Does your crop look similar?</p>
                          <div className="flex gap-2 overflow-x-auto pb-1">
                            {result.referenceImages.map((img, i) => (
                              <div key={i} className="flex-shrink-0 w-[100px]">
                                <div className="w-[100px] h-[75px] rounded-lg overflow-hidden bg-gray-100">
                                  <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1 text-center leading-tight">{img.caption}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.symptoms.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm mb-2">Symptoms</h4>
                          <div className="space-y-1.5">
                            {result.symptoms.map((s, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                                <p className="text-gray-600 text-xs">{s}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reject — per disease */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRejectedDiseases((prev) => new Set(prev).add(idx));
                          const nextOpen = results.findIndex((_, i) => i !== idx && !rejectedDiseases.has(i));
                          setExpandedIdx(nextOpen >= 0 ? nextOpen : -1);
                        }}
                        className="w-full py-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        This doesn&apos;t match my crop
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* ── ONE CTA: Save & See Treatment ── */}
            {!diagnosisSaved && results.some((_, i) => !rejectedDiseases.has(i)) && (
              <button
                onClick={() => {
                  setDiagnosisSaved(true);
                  // Save non-rejected diseases to scan history
                  try {
                    const scans = JSON.parse(localStorage.getItem("mercbex_crop_scans") || "[]");
                    results.forEach((r, i) => {
                      if (rejectedDiseases.has(i)) return;
                      const exists = scans.some((sc: { disease: string }) => sc.disease === r.disease);
                      if (!exists) {
                        scans.unshift({
                          id: Date.now().toString() + r.disease,
                          crop: r.crop, disease: r.disease, severity: r.severity,
                          confidence: r.confidence, timestamp: new Date().toISOString(), status: "action_needed",
                        });
                      }
                    });
                    localStorage.setItem("mercbex_crop_scans", JSON.stringify(scans.slice(0, 50)));
                  } catch {}
                }}
                className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition text-base flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Save &amp; See Treatment
              </button>
            )}

            {/* ── RECOMMENDED MEDICINES — only after save, exclude rejected ── */}
            {diagnosisSaved && (() => {
              const medicineList: { pid: string; disease: string; severity: string; result: DetectionResult }[] = [];
              results.forEach((r, i) => {
                if (rejectedDiseases.has(i)) return;
                r.recommendedProductIds.forEach((pid) => {
                  if (!medicineList.some((m) => m.pid === pid)) {
                    medicineList.push({ pid, disease: r.disease, severity: r.severity, result: r });
                  }
                });
              });
              if (medicineList.length === 0) return null;

              return (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">Recommended Medicines</h3>
                        <p className="text-gray-400 text-[11px]">{medicineList.length} product{medicineList.length > 1 ? "s" : ""} for {results.filter((_, i) => !rejectedDiseases.has(i)).length} issue{results.filter((_, i) => !rejectedDiseases.has(i)).length > 1 ? "s" : ""}</p>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {medicineList.map(({ pid, disease, severity, result: diseaseResult }) => {
                      const product = products.find((p) => p.id === pid);
                      if (!product) return null;
                      const isAdded = addedProducts.has(pid);
                      const sevColor = severity === "critical" ? "bg-red-100 text-red-700" : severity === "high" ? "bg-orange-100 text-orange-700" : "bg-yellow-100 text-yellow-700";

                      return (
                        <div key={pid} className="p-4">
                          {/* Disease tag */}
                          <div className="flex items-center gap-1.5 mb-2.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sevColor}`}>{disease}</span>
                          </div>

                          {/* Product info */}
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center flex-shrink-0">
                              <p className="text-[6px] text-white/80 font-bold leading-tight text-center">MERCBEX</p>
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link href={`/products/${product.id}`} className="text-sm font-semibold text-gray-900 hover:text-green-700 transition truncate block">
                                {product.name}
                              </Link>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-green-700 font-bold text-base">₹{product.price}</span>
                                {product.originalPrice && (
                                  <span className="text-gray-400 text-xs line-through">₹{product.originalPrice}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Qty + Add to cart */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setQty(pid, getQty(pid) - 1)}
                                disabled={isAdded || getQty(pid) <= 1}
                                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 disabled:opacity-40 transition"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M5 12h14" /></svg>
                              </button>
                              <span className="w-8 text-center text-sm font-bold text-gray-900">{getQty(pid)}</span>
                              <button
                                onClick={() => setQty(pid, getQty(pid) + 1)}
                                disabled={isAdded || getQty(pid) >= 10}
                                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 disabled:opacity-40 transition"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
                              </button>
                            </div>
                            <button
                              onClick={() => handleAddToCart(pid, diseaseResult)}
                              disabled={isAdded}
                              className={`px-5 py-2 rounded-xl text-sm font-bold flex-shrink-0 transition flex items-center gap-2 ${
                                isAdded ? "bg-green-100 text-green-700" : "bg-green-600 text-white hover:bg-green-700"
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                  Added ({getQty(pid)})
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                                  Add to Cart{getQty(pid) > 1 ? ` (${getQty(pid)})` : ""}
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button onClick={handleRescan} className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition">
                Scan Another Crop
              </button>
              <Link href="/products" className="flex-1 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl text-center hover:bg-gray-50 transition">
                Browse All Products
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
