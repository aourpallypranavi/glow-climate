// ========================================
// SCENE MANAGER
// ========================================
// Controls scroll-driven scene transitions
// Maps scroll progress → scene behaviors
// ========================================

import { SCENES, getSceneByProgress, getLocalProgress } from './config.js';

export class SceneManager {
  constructor() {
    this.scenes = SCENES;
    this.currentScene = null;
    this.previousScene = null;
    this.scrollProgress = 0;
    this.isTransitioning = false;
    
    // DOM elements
    this.textOverlay = document.getElementById('textOverlay');
    this.textContent = document.getElementById('textContent');
    this.dataCounter = document.getElementById('dataCounter');
    this.counterValue = document.getElementById('counterValue');
    this.counterLabel = document.getElementById('counterLabel');
  }
  
  // ========================================
  // UPDATE
  // ========================================
  update(scrollProgress, particles) {
    this.scrollProgress = scrollProgress;
    
    // Find active scene
    const activeScene = getSceneByProgress(scrollProgress);
    
    // Scene transition
    if (activeScene && activeScene !== this.currentScene) {
      this.transitionToScene(activeScene, particles);
    }
    
    // Update current scene
    if (this.currentScene) {
      const localProgress = getLocalProgress(scrollProgress, this.currentScene);
      this.updateSceneContent(this.currentScene, localProgress, particles);
    }
  }
  
  // ========================================
  // SCENE TRANSITION
  // ========================================
  transitionToScene(newScene, particles) {
    console.log(`Scene transition: ${this.currentScene?.name || 'null'} → ${newScene.name}`);
    
    this.previousScene = this.currentScene;
    this.currentScene = newScene;
    
    // Call scene-specific enter logic
    this.enterScene(newScene, particles);
  }
  
  // ========================================
  // SCENE-SPECIFIC LOGIC
  // ========================================
  enterScene(scene, particles) {
    switch (scene.id) {
      case 0: this.enterScene0_Hook(particles); break;
      case 1: this.enterScene1_Unit(particles); break;
      case 2: this.enterScene2_Query(particles); break;
      case 3: this.enterScene3_Daily(particles); break;
      case 4: this.enterScene4_Scale(particles); break;
      case 5: this.enterScene5_Grid(particles); break;
      case 6: this.enterScene6_Carbon(particles); break;
      case 7: this.enterScene7_Growth(particles); break;
      case 8: this.enterScene8_Flock(particles); break;
      case 9: this.enterScene9_Reckoning(particles); break;
    }
  }
  
  updateSceneContent(scene, localProgress, particles) {
    switch (scene.id) {
      case 0: this.updateScene0_Hook(localProgress, particles); break;
      case 1: this.updateScene1_Unit(localProgress, particles); break;
      case 2: this.updateScene2_Query(localProgress, particles); break;
      case 3: this.updateScene3_Daily(localProgress, particles); break;
      case 4: this.updateScene4_Scale(localProgress, particles); break;
      case 5: this.updateScene5_Grid(localProgress, particles); break;
      case 6: this.updateScene6_Carbon(localProgress, particles); break;
      case 7: this.updateScene7_Growth(localProgress, particles); break;
      case 8: this.updateScene8_Flock(localProgress, particles); break;
      case 9: this.updateScene9_Reckoning(localProgress, particles); break;
    }
  }
  
  // ========================================
  // SCENE 0: HOOK
  // ========================================
  enterScene0_Hook(particles) {
    this.showText('Every time you ask AI a question,<br>this happens.');
    this.hideCounter();
  }
  
  updateScene0_Hook(progress, particles) {
    // Show text throughout
    this.textOverlay.classList.toggle('visible', true);
  }
  
  // ========================================
  // SCENE 1: UNIT
  // ========================================
  enterScene1_Unit(particles) {
    this.showText('<strong>1 kWh</strong> of energy<br><br>Enough to power an LED bulb for 10 hours<br>Produces 0.85 lbs of CO₂');
    this.hideCounter();
  }
  
  updateScene1_Unit(progress, particles) {
    this.textOverlay.classList.toggle('visible', true);
  }
  
  // ========================================
  // SCENE 2: QUERY
  // ========================================
  enterScene2_Query(particles) {
    this.showText('One ChatGPT question = <strong>0.003 kWh</strong><br>That\'s <strong>10× more</strong> than a Google search');
    this.hideCounter();
  }
  
  updateScene2_Query(progress, particles) {
    this.textOverlay.classList.toggle('visible', true);
  }
  
  // ========================================
  // SCENE 3: DAILY
  // ========================================
  enterScene3_Daily(particles) {
    this.showText('You probably ask <strong>20-50 questions</strong> a day');
    this.showCounter(1, 'queries');
  }
  
  updateScene3_Daily(progress, particles) {
    const count = Math.floor(1 + progress * 29); // 1 → 30
    this.updateCounter(count, 'queries');
    
    // Fade out text after 50% progress
    this.textOverlay.classList.toggle('visible', progress < 0.5);
  }
  
  // ========================================
  // SCENE 4: SCALE
  // ========================================
  enterScene4_Scale(particles) {
    this.showText('Now multiply by <strong>100 million</strong> daily users');
    this.showCounter(30, 'queries');
  }
  
  updateScene4_Scale(progress, particles) {
    // Counter grows exponentially
    const count = Math.floor(30 + progress * (3_000_000_000 - 30));
    this.updateCounter(this.formatLargeNumber(count), 'queries/day');
    
    this.textOverlay.classList.toggle('visible', progress < 0.3);
  }
  
  // ========================================
  // SCENE 5: GRID
  // ========================================
  enterScene5_Grid(particles) {
    this.showText('But here\'s what you don\'t see<br><br><strong>60%</strong> of AI\'s energy comes from <strong>coal and natural gas</strong>');
    this.hideCounter();
  }
  
  updateScene5_Grid(progress, particles) {
    this.textOverlay.classList.toggle('visible', true);
    
    // Split particles into fossil/renewable
    if (progress > 0.3 && particles.length > 0) {
      particles.forEach((p, i) => {
        if (!p.typeSplit) {
          p.type = (i % 10 < 6) ? 'fossil' : 'renewable'; // 60/40 split
          p.color = p.getColorByType();
          p.mass = p.type === 'fossil' ? 820 : 50; // Different carbon intensity
          p.typeSplit = true;
        }
      });
    }
  }
  
  // ========================================
  // SCENE 6: CARBON
  // ========================================
  enterScene6_Carbon(particles) {
    this.showText('Every query leaves a <strong>permanent trace</strong><br><br>This CO₂ stays in the atmosphere for <strong>300-1,000 years</strong>');
    this.showCounter(0, 'tons CO₂');
  }
  
  updateScene6_Carbon(progress, particles) {
    // Enable smoke emission for all particles
    particles.forEach(p => {
      if (p.type === 'fossil') {
        p.emitSmoke = true;
      }
    });
    
    // Count accumulated CO₂
    const co2Tons = Math.floor(progress * 4500); // Daily AI CO₂
    this.updateCounter(co2Tons.toLocaleString(), 'tons CO₂ today');
    
    this.textOverlay.classList.toggle('visible', progress < 0.4);
  }
  
  // ========================================
  // SCENE 7: GROWTH
  // ========================================
  enterScene7_Growth(particles) {
    this.showText('And it\'s <strong>accelerating</strong>');
    this.showCounter(200, 'TWh (2020)');
  }
  
  updateScene7_Growth(progress, particles) {
    // Exponential growth
    const year = 2020 + Math.floor(progress * 10); // 2020 → 2030
    const twh = Math.floor(200 * Math.pow(1.18, (year - 2020))); // 18% annual growth
    
    this.updateCounter(twh, `TWh (${year})`);
    
    this.textOverlay.classList.toggle('visible', progress < 0.2);
  }
  
  // ========================================
  // SCENE 8: FLOCK
  // ========================================
  enterScene8_Flock(particles) {
    this.showText('We\'re not separate from this system<br><strong>We are the system</strong>');
    this.hideCounter();
    
    // Enable flocking for all particles
    particles.forEach(p => {
      p.behaviorMode = 'flock';
      p.emitSmoke = false; // Disable smoke for clarity
    });
  }
  
  updateScene8_Flock(progress, particles) {
    this.textOverlay.classList.toggle('visible', true);
  }
  
  // ========================================
  // SCENE 9: RECKONING
  // ========================================
  enterScene9_Reckoning(particles) {
    this.showText('This isn\'t about stopping AI<br><br>It\'s about <strong>seeing the cost</strong><br><br>Energy is climate. Convenience has weight.<br><br><strong>Now you know.</strong><br><br><em>What will you do differently?</em>');
    this.hideCounter();
    
    // Slow down all particles
    particles.forEach(p => {
      p.behaviorMode = 'wander';
      p.vx *= 0.5;
      p.vy *= 0.5;
      p.wanderSpeed *= 0.3;
      p.emitSmoke = false;
    });
  }
  
  updateScene9_Reckoning(progress, particles) {
    this.textOverlay.classList.toggle('visible', true);
  }
  
  // ========================================
  // UI HELPERS
  // ========================================
  showText(html) {
    this.textContent.innerHTML = html;
    this.textOverlay.classList.add('visible');
  }
  
  hideText() {
    this.textOverlay.classList.remove('visible');
  }
  
  showCounter(value, label) {
    this.counterValue.textContent = value;
    this.counterLabel.textContent = label;
    this.dataCounter.classList.add('visible');
  }
  
  updateCounter(value, label) {
    this.counterValue.textContent = value;
    if (label) {
      this.counterLabel.textContent = label;
    }
  }
  
  hideCounter() {
    this.dataCounter.classList.remove('visible');
  }
  
  formatLargeNumber(num) {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1) + 'B';
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + 'M';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(0) + 'K';
    }
    return num.toFixed(0);
  }
}
