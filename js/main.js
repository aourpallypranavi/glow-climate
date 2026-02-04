// ========================================
// MAIN ENTRY POINT
// ========================================
// Animation loop, scroll handling, particle management
// ========================================

import { DATA, VISUAL } from './config.js';
import { GlowParticle } from './GlowParticle.js';
import { SceneManager } from './SceneManager.js';

// ========================================
// GLOBAL STATE
// ========================================
const state = {
  canvas: null,
  ctx: null,
  offscreenCanvas: null,
  offscreenCtx: null,
  particles: [],
  sceneManager: null,
  scrollProgress: 0,
  time: 0,
  mouse: { x: 0, y: 0 },
  isRunning: false,
};

// ========================================
// INITIALIZATION
// ========================================
function init() {
  console.log('🌟 Initializing Glow Climate Visualization...');
  
  // Setup canvas
  state.canvas = document.getElementById('canvas');
  state.ctx = state.canvas.getContext('2d', { alpha: false });
  
  // Offscreen canvas for gradient compositing
  state.offscreenCanvas = document.createElement('canvas');
  state.offscreenCtx = state.offscreenCanvas.getContext('2d');
  
  // Resize canvas
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Setup scene manager
  state.sceneManager = new SceneManager();
  
  // Setup scroll listener
  window.addEventListener('scroll', updateScroll);
  updateScroll(); // Initial call
  
  // Mouse tracking
  window.addEventListener('mousemove', (e) => {
    state.mouse.x = e.clientX;
    state.mouse.y = e.clientY;
  });
  
  // Create initial particle
  createInitialGlow();
  
  // Start animation loop
  state.isRunning = true;
  animate();
  
  console.log('✅ Initialization complete');
}

// ========================================
// RESIZE HANDLER
// ========================================
function resizeCanvas() {
  state.canvas.width = window.innerWidth;
  state.canvas.height = window.innerHeight;
  console.log(`Canvas resized: ${state.canvas.width}x${state.canvas.height}`);
}

// ========================================
// SCROLL HANDLER
// ========================================
function updateScroll() {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  state.scrollProgress = window.scrollY / maxScroll;
  
  // Clamp between 0 and 1
  state.scrollProgress = Math.max(0, Math.min(1, state.scrollProgress));
  
  // Update scene manager
  state.sceneManager.update(state.scrollProgress, state.particles);
  
  // Spawn particles based on scroll progress
  updateParticleCount();
}

// ========================================
// PARTICLE MANAGEMENT
// ========================================
function createInitialGlow() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  
  const glow = new GlowParticle(centerX, centerY, {
    energyKWh: 1, // 1 kWh reference
    co2Grams: DATA.carbon.co2_per_kwh_us_grid_g,
    type: 'inference'
  });
  
  glow.spawn();
  state.particles.push(glow);
}

function updateParticleCount() {
  const scene = state.sceneManager.currentScene;
  if (!scene) return;
  
  // Determine target particle count based on scene
  let targetCount = 1; // Default
  
  switch (scene.id) {
    case 0: // Hook
      targetCount = 1;
      break;
    case 1: // Unit
      targetCount = 1;
      break;
    case 2: // Query
      targetCount = 10; // 10× comparison
      break;
    case 3: // Daily
      const localProgress3 = (state.scrollProgress - scene.scrollRange[0]) / 
                             (scene.scrollRange[1] - scene.scrollRange[0]);
      targetCount = Math.floor(1 + localProgress3 * 29); // 1 → 30
      break;
    case 4: // Scale
      const localProgress4 = (state.scrollProgress - scene.scrollRange[0]) / 
                             (scene.scrollRange[1] - scene.scrollRange[0]);
      targetCount = Math.floor(30 + localProgress4 * 370); // 30 → 400
      break;
    case 5: // Grid
      targetCount = 400;
      break;
    case 6: // Carbon
      targetCount = 400;
      break;
    case 7: // Growth
      const localProgress7 = (state.scrollProgress - scene.scrollRange[0]) / 
                             (scene.scrollRange[1] - scene.scrollRange[0]);
      targetCount = Math.floor(400 + localProgress7 * 215); // 400 → 615 (representing 2024→2030)
      break;
    case 8: // Flock
      targetCount = 615;
      break;
    case 9: // Reckoning
      targetCount = 615;
      break;
  }
  
  // Spawn or remove particles to match target
  const currentCount = state.particles.filter(p => p.alive).length;
  
  if (currentCount < targetCount) {
    // Spawn new particles
    const toSpawn = targetCount - currentCount;
    for (let i = 0; i < toSpawn; i++) {
      spawnParticle();
    }
  } else if (currentCount > targetCount) {
    // Remove excess particles (fade out oldest)
    const toRemove = currentCount - targetCount;
    let removed = 0;
    for (let i = state.particles.length - 1; i >= 0 && removed < toRemove; i--) {
      if (state.particles[i].alive) {
        fadeOutParticle(state.particles[i]);
        removed++;
      }
    }
  }
  
  // Clean up dead particles
  state.particles = state.particles.filter(p => p.alive || p.opacity > 0.01);
}

function spawnParticle() {
  const canvas = state.canvas;
  
  // Spawn in editorial rows layout
  const padding = 100;
  const x = padding + Math.random() * (canvas.width - padding * 2);
  const y = padding + Math.random() * (canvas.height - padding * 2);
  
  const particle = new GlowParticle(x, y, {
    energyKWh: DATA.energy.kwh_per_query,
    co2Grams: DATA.carbon.co2_per_query_g,
    type: 'inference'
  });
  
  particle.spawn();
  state.particles.push(particle);
}

function fadeOutParticle(particle) {
  particle.alive = false;
  gsap.to(particle, {
    opacity: 0,
    scale: 0,
    duration: 0.6,
    ease: 'power2.in'
  });
}

// ========================================
// ANIMATION LOOP
// ========================================
function animate(timestamp) {
  if (!state.isRunning) return;
  
  state.time = timestamp || 0;
  
  // Clear canvas
  state.ctx.fillStyle = VISUAL.colors.background;
  state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
  
  // Update and draw particles
  state.particles.forEach(particle => {
    // Update physics
    particle.update(1);
    
    // Apply scene-specific behaviors
    const scene = state.sceneManager.currentScene;
    if (scene) {
      switch (particle.behaviorMode) {
        case 'wander':
          particle.wander(state.time);
          break;
        case 'flock':
          particle.flock(state.particles);
          break;
      }
    }
    
    // Draw
    particle.draw(state.ctx, state.offscreenCanvas, state.offscreenCtx);
  });
  
  // Continue loop
  requestAnimationFrame(animate);
}

// ========================================
// START
// ========================================
window.addEventListener('load', init);

// ========================================
// DEBUG INFO
// ========================================
window.addEventListener('keydown', (e) => {
  if (e.key === 'd') {
    console.log('=== DEBUG INFO ===');
    console.log('Scroll Progress:', state.scrollProgress);
    console.log('Current Scene:', state.sceneManager.currentScene?.name);
    console.log('Particle Count:', state.particles.length);
    console.log('Alive Particles:', state.particles.filter(p => p.alive).length);
  }
});

// Export for debugging
window.glowState = state;
