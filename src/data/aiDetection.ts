// Simulated AI detection results for prototype
// In production, replace with a real ML model API call

export interface DetectionResult {
  crop: string;
  cropIcon: string;
  disease: string;
  confidence: number;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  symptoms: string[];
  cause: string;
  recommendedProductIds: string[];
  preventionTips: string[];
  referenceImages: { url: string; caption: string }[];
}

// Placeholder reference images — in production these come from the detection API
const refImg = (q: string, i: number) => `https://images.unsplash.com/photo-${q}?auto=format&fit=crop&w=300&q=60`;

const detectionPool: DetectionResult[] = [
  {
    crop: "Rice",
    cropIcon: "🌾",
    disease: "Rice Blast",
    confidence: 94,
    severity: "critical",
    description: "Fungal disease caused by Magnaporthe oryzae. Diamond-shaped lesions on leaves that can rapidly spread and destroy the crop.",
    symptoms: ["Diamond-shaped grey-green lesions on leaves", "Lesions with brown borders", "Neck rot causing broken panicles", "White to grey center in spots"],
    cause: "High humidity (>85%), moderate temperature (25-28°C), excess nitrogen fertilizer",
    recommendedProductIds: ["13", "19", "9"],
    preventionTips: ["Avoid excess nitrogen application", "Ensure proper spacing between plants", "Use resistant varieties", "Drain fields periodically"],
    referenceImages: [
      { url: refImg("1592982537447-6f71c5f9bbb7", 1), caption: "Diamond lesions on leaf" },
      { url: refImg("1574323347407-f5e1ad6d020b", 2), caption: "Neck blast damage" },
      { url: refImg("1625246333195-78d9c38ad449", 3), caption: "Field-level spread" },
    ],
  },
  {
    crop: "Rice",
    cropIcon: "🌾",
    disease: "Brown Plant Hopper (BPH)",
    confidence: 91,
    severity: "critical",
    description: "Small brown insects at the base of rice plants that suck sap, causing hopper burn — circular patches of dead, yellow-brown plants.",
    symptoms: ["Circular yellowing patches in field", "Plants drying up in patches (hopper burn)", "Honeydew and sooty mold on stems", "Small brown insects at plant base"],
    cause: "Overuse of insecticides killing natural predators, excessive nitrogen, continuous flooding",
    recommendedProductIds: ["10", "11", "8"],
    preventionTips: ["Avoid broad-spectrum insecticides", "Alternate wet and dry irrigation", "Use BPH-resistant varieties", "Monitor fields weekly"],
    referenceImages: [
      { url: refImg("1530836369250-ef72a3f5cda8", 1), caption: "Hopper burn patches" },
      { url: refImg("1594771804886-a933bb2d609b", 2), caption: "Insects at stem base" },
      { url: refImg("1536054337653-eca34bc11e5c", 3), caption: "Yellowing rice field" },
    ],
  },
  {
    crop: "Cotton",
    cropIcon: "🏵️",
    disease: "Bollworm Infestation",
    confidence: 88,
    severity: "high",
    description: "Helicoverpa armigera larvae bore into cotton bolls, feeding on lint and seeds. The most destructive pest of cotton.",
    symptoms: ["Round bore holes on bolls", "Frass (excrement) near entry points", "Larvae inside damaged bolls", "Premature boll opening"],
    cause: "Continuous cotton monocropping, warm weather, lack of natural enemies",
    recommendedProductIds: ["5", "7", "4"],
    preventionTips: ["Use pheromone traps for monitoring", "Plant refuge crops nearby", "Practice crop rotation", "Hand-pick larvae in small fields"],
    referenceImages: [
      { url: refImg("1605000797499-95a51c5269ae", 1), caption: "Bore holes on bolls" },
      { url: refImg("1500937386664-56d1dfef3854", 2), caption: "Larval damage inside" },
      { url: refImg("1560493676-04071c5f467b", 3), caption: "Premature boll opening" },
    ],
  },
  {
    crop: "Tomato",
    cropIcon: "🍅",
    disease: "Early Blight",
    confidence: 92,
    severity: "high",
    description: "Caused by Alternaria solani. Target-board pattern lesions on lower leaves that spread upward, causing defoliation.",
    symptoms: ["Concentric ring spots (target-board pattern)", "Lower leaves affected first", "Dark brown circular lesions", "Premature defoliation"],
    cause: "Warm humid weather, overhead irrigation, poor air circulation",
    recommendedProductIds: ["15", "19", "17"],
    preventionTips: ["Use drip irrigation instead of overhead", "Remove infected lower leaves", "Maintain proper spacing", "Apply preventive fungicide sprays"],
    referenceImages: [
      { url: refImg("1592838064575-70ed626438c2", 1), caption: "Target-board lesions" },
      { url: refImg("1587049352846-4a222e784d38", 2), caption: "Leaf defoliation" },
      { url: refImg("1560493676-04071c5f467b", 3), caption: "Affected lower leaves" },
    ],
  },
  {
    crop: "Tomato",
    cropIcon: "🍅",
    disease: "Leaf Curl Virus",
    confidence: 86,
    severity: "critical",
    description: "Tomato Leaf Curl Virus (ToLCV) transmitted by whiteflies. Causes severe upward curling of leaves and stunted growth.",
    symptoms: ["Severe upward curling of leaves", "Stunted plant growth", "Thick leathery leaves", "Yellow leaf margins"],
    cause: "Whitefly (Bemisia tabaci) transmission, warm dry weather favoring whitefly",
    recommendedProductIds: ["8", "4", "2"],
    preventionTips: ["Use whitefly-resistant varieties", "Install yellow sticky traps", "Use neem oil as deterrent", "Remove infected plants early"],
    referenceImages: [
      { url: refImg("1592838064575-70ed626438c2", 1), caption: "Curled leaves" },
      { url: refImg("1574323347407-f5e1ad6d020b", 2), caption: "Stunted growth" },
      { url: refImg("1587049352846-4a222e784d38", 3), caption: "Whitefly on leaf" },
    ],
  },
  {
    crop: "Potato",
    cropIcon: "🥔",
    disease: "Late Blight",
    confidence: 95,
    severity: "critical",
    description: "Caused by Phytophthora infestans. Entire fields can be destroyed in days under cool, wet conditions.",
    symptoms: ["Water-soaked dark lesions on leaf tips", "White fungal growth on leaf undersides", "Rapid blackening of entire foliage", "Brown rot on tubers"],
    cause: "Cool temperatures (15-22°C), high humidity, rain, fog",
    recommendedProductIds: ["17", "18", "14"],
    preventionTips: ["Plant certified disease-free seed tubers", "Apply protective fungicide before rains", "Destroy infected plant debris", "Avoid overhead irrigation"],
    referenceImages: [
      { url: refImg("1508313880080-c4bef0730395", 1), caption: "Dark water-soaked lesions" },
      { url: refImg("1574323347407-f5e1ad6d020b", 2), caption: "White growth on underside" },
      { url: refImg("1592982537447-6f71c5f9bbb7", 3), caption: "Blackened foliage" },
    ],
  },
  {
    crop: "Chili",
    cropIcon: "🌶️",
    disease: "Anthracnose (Fruit Rot)",
    confidence: 89,
    severity: "critical",
    description: "Caused by Colletotrichum spp. Sunken dark spots with concentric rings on ripening fruits.",
    symptoms: ["Sunken dark spots on ripe fruits", "Concentric rings of black dots", "Fruits shrivel and dry", "Mummified fruits on plant"],
    cause: "Wet weather during fruiting, infected seeds, splash-dispersed spores",
    recommendedProductIds: ["16", "17", "19"],
    preventionTips: ["Use disease-free seeds", "Avoid overhead irrigation during fruiting", "Remove and destroy infected fruits", "Spray preventive fungicide before monsoon"],
    referenceImages: [
      { url: refImg("1592838064575-70ed626438c2", 1), caption: "Sunken dark spots" },
      { url: refImg("1587049352846-4a222e784d38", 2), caption: "Concentric rings" },
      { url: refImg("1560493676-04071c5f467b", 3), caption: "Shrivelled fruits" },
    ],
  },
  {
    crop: "Wheat",
    cropIcon: "🌾",
    disease: "Yellow Rust (Stripe Rust)",
    confidence: 90,
    severity: "critical",
    description: "Caused by Puccinia striiformis. Yellow-orange pustules arranged in stripes along leaf veins.",
    symptoms: ["Yellow-orange pustules in stripes on leaves", "Leaves yellow and dry prematurely", "Reduced grain filling", "Stripe pattern along veins"],
    cause: "Cool temperatures (10-18°C), high humidity, dew, susceptible varieties",
    recommendedProductIds: ["19", "18"],
    preventionTips: ["Use resistant wheat varieties", "Timely sowing — avoid late sowing", "Apply fungicide at first appearance", "Monitor fields from tillering stage"],
    referenceImages: [
      { url: refImg("1574323347407-f5e1ad6d020b", 1), caption: "Yellow-orange pustules" },
      { url: refImg("1530836369250-ef72a3f5cda8", 2), caption: "Stripe pattern on leaf" },
      { url: refImg("1625246333195-78d9c38ad449", 3), caption: "Premature yellowing" },
    ],
  },
  {
    crop: "Grapes",
    cropIcon: "🍇",
    disease: "Downy Mildew",
    confidence: 93,
    severity: "critical",
    description: "Caused by Plasmopara viticola. Devastating in humid monsoon weather.",
    symptoms: ["Oily yellowish spots on upper leaf surface", "White cottony growth on leaf undersides", "Berries shrivel and turn brown", "Shoot tips blackened"],
    cause: "High humidity, rain, warm temperatures (20-25°C), poor air circulation",
    recommendedProductIds: ["17", "18", "19"],
    preventionTips: ["Ensure good canopy management", "Spray copper fungicide before monsoon", "Remove infected leaves", "Maintain proper drainage"],
    referenceImages: [
      { url: refImg("1560493676-04071c5f467b", 1), caption: "Oily spots on leaf" },
      { url: refImg("1592838064575-70ed626438c2", 2), caption: "Cottony underside growth" },
      { url: refImg("1587049352846-4a222e784d38", 3), caption: "Shrivelled berries" },
    ],
  },
  {
    crop: "Sugarcane",
    cropIcon: "🎋",
    disease: "Stem Borer",
    confidence: 87,
    severity: "critical",
    description: "Larvae tunnel into sugarcane stems causing dead hearts. Reduces sugar content and can cause lodging.",
    symptoms: ["Dead hearts — central shoot wilts and dries", "Bore holes on internodes with frass", "Internal tunneling visible when split", "Reduced sugar recovery"],
    cause: "Continuous sugarcane cropping, late planting, poor field hygiene",
    recommendedProductIds: ["5", "1", "3"],
    preventionTips: ["Remove and destroy dead hearts", "Use light traps for adult moths", "Release Trichogramma parasitoids", "Trash mulching to reduce egg laying"],
    referenceImages: [
      { url: refImg("1500937386664-56d1dfef3854", 1), caption: "Dead heart symptom" },
      { url: refImg("1605000797499-95a51c5269ae", 2), caption: "Bore holes with frass" },
      { url: refImg("1574323347407-f5e1ad6d020b", 3), caption: "Internal tunneling" },
    ],
  },
  {
    crop: "Soybean",
    cropIcon: "🫘",
    disease: "Soybean Rust",
    confidence: 85,
    severity: "high",
    description: "Caused by Phakopsora pachyrhizi. Can reduce yield by 30-80% if not controlled early.",
    symptoms: ["Tan to reddish-brown pustules on leaf undersides", "Rapid yellowing and defoliation", "Premature pod maturity", "Small shrivelled seeds"],
    cause: "Warm humid conditions, windborne spores from other regions",
    recommendedProductIds: ["19", "18"],
    preventionTips: ["Use early-maturing varieties", "Apply fungicide at first sign of pustules", "Scout lower canopy regularly", "Avoid late planting"],
    referenceImages: [
      { url: refImg("1592982537447-6f71c5f9bbb7", 1), caption: "Reddish-brown pustules" },
      { url: refImg("1530836369250-ef72a3f5cda8", 2), caption: "Yellowing and defoliation" },
      { url: refImg("1560493676-04071c5f467b", 3), caption: "Shrivelled seeds" },
    ],
  },
  {
    crop: "Mango",
    cropIcon: "🥭",
    disease: "Powdery Mildew",
    confidence: 91,
    severity: "high",
    description: "White powdery coating on flower panicles and young fruits. Causes massive flower drop and poor fruit set.",
    symptoms: ["White powdery coating on panicles", "Flower drop and poor fruit set", "Deformed small fruits", "Powdery growth on young leaves"],
    cause: "Cool dry weather during flowering, cloudy conditions, temperature 15-25°C",
    recommendedProductIds: ["19", "15"],
    preventionTips: ["Spray sulfur-based fungicide before flowering", "Prune dense canopy for air circulation", "Apply at panicle emergence stage", "Avoid excess nitrogen"],
    referenceImages: [
      { url: refImg("1553279768-865429fa0078", 1), caption: "White powdery coating" },
      { url: refImg("1587049352846-4a222e784d38", 2), caption: "Flower drop" },
      { url: refImg("1592838064575-70ed626438c2", 3), caption: "Deformed young fruits" },
    ],
  },
];

export function simulateDetection(userCropIds?: string[], previousDisease?: string): DetectionResult {
  let pool = detectionPool;

  if (userCropIds && userCropIds.length > 0) {
    const cropNames: Record<string, string> = {
      rice: "Rice", cotton: "Cotton", wheat: "Wheat", tomato: "Tomato",
      chili: "Chili", sugarcane: "Sugarcane", potato: "Potato",
      grapes: "Grapes", soybean: "Soybean", mango: "Mango",
    };
    const userCropNames = userCropIds.map(id => cropNames[id]).filter(Boolean);
    const matched = detectionPool.filter(d => userCropNames.includes(d.crop));
    if (matched.length > 0) pool = matched;
  }

  if (previousDisease && pool.length > 1) {
    pool = pool.filter(d => d.disease !== previousDisease);
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

// Returns 1-3 unique diseases, sorted by severity (critical first)
const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

export function simulateMultiDetection(userCropIds?: string[]): DetectionResult[] {
  let pool = [...detectionPool];

  if (userCropIds && userCropIds.length > 0) {
    const cropNames: Record<string, string> = {
      rice: "Rice", cotton: "Cotton", wheat: "Wheat", tomato: "Tomato",
      chili: "Chili", sugarcane: "Sugarcane", potato: "Potato",
      grapes: "Grapes", soybean: "Soybean", mango: "Mango",
    };
    const userCropNames = userCropIds.map(id => cropNames[id]).filter(Boolean);
    const matched = pool.filter(d => userCropNames.includes(d.crop));
    if (matched.length > 0) pool = matched;
  }

  // Shuffle and pick 1-3 unique diseases
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const count = Math.min(shuffled.length, Math.random() < 0.3 ? 1 : Math.random() < 0.6 ? 2 : 3);
  const picked = shuffled.slice(0, count);

  // Sort by severity
  return picked.sort((a, b) => (severityOrder[a.severity] ?? 3) - (severityOrder[b.severity] ?? 3));
}
