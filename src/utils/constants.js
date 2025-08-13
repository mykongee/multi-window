// Window configuration constants
export const WINDOW_CONFIG = {
  DEFAULT_SIZE: 150,
  MIN_SIZE: 80,
  MAX_SIZE: 400,
  FEATURES: 'menubar=no,toolbar=no,location=no,status=no,scrollbars=no',
  AUTO_CLOSE_DELAY: 5000,
  ANIMATION_CLOSE_DELAY: 10000
};

// Animation constants
export const ANIMATION = {
  FRAME_RATE: 60,
  DEFAULT_SPEED: 0.1,
  SINE_AMPLITUDE: 100,
  SINE_FREQUENCY: 0.5,
  WAVE_LENGTH: 200,
  CIRCLE_RADIUS: 300,
  SPIRAL_TURNS: 3,
  FIREWORK_BURST_SPEED: 5
};

// Screen bounds and positioning
export const SCREEN = {
  MARGIN_BUFFER: 50,
  SAFE_ZONE_RATIO: 0.8 // Use 80% of screen for safe positioning
};

// Color palettes and generation
export const COLORS = {
  PASTEL_RANGE: { min: 180, max: 255 },
  SATURATION_RANGE: { min: 40, max: 80 },
  LIGHTNESS_RANGE: { min: 70, max: 90 },
  HUE_STEP: 30 // For rainbow generation
};