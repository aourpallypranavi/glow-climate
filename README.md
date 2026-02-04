# GLOW — The Climate Cost of AI

An interactive data visualization exploring AI's energy consumption and climate impact through scroll-driven storytelling and physics-based particle systems.

Created for **Nightingale**, the Data Visualization Society's journal.

---

## 📊 PROJECT OVERVIEW

**Core Concept:** Visualize AI's energy consumption (415 TWh annually) using animated "glow" particles where physics behaviors encode data meanings.

**Data Sources:**
- International Energy Agency (2024)
- SemiAnalysis (2024)
- Patterson et al., Google Research (2021)
- US Energy Information Administration (2024)

---

## 🎬 NARRATIVE STRUCTURE (10 Scenes)

### Scene 0: Hook (0-5%)
"Every time you ask AI a question, this happens."

### Scene 1: Unit (5-12%)
Establishes 1 kWh as the measurement unit

### Scene 2: Query (12-20%)
One ChatGPT query = 10× Google search energy

### Scene 3: Daily (20-35%)
Personal scale: 30 queries/day = 45g CO₂

### Scene 4: Scale (35-50%)
100M users × 30 queries = 3 billion daily queries

### Scene 5: Grid (50-65%)
Reveals: 60% fossil fuels power AI

### Scene 6: Carbon (65-78%)
Permanent CO₂ trails (300-1000 year lifespan)

### Scene 7: Growth (78-88%)
Exponential growth: 200 TWh (2020) → 652 TWh (2030)

### Scene 8: Flock (88-95%)
Collective behavior — "We are the system"

### Scene 9: Reckoning (95-100%)
Total impact: 27M tons CO₂/year

---

## 🏗️ FILE STRUCTURE

```
glow-climate/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # All styles
├── js/
│   ├── main.js             # Entry point, animation loop
│   ├── config.js           # Data constants (source of truth)
│   ├── GlowParticle.js     # Particle class with behaviors
│   └── SceneManager.js     # Scroll → scene mapping
└── assets/
    ├── shape1.png          # Organic blob shape
    ├── shape2.png          # Starburst shape
    ├── shape3.png          # Wavy splat shape
    └── shape4.png          # Star flower shape
```

---

## 🔧 TECH STACK

- **HTML5 Canvas** — Rendering
- **Vanilla JavaScript** — No framework bloat
- **ES6 Modules** — Clean imports
- **GSAP** — Smooth animations
- **Nature of Code** — Physics behaviors

### Physics Behaviors:
- **Wandering** — Perlin noise-based movement
- **Flocking** — Boids algorithm (alignment, cohesion, separation)
- **Multiplication** — Mitosis/splitting for growth
- **Emission** — Carbon smoke trails

---

## 🚀 HOW TO RUN

### Option 1: Local Server (Recommended)
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# Then open: http://localhost:8000
```

### Option 2: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

**Note:** Must use a server due to ES6 modules. Opening `index.html` directly won't work.

---

## 📐 DATA → VISUAL ENCODING

### Core Mappings:
| Data Variable | Visual Parameter | Physics Behavior |
|--------------|------------------|------------------|
| Energy (kWh) | Glow size | Larger = more energy |
| CO₂ intensity | Particle mass | Heavier = dirtier |
| Energy source | Color | Dark = fossil, Bright = renewable |
| Time elapsed | Animation speed | Growth rate |
| Query volume | Spawn rate | More queries = more particles |
| Cumulative CO₂ | Smoke density | Permanent accumulation |

### Key Principles:
1. **No arbitrary values** — every parameter maps to data
2. **Behavior = data relationship** — not decoration
3. **Emergence shows insight** — patterns reveal truth
4. **Scaling is literal** — 415 particles = 415 TWh

---

## 🎨 DESIGN SYSTEM

### Color Palette (Warm Fruit):
- Background: `#F9C12F` (Sun Yellow)
- Glow Center: `#F15A29` (Tangerine)
- Glow Edge: `#DA1C5C` (Dragonfruit)
- Fossil: `#2a2a2a` (Charcoal)
- Renewable: `#00ff88` (Bright Green)

### Typography:
- Font: **Outfit** (Google Fonts)
- Weights: 300, 400, 500, 600, 700, 800, 900

### Motion Primitives:
- **Spawn** — Scale + fade in (0.8s, back.out easing)
- **Wander** — Sin/cos oscillation (Nature of Code)
- **Flock** — Boids algorithm (Reynolds)
- **Emit** — Particle trails (smoke = CO₂)

---

## 🐛 DEBUGGING

Press **`d`** key to log debug info:
- Current scroll progress
- Active scene
- Particle count
- Alive particles

Access state in console:
```javascript
window.glowState
```

---

## ✅ CURRENT STATUS

### Completed:
- ✅ Foundation architecture
- ✅ Config with verified data
- ✅ GlowParticle class with behaviors
- ✅ SceneManager with scroll control
- ✅ Animation loop
- ✅ 10 scene structure
- ✅ Basic physics (wander, flock)

### To Build:
- 🔲 Scene-specific particle spawning logic
- 🔲 Smooth scene transitions
- 🔲 Use actual PNG shapes (currently circles)
- 🔲 Mobile optimization
- 🔲 Performance tuning (too many particles)
- 🔲 Final copy editing

---

## 🔄 NEXT STEPS

1. **Test current build** — Does it scroll? Do particles appear?
2. **Refine Scene 3-4** — Daily → Scale particle spawning
3. **Implement Grid split** — 60/40 fossil/renewable
4. **Add smoke trails** — Scene 6 carbon emission
5. **Growth splitting** — Scene 7 mitosis behavior
6. **Polish transitions** — Smooth scene blending
7. **Mobile testing** — Touch interactions
8. **Performance** — Optimize for 600+ particles

---

## 📝 NOTES

- Scroll progress: `0.0` (top) → `1.0` (bottom)
- Scene ranges defined in `config.js`
- Particle behaviors switch based on scene
- All data constants in `config.js` — single source of truth

---

## 🎯 DESIGN GOALS

1. **Data accuracy** — Every number verified
2. **Semantic encoding** — Physics = meaning
3. **Editorial quality** — Magazine-worthy
4. **Emotional impact** — Feel the scale
5. **No guilt** — Awareness, not shame

---

Built with ☀️ by Wasim
For Nightingale / Data Visualization Society
