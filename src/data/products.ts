export type ProductCategory = "Insecticide" | "Fungicide" | "Herbicide" | "Rodenticide" | "Plant Growth Regulator";

export interface Product {
  id: string;
  name: string;
  activeIngredient: string;
  formulation: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  targetPests: string[];
  cropSuitability: string[];
  dosage: string;
  packSizes: string[];
  features: string[];
  inStock: boolean;
  badge?: string;
}

export const categories = [
  { name: "Insecticide", slug: "insecticide", icon: "Bug", description: "Protect crops from harmful insects" },
  { name: "Fungicide", slug: "fungicide", icon: "Shield", description: "Fight fungal diseases effectively" },
  { name: "Herbicide", slug: "herbicide", icon: "Leaf", description: "Eliminate unwanted weeds" },
  { name: "Rodenticide", slug: "rodenticide", icon: "Rat", description: "Control rodent infestations" },
  { name: "Plant Growth Regulator", slug: "pgr", icon: "TrendingUp", description: "Boost crop growth and yield" },
];

// Common pest/problem lookup for the worried farmer persona
export interface CropProblem {
  id: string;
  problem: string;
  solution: string;
  icon: string;
  description: string;
  symptoms: string[];
  affectedCrops: string[];
  severity: "low" | "medium" | "high" | "critical";
  season: string;
  imageUrl: string;
  referenceImages: { src: string; caption: string }[];
  prevention: string[];
  matchingProductIds: string[];
}

export const commonProblems: CropProblem[] = [
  {
    id: "whitefly-aphids",
    problem: "Whitefly / Aphids",
    solution: "Imidacloprid 17.1% SL, Clothianidin 50% WG, Thiacloprid 21.7% SC",
    icon: "🦟",
    description: "Tiny sap-sucking insects that cluster on the underside of leaves. They weaken the plant by draining nutrients and secrete honeydew that promotes sooty mold growth, reducing photosynthesis.",
    symptoms: [
      "Yellow or pale spots on upper leaf surface",
      "Sticky honeydew on leaves attracting ants",
      "Black sooty mold coating on leaf surface",
      "Curling and wilting of young leaves",
      "Cloud of tiny white insects when plant is disturbed",
    ],
    affectedCrops: ["Cotton", "Chili", "Tomato", "Brinjal", "Okra", "Vegetables", "Rice", "Mango"],
    severity: "high",
    season: "Kharif & Rabi (year-round in warm climates)",
    imageUrl: "/images/problems/whitefly-aphids.svg",
    referenceImages: [
      { src: "/images/problems/whitefly-aphids.svg", caption: "Whiteflies and aphid clusters on leaf underside with yellowing damage" },
    ],
    prevention: [
      "Use yellow sticky traps to monitor populations",
      "Remove and destroy heavily infested leaves",
      "Avoid excessive nitrogen fertilization",
      "Encourage natural predators like ladybugs",
    ],
    matchingProductIds: ["8", "2", "4"],
  },
  {
    id: "bollworm-caterpillar",
    problem: "Bollworm / Caterpillar",
    solution: "Chlorfenapyr 10% SC, Bifenthrin 8% + Clothianidin 10% SC",
    icon: "Bug",
    description: "Larvae of moths that bore into fruiting bodies (bolls, pods, fruits). American bollworm (Helicoverpa armigera) is one of the most destructive pests, causing massive yield losses in cotton and pulses.",
    symptoms: [
      "Round entry holes in bolls, fruits, or pods",
      "Frass (excrement) visible near bore holes",
      "Premature dropping of flowers and young bolls",
      "Damaged bolls with rotting lint inside",
      "Caterpillars visible inside fruits when cut open",
    ],
    affectedCrops: ["Cotton", "Chili", "Tomato", "Chickpea (Gram)", "Pigeon Pea", "Soybean", "Maize"],
    severity: "critical",
    season: "Kharif (July-October), peak during flowering",
    imageUrl: "/images/problems/bollworm-caterpillar.svg",
    referenceImages: [
      { src: "/images/problems/bollworm-caterpillar.svg", caption: "Bollworm larva and entry holes in cotton boll with frass" },
    ],
    prevention: [
      "Install pheromone traps to monitor moth activity",
      "Handpick and destroy visible larvae early",
      "Practice crop rotation to break pest cycle",
      "Use Bt cotton varieties where available",
    ],
    matchingProductIds: ["7", "5"],
  },
  {
    id: "termites-soil-pests",
    problem: "Termites / Soil Pests",
    solution: "Fipronil 0.6% WG, Chlorpyriphos 75% WG",
    icon: "🪲",
    description: "Underground pests that feed on plant roots and lower stems. Termites build mud tunnels up stems and can kill an entire plant by destroying the root system. Often undetected until serious damage occurs.",
    symptoms: [
      "Sudden wilting of apparently healthy plants",
      "Mud tubes or tunnels on lower stem surface",
      "Hollow or papery roots when pulled up",
      "Patchy gaps appearing in the field",
      "Dead plants easily pulled from soil",
    ],
    affectedCrops: ["Sugarcane", "Wheat", "Groundnut", "Maize", "Potato", "Plantation Crops"],
    severity: "high",
    season: "Year-round, worse in dry conditions",
    imageUrl: "/images/problems/termites-soil-pests.svg",
    referenceImages: [
      { src: "/images/problems/termites-soil-pests.svg", caption: "Termites in soil tunnels damaging plant root system" },
    ],
    prevention: [
      "Treat soil before sowing with granular insecticide",
      "Remove crop stubble and debris from fields",
      "Ensure proper field drainage",
      "Rotate crops to break pest cycle",
    ],
    matchingProductIds: ["1", "6"],
  },
  {
    id: "rice-blast-sheath-blight",
    problem: "Rice Blast / Sheath Blight",
    solution: "Kasugamycin 6% + Thifluzamide 26% SC, Azoxystrobin 120 g/L + Tebuconazole 240 g/L SC",
    icon: "🍂",
    description: "Rice blast (Magnaporthe oryzae) causes diamond-shaped lesions on leaves and neck rot. Sheath blight (Rhizoctonia solani) creates water-soaked patches on leaf sheaths. Both are devastating rice diseases that can destroy 50-80% of the crop.",
    symptoms: [
      "Diamond-shaped grey spots with brown borders on leaves (blast)",
      "Oval greenish-grey water-soaked patches on sheaths (sheath blight)",
      "White to grey panicles with no grain filling (neck blast)",
      "Dried up and broken leaf sheaths",
      "Grain discoloration and unfilled grains",
    ],
    affectedCrops: ["Rice (Paddy)"],
    severity: "critical",
    season: "Kharif (monsoon season), high humidity periods",
    imageUrl: "/images/problems/rice-blast.svg",
    referenceImages: [
      { src: "/images/problems/rice-blast.svg", caption: "Diamond-shaped lesions on rice leaves with gray center and brown border" },
    ],
    prevention: [
      "Use blast-resistant rice varieties",
      "Avoid excessive nitrogen application",
      "Maintain proper plant spacing for air circulation",
      "Apply preventive fungicide sprays at tillering stage",
    ],
    matchingProductIds: ["13", "19"],
  },
  {
    id: "late-blight-downy-mildew",
    problem: "Late Blight / Downy Mildew",
    solution: "Copper Hydroxide 77% WP, Copper Oxychloride 50% WG, Mancozeb 40% + Azoxystrobin 7% OS",
    icon: "🍄",
    description: "Late blight (Phytophthora infestans) is the disease that caused the Irish Potato Famine. It spreads rapidly in cool, wet weather and can destroy an entire potato or tomato crop within days. Downy mildew similarly devastates grapes and vegetables.",
    symptoms: [
      "Dark, water-soaked patches on leaves turning brown-black",
      "White fluffy fungal growth on leaf undersides (especially mornings)",
      "Rapid browning and collapse of entire plant canopy",
      "Brown rotting of tubers with granular texture",
      "Foul smell from infected fruits and tubers",
    ],
    affectedCrops: ["Potato", "Tomato", "Grapes", "Chili", "Onion", "Citrus", "Cucurbits"],
    severity: "critical",
    season: "Rabi (winter) and monsoon, cool wet weather",
    imageUrl: "/images/problems/late-blight.svg",
    referenceImages: [
      { src: "/images/problems/late-blight.svg", caption: "Water-soaked dark lesions with white mildew growth on leaf" },
    ],
    prevention: [
      "Start preventive copper sprays before disease onset",
      "Avoid overhead irrigation in evening",
      "Remove and burn infected plant material",
      "Use disease-free seed tubers/transplants",
    ],
    matchingProductIds: ["14", "15", "18"],
  },
  {
    id: "broadleaf-weeds",
    problem: "Broadleaf Weeds",
    solution: "Pendimethalin 38.4% + Pyrazosulfuron Ethyl 0.85% ZC, Halosulfuron methyl 12% + Metribuzin 55% WG",
    icon: "Leaf",
    description: "Broad-leaved weeds compete with crops for water, nutrients, and sunlight. Common species include Parthenium, Amaranthus, Chenopodium, and Eclipta. They can reduce yield by 30-50% if not managed early.",
    symptoms: [
      "Wide-leaved plants growing between crop rows",
      "Crop plants look stunted due to competition",
      "Uneven crop canopy with weeds overtaking",
      "Reduced tillering or branching in crop",
      "Weeds flowering and setting seed before crop",
    ],
    affectedCrops: ["Rice", "Sugarcane", "Wheat", "Maize", "Soybean", "Vegetables"],
    severity: "medium",
    season: "Kharif & Rabi, first 30-45 days are critical",
    imageUrl: "/images/problems/broadleaf-weeds.svg",
    referenceImages: [
      { src: "/images/problems/broadleaf-weeds.svg", caption: "Broadleaf weeds competing with crop rows for space and nutrients" },
    ],
    prevention: [
      "Apply pre-emergence herbicide within 3 days of sowing",
      "Maintain proper crop stand density",
      "Use stale seedbed technique before sowing",
      "Hand weeding at 20-25 days as supplement",
    ],
    matchingProductIds: ["21", "24"],
  },
  {
    id: "grassy-weeds",
    problem: "Grassy Weeds",
    solution: "Clodinafop Propargyl 15% DF, Pyrazosulfuron Ethyl 10% WP",
    icon: "🌾",
    description: "Grass weeds like wild oat (Avena), Phalaris minor, and Echinochloa are the biggest threat to wheat and rice crops. They look similar to the crop itself, making identification difficult. Phalaris minor has developed resistance to many herbicides.",
    symptoms: [
      "Grass-like weeds growing among crop plants",
      "Taller or different-coloured tillers mixed in crop",
      "Reduced crop vigour due to root competition",
      "Uneven crop height in patches",
      "Weed seeds contaminating harvested grain",
    ],
    affectedCrops: ["Wheat", "Rice (Paddy)", "Maize", "Barley"],
    severity: "high",
    season: "Rabi (wheat) and Kharif (rice), early growth stages",
    imageUrl: "/images/problems/grassy-weeds.svg",
    referenceImages: [
      { src: "/images/problems/grassy-weeds.svg", caption: "Dense grassy weed growth choking rice crop plants in paddy" },
    ],
    prevention: [
      "Timely post-emergence herbicide at 25-30 DAS",
      "Crop rotation (rice-wheat-pulse rotation)",
      "Avoid using saved seed contaminated with weed seeds",
      "Zero-tillage sowing to reduce weed emergence",
    ],
    matchingProductIds: ["23", "22"],
  },
  {
    id: "stubborn-weeds",
    problem: "Stubborn Weeds / Non-selective",
    solution: "Glufosinate Ammonium 13.5% SL, Oxyfluorfen 20% DF, Diuron 80% WP",
    icon: "💪",
    description: "Perennial and deep-rooted weeds that resist hand weeding and selective herbicides. Includes Cyperus rotundus (nutsedge), Convolvulus, Cynodon, and woody weeds. These need non-selective burndown treatment before planting.",
    symptoms: [
      "Weeds regrowing quickly after manual removal",
      "Dense weed patches suppressing crop completely",
      "Deep-rooted weeds that break off when pulled",
      "Vine-like weeds climbing over crop canopy",
      "Weeds present even after herbicide application",
    ],
    affectedCrops: ["All crops (pre-planting)", "Orchards", "Plantations", "Non-crop areas"],
    severity: "medium",
    season: "Year-round, treat before crop planting",
    imageUrl: "/images/problems/stubborn-weeds.svg",
    referenceImages: [
      { src: "/images/problems/stubborn-weeds.svg", caption: "Deep-rooted stubborn weeds suppressing nearby crop growth" },
    ],
    prevention: [
      "Apply non-selective herbicide 10-15 days before sowing",
      "Use mulching to suppress weed growth",
      "Summer deep ploughing to expose rhizomes",
      "Solarize soil using plastic sheets in summer",
    ],
    matchingProductIds: ["25", "27", "28"],
  },
  {
    id: "mites-sucking-pests",
    problem: "Mites / Sucking Pests",
    solution: "Flupyrimin 10% SC, Benzpyrimoxan 10% SC",
    icon: "🔍",
    description: "Microscopic spider mites and plant hoppers that suck cell sap from leaves. Brown Plant Hopper (BPH) is the most feared rice pest — it causes 'hopper burn' where entire fields turn brown and dry. These pests often develop resistance to common insecticides.",
    symptoms: [
      "Fine webbing on leaf undersides (mites)",
      "Silvery or bronze discolouration of leaves",
      "Hopper burn: circular patches of brown, dead rice plants",
      "Plants dry up from bottom leaves upward",
      "Tiny crawling insects on stems near water level (BPH)",
    ],
    affectedCrops: ["Rice", "Tea", "Cotton", "Brinjal", "Chili", "Vegetables"],
    severity: "critical",
    season: "Kharif, humid conditions, late crop stage",
    imageUrl: "/images/problems/mites-sucking-pests.svg",
    referenceImages: [
      { src: "/images/problems/mites-sucking-pests.svg", caption: "Spider mites with webbing and stippling damage on leaf underside" },
    ],
    prevention: [
      "Avoid excessive nitrogen which attracts hoppers",
      "Maintain alternate wetting and drying in paddy",
      "Use resistant rice varieties (BPH-resistant)",
      "Rotate insecticide groups to prevent resistance",
    ],
    matchingProductIds: ["10", "11"],
  },
  {
    id: "stored-grain-pests",
    problem: "Stored Grain Pests",
    solution: "Aluminium Phosphide 56% Tablet",
    icon: "📦",
    description: "Insects that infest stored grains in warehouses and godowns. Rice weevils, grain borers, and flour beetles bore into kernels, causing weight loss, contamination, and reduced germination. Can cause 10-40% storage losses.",
    symptoms: [
      "Small round holes in grain kernels",
      "Fine powdery dust in grain bags",
      "Heating of grain mass in storage",
      "Musty or foul odour from stored grain",
      "Live or dead insects visible in grain",
    ],
    affectedCrops: ["Stored Wheat", "Stored Rice", "Stored Pulses", "Stored Maize", "All stored grains"],
    severity: "high",
    season: "Post-harvest, during storage period",
    imageUrl: "/images/problems/stored-grain-pests.svg",
    referenceImages: [
      { src: "/images/problems/stored-grain-pests.svg", caption: "Grain weevils boring into stored grain with visible damage holes" },
    ],
    prevention: [
      "Dry grain properly below 12% moisture before storage",
      "Clean and disinfect storage facility before use",
      "Use airtight storage containers or bags",
      "Fumigate with AlP tablets by trained personnel",
    ],
    matchingProductIds: ["12"],
  },
];

const hardcodedProducts: Product[] = [
  // ===== INSECTICIDES =====
  {
    id: "1",
    name: "MERCBEX Fipronil 0.6% WG",
    activeIngredient: "Fipronil 0.6% WG",
    formulation: "WG (Water Dispersible Granule)",
    category: "Insecticide",
    price: 850,
    originalPrice: 999,
    rating: 4.7,
    reviewCount: 234,
    description: "A highly effective phenylpyrazole insecticide for control of termites, stem borers, and soil insects. Its granular formulation ensures uniform distribution and long-lasting soil protection for your crops.",
    targetPests: ["Termites", "Stem Borers", "White Grubs", "Soil Insects", "Brown Plant Hopper"],
    cropSuitability: ["Rice", "Sugarcane", "Maize", "Vegetables", "Plantation crops"],
    dosage: "6-8 kg per acre for soil application",
    packSizes: ["1 kg", "5 kg", "25 kg"],
    features: ["Long residual activity in soil", "Low dosage, high efficacy", "Granular form for easy application", "Excellent termite control"],
    inStock: true,
    badge: "Best Seller",
  },
  {
    id: "2",
    name: "MERCBEX Clothianidin 50% WG",
    activeIngredient: "Clothianidin 50% WG",
    formulation: "WG (Water Dispersible Granule)",
    category: "Insecticide",
    price: 1450,
    rating: 4.6,
    reviewCount: 189,
    description: "A neonicotinoid systemic insecticide with excellent activity against sucking pests. Provides both contact and stomach action with long-lasting systemic protection through the plant tissue.",
    targetPests: ["Aphids", "Whiteflies", "Jassids", "Thrips", "Brown Plant Hopper", "Leaf hoppers"],
    cropSuitability: ["Rice", "Cotton", "Wheat", "Vegetables", "Sugarcane"],
    dosage: "0.2-0.3 g per liter of water",
    packSizes: ["100 g", "250 g", "500 g"],
    features: ["Systemic + contact action", "Quick knockdown", "Long-lasting protection up to 21 days", "Safe for beneficial insects at recommended dose"],
    inStock: true,
  },
  {
    id: "3",
    name: "MERCBEX Clothianidin 0.5% GR",
    activeIngredient: "Clothianidin 0.5% GR",
    formulation: "GR (Granule)",
    category: "Insecticide",
    price: 520,
    rating: 4.4,
    reviewCount: 156,
    description: "Granular formulation of Clothianidin for direct soil application. Ideal for paddy fields to control brown plant hoppers, stem borers, and other soil and root-zone pests.",
    targetPests: ["Brown Plant Hopper", "Stem Borers", "Leaf Folders", "Gall Midge"],
    cropSuitability: ["Rice (Paddy)", "Sugarcane"],
    dosage: "4-6 kg per acre",
    packSizes: ["1 kg", "5 kg", "10 kg"],
    features: ["Easy granular application", "Soil-systemic action", "Ideal for paddy", "Long residual control"],
    inStock: true,
  },
  {
    id: "4",
    name: "MERCBEX Thiacloprid 21.7% SC",
    activeIngredient: "Thiacloprid 21.7% SC",
    formulation: "SC (Suspension Concentrate)",
    category: "Insecticide",
    price: 1199,
    originalPrice: 1399,
    rating: 4.5,
    reviewCount: 178,
    description: "A second-generation neonicotinoid insecticide effective against a wide range of sucking and biting pests. Provides rapid knockdown with sustained control, making it ideal for urgent pest outbreaks.",
    targetPests: ["Aphids", "Whiteflies", "Bollworms", "Fruit Borers", "Leaf Miners"],
    cropSuitability: ["Cotton", "Chili", "Tomato", "Brinjal", "Okra", "Grapes"],
    dosage: "0.6-0.75 ml per liter of water",
    packSizes: ["100 ml", "250 ml", "500 ml", "1 L"],
    features: ["Rapid knockdown action", "Systemic + translaminar activity", "Rain-fast within 1 hour", "Safe for pollinators when applied as directed"],
    inStock: true,
    badge: "Fast Acting",
  },
  {
    id: "5",
    name: "MERCBEX Bifenthrin 8% + Clothianidin 10% SC",
    activeIngredient: "Bifenthrin 8% + Clothianidin 10% SC",
    formulation: "SC (Suspension Concentrate)",
    category: "Insecticide",
    price: 1799,
    originalPrice: 2099,
    rating: 4.8,
    reviewCount: 267,
    description: "A powerful dual-action combination insecticide. Bifenthrin provides instant contact kill while Clothianidin offers systemic protection. Ideal for heavy pest infestations requiring immediate + lasting control.",
    targetPests: ["Bollworms", "Aphids", "Jassids", "Thrips", "Whiteflies", "Caterpillars"],
    cropSuitability: ["Cotton", "Rice", "Chili", "Vegetables", "Soybean"],
    dosage: "1.0-1.5 ml per liter of water",
    packSizes: ["250 ml", "500 ml", "1 L"],
    features: ["Dual mode of action", "Instant knockdown + long-lasting control", "Broad-spectrum efficacy", "Resistance management tool"],
    inStock: true,
    badge: "Recommended",
  },
  {
    id: "6",
    name: "MERCBEX Chlorpyriphos 75% WG",
    activeIngredient: "Chlorpyriphos 75% WG",
    formulation: "WG (Water Dispersible Granule)",
    category: "Insecticide",
    price: 1350,
    rating: 4.5,
    reviewCount: 312,
    description: "A high-concentration organophosphate insecticide for control of termites and soil insects. The WG formulation offers superior handling safety and precise dosing compared to EC formulations.",
    targetPests: ["Termites", "Cutworms", "White Grubs", "Root Borers", "Soil Insects"],
    cropSuitability: ["Sugarcane", "Groundnut", "Potato", "Construction (anti-termite)"],
    dosage: "0.5-1.0 g per liter of water for soil drench",
    packSizes: ["250 g", "500 g", "1 kg"],
    features: ["High concentration 75% WG", "Excellent termite barrier", "Long soil residual activity", "Safer WG formulation"],
    inStock: true,
  },
  {
    id: "7",
    name: "MERCBEX Chlorfenapyr 10% SC",
    activeIngredient: "Chlorfenapyr 10% SC",
    formulation: "SC (Suspension Concentrate)",
    category: "Insecticide",
    price: 1650,
    rating: 4.7,
    reviewCount: 198,
    description: "A pro-insecticide with a unique mode of action that disrupts mitochondrial respiration. Highly effective against resistant pest populations, especially bollworms and fruit borers.",
    targetPests: ["Bollworms", "Fruit Borers", "Diamondback Moth", "Caterpillars", "Mites"],
    cropSuitability: ["Cotton", "Tomato", "Chili", "Cabbage", "Brinjal"],
    dosage: "1.5-2.0 ml per liter of water",
    packSizes: ["100 ml", "250 ml", "500 ml", "1 L"],
    features: ["Novel mode of action", "Effective against resistant pests", "Both insecticidal and acaricidal", "Excellent for IPM programs"],
    inStock: true,
    badge: "For Resistant Pests",
  },
  {
    id: "8",
    name: "MERCBEX Imidacloprid 17.1% SL",
    activeIngredient: "Imidacloprid 17.1% SL",
    formulation: "SL (Soluble Liquid)",
    category: "Insecticide",
    price: 699,
    originalPrice: 849,
    rating: 4.8,
    reviewCount: 456,
    description: "The most trusted neonicotinoid insecticide for controlling sucking pests. Fast-acting systemic action ensures rapid pest control, ideal for emergency treatment when pests are spotted on your crop.",
    targetPests: ["Aphids", "Whiteflies", "Jassids", "Thrips", "Brown Plant Hopper", "Leaf hoppers"],
    cropSuitability: ["Cotton", "Rice", "Wheat", "Chili", "Vegetables", "Sugarcane", "Mango"],
    dosage: "0.5-1.0 ml per liter of water",
    packSizes: ["100 ml", "250 ml", "500 ml", "1 L"],
    features: ["Most trusted insecticide for sucking pests", "Rapid systemic action", "Low dosage, high efficacy", "Economical per acre cost"],
    inStock: true,
    badge: "Best Seller",
  },
  {
    id: "9",
    name: "MERCBEX Fenoxanil 5% + Isoprothiolane 30% EC",
    activeIngredient: "Fenoxanil 5% + Isoprothiolane 30% EC",
    formulation: "EC (Emulsifiable Concentrate)",
    category: "Insecticide",
    price: 1299,
    rating: 4.4,
    reviewCount: 134,
    description: "A combination product offering both insecticidal and fungicidal action. Particularly effective in rice crop for simultaneous control of stem borers and rice blast disease.",
    targetPests: ["Stem Borers", "Rice Blast", "Sheath Blight", "Brown Spot"],
    cropSuitability: ["Rice (Paddy)"],
    dosage: "1.5-2.0 ml per liter of water",
    packSizes: ["250 ml", "500 ml", "1 L"],
    features: ["Dual insecticide + fungicide action", "Specially formulated for rice", "Controls borers and blast simultaneously", "Improves grain quality"],
    inStock: true,
  },
  {
    id: "10",
    name: "MERCBEX Flupyrimin 10% SC",
    activeIngredient: "Flupyrimin 10% SC",
    formulation: "SC (Suspension Concentrate)",
    category: "Insecticide",
    price: 1899,
    rating: 4.6,
    reviewCount: 89,
    description: "A next-generation mesoionic insecticide with a novel mode of action. Excellent against plant hoppers and other sucking pests, especially where resistance to conventional neonicotinoids is observed.",
    targetPests: ["Brown Plant Hopper", "White-backed Plant Hopper", "Leaf Hoppers", "Aphids"],
    cropSuitability: ["Rice", "Vegetables"],
    dosage: "0.5-0.8 ml per liter of water",
    packSizes: ["100 ml", "250 ml"],
    features: ["Novel mode of action", "Breaks neonicotinoid resistance", "Long residual control", "Low environmental impact"],
    inStock: true,
    badge: "New",
  },
  {
    id: "11",
    name: "MERCBEX Benzpyrimoxan 10% SC",
    activeIngredient: "Benzpyrimoxan 10% SC",
    formulation: "SC (Suspension Concentrate)",
    category: "Insecticide",
    price: 2199,
    rating: 4.7,
    reviewCount: 67,
    description: "A cutting-edge insecticide targeting plant hoppers with a unique mechanism. Disrupts chitin synthesis in nymphs, providing effective control of even resistant hopper populations in rice.",
    targetPests: ["Brown Plant Hopper", "White-backed Plant Hopper"],
    cropSuitability: ["Rice"],
    dosage: "0.6-1.0 ml per liter of water",
    packSizes: ["100 ml", "250 ml"],
    features: ["Unique chitin synthesis inhibitor", "Controls resistant BPH", "Safe for natural enemies", "Ideal for IPM"],
    inStock: true,
    badge: "New",
  },
  {
    id: "12",
    name: "MERCBEX Aluminium Phosphide 56% Tablet",
    activeIngredient: "Aluminium Phosphide 56%",
    formulation: "Tablet",
    category: "Insecticide",
    price: 450,
    rating: 4.3,
    reviewCount: 213,
    description: "Professional-grade fumigant for stored grain pest control. Releases phosphine gas to eliminate all stored product insects and rodents. Must be used by trained personnel only.",
    targetPests: ["Stored grain insects", "Rice weevils", "Flour beetles", "Grain moths", "Rodents"],
    cropSuitability: ["Stored wheat", "Stored rice", "Warehouses", "Ship holds", "Containers"],
    dosage: "3 tablets per tonne of grain",
    packSizes: ["10 tablets", "30 tablets", "100 tablets"],
    features: ["Complete fumigation", "Kills all life stages", "No residue on grain", "Government approved for storage"],
    inStock: true,
  },

  // ===== FUNGICIDES =====
  {
    id: "13",
    name: "MERCBEX Kasugamycin 6% + Thifluzamide 26% SC",
    activeIngredient: "Kasugamycin 6% + Thifluzamide 26% SC",
    formulation: "SC (Suspension Concentrate)",
    category: "Fungicide",
    price: 1599,
    originalPrice: 1849,
    rating: 4.8,
    reviewCount: 287,
    description: "A powerful combination fungicide providing both preventive and curative action against rice diseases. Kasugamycin targets blast while Thifluzamide controls sheath blight — protecting your rice crop from its two biggest threats.",
    targetPests: ["Rice Blast", "Sheath Blight", "Sheath Rot", "Brown Spot"],
    cropSuitability: ["Rice (Paddy)"],
    dosage: "1.0-1.2 ml per liter of water",
    packSizes: ["100 ml", "250 ml", "500 ml", "1 L"],
    features: ["Dual action: Blast + Sheath Blight", "Preventive + Curative", "Excellent rainfastness", "Improves grain filling"],
    inStock: true,
    badge: "Top Rated",
  },
  {
    id: "14",
    name: "MERCBEX Copper Hydroxide 77% WP",
    activeIngredient: "Copper Hydroxide 77% WP",
    formulation: "WP (Wettable Powder)",
    category: "Fungicide",
    price: 599,
    rating: 4.5,
    reviewCount: 321,
    description: "A copper-based broad-spectrum fungicide and bactericide. Provides reliable preventive protection against a wide range of fungal and bacterial diseases. Approved for organic farming.",
    targetPests: ["Late Blight", "Downy Mildew", "Bacterial Leaf Spot", "Canker", "Black Rot"],
    cropSuitability: ["Potato", "Tomato", "Grapes", "Citrus", "Apple", "Vegetables"],
    dosage: "2.5-3.0 g per liter of water",
    packSizes: ["250 g", "500 g", "1 kg"],
    features: ["Broad-spectrum protection", "Organic farming approved", "Multi-site action — low resistance risk", "Also controls bacterial diseases"],
    inStock: true,
  },
  {
    id: "15",
    name: "MERCBEX Copper Oxychloride 50% WG",
    activeIngredient: "Copper Oxychloride 50% WG",
    formulation: "WG (Water Dispersible Granule)",
    category: "Fungicide",
    price: 549,
    rating: 4.4,
    reviewCount: 198,
    description: "An advanced WG formulation of copper oxychloride offering better suspension, coverage, and rain-fastness compared to WP. Ideal for preventive spray schedules against fungal diseases.",
    targetPests: ["Late Blight", "Early Blight", "Downy Mildew", "Leaf Spot", "Fruit Rot"],
    cropSuitability: ["Potato", "Tomato", "Grapes", "Chili", "Onion", "Citrus"],
    dosage: "2.0-2.5 g per liter of water",
    packSizes: ["250 g", "500 g", "1 kg"],
    features: ["Superior WG formulation", "Better coverage than WP", "Excellent rainfastness", "Organic approved"],
    inStock: true,
  },
  {
    id: "16",
    name: "MERCBEX Copper Oxychloride OP 56% w/w",
    activeIngredient: "Copper Oxychloride OP formulation containing 56% w/w Copper",
    formulation: "OP (Oil Paste)",
    category: "Fungicide",
    price: 479,
    rating: 4.3,
    reviewCount: 145,
    description: "Oil paste formulation of copper oxychloride with high copper content. Provides excellent adhesion to plant surfaces and superior rainfastness, especially useful during monsoon spraying.",
    targetPests: ["Late Blight", "Downy Mildew", "Anthracnose", "Die-back"],
    cropSuitability: ["Potato", "Grapes", "Chili", "Betel vine", "Plantation crops"],
    dosage: "2.0-3.0 g per liter of water",
    packSizes: ["250 g", "500 g", "1 kg"],
    features: ["High copper content 56%", "Oil paste for better adhesion", "Rain-resistant", "Cost-effective copper solution"],
    inStock: true,
  },
  {
    id: "17",
    name: "MERCBEX Copper Sulphate 47.15% + Mancozeb 30% WDG",
    activeIngredient: "Copper Sulphate 47.15% + Mancozeb 30% WDG",
    formulation: "WDG (Water Dispersible Granule)",
    category: "Fungicide",
    price: 899,
    originalPrice: 1049,
    rating: 4.6,
    reviewCount: 176,
    description: "A dual-action fungicide combining the protective power of copper sulphate with Mancozeb. Multi-site contact action provides broad-spectrum disease control with minimal resistance risk.",
    targetPests: ["Late Blight", "Early Blight", "Downy Mildew", "Anthracnose", "Leaf Spot", "Fruit Rot"],
    cropSuitability: ["Potato", "Tomato", "Grapes", "Chili", "Mango", "Citrus"],
    dosage: "2.0-2.5 g per liter of water",
    packSizes: ["250 g", "500 g", "1 kg"],
    features: ["Dual active ingredients", "Multi-site action", "Very low resistance risk", "Broad-spectrum control"],
    inStock: true,
    badge: "Value Pick",
  },
  {
    id: "18",
    name: "MERCBEX Mancozeb 40% + Azoxystrobin 7% w/w OS",
    activeIngredient: "Mancozeb 40% + Azoxystrobin 7% w/w OS",
    formulation: "OS (Oil Suspension)",
    category: "Fungicide",
    price: 1249,
    rating: 4.7,
    reviewCount: 231,
    description: "A premium combination of contact (Mancozeb) and systemic (Azoxystrobin) fungicides. Offers complete protection — Mancozeb guards the surface while Azoxystrobin moves inside the plant for curative action.",
    targetPests: ["Late Blight", "Early Blight", "Powdery Mildew", "Downy Mildew", "Sheath Blight", "Blast"],
    cropSuitability: ["Potato", "Tomato", "Rice", "Grapes", "Chili", "Wheat"],
    dosage: "2.0-3.0 ml per liter of water",
    packSizes: ["250 ml", "500 ml", "1 L"],
    features: ["Contact + Systemic dual protection", "Preventive + Curative", "Improves crop vigor", "Premium OS formulation"],
    inStock: true,
  },
  {
    id: "19",
    name: "MERCBEX Azoxystrobin 120 g/L + Tebuconazole 240 g/L SC",
    activeIngredient: "Azoxystrobin 120 g/L + Tebuconazole 240 g/L SC",
    formulation: "SC (Suspension Concentrate)",
    category: "Fungicide",
    price: 1749,
    originalPrice: 1999,
    rating: 4.8,
    reviewCount: 203,
    description: "The ultimate fungicide combination — Azoxystrobin (strobilurin) + Tebuconazole (triazole). Two systemic actives working together for unmatched disease control. Ideal when disease pressure is high and you need maximum protection.",
    targetPests: ["Blast", "Sheath Blight", "Powdery Mildew", "Rust", "Scab", "Leaf Spot"],
    cropSuitability: ["Rice", "Wheat", "Grapes", "Mango", "Chili", "Soybean", "Groundnut"],
    dosage: "1.0-1.5 ml per liter of water",
    packSizes: ["100 ml", "250 ml", "500 ml", "1 L"],
    features: ["Two systemic actives", "Maximum disease control", "Preventive + Curative + Eradicant", "Green leaf effect — extends crop life"],
    inStock: true,
    badge: "Premium",
  },
  {
    id: "20",
    name: "MERCBEX Sulfentrazone 28% + Clomazone 30% WP",
    activeIngredient: "Sulfentrazone 28% + Clomazone 30% WP",
    formulation: "WP (Wettable Powder)",
    category: "Fungicide",
    price: 1099,
    rating: 4.3,
    reviewCount: 87,
    description: "A unique combination product for pre-emergence weed and disease management. Provides soil-level protection during the critical early growth stages of the crop.",
    targetPests: ["Soil-borne fungi", "Damping off", "Early weed competition"],
    cropSuitability: ["Soybean", "Sugarcane", "Groundnut"],
    dosage: "2.0-3.0 g per liter of water",
    packSizes: ["250 g", "500 g"],
    features: ["Pre-emergence action", "Soil-level protection", "Dual weed + disease control", "Critical early-stage protection"],
    inStock: true,
  },

  // ===== HERBICIDES =====
  {
    id: "21",
    name: "MERCBEX Pendimethalin 38.4% + Pyrazosulfuron Ethyl 0.85% ZC",
    activeIngredient: "Pendimethalin 38.4% + Pyrazosulfuron Ethyl 0.85% ZC",
    formulation: "ZC (Capsule Suspension)",
    category: "Herbicide",
    price: 1349,
    originalPrice: 1549,
    rating: 4.6,
    reviewCount: 245,
    description: "A pre-emergence herbicide combination for paddy fields. Pendimethalin controls grasses while Pyrazosulfuron targets sedges and broadleaf weeds — giving your rice a weed-free start.",
    targetPests: ["Annual grasses", "Sedges", "Broadleaf weeds", "Echinochloa", "Cyperus"],
    cropSuitability: ["Rice (Paddy)", "Transplanted rice"],
    dosage: "700-800 ml per acre in 200L water",
    packSizes: ["500 ml", "1 L", "5 L"],
    features: ["Pre-emergence weed control", "Controls grasses + sedges + broadleaf", "ZC formulation for extended activity", "Safe for transplanted rice"],
    inStock: true,
    badge: "Popular",
  },
  {
    id: "22",
    name: "MERCBEX Pyrazosulfuron Ethyl 10% WP",
    activeIngredient: "Pyrazosulfuron Ethyl 10% WP",
    formulation: "WP (Wettable Powder)",
    category: "Herbicide",
    price: 649,
    rating: 4.5,
    reviewCount: 312,
    description: "A selective herbicide for rice fields. Controls broadleaf weeds and sedges without harming the rice crop. Can be applied early post-emergence for clean paddy fields.",
    targetPests: ["Broadleaf weeds", "Sedges", "Cyperus", "Eclipta", "Ludwigia"],
    cropSuitability: ["Rice (Paddy)", "Transplanted and direct-seeded rice"],
    dosage: "20-25 g per acre",
    packSizes: ["20 g", "100 g", "250 g"],
    features: ["Selective for rice", "Low dosage per acre", "Controls sedges + broadleaf", "Early post-emergence use"],
    inStock: true,
  },
  {
    id: "23",
    name: "MERCBEX Clodinafop Propargyl 15% DF",
    activeIngredient: "Clodinafop Propargyl 15% DF",
    formulation: "DF (Dry Flowable)",
    category: "Herbicide",
    price: 899,
    rating: 4.6,
    reviewCount: 198,
    description: "A post-emergence graminicide for wheat. Specifically targets grassy weeds like wild oat and Phalaris without any crop damage. The go-to herbicide for wheat farmers facing grass weed pressure.",
    targetPests: ["Wild Oat (Avena)", "Phalaris minor", "Annual grassy weeds"],
    cropSuitability: ["Wheat"],
    dosage: "160 g per acre in 150-200L water",
    packSizes: ["160 g", "500 g"],
    features: ["Selective graminicide for wheat", "Controls Phalaris minor effectively", "Post-emergence application", "No crop phytotoxicity"],
    inStock: true,
  },
  {
    id: "24",
    name: "MERCBEX Halosulfuron Methyl 12% + Metribuzin 55% WG",
    activeIngredient: "Halosulfuron Methyl 12% + Metribuzin 55% WG",
    formulation: "WG (Water Dispersible Granule)",
    category: "Herbicide",
    price: 1549,
    rating: 4.5,
    reviewCount: 134,
    description: "A dual-action herbicide for sugarcane combining Halosulfuron (ALS inhibitor) with Metribuzin (photosynthesis inhibitor). Controls both broadleaf and grassy weeds in sugarcane early post-emergence.",
    targetPests: ["Broadleaf weeds", "Grassy weeds", "Sedges", "Cyperus rotundus (Nutsedge)"],
    cropSuitability: ["Sugarcane", "Maize"],
    dosage: "80-100 g per acre in 200L water",
    packSizes: ["100 g", "250 g"],
    features: ["Dual herbicide combination", "Controls nutsedge (Cyperus)", "Two modes of action", "Effective in sugarcane"],
    inStock: true,
  },
  {
    id: "25",
    name: "MERCBEX Glufosinate Ammonium 13.5% w/w SL",
    activeIngredient: "Glufosinate Ammonium 13.5% w/w SL",
    formulation: "SL (Soluble Liquid)",
    category: "Herbicide",
    price: 1199,
    rating: 4.7,
    reviewCount: 267,
    description: "A non-selective contact herbicide alternative to glyphosate. Fast-acting burndown visible within 3-5 days. No soil residual activity makes it safe for immediate replanting.",
    targetPests: ["All weeds — grasses, broadleaf, and sedges"],
    cropSuitability: ["Pre-planting for all crops", "Orchards", "Plantations", "Non-crop areas", "Fence lines"],
    dosage: "1.5-2.5 L per acre in 200L water",
    packSizes: ["500 ml", "1 L", "5 L"],
    features: ["Fast burndown in 3-5 days", "No soil residual — safe for replanting", "Non-selective contact action", "Glyphosate alternative"],
    inStock: true,
  },
  {
    id: "26",
    name: "MERCBEX Fomesafen 12% + Quizalofop Ethyl 3% SC",
    activeIngredient: "Fomesafen 12% + Quizalofop Ethyl 3% SC",
    formulation: "SC (Suspension Concentrate)",
    category: "Herbicide",
    price: 1099,
    originalPrice: 1299,
    rating: 4.4,
    reviewCount: 156,
    description: "A ready-mix herbicide for soybean. Fomesafen controls broadleaf weeds while Quizalofop targets grassy weeds — providing complete weed management in a single spray for soybean growers.",
    targetPests: ["Broadleaf weeds", "Grassy weeds", "Annual weeds in soybean"],
    cropSuitability: ["Soybean"],
    dosage: "1.0-1.5 L per acre in 200L water",
    packSizes: ["500 ml", "1 L"],
    features: ["Complete soybean weed control", "One-spray solution", "Controls both grass + broadleaf", "Ready-mix convenience"],
    inStock: true,
  },
  {
    id: "27",
    name: "MERCBEX Oxyfluorfen 20% DF",
    activeIngredient: "Oxyfluorfen 20% DF",
    formulation: "DF (Dry Flowable)",
    category: "Herbicide",
    price: 949,
    rating: 4.3,
    reviewCount: 143,
    description: "A pre-emergence and early post-emergence herbicide effective against broadleaf weeds and grasses in onion, garlic, and other transplanted vegetables.",
    targetPests: ["Broadleaf weeds", "Annual grasses", "Small-seeded weeds"],
    cropSuitability: ["Onion", "Garlic", "Groundnut", "Tea", "Transplanted vegetables"],
    dosage: "200-250 ml per acre in 200L water",
    packSizes: ["250 ml", "500 ml", "1 L"],
    features: ["Pre + early post-emergence use", "Ideal for onion and garlic", "Long residual soil activity", "DF formulation — dust free"],
    inStock: true,
  },
  {
    id: "28",
    name: "MERCBEX Diuron 80% WP",
    activeIngredient: "Diuron 80% WP",
    formulation: "WP (Wettable Powder)",
    category: "Herbicide",
    price: 799,
    rating: 4.2,
    reviewCount: 167,
    description: "A pre-emergence soil-applied herbicide for sugarcane and non-crop areas. Provides season-long weed control by forming a herbicide barrier in the topsoil layer.",
    targetPests: ["Annual grasses", "Broadleaf weeds", "Mixed weed flora"],
    cropSuitability: ["Sugarcane", "Pineapple", "Non-crop areas", "Industrial sites"],
    dosage: "1.0-1.5 kg per acre",
    packSizes: ["500 g", "1 kg"],
    features: ["Pre-emergence soil barrier", "Season-long control", "High active content 80%", "Economical per acre"],
    inStock: true,
  },
  {
    id: "29",
    name: "MERCBEX Ametryn 80% WG",
    activeIngredient: "Ametryn 80% WG",
    formulation: "WG (Water Dispersible Granule)",
    category: "Herbicide",
    price: 879,
    rating: 4.4,
    reviewCount: 121,
    description: "A selective pre and post-emergence herbicide for sugarcane. Controls a wide spectrum of annual weeds while being safe for the sugarcane crop at recommended dosages.",
    targetPests: ["Annual grasses", "Broadleaf weeds", "Mixed weed flora"],
    cropSuitability: ["Sugarcane", "Pineapple"],
    dosage: "800g-1.0 kg per acre",
    packSizes: ["500 g", "1 kg"],
    features: ["Selective for sugarcane", "Pre + post-emergence", "Wide weed spectrum", "WG — easy to handle"],
    inStock: true,
  },

  // ===== RODENTICIDE =====
  {
    id: "30",
    name: "MERCBEX Aluminium Phosphide 56% Tablet (Rodenticide)",
    activeIngredient: "Aluminium Phosphide 56%",
    formulation: "Tablet",
    category: "Rodenticide",
    price: 399,
    rating: 4.2,
    reviewCount: 178,
    description: "Fumigant tablets for rodent control in burrows, godowns, and warehouses. Releases lethal phosphine gas. Must be handled by trained professionals following safety protocols.",
    targetPests: ["Field rats", "Bandicoot", "House rats", "Mice"],
    cropSuitability: ["Field burrow treatment", "Warehouses", "Godowns"],
    dosage: "1-2 tablets per burrow",
    packSizes: ["10 tablets", "30 tablets"],
    features: ["Professional rodent control", "Burrow fumigation", "Complete kill", "Trained applicator required"],
    inStock: true,
  },
];

// Merge hardcoded products with admin overrides from localStorage
export function getProducts(): Product[] {
  if (typeof window === "undefined") return hardcodedProducts;
  try {
    const overrides = localStorage.getItem("mercbex_products_override");
    if (!overrides) return hardcodedProducts;
    const adminProducts: Product[] = JSON.parse(overrides);
    // Merge: admin overrides replace matching IDs, new products are appended
    const merged = hardcodedProducts.map((p) => {
      const override = adminProducts.find((ap) => ap.id === p.id);
      return override ? { ...p, ...override } : p;
    });
    // Add any new products from admin that don't exist in hardcoded
    const existingIds = new Set(hardcodedProducts.map((p) => p.id));
    const newProducts = adminProducts.filter((ap) => !existingIds.has(ap.id));
    return [...merged, ...newProducts];
  } catch {
    return hardcodedProducts;
  }
}

// Default export for static contexts (SSR/build)
export const products: Product[] = hardcodedProducts;

export const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    location: "Punjab",
    crop: "Wheat & Rice",
    rating: 5,
    text: "My paddy field was severely attacked by Brown Plant Hopper. MERCBEX Imidacloprid saved my crop within 48 hours. Now I always keep it in stock for emergencies.",
    avatar: "RK",
  },
  {
    id: 2,
    name: "Anita Devi",
    location: "Maharashtra",
    crop: "Grapes & Pomegranate",
    rating: 5,
    text: "The MERCBEX Azoxystrobin + Tebuconazole combination is the best fungicide I have used. My grape vineyard was under heavy downy mildew attack and this saved the entire crop.",
    avatar: "AD",
  },
  {
    id: 3,
    name: "Suresh Patel",
    location: "Gujarat",
    crop: "Cotton & Groundnut",
    rating: 5,
    text: "MERCBEX Bifenthrin + Clothianidin gave instant results on bollworm infestation. The dual action formula controlled the pest within a day. Highly recommend for cotton farmers.",
    avatar: "SP",
  },
  {
    id: 4,
    name: "Lakshmi Narayanan",
    location: "Tamil Nadu",
    crop: "Rice & Vegetables",
    rating: 4,
    text: "I was worried about resistant BPH in my paddy. The MERCBEX Flupyrimin 10% SC worked where other insecticides had failed. Excellent product for resistant pest management.",
    avatar: "LN",
  },
];

export interface CropIssue {
  name: string;
  image: string;
  severity: "low" | "medium" | "high" | "critical";
  symptoms: string[];
  description: string;
  recommendedProductIds: string[];
}

export interface CropType {
  id: string;
  name: string;
  icon: string;
  image: string;
  description: string;
  commonIssues: CropIssue[];
  matchingProductIds: string[];
}

// SVG generator for disease reference images
function makeDiseaseSvg(bgColor: string, spotColor: string, leafColor: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="${bgColor}"/>
    <ellipse cx="200" cy="140" rx="100" ry="120" fill="${leafColor}" opacity="0.9"/>
    <line x1="200" y1="30" x2="200" y2="260" stroke="${leafColor}" stroke-width="3" opacity="0.7"/>
    <line x1="200" y1="80" x2="140" y2="60" stroke="${leafColor}" stroke-width="2" opacity="0.5"/>
    <line x1="200" y1="120" x2="130" y2="110" stroke="${leafColor}" stroke-width="2" opacity="0.5"/>
    <line x1="200" y1="160" x2="140" y2="170" stroke="${leafColor}" stroke-width="2" opacity="0.5"/>
    <line x1="200" y1="80" x2="260" y2="60" stroke="${leafColor}" stroke-width="2" opacity="0.5"/>
    <line x1="200" y1="120" x2="270" y2="110" stroke="${leafColor}" stroke-width="2" opacity="0.5"/>
    <line x1="200" y1="160" x2="260" y2="170" stroke="${leafColor}" stroke-width="2" opacity="0.5"/>
    <circle cx="165" cy="100" r="15" fill="${spotColor}" opacity="0.8"/>
    <circle cx="230" cy="130" r="12" fill="${spotColor}" opacity="0.7"/>
    <circle cx="180" cy="170" r="10" fill="${spotColor}" opacity="0.6"/>
    <circle cx="220" cy="80" r="8" fill="${spotColor}" opacity="0.7"/>
    <circle cx="195" cy="200" r="11" fill="${spotColor}" opacity="0.5"/>
    <rect x="0" y="265" width="400" height="35" fill="rgba(0,0,0,0.5)"/>
    <text x="200" y="288" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="white">${label}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function makePestSvg(bgColor: string, pestColor: string, leafColor: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="${bgColor}"/>
    <ellipse cx="200" cy="140" rx="110" ry="120" fill="${leafColor}" opacity="0.85"/>
    <line x1="200" y1="30" x2="200" y2="260" stroke="${leafColor}" stroke-width="3" opacity="0.6"/>
    <ellipse cx="155" cy="95" rx="12" ry="8" fill="${pestColor}" opacity="0.9" transform="rotate(-20 155 95)"/>
    <ellipse cx="235" cy="110" rx="10" ry="7" fill="${pestColor}" opacity="0.85" transform="rotate(15 235 110)"/>
    <ellipse cx="170" cy="150" rx="11" ry="7" fill="${pestColor}" opacity="0.8" transform="rotate(-10 170 150)"/>
    <ellipse cx="220" cy="170" rx="9" ry="6" fill="${pestColor}" opacity="0.75" transform="rotate(25 220 170)"/>
    <ellipse cx="190" cy="200" rx="10" ry="7" fill="${pestColor}" opacity="0.7" transform="rotate(-5 190 200)"/>
    <ellipse cx="245" cy="140" rx="8" ry="5" fill="${pestColor}" opacity="0.8" transform="rotate(10 245 140)"/>
    <circle cx="130" cy="80" r="20" fill="#FFD700" opacity="0.3"/>
    <circle cx="260" cy="190" r="18" fill="#FFD700" opacity="0.25"/>
    <rect x="0" y="265" width="400" height="35" fill="rgba(0,0,0,0.5)"/>
    <text x="200" y="288" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="white">${label}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function makeWiltSvg(bgColor: string, wiltColor: string, leafColor: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="${bgColor}"/>
    <path d="M200 260 Q180 200 150 160 Q120 120 140 80 Q160 40 200 30 Q240 40 260 80 Q280 120 250 160 Q220 200 200 260Z" fill="${leafColor}" opacity="0.7"/>
    <path d="M200 260 Q190 220 175 190 Q160 160 170 130" stroke="${wiltColor}" stroke-width="3" fill="none" opacity="0.6"/>
    <path d="M200 260 Q210 220 225 190 Q240 160 230 130" stroke="${wiltColor}" stroke-width="3" fill="none" opacity="0.6"/>
    <path d="M150 160 Q165 155 175 165" stroke="${wiltColor}" stroke-width="2" fill="none" opacity="0.5"/>
    <path d="M250 160 Q235 155 225 165" stroke="${wiltColor}" stroke-width="2" fill="none" opacity="0.5"/>
    <circle cx="170" cy="110" r="12" fill="${wiltColor}" opacity="0.4"/>
    <circle cx="225" cy="100" r="10" fill="${wiltColor}" opacity="0.35"/>
    <circle cx="195" cy="150" r="14" fill="${wiltColor}" opacity="0.3"/>
    <rect x="0" y="265" width="400" height="35" fill="rgba(0,0,0,0.5)"/>
    <text x="200" y="288" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="white">${label}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const crops: CropType[] = [
  {
    id: "rice",
    name: "Rice (Paddy)",
    icon: "🌾",
    image: "https://images.unsplash.com/photo-1594771804886-a933bb2d609b?auto=format&fit=crop&w=400&q=80",
    description: "Complete protection for paddy from BPH, stem borer & blast",
    commonIssues: [
      {
        name: "Brown Plant Hopper",
        image: makePestSvg("#1a3a1a", "#8B6914", "#2d5a2d", "Brown Plant Hopper - Rice"),
        severity: "critical",
        symptoms: ["Circular yellowing patches in field (hopper burn)", "Plants dry up in patches", "Honeydew and sooty mold on stems"],
        description: "Small brown insects that suck sap from rice stems at the base, causing hopper burn and complete drying of plants in circular patches.",
        recommendedProductIds: ["8", "10", "11"],
      },
      {
        name: "Stem Borer",
        image: makePestSvg("#1a2e1a", "#D4A574", "#2a4a2a", "Stem Borer - Rice"),
        severity: "high",
        symptoms: ["Dead hearts in vegetative stage", "White earheads (whiteheads) at flowering", "Bore holes in stems with frass"],
        description: "Larvae bore into rice stems causing dead hearts in young plants and white earheads during flowering, leading to severe yield loss.",
        recommendedProductIds: ["5", "1", "3"],
      },
      {
        name: "Rice Blast",
        image: makeDiseaseSvg("#1a2a1a", "#5a3a2a", "#3a6a3a", "Rice Blast Disease"),
        severity: "critical",
        symptoms: ["Diamond-shaped lesions on leaves", "Grey-green to white center with brown border", "Neck rot causing broken panicles"],
        description: "Fungal disease causing diamond-shaped spots on leaves. In severe cases, neck blast breaks the panicle, destroying the entire grain yield.",
        recommendedProductIds: ["15", "19"],
      },
      {
        name: "Sheath Blight",
        image: makeDiseaseSvg("#1a2a1a", "#8B7355", "#3a5a3a", "Sheath Blight - Rice"),
        severity: "high",
        symptoms: ["Oval or irregular greenish-grey lesions on leaf sheath", "Lesions enlarge and merge upward", "Soft rotting of sheath tissue"],
        description: "Fungal infection that starts on leaf sheaths near water level and spreads upward, reducing grain filling and causing lodging.",
        recommendedProductIds: ["15", "16"],
      },
    ],
    matchingProductIds: ["1", "3", "8", "10", "11", "13", "19"],
  },
  {
    id: "cotton",
    name: "Cotton",
    icon: "🏵️",
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=400&q=80",
    description: "Guard against bollworm, whitefly & jassids",
    commonIssues: [
      {
        name: "Bollworm",
        image: makePestSvg("#2a1a1a", "#C4A35A", "#4a3a2a", "Bollworm Damage - Cotton"),
        severity: "critical",
        symptoms: ["Round bore holes in bolls", "Frass near entry points", "Damaged lint and rotting bolls"],
        description: "American bollworm larvae bore into cotton bolls, feeding on developing lint and seeds. The most destructive cotton pest causing massive yield losses.",
        recommendedProductIds: ["5", "7", "4"],
      },
      {
        name: "Whitefly",
        image: makePestSvg("#1a2a1a", "#F5F5DC", "#3a5a3a", "Whitefly Infestation - Cotton"),
        severity: "high",
        symptoms: ["Tiny white insects flying when plant is disturbed", "Sticky honeydew on leaves", "Black sooty mold coating"],
        description: "Tiny white sap-sucking insects on leaf undersides. They transmit Cotton Leaf Curl Virus (CLCuV) and reduce plant vigour through sap drainage.",
        recommendedProductIds: ["8", "2", "4"],
      },
      {
        name: "Jassids",
        image: makePestSvg("#1a2a1a", "#90EE90", "#3a6a3a", "Jassid Damage - Cotton"),
        severity: "medium",
        symptoms: ["Leaf margins curl downward", "Yellowing and reddening of leaf edges", "Hopper burn in severe cases"],
        description: "Green leafhopper insects that feed on leaf undersides causing downward curling of leaf margins and yellowing, reducing photosynthesis.",
        recommendedProductIds: ["8", "2"],
      },
      {
        name: "Aphids",
        image: makePestSvg("#1a2a1a", "#3a3a3a", "#3a5a2a", "Aphid Colony - Cotton"),
        severity: "high",
        symptoms: ["Dense colonies on growing tips", "Curling and distortion of young leaves", "Sticky honeydew attracting ants"],
        description: "Black or green aphids form dense colonies on tender shoots and leaf undersides, causing leaf curl and stunted growth.",
        recommendedProductIds: ["8", "2", "4"],
      },
    ],
    matchingProductIds: ["2", "4", "5", "7", "8"],
  },
  {
    id: "wheat",
    name: "Wheat",
    icon: "Leaf",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80",
    description: "Protect from termites, rust & weed competition",
    commonIssues: [
      {
        name: "Termites",
        image: makePestSvg("#2a2010", "#F5DEB3", "#5a4a2a", "Termite Damage - Wheat"),
        severity: "high",
        symptoms: ["Wilting plants despite watering", "Roots and stem base hollowed out", "Mud tubes on stems near soil"],
        description: "Subterranean termites feed on roots and lower stems, hollowing them out. Plants wilt and die even with adequate irrigation.",
        recommendedProductIds: ["1", "6"],
      },
      {
        name: "Yellow Rust",
        image: makeDiseaseSvg("#2a2a10", "#DAA520", "#4a5a2a", "Yellow Rust - Wheat"),
        severity: "critical",
        symptoms: ["Yellow-orange pustules in stripes along leaf veins", "Leaves turn yellow and dry prematurely", "Reduced grain filling"],
        description: "Stripe rust appears as yellow-orange powdery pustules arranged in stripes along leaf veins. Spreads rapidly in cool, humid weather.",
        recommendedProductIds: ["16", "20"],
      },
      {
        name: "Aphids",
        image: makePestSvg("#2a2a10", "#556B2F", "#5a6a3a", "Aphid Infestation - Wheat"),
        severity: "medium",
        symptoms: ["Green aphids on earheads and leaves", "Honeydew secretion on grain", "Stunted earhead development"],
        description: "Wheat aphids cluster on earheads during grain filling stage, sucking sap and secreting honeydew that promotes sooty mold on grain.",
        recommendedProductIds: ["8", "2"],
      },
      {
        name: "Weeds",
        image: makeWiltSvg("#2a2a10", "#8B4513", "#6a7a4a", "Weed Competition - Wheat"),
        severity: "medium",
        symptoms: ["Stunted wheat plants between weeds", "Reduced tillering and yield", "Wild oat, Phalaris mixed in crop"],
        description: "Weeds like Phalaris minor, wild oat, and broadleaf weeds compete for nutrients, water, and light, significantly reducing wheat yield.",
        recommendedProductIds: ["23"],
      },
    ],
    matchingProductIds: ["1", "6", "8", "23"],
  },
  {
    id: "tomato",
    name: "Tomato",
    icon: "🍅",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=400&q=80",
    description: "Fight leaf curl, blight & fruit borer effectively",
    commonIssues: [
      {
        name: "Leaf Curl Virus",
        image: makeWiltSvg("#1a2a1a", "#6B8E23", "#3a5a3a", "Leaf Curl Virus - Tomato"),
        severity: "critical",
        symptoms: ["Upward curling and puckering of leaves", "Stunted plant growth", "Severe yield reduction, small deformed fruits"],
        description: "Tomato leaf curl virus (ToLCV) is transmitted by whiteflies. Infected plants show severe leaf curling, stunting, and produce very few deformed fruits.",
        recommendedProductIds: ["8", "4"],
      },
      {
        name: "Early Blight",
        image: makeDiseaseSvg("#1a2a1a", "#4a2a1a", "#3a5a3a", "Early Blight - Tomato"),
        severity: "high",
        symptoms: ["Dark brown concentric ring spots on lower leaves", "Target-board pattern on leaves", "Premature defoliation from bottom up"],
        description: "Alternaria solani causes circular lesions with concentric rings (target spots) on older leaves first. Defoliation exposes fruits to sunscald.",
        recommendedProductIds: ["16", "19"],
      },
      {
        name: "Fruit Borer",
        image: makePestSvg("#1a2a1a", "#CD853F", "#3a5a3a", "Fruit Borer - Tomato"),
        severity: "high",
        symptoms: ["Round entry holes on green and ripe fruits", "Larva feeding inside fruit", "Rotting fruits with frass at bore site"],
        description: "Helicoverpa armigera larvae bore into tomato fruits, feeding inside and causing rotting. Can destroy 30-40% of fruit yield if untreated.",
        recommendedProductIds: ["7", "5"],
      },
      {
        name: "Whitefly",
        image: makePestSvg("#1a2a1a", "#FFFFF0", "#3a5a3a", "Whitefly on Tomato"),
        severity: "high",
        symptoms: ["Cloud of tiny white insects under leaves", "Yellowing and weakening of plants", "Transmits Leaf Curl Virus"],
        description: "Whiteflies are the primary vector for ToLCV. Besides virus transmission, heavy infestations weaken plants through sap sucking and sooty mold.",
        recommendedProductIds: ["8", "4", "2"],
      },
    ],
    matchingProductIds: ["4", "7", "8", "15", "16", "19"],
  },
  {
    id: "chili",
    name: "Chili",
    icon: "🌶️",
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=400&q=80",
    description: "Control thrips, mites & anthracnose disease",
    commonIssues: [
      {
        name: "Thrips",
        image: makePestSvg("#2a1a1a", "#DEB887", "#4a3a2a", "Thrips Damage - Chili"),
        severity: "high",
        symptoms: ["Upward curling of leaves", "Silvery streaks on leaf surface", "Flower dropping and reduced fruit set"],
        description: "Tiny thrips rasp leaf surfaces causing upward curling and silvery appearance. Heavy infestation leads to flower drop and poor fruit setting.",
        recommendedProductIds: ["8", "4"],
      },
      {
        name: "Mites",
        image: makePestSvg("#2a1a1a", "#FF6347", "#4a3a2a", "Mite Infestation - Chili"),
        severity: "medium",
        symptoms: ["Downward leaf curling", "Leaf surface becomes rough and leathery", "Bronzing and webbing on undersides"],
        description: "Yellow and broad mites cause severe downward leaf curling, giving a leathery texture. Fine webbing visible on leaf undersides in severe cases.",
        recommendedProductIds: ["7"],
      },
      {
        name: "Anthracnose",
        image: makeDiseaseSvg("#2a1a1a", "#2F1E0E", "#4a3a2a", "Anthracnose - Chili Fruit"),
        severity: "critical",
        symptoms: ["Sunken dark spots on ripening fruits", "Concentric rings of black dots on lesions", "Fruits shrivel and rot on plant"],
        description: "Die-back and fruit rot caused by Colletotrichum. Dark sunken lesions on ripe fruits with black dot patterns. Can destroy entire harvests in wet weather.",
        recommendedProductIds: ["16", "17"],
      },
      {
        name: "Fruit Rot",
        image: makeDiseaseSvg("#2a1a1a", "#8B0000", "#4a3a2a", "Fruit Rot - Chili"),
        severity: "high",
        symptoms: ["Soft watery rot on green fruits", "White fungal growth on affected area", "Fruits fall off prematurely"],
        description: "Various fungi cause rotting of chili fruits especially during monsoon. Infected fruits become soft, develop fungal growth, and drop from the plant.",
        recommendedProductIds: ["17", "18"],
      },
    ],
    matchingProductIds: ["4", "7", "8", "16", "17"],
  },
  {
    id: "sugarcane",
    name: "Sugarcane",
    icon: "🎋",
    image: "https://images.unsplash.com/photo-1559070169-a3077159ee16?auto=format&fit=crop&w=400&q=80",
    description: "Tackle borers, termites & red rot for higher yield",
    commonIssues: [
      {
        name: "Stem Borer",
        image: makePestSvg("#1a2a1a", "#D2B48C", "#2a4a2a", "Stem Borer - Sugarcane"),
        severity: "critical",
        symptoms: ["Dead hearts - central shoot dries up", "Bore holes with frass on internodes", "Reduced sugar content in cane"],
        description: "Early shoot borer and top borer larvae tunnel through sugarcane stems causing dead hearts, reducing cane weight and sugar recovery.",
        recommendedProductIds: ["5", "1"],
      },
      {
        name: "Termites",
        image: makePestSvg("#2a2010", "#F5DEB3", "#4a3a2a", "Termite Damage - Sugarcane"),
        severity: "high",
        symptoms: ["Wilting and drying of cane stalks", "Hollowed-out setts and roots", "Mud galleries inside stems"],
        description: "Termites attack planted setts and roots, hollowing out the cane from inside. Infested stools fail to germinate or produce thin, weak canes.",
        recommendedProductIds: ["1", "6"],
      },
      {
        name: "Red Rot",
        image: makeDiseaseSvg("#1a2a1a", "#8B0000", "#2a5a2a", "Red Rot Disease - Sugarcane"),
        severity: "critical",
        symptoms: ["Reddening of internal cane tissue", "White patches within red tissue", "Foul alcoholic smell when split"],
        description: "Most dreaded sugarcane disease. Internal tissue turns red with white patches. Infected canes have a sour alcoholic smell and are unfit for milling.",
        recommendedProductIds: ["17", "18"],
      },
      {
        name: "Woolly Aphid",
        image: makePestSvg("#1a2a1a", "#FFFAF0", "#2a5a2a", "Woolly Aphid - Sugarcane"),
        severity: "medium",
        symptoms: ["White cottony masses on leaf undersides", "Black sooty mold on honeydew", "Yellowing and drying of lower leaves"],
        description: "White woolly aphid colonies form on leaf undersides, secreting copious honeydew. Sooty mold growth reduces photosynthesis and weakens the crop.",
        recommendedProductIds: ["8", "2"],
      },
    ],
    matchingProductIds: ["1", "2", "6", "24", "26"],
  },
  {
    id: "potato",
    name: "Potato",
    icon: "🥔",
    image: "https://images.unsplash.com/photo-1508313880080-c4bef0730395?auto=format&fit=crop&w=400&q=80",
    description: "Prevent late blight, early blight & cutworm",
    commonIssues: [
      {
        name: "Late Blight",
        image: makeDiseaseSvg("#1a2a1a", "#2F4F4F", "#3a5a3a", "Late Blight - Potato"),
        severity: "critical",
        symptoms: ["Water-soaked dark lesions on leaf tips/edges", "White mold growth on leaf undersides", "Rapid blackening and collapse of foliage"],
        description: "Phytophthora infestans causes devastating late blight. Entire fields can be destroyed in days under cool, wet conditions. Also rots tubers in storage.",
        recommendedProductIds: ["17", "18", "19"],
      },
      {
        name: "Early Blight",
        image: makeDiseaseSvg("#1a2a1a", "#5C4033", "#3a5a3a", "Early Blight - Potato"),
        severity: "high",
        symptoms: ["Target-shaped concentric ring lesions on leaves", "Yellowing around lesions", "Premature defoliation reducing tuber size"],
        description: "Alternaria solani causes dark brown target-shaped spots on older leaves first. Premature defoliation reduces tuber bulking and overall yield.",
        recommendedProductIds: ["16", "19"],
      },
      {
        name: "Cutworm",
        image: makePestSvg("#2a2010", "#6B4423", "#4a4a2a", "Cutworm Damage - Potato"),
        severity: "high",
        symptoms: ["Young plants cut at soil level overnight", "Fat greyish caterpillar curled in soil", "Irregular holes chewed in tubers"],
        description: "Cutworm caterpillars hide in soil during day and cut young potato plants at the base at night. They also bore into developing tubers.",
        recommendedProductIds: ["1", "6"],
      },
      {
        name: "Aphids",
        image: makePestSvg("#1a2a1a", "#98FB98", "#3a5a3a", "Aphid Vectors - Potato"),
        severity: "medium",
        symptoms: ["Green peach aphids on leaf undersides", "Transmit potato viruses (PVY, PLRV)", "Leaf curling and mosaic symptoms"],
        description: "Aphids are critical as vectors of potato viruses. Even small populations can transmit PVY and PLRV, causing leaf roll and mosaic diseases.",
        recommendedProductIds: ["8", "4"],
      },
    ],
    matchingProductIds: ["15", "16", "17", "18", "19"],
  },
  {
    id: "grapes",
    name: "Grapes",
    icon: "🍇",
    image: "https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=400&q=80",
    description: "Shield from downy mildew, powdery mildew & thrips",
    commonIssues: [
      {
        name: "Downy Mildew",
        image: makeDiseaseSvg("#1a2a1a", "#D3D3D3", "#3a6a3a", "Downy Mildew - Grapes"),
        severity: "critical",
        symptoms: ["Oily yellowish spots on upper leaf surface", "White cottony growth on leaf undersides", "Berries shrivel and turn brown"],
        description: "Plasmopara viticola causes oily spots on leaves with white downy growth underneath. Berries get infected and shrivel. Devastating in humid monsoon weather.",
        recommendedProductIds: ["17", "18", "19"],
      },
      {
        name: "Powdery Mildew",
        image: makeDiseaseSvg("#1a2a1a", "#E8E8E8", "#3a5a3a", "Powdery Mildew - Grapes"),
        severity: "high",
        symptoms: ["White powdery coating on leaves and berries", "Berries crack and expose seeds", "Reduced sugar content in grapes"],
        description: "White powdery fungal growth covers leaves, shoots, and berries. Infected berries crack open, exposing flesh to secondary infections and reducing quality.",
        recommendedProductIds: ["16", "15"],
      },
      {
        name: "Thrips",
        image: makePestSvg("#1a2a1a", "#FFD700", "#3a5a3a", "Thrips Damage - Grapes"),
        severity: "medium",
        symptoms: ["Scarring and russeting on berries", "Silvery patches on leaves", "Damaged flower clusters reducing fruit set"],
        description: "Thrips feed on tender flowers and developing berries causing russeting scars. Damaged flowers fail to set fruit, reducing bunch weight.",
        recommendedProductIds: ["8", "4"],
      },
      {
        name: "Anthracnose",
        image: makeDiseaseSvg("#1a2a1a", "#3a1a1a", "#3a5a3a", "Anthracnose - Grapes"),
        severity: "high",
        symptoms: ["Bird's eye spots on berries (dark border, grey center)", "Sunken lesions on shoots", "Cracking and rotting of berries"],
        description: "Characteristic bird's eye spots on berries with dark borders and grey centers. Also attacks shoots and leaves, causing cankers and defoliation.",
        recommendedProductIds: ["16", "20"],
      },
    ],
    matchingProductIds: ["15", "16", "17", "19", "20"],
  },
  {
    id: "soybean",
    name: "Soybean",
    icon: "🫘",
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=400&q=80",
    description: "Manage pod borer, rust & weed infestation",
    commonIssues: [
      {
        name: "Pod Borer",
        image: makePestSvg("#1a2a1a", "#C4A35A", "#3a5a3a", "Pod Borer - Soybean"),
        severity: "high",
        symptoms: ["Holes in pods with larvae inside", "Damaged and shrivelled seeds", "Frass on pod surface near holes"],
        description: "Helicoverpa and Spodoptera larvae bore into soybean pods and feed on developing seeds, causing direct yield loss and quality reduction.",
        recommendedProductIds: ["5", "7"],
      },
      {
        name: "Soybean Rust",
        image: makeDiseaseSvg("#1a2a1a", "#B8860B", "#3a5a3a", "Asian Soybean Rust"),
        severity: "critical",
        symptoms: ["Tan to dark brown pustules on leaf undersides", "Rapid yellowing and defoliation", "Premature pod maturity with small seeds"],
        description: "Asian soybean rust (Phakopsora pachyrhizi) causes rapid defoliation. Can reduce yields by 30-80% if not controlled early. Spreads fast in humid weather.",
        recommendedProductIds: ["20", "16"],
      },
      {
        name: "Girdle Beetle",
        image: makePestSvg("#1a2a1a", "#8B4513", "#3a5a3a", "Girdle Beetle - Soybean"),
        severity: "medium",
        symptoms: ["Ring-shaped girdle cut on stem", "Stem breaks at the girdled point", "Plant portion above girdle dries up"],
        description: "Adult beetles girdle the stem by chewing a ring around it. The plant above the girdle wilts and dries. Larvae feed inside the stem below the girdle.",
        recommendedProductIds: ["5", "8"],
      },
      {
        name: "Weeds",
        image: makeWiltSvg("#1a2a1a", "#6B8E23", "#3a6a3a", "Weed Competition - Soybean"),
        severity: "medium",
        symptoms: ["Stunted soybean among weeds", "Reduced branching and pod formation", "Difficulty in harvesting"],
        description: "Weeds compete aggressively with soybean during the first 30-45 days. Uncontrolled weeds can reduce yields by 25-70%.",
        recommendedProductIds: ["25"],
      },
    ],
    matchingProductIds: ["5", "7", "20", "25"],
  },
  {
    id: "mango",
    name: "Mango",
    icon: "🥭",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80",
    description: "Control hopper, powdery mildew & fruit fly",
    commonIssues: [
      {
        name: "Mango Hopper",
        image: makePestSvg("#1a2a0a", "#7CFC00", "#2a4a1a", "Mango Hopper"),
        severity: "high",
        symptoms: ["Hoppers on flower panicles", "Honeydew dripping from flowers", "Flower drying and poor fruit set"],
        description: "Mango hoppers suck sap from tender shoots and flower panicles. Honeydew secretion causes sooty mold. Heavy infestation leads to complete flower drying and no fruiting.",
        recommendedProductIds: ["8", "2"],
      },
      {
        name: "Powdery Mildew",
        image: makeDiseaseSvg("#1a2a1a", "#E8E8E8", "#2a5a2a", "Powdery Mildew - Mango"),
        severity: "high",
        symptoms: ["White powder on panicles and young fruits", "Flower and fruit drop", "Malformed fruits with white residue"],
        description: "White powdery fungal coating on flower panicles and young fruits. Causes massive flower drop and poor fruit set. Most damaging in dry, cool weather.",
        recommendedProductIds: ["16", "20"],
      },
      {
        name: "Fruit Fly",
        image: makePestSvg("#1a2a1a", "#FF8C00", "#2a5a2a", "Fruit Fly - Mango"),
        severity: "critical",
        symptoms: ["Puncture marks on ripening fruits", "Maggots inside fruit pulp", "Premature fruit drop and rotting"],
        description: "Female fruit flies lay eggs under the skin of ripening mangoes. Maggots feed inside, causing fruit rot and drop. Major post-harvest and export concern.",
        recommendedProductIds: ["8", "18"],
      },
      {
        name: "Anthracnose",
        image: makeDiseaseSvg("#1a2a1a", "#2F1E0E", "#2a5a2a", "Anthracnose - Mango"),
        severity: "high",
        symptoms: ["Black spots on leaves and flowers", "Dark sunken lesions on fruits", "Post-harvest fruit rot during storage"],
        description: "Colletotrichum causes black spots on flowers (blossom blight) and dark lesions on fruits. Major cause of post-harvest decay during storage and transport.",
        recommendedProductIds: ["16", "17", "18"],
      },
    ],
    matchingProductIds: ["8", "16", "18", "20"],
  },
  {
    id: "onion",
    name: "Onion",
    icon: "🧅",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80",
    description: "Protect onion crops from thrips and purple blotch",
    commonIssues: [],
    matchingProductIds: ["8", "17"],
  },
  {
    id: "maize",
    name: "Maize (Corn)",
    icon: "🌽",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80",
    description: "Shield maize from fall armyworm and stem borer",
    commonIssues: [],
    matchingProductIds: ["5", "7"],
  },
  {
    id: "groundnut",
    name: "Groundnut",
    icon: "🥜",
    image: "https://images.unsplash.com/photo-1567892737950-30c4db37cd89?auto=format&fit=crop&w=400&q=80",
    description: "Control leaf spot and white grub in groundnut",
    commonIssues: [],
    matchingProductIds: ["16", "1"],
  },
  {
    id: "banana",
    name: "Banana",
    icon: "🍌",
    image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=400&q=80",
    description: "Manage banana bunchy top virus and sigatoka",
    commonIssues: [],
    matchingProductIds: ["8", "17", "18"],
  },
];
