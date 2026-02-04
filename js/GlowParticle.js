// ========================================
// GLOW PARTICLE CLASS
// ========================================
// Each particle encodes data through:
// - Size = energy (kWh)
// - Mass = carbon intensity (gCO2)
// - Color = energy source type
// - Behavior = scene-specific physics
// ========================================

import { DATA, VISUAL } from './config.js';

let particleIdCounter = 0;

export class GlowParticle {
  constructor(x, y, options = {}) {
    this.id = particleIdCounter++;
    
    // Position
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    
    // DATA ENCODING
    this.energyKWh = options.energyKWh || DATA.energy.kwh_per_query;
    this.co2Grams = options.co2Grams || DATA.carbon.co2_per_query_g;
    this.type = options.type || 'inference'; // 'training', 'inference', 'fossil', 'renewable'
    
    // VISUAL ENCODING
    this.size = this.calculateSize();
    this.mass = this.co2Grams; // Physics mass = carbon weight
    this.color = this.getColorByType();
    
    // Physics
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    
    // Animation state
    this.opacity = 0;
    this.targetOpacity = 0;
    this.scale = 0;
    this.targetScale = 1;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.005;
    
    // Behavior mode
    this.behaviorMode = 'idle'; // 'idle', 'spawn', 'wander', 'flock', 'split', 'emit'
    
    // Wandering (Nature of Code)
    this.wanderPhase = Math.random() * Math.PI * 2;
    this.wanderSpeed = VISUAL.wander_speed + Math.random() * 0.004;
    this.wanderRadius = VISUAL.wander_radius;
    
    // Flocking (Boids)
    this.perceptionRadius = VISUAL.flock_perception_radius;
    this.maxSpeed = VISUAL.flock_max_speed;
    this.maxForce = VISUAL.flock_max_force;
    
    // Smoke trail
    this.emitSmoke = false;
    this.smokeParticles = [];
    this.smokeEmitRate = 0.3; // particles per frame
    
    // Spawned flag
    this.spawned = false;
    this.alive = true;
  }
  
  // Calculate size based on energy
  calculateSize() {
    const baseSize = VISUAL.glow_base_size;
    const scaleFactor = this.energyKWh * VISUAL.glow_size_multiplier;
    return Math.max(baseSize + scaleFactor, 20); // Minimum 20px
  }
  
  // Color by energy source type
  getColorByType() {
    switch (this.type) {
      case 'fossil':
        return VISUAL.colors.fossil;
      case 'renewable':
        return VISUAL.colors.renewable;
      case 'training':
        return VISUAL.colors.glow_edge; // Larger training glows
      default:
        return VISUAL.colors.glow_center;
    }
  }
  
  // ========================================
  // BEHAVIOR: Spawn animation
  // ========================================
  spawn() {
    this.spawned = true;
    this.targetOpacity = 1;
    this.targetScale = 1;
    
    // Smooth spawn using GSAP
    gsap.to(this, {
      opacity: 1,
      scale: 1,
      duration: VISUAL.spawn_duration,
      ease: 'back.out(1.2)',
      onComplete: () => {
        this.behaviorMode = 'wander';
      }
    });
  }
  
  // ========================================
  // BEHAVIOR: Wandering (Nature of Code)
  // ========================================
  wander(time) {
    if (this.behaviorMode !== 'wander') return;
    
    this.wanderPhase += this.wanderSpeed;
    
    const targetX = this.baseX + Math.sin(this.wanderPhase) * this.wanderRadius;
    const targetY = this.baseY + Math.cos(this.wanderPhase * 0.8) * this.wanderRadius;
    
    // Smooth movement toward target
    this.ax = (targetX - this.x) * 0.05;
    this.ay = (targetY - this.y) * 0.05;
  }
  
  // ========================================
  // BEHAVIOR: Flocking (Boids algorithm)
  // ========================================
  flock(particles) {
    if (this.behaviorMode !== 'flock') return;
    
    const neighbors = this.getNeighbors(particles);
    
    if (neighbors.length === 0) return;
    
    const alignment = this.align(neighbors);
    const cohesion = this.cohere(neighbors);
    const separation = this.separate(neighbors);
    
    // Weight the forces
    alignment.mult(VISUAL.flock_alignment_weight);
    cohesion.mult(VISUAL.flock_cohesion_weight);
    separation.mult(VISUAL.flock_separation_weight);
    
    // Apply forces
    this.applyForce(alignment);
    this.applyForce(cohesion);
    this.applyForce(separation);
  }
  
  getNeighbors(particles) {
    return particles.filter(other => {
      if (other === this || !other.alive) return false;
      const d = this.distance(other);
      return d < this.perceptionRadius;
    });
  }
  
  align(neighbors) {
    const avgVel = { x: 0, y: 0 };
    neighbors.forEach(n => {
      avgVel.x += n.vx;
      avgVel.y += n.vy;
    });
    avgVel.x /= neighbors.length;
    avgVel.y /= neighbors.length;
    
    // Steering = desired - current
    const steer = {
      x: avgVel.x - this.vx,
      y: avgVel.y - this.vy
    };
    
    return this.limitForce(steer);
  }
  
  cohere(neighbors) {
    const center = { x: 0, y: 0 };
    neighbors.forEach(n => {
      center.x += n.x;
      center.y += n.y;
    });
    center.x /= neighbors.length;
    center.y /= neighbors.length;
    
    // Steer toward center
    const desired = {
      x: center.x - this.x,
      y: center.y - this.y
    };
    
    return this.limitForce(desired);
  }
  
  separate(neighbors) {
    const steer = { x: 0, y: 0 };
    
    neighbors.forEach(n => {
      const d = this.distance(n);
      if (d > 0) {
        const diff = {
          x: this.x - n.x,
          y: this.y - n.y
        };
        // Weight by distance (closer = stronger repulsion)
        diff.x /= d;
        diff.y /= d;
        steer.x += diff.x;
        steer.y += diff.y;
      }
    });
    
    if (neighbors.length > 0) {
      steer.x /= neighbors.length;
      steer.y /= neighbors.length;
    }
    
    return this.limitForce(steer);
  }
  
  applyForce(force) {
    this.ax += force.x;
    this.ay += force.y;
  }
  
  limitForce(vec) {
    const mag = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    if (mag > this.maxForce) {
      vec.x = (vec.x / mag) * this.maxForce;
      vec.y = (vec.y / mag) * this.maxForce;
    }
    return vec;
  }
  
  distance(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  // ========================================
  // BEHAVIOR: Split (mitosis)
  // ========================================
  split() {
    const angle = Math.random() * Math.PI * 2;
    const distance = 30;
    
    const newParticle = new GlowParticle(
      this.x + Math.cos(angle) * distance,
      this.y + Math.sin(angle) * distance,
      {
        energyKWh: this.energyKWh,
        co2Grams: this.co2Grams,
        type: this.type
      }
    );
    
    newParticle.spawn();
    
    // Push apart
    this.vx += Math.cos(angle + Math.PI) * 2;
    this.vy += Math.sin(angle + Math.PI) * 2;
    
    return newParticle;
  }
  
  // ========================================
  // BEHAVIOR: Emit smoke (carbon trail)
  // ========================================
  emitSmokeParticle() {
    if (!this.emitSmoke) return;
    if (Math.random() > this.smokeEmitRate) return;
    
    this.smokeParticles.push({
      x: this.x,
      y: this.y,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1 - 0.5, // Slight upward drift
      opacity: 0.3,
      size: 6 + Math.random() * 4,
      life: 1.0,
      maxLife: 1.0
    });
  }
  
  updateSmoke() {
    this.smokeParticles.forEach(smoke => {
      smoke.x += smoke.vx;
      smoke.y += smoke.vy;
      smoke.vy -= 0.02; // Rise slightly
      smoke.life -= 0.005;
      smoke.opacity = (smoke.life / smoke.maxLife) * 0.3;
    });
    
    // Remove dead smoke
    this.smokeParticles = this.smokeParticles.filter(s => s.life > 0);
  }
  
  // ========================================
  // UPDATE
  // ========================================
  update(deltaTime = 1) {
    // Apply acceleration
    this.vx += this.ax * deltaTime;
    this.vy += this.ay * deltaTime;
    
    // Limit speed
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > this.maxSpeed) {
      this.vx = (this.vx / speed) * this.maxSpeed;
      this.vy = (this.vy / speed) * this.maxSpeed;
    }
    
    // Update position
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    
    // Apply damping
    this.vx *= VISUAL.damping;
    this.vy *= VISUAL.damping;
    
    // Reset acceleration
    this.ax = 0;
    this.ay = 0;
    
    // Update rotation
    this.rotation += this.rotationSpeed;
    
    // Smooth opacity/scale
    this.opacity += (this.targetOpacity - this.opacity) * 0.1;
    this.scale += (this.targetScale - this.scale) * 0.1;
    
    // Emit smoke
    if (this.emitSmoke) {
      this.emitSmokeParticle();
    }
    this.updateSmoke();
    
    // Bounds checking (wrap around)
    if (this.x < -100) this.x = window.innerWidth + 100;
    if (this.x > window.innerWidth + 100) this.x = -100;
    if (this.y < -100) this.y = window.innerHeight + 100;
    if (this.y > window.innerHeight + 100) this.y = -100;
  }
  
  // ========================================
  // DRAW
  // ========================================
  draw(ctx, offscreenCanvas, offscreenCtx) {
    if (this.opacity < 0.01) return;
    
    // Draw smoke first (behind glow)
    this.drawSmoke(ctx);
    
    // Draw glow with gradient
    const renderSize = this.size * this.scale;
    
    // Use offscreen canvas for gradient compositing
    offscreenCanvas.width = Math.ceil(renderSize * 2);
    offscreenCanvas.height = Math.ceil(renderSize * 2);
    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    
    // Draw shape (for now, circle - will use PNG shapes later)
    const centerX = offscreenCanvas.width / 2;
    const centerY = offscreenCanvas.height / 2;
    
    offscreenCtx.beginPath();
    offscreenCtx.arc(centerX, centerY, renderSize, 0, Math.PI * 2);
    offscreenCtx.fillStyle = '#ffffff';
    offscreenCtx.fill();
    
    // Apply gradient color
    offscreenCtx.globalCompositeOperation = 'source-atop';
    const gradient = offscreenCtx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, renderSize
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, VISUAL.colors.glow_edge);
    offscreenCtx.fillStyle = gradient;
    offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    offscreenCtx.globalCompositeOperation = 'source-over';
    
    // Draw to main canvas
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(
      offscreenCanvas,
      -renderSize,
      -renderSize,
      renderSize * 2,
      renderSize * 2
    );
    ctx.restore();
  }
  
  drawSmoke(ctx) {
    this.smokeParticles.forEach(smoke => {
      ctx.save();
      ctx.globalAlpha = smoke.opacity;
      ctx.fillStyle = VISUAL.colors.smoke;
      ctx.beginPath();
      ctx.arc(smoke.x, smoke.y, smoke.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
}

// ========================================
// UTILITY: Vector helper
// ========================================
class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  
  mult(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }
  
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  
  normalize() {
    const m = this.mag();
    if (m > 0) {
      this.x /= m;
      this.y /= m;
    }
    return this;
  }
}
