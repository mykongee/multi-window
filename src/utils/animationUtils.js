import { ANIMATION } from './constants.js';
import { moveWindow, closeWindows } from './windowUtils.js';

/**
 * Animation manager class for handling window animations
 */
export class AnimationManager {
  constructor() {
    this.animations = new Map();
    this.globalAnimationId = null;
    this.isRunning = false;
  }

  /**
   * Register an animation with the manager
   * @param {string} id - Unique animation ID
   * @param {Object} animation - Animation configuration
   */
  registerAnimation(id, animation) {
    this.animations.set(id, {
      ...animation,
      active: true,
      startTime: performance.now()
    });
  }

  /**
   * Start the global animation loop
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.animate();
  }

  /**
   * Stop all animations
   */
  stop() {
    this.isRunning = false;
    if (this.globalAnimationId) {
      cancelAnimationFrame(this.globalAnimationId);
      this.globalAnimationId = null;
    }
    
    // Close all windows from active animations
    this.animations.forEach(animation => {
      if (animation.windows) {
        closeWindows(animation.windows);
      }
    });
    
    this.animations.clear();
  }

  /**
   * Stop a specific animation
   * @param {string} id - Animation ID to stop
   */
  stopAnimation(id) {
    const animation = this.animations.get(id);
    if (animation) {
      animation.active = false;
      if (animation.windows) {
        closeWindows(animation.windows);
      }
      this.animations.delete(id);
    }
  }

  /**
   * Main animation loop
   */
  animate() {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    
    // Update all active animations
    this.animations.forEach((animation, id) => {
      if (!animation.active) return;
      
      const elapsed = currentTime - animation.startTime;
      const progress = elapsed / 1000; // Convert to seconds
      
      // Call the animation update function
      if (animation.updateFn) {
        animation.updateFn(progress, elapsed);
      }
      
      // Check if animation should end
      if (animation.duration && elapsed >= animation.duration * 1000) {
        this.stopAnimation(id);
      }
    });
    
    // Continue the loop
    this.globalAnimationId = requestAnimationFrame(() => this.animate());
  }
}

// Global animation manager instance
export const animationManager = new AnimationManager();

/**
 * Sine wave animation function
 * @param {Array} windows - Array of window objects with {window, baseX, baseY, index}
 * @param {number} time - Current time in seconds
 * @param {Object} options - Animation options
 */
export function animateSineWave(windows, time, options = {}) {
  const {
    amplitude = ANIMATION.SINE_AMPLITUDE,
    frequency = ANIMATION.SINE_FREQUENCY,
    phase = 0.5,
    speed = ANIMATION.DEFAULT_SPEED
  } = options;
  
  windows.forEach((winObj) => {
    if (!winObj.window.closed) {
      const newY = winObj.baseY + amplitude * Math.sin(frequency * winObj.index + time * speed + phase * winObj.index);
      moveWindow(winObj.window, winObj.baseX, newY);
    }
  });
}

/**
 * Traveling wave animation function
 * @param {Array} windows - Array of window objects
 * @param {number} time - Current time in seconds  
 * @param {Object} options - Animation options
 */
export function animateTravelingWave(windows, time, options = {}) {
  const {
    amplitude = 80,
    waveLength = 3,
    speed = 0.15
  } = options;
  
  windows.forEach((winObj) => {
    if (!winObj.window.closed) {
      const newY = winObj.baseY + amplitude * Math.sin((2 * Math.PI * winObj.index / waveLength) - time * speed);
      moveWindow(winObj.window, winObj.baseX, newY);
    }
  });
}

/**
 * Circular orbit animation function
 * @param {Array} windows - Array of window objects
 * @param {number} time - Current time in seconds
 * @param {Object} options - Animation options
 */
export function animateCircularOrbit(windows, time, options = {}) {
  const {
    centerX = 400,
    centerY = 300,
    radius = 200,
    speed = ANIMATION.DEFAULT_SPEED
  } = options;
  
  windows.forEach((winObj, index) => {
    if (!winObj.window.closed) {
      const angle = (2 * Math.PI * index / windows.length) + (time * speed);
      const newX = centerX + radius * Math.cos(angle);
      const newY = centerY + radius * Math.sin(angle);
      moveWindow(winObj.window, newX, newY);
    }
  });
}

/**
 * Spiral animation function
 * @param {Array} windows - Array of window objects
 * @param {number} time - Current time in seconds
 * @param {Object} options - Animation options
 */
export function animateSpiral(windows, time, options = {}) {
  const {
    centerX = 400,
    centerY = 300,
    maxRadius = 300,
    turns = ANIMATION.SPIRAL_TURNS,
    speed = ANIMATION.DEFAULT_SPEED
  } = options;
  
  windows.forEach((winObj, index) => {
    if (!winObj.window.closed) {
      const progress = (index / windows.length) + (time * speed * 0.1);
      const angle = progress * turns * 2 * Math.PI;
      const radius = (progress % 1) * maxRadius;
      
      const newX = centerX + radius * Math.cos(angle);
      const newY = centerY + radius * Math.sin(angle);
      moveWindow(winObj.window, newX, newY);
    }
  });
}

/**
 * Firework burst animation function
 * @param {Array} windows - Array of window objects
 * @param {number} time - Current time in seconds
 * @param {Object} options - Animation options
 */
export function animateFireworkBurst(windows, time, options = {}) {
  const {
    centerX = 400,
    centerY = 300,
    burstSpeed = ANIMATION.FIREWORK_BURST_SPEED,
    gravity = 0.5
  } = options;
  
  windows.forEach((winObj, index) => {
    if (!winObj.window.closed) {
      const angle = (2 * Math.PI * index / windows.length);
      const distance = time * burstSpeed * 60; // 60fps conversion
      const gravityOffset = gravity * time * time * 30;
      
      const newX = centerX + distance * Math.cos(angle);
      const newY = centerY + distance * Math.sin(angle) + gravityOffset;
      
      moveWindow(winObj.window, newX, newY);
    }
  });
}

/**
 * Create a simple animation with automatic cleanup
 * @param {string} id - Unique animation ID
 * @param {Array} windows - Array of window objects
 * @param {Function} animationFn - Animation function
 * @param {Object} options - Animation options
 */
export function createAnimation(id, windows, animationFn, options = {}) {
  const {
    duration = null, // No duration limit by default
    ...animationOptions
  } = options;
  
  const updateFn = (time) => {
    animationFn(windows, time, animationOptions);
  };
  
  animationManager.registerAnimation(id, {
    windows,
    updateFn,
    duration
  });
  
  animationManager.start();
  
  return () => animationManager.stopAnimation(id);
}