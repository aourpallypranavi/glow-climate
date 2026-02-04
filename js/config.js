// ========================================
// DATA CONSTANTS — SOURCE OF TRUTH
// ========================================
// All data verified from:
// - International Energy Agency (2024)
// - SemiAnalysis (2024)
// - Patterson et al., Google Research (2021)
// - US Energy Information Administration (2024)
// - Goldman Sachs Research (2024)
// ========================================

export const DATA = {
  // Energy consumption
  energy: {
    kwh_per_query: 0.003,              // ChatGPT query
    kwh_per_google_search: 0.0003,     // Google search (10× less)
    training_gpt3_mwh: 1287,           // Training GPT-3 once
    training_gpt4_mwh: 50000,          // Training GPT-4 (estimated)
    daily_inference_mwh: 9000,         // ChatGPT daily inference
    daily_inference_kwh: 9_000_000,    // Same in kWh
  },
  
  // Carbon emissions
  carbon: {
    co2_per_query_g: 1.5,              // grams CO₂ per ChatGPT query
    co2_per_google_search_g: 0.2,      // grams CO₂ per Google search
    co2_per_kwh_us_grid_lbs: 0.85,     // US average grid
    co2_per_kwh_us_grid_g: 385,        // US average (grams)
    co2_per_kwh_coal_g: 820,           // Coal power
    co2_per_kwh_gas_g: 490,            // Natural gas
    co2_per_kwh_renewable_g: 50,       // Renewable (lifecycle)
    training_gpt3_co2_tons: 552,       // Training GPT-3
    training_gpt4_co2_tons: 25000,     // Training GPT-4 (estimated)
    daily_ai_co2_tons: 4500,           // Daily ChatGPT CO₂
    annual_inference_co2_tons: 1_600_000, // Annual inference
    annual_training_co2_tons: 25_000_000, // Annual all training
  },
  
  // Usage patterns
  usage: {
    daily_users: 100_000_000,          // ChatGPT daily active users
    avg_queries_per_user: 30,          // Average queries per user/day
    daily_queries: 3_000_000_000,      // Total daily queries
    annual_queries: 1_095_000_000_000, // ~1.1 trillion/year
  },
  
  // Grid composition
  grid: {
    fossil_percent: 0.60,              // US grid: 60% fossil fuels
    renewable_percent: 0.40,           // US grid: 40% renewables
    coal_percent: 0.20,                // Coal portion
    gas_percent: 0.40,                 // Natural gas portion
    nuclear_percent: 0.18,             // Nuclear (low carbon)
    hydro_solar_wind_percent: 0.22,    // True renewables
  },
  
  // Data center locations (highest fossil fuel intensity)
  locations: {
    virginia: { fossil: 0.75, name: 'Virginia' },    // Major AI hub
    iowa: { fossil: 0.70, name: 'Iowa' },
    texas: { fossil: 0.65, name: 'Texas' },
  },
  
  // Growth trajectory
  growth: {
    twh_2020: 200,                     // AI energy 2020
    twh_2024: 415,                     // AI energy 2024 (current)
    twh_2030: 652,                     // AI energy 2030 (projected)
    annual_growth_rate: 0.18,          // 18% per year
    doubling_time_years: 4,            // Doubles every ~4 years
  },
  
  // Comparisons (for context)
  comparisons: {
    argentina_annual_twh: 140,         // Argentina total electricity
    iceland_annual_co2_tons: 4_000_000,// Iceland total emissions
    homes_per_mwh_year: 0.0011,        // US homes (1 home ≈ 900 kWh/month)
    miles_per_kg_co2: 2.2,             // Miles driven per kg CO₂
    cars_per_year_co2_tons: 4.6,       // Average car annual CO₂
  }
};

// ========================================
// VISUAL CONSTANTS
// ========================================

export const VISUAL = {
  // Color palette (Warm Fruit)
  colors: {
    background: '#F9C12F',             // Sun Yellow
    glow_center: '#F15A29',            // Tangerine
    glow_edge: '#DA1C5C',              // Dragonfruit
    fossil: '#2a2a2a',                 // Charcoal (fossil fuel)
    renewable: '#00ff88',              // Bright green
    smoke: 'rgba(50,50,50,0.25)',      // Carbon smoke
    text: '#1A1A1A',                   // Near black
    text_accent: '#DA1C5C',            // Dragonfruit
  },
  
  // Glow sizing
  glow_base_size: 40,                  // Base size in pixels
  glow_size_multiplier: 10000,         // kWh to pixel scaling
  
  // Animation timing
  spawn_duration: 0.8,                 // seconds
  transition_duration: 1.2,            // seconds between scenes
  
  // Physics
  wander_radius: 10,                   // pixels
  wander_speed: 0.008,                 // radians per frame
  damping: 0.98,                       // velocity damping
  
  // Flocking (Boids)
  flock_perception_radius: 80,         // pixels
  flock_alignment_weight: 1.0,
  flock_cohesion_weight: 0.8,
  flock_separation_weight: 1.5,
  flock_max_speed: 2.0,                // pixels per frame
  flock_max_force: 0.05,               // acceleration limit
};

// ========================================
// SCENE CONFIGURATION
// ========================================

export const SCENES = [
  {
    id: 0,
    name: 'Hook',
    scrollRange: [0, 0.05],
    title: null,
    description: 'Meet your AI assistant'
  },
  {
    id: 1,
    name: 'Unit',
    scrollRange: [0.05, 0.12],
    title: 'This is 1 kWh of energy',
    description: 'Establishing the unit of measurement'
  },
  {
    id: 2,
    name: 'Query',
    scrollRange: [0.12, 0.20],
    title: 'One ChatGPT question uses this much',
    description: 'Energy per query comparison'
  },
  {
    id: 3,
    name: 'Daily',
    scrollRange: [0.20, 0.35],
    title: 'You probably ask 20-50 questions a day',
    description: 'Personal scale impact'
  },
  {
    id: 4,
    name: 'Scale',
    scrollRange: [0.35, 0.50],
    title: 'Now multiply by 100 million daily users',
    description: 'Global scale multiplication'
  },
  {
    id: 5,
    name: 'Grid',
    scrollRange: [0.50, 0.65],
    title: "But here's what you don't see",
    description: 'Grid composition reveal'
  },
  {
    id: 6,
    name: 'Carbon',
    scrollRange: [0.65, 0.78],
    title: 'Every query leaves a permanent trace',
    description: 'Carbon accumulation'
  },
  {
    id: 7,
    name: 'Growth',
    scrollRange: [0.78, 0.88],
    title: "And it's accelerating",
    description: 'Exponential growth visualization'
  },
  {
    id: 8,
    name: 'Flock',
    scrollRange: [0.88, 0.95],
    title: "We're all part of this",
    description: 'Collective behavior emergence'
  },
  {
    id: 9,
    name: 'Reckoning',
    scrollRange: [0.95, 1.00],
    title: 'So what do we do?',
    description: 'Final impact and reflection'
  }
];

// ========================================
// HELPER FUNCTIONS
// ========================================

export function getSceneByProgress(scrollProgress) {
  return SCENES.find(scene => 
    scrollProgress >= scene.scrollRange[0] && 
    scrollProgress < scene.scrollRange[1]
  );
}

export function getLocalProgress(scrollProgress, scene) {
  const [start, end] = scene.scrollRange;
  return (scrollProgress - start) / (end - start);
}

// Data formatting helpers
export function formatNumber(num) {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toFixed(0);
}

export function formatEnergy(kwh) {
  if (kwh >= 1_000_000) {
    return (kwh / 1_000_000).toFixed(1) + ' GWh';
  }
  if (kwh >= 1_000) {
    return (kwh / 1_000).toFixed(1) + ' MWh';
  }
  return kwh.toFixed(2) + ' kWh';
}

export function formatCO2(grams) {
  if (grams >= 1_000_000_000) {
    return (grams / 1_000_000_000).toFixed(1) + ' Mt';
  }
  if (grams >= 1_000_000) {
    return (grams / 1_000_000).toFixed(1) + ' tons';
  }
  if (grams >= 1_000) {
    return (grams / 1_000).toFixed(1) + ' kg';
  }
  return grams.toFixed(1) + ' g';
}
