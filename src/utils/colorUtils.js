import { COLORS } from './constants.js';

/**
 * Generate an array of pastel colors
 * @param {number} numColors - Number of colors to generate
 * @returns {string[]} Array of RGB color strings
 */
export function generatePastelColors(numColors) {
  const colors = [];
  const { min, max } = COLORS.PASTEL_RANGE;
  
  for (let i = 0; i < numColors; i++) {
    const r = min + Math.floor(Math.random() * (max - min));
    const g = min + Math.floor(Math.random() * (max - min));
    const b = min + Math.floor(Math.random() * (max - min));
    colors.push(`rgb(${r}, ${g}, ${b})`);
  }
  
  return colors;
}

/**
 * Generate rainbow colors with consistent saturation and lightness
 * @param {number} numColors - Number of colors to generate
 * @param {number} saturation - HSL saturation (0-100)
 * @param {number} lightness - HSL lightness (0-100)
 * @returns {string[]} Array of HSL color strings
 */
export function generateRainbowColors(numColors, saturation = 60, lightness = 80) {
  const colors = [];
  
  for (let i = 0; i < numColors; i++) {
    const hue = (360 * i) / numColors;
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  
  return colors;
}

/**
 * Generate colors along a gradient between two colors
 * @param {string} startColor - Starting HSL color (e.g., "hsl(0, 100%, 50%)")
 * @param {string} endColor - Ending HSL color
 * @param {number} steps - Number of gradient steps
 * @returns {string[]} Array of HSL color strings
 */
export function generateGradientColors(startColor, endColor, steps) {
  // Simple implementation - extract HSL values and interpolate
  const colors = [];
  
  // For now, use rainbow as fallback - could enhance with proper HSL parsing
  return generateRainbowColors(steps);
}

/**
 * Generate warm color palette (reds, oranges, yellows)
 * @param {number} numColors - Number of colors to generate
 * @returns {string[]} Array of HSL color strings
 */
export function generateWarmColors(numColors) {
  const colors = [];
  const { min: satMin, max: satMax } = COLORS.SATURATION_RANGE;
  const { min: lightMin, max: lightMax } = COLORS.LIGHTNESS_RANGE;
  
  for (let i = 0; i < numColors; i++) {
    const hue = Math.random() * 60; // 0-60 for warm colors (red to yellow)
    const saturation = satMin + Math.random() * (satMax - satMin);
    const lightness = lightMin + Math.random() * (lightMax - lightMin);
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  
  return colors;
}

/**
 * Generate cool color palette (blues, greens, purples)
 * @param {number} numColors - Number of colors to generate
 * @returns {string[]} Array of HSL color strings
 */
export function generateCoolColors(numColors) {
  const colors = [];
  const { min: satMin, max: satMax } = COLORS.SATURATION_RANGE;
  const { min: lightMin, max: lightMax } = COLORS.LIGHTNESS_RANGE;
  
  for (let i = 0; i < numColors; i++) {
    const hue = 180 + Math.random() * 120; // 180-300 for cool colors (cyan to purple)
    const saturation = satMin + Math.random() * (satMax - satMin);
    const lightness = lightMin + Math.random() * (lightMax - lightMin);
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  
  return colors;
}

/**
 * Generate monochromatic color palette based on single hue
 * @param {number} baseHue - Base hue (0-360)
 * @param {number} numColors - Number of colors to generate
 * @returns {string[]} Array of HSL color strings
 */
export function generateMonochromaticColors(baseHue, numColors) {
  const colors = [];
  const { min: satMin, max: satMax } = COLORS.SATURATION_RANGE;
  const { min: lightMin, max: lightMax } = COLORS.LIGHTNESS_RANGE;
  
  for (let i = 0; i < numColors; i++) {
    const saturation = satMin + (i / (numColors - 1)) * (satMax - satMin);
    const lightness = lightMin + (i / (numColors - 1)) * (lightMax - lightMin);
    colors.push(`hsl(${baseHue}, ${saturation}%, ${lightness}%)`);
  }
  
  return colors;
}