// Crop disease/pest detection mapping
// In production, this would be replaced by an ML model API response.
// The structure is designed so a real API can return the same shape.

export interface DetectedIssue {
  id: string;
  name: string;
  confidence: number; // 0-100
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  matchingProductIds: string[];
  icon: string;
}

export interface AnalysisResult {
  status: "analyzing" | "complete" | "error";
  detectedIssues: DetectedIssue[];
  cropType?: string;
  recommendation?: string;
}

// Maps visual symptoms/conditions to product IDs from our catalog
const issueDatabase: DetectedIssue[] = [
  {
    id: "aphid-infestation",
    name: "Aphid / Whitefly Infestation",
    confidence: 92,
    severity: "high",
    description: "Sucking pests detected on leaf undersides. Yellowing and curling of leaves visible. Immediate treatment recommended.",
    matchingProductIds: ["2", "4", "8", "10"], // Clothianidin, Thiacloprid, Imidacloprid, Flupyrimin
    icon: "🐛",
  },
  {
    id: "bollworm-damage",
    name: "Bollworm / Caterpillar Damage",
    confidence: 88,
    severity: "critical",
    description: "Boring damage and frass visible on fruits/bolls. Larvae feeding actively. Urgent intervention needed to prevent yield loss.",
    matchingProductIds: ["5", "7", "4"], // Bifenthrin+Clothianidin, Chlorfenapyr, Thiacloprid
    icon: "🐛",
  },
  {
    id: "fungal-leaf-spot",
    name: "Fungal Leaf Spot / Blight",
    confidence: 85,
    severity: "high",
    description: "Brown/dark spots with yellow halos on leaves. Fungal infection spreading — treat promptly to save the crop.",
    matchingProductIds: ["15", "16", "17", "18"], // Kasugamycin+Thifluzamide, Azoxystrobin+Tebuconazole, Copper Hydroxide, Copper Oxychloride
    icon: "🍂",
  },
  {
    id: "downy-mildew",
    name: "Downy Mildew / Late Blight",
    confidence: 90,
    severity: "critical",
    description: "White/grey fuzzy growth on leaf undersides with water-soaked lesions on top. Spreads rapidly in humid conditions.",
    matchingProductIds: ["17", "18", "19"], // Copper Hydroxide, Copper Oxychloride, Mancozeb+Azoxystrobin
    icon: "🛡️",
  },
  {
    id: "powdery-mildew",
    name: "Powdery Mildew",
    confidence: 94,
    severity: "medium",
    description: "White powdery coating on leaves and stems. Reduces photosynthesis and weakens the plant over time.",
    matchingProductIds: ["15", "16"], // Kasugamycin+Thifluzamide, Azoxystrobin+Tebuconazole
    icon: "🛡️",
  },
  {
    id: "termite-damage",
    name: "Termite / Soil Pest Damage",
    confidence: 87,
    severity: "high",
    description: "Root and stem base damage from soil pests. Wilting despite adequate watering is a key indicator.",
    matchingProductIds: ["1", "6"], // Fipronil, Chlorpyriphos
    icon: "🐜",
  },
  {
    id: "weed-infestation",
    name: "Weed Competition",
    confidence: 91,
    severity: "medium",
    description: "Heavy weed growth competing with crop for nutrients, water, and sunlight. Pre/post-emergence treatment advised.",
    matchingProductIds: ["21", "22", "23", "24", "25"], // Herbicides
    icon: "🌿",
  },
  {
    id: "mite-damage",
    name: "Mite Infestation",
    confidence: 86,
    severity: "medium",
    description: "Fine webbing and stippled/bronzed leaves indicating mite feeding. Populations can explode in hot, dry weather.",
    matchingProductIds: ["10", "11", "7"], // Flupyrimin, Benzpyrimoxan, Chlorfenapyr
    icon: "🔍",
  },
  {
    id: "nutrient-deficiency",
    name: "Nutrient Deficiency / Growth Issue",
    confidence: 78,
    severity: "low",
    description: "Yellowing, stunting, or abnormal growth patterns suggest nutrient issues. Consider plant growth regulators alongside fertilization.",
    matchingProductIds: ["29", "30"], // PGRs
    icon: "📈",
  },
  {
    id: "rodent-damage",
    name: "Rodent Damage",
    confidence: 83,
    severity: "high",
    description: "Gnaw marks on stems, roots, or stored produce. Burrow holes visible near crop rows.",
    matchingProductIds: ["27", "28"], // Rodenticides
    icon: "🐀",
  },
];

// Simulate an AI analysis — in production, replace this with a real API call
// e.g., POST /api/analyze-crop with the image file
export async function analyzeCropImage(_imageFile: File): Promise<AnalysisResult> {
  // Simulate network delay for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 2500));

  // Pick 2-3 random issues to simulate detection
  const shuffled = [...issueDatabase].sort(() => Math.random() - 0.5);
  const count = 2 + Math.floor(Math.random() * 2); // 2 or 3 issues
  const detected = shuffled.slice(0, count).map((issue) => ({
    ...issue,
    confidence: issue.confidence + Math.floor(Math.random() * 8) - 4, // slight variance
  }));

  // Sort by confidence descending
  detected.sort((a, b) => b.confidence - a.confidence);

  const crops = ["Rice", "Cotton", "Tomato", "Chili", "Wheat", "Sugarcane", "Vegetables"];
  const cropType = crops[Math.floor(Math.random() * crops.length)];

  return {
    status: "complete",
    detectedIssues: detected,
    cropType,
    recommendation: `Based on the analysis, we recommend immediate treatment for the primary issue. Apply the suggested product at the recommended dosage for best results on your ${cropType} crop.`,
  };
}
