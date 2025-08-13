import { WINDOW_CONFIG, SCREEN } from './constants.js';

/**
 * Calculate safe bounds for window positioning
 * @param {number} windowSize - Size of the window
 * @param {number} margin - Additional margin buffer
 * @returns {Object} Safe bounds {minX, maxX, minY, maxY}
 */
export function calculateSafeBounds(windowSize = WINDOW_CONFIG.DEFAULT_SIZE, margin = SCREEN.MARGIN_BUFFER) {
  const totalMargin = margin + (windowSize / 2);
  
  return {
    minX: totalMargin,
    maxX: window.screen.availWidth - totalMargin,
    minY: totalMargin,
    maxY: window.screen.availHeight - totalMargin
  };
}

/**
 * Generate random position within safe screen bounds
 * @param {number} windowSize - Size of the window
 * @returns {Object} Position {x, y}
 */
export function getRandomPosition(windowSize = WINDOW_CONFIG.DEFAULT_SIZE) {
  const bounds = calculateSafeBounds(windowSize);
  
  return {
    x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
    y: bounds.minY + Math.random() * (bounds.maxY - bounds.minY)
  };
}

/**
 * Generate random window dimensions
 * @param {number} minSize - Minimum window size
 * @param {number} maxSize - Maximum window size
 * @returns {Object} Dimensions {width, height}
 */
export function getRandomDimensions(minSize = WINDOW_CONFIG.MIN_SIZE, maxSize = WINDOW_CONFIG.MAX_SIZE) {
  return {
    width: minSize + Math.random() * (maxSize - minSize),
    height: minSize + Math.random() * (maxSize - minSize)
  };
}

/**
 * Create a new browser window with specified configuration
 * @param {Object} config - Window configuration
 * @param {number} config.width - Window width
 * @param {number} config.height - Window height  
 * @param {number} config.x - Window x position
 * @param {number} config.y - Window y position
 * @param {string} config.title - Window title
 * @param {string} config.backgroundColor - Background color
 * @param {number} config.autoCloseDelay - Auto close delay in ms
 * @returns {Window} New window reference
 */
export function createWindow(config = {}) {
  const {
    width = WINDOW_CONFIG.DEFAULT_SIZE,
    height = WINDOW_CONFIG.DEFAULT_SIZE,
    x = 100,
    y = 100,
    title = 'Window',
    backgroundColor = '#ffffff',
    autoCloseDelay = WINDOW_CONFIG.AUTO_CLOSE_DELAY
  } = config;
  
  const features = `width=${width},height=${height},left=${x},top=${y},${WINDOW_CONFIG.FEATURES}`;
  const uniqueName = `window_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const newWindow = window.open('', uniqueName, features);
  
  if (newWindow) {
    newWindow.document.title = title;
    newWindow.document.body.style.backgroundColor = backgroundColor;
    
    // Auto close after delay
    if (autoCloseDelay > 0) {
      setTimeout(() => {
        if (!newWindow.closed) {
          newWindow.close();
        }
      }, autoCloseDelay);
    }
  }
  
  return newWindow;
}

/**
 * Create multiple windows in a batch
 * @param {Array} configs - Array of window configurations
 * @returns {Array} Array of window references
 */
export function createWindowBatch(configs) {
  return configs.map(config => createWindow(config));
}

/**
 * Close multiple windows
 * @param {Array} windows - Array of window references
 */
export function closeWindows(windows) {
  windows.forEach(window => {
    if (window && !window.closed) {
      window.close();
    }
  });
}

/**
 * Move window to position
 * @param {Window} window - Window reference
 * @param {number} x - New x position
 * @param {number} y - New y position
 */
export function moveWindow(window, x, y) {
  if (window && !window.closed) {
    window.moveTo(Math.round(x), Math.round(y));
  }
}

/**
 * Get center position for circular arrangement
 * @param {number} radius - Circle radius
 * @param {number} windowSize - Window size for bounds calculation
 * @returns {Object} Center position {x, y}
 */
export function getRandomCircleCenter(radius, windowSize = WINDOW_CONFIG.DEFAULT_SIZE) {
  const bounds = calculateSafeBounds(windowSize, radius + SCREEN.MARGIN_BUFFER);
  
  return {
    x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
    y: bounds.minY + Math.random() * (bounds.maxY - bounds.minY)
  };
}

/**
 * Calculate positions for circular arrangement
 * @param {number} numWindows - Number of windows
 * @param {number} radius - Circle radius
 * @param {Object} center - Center position {x, y}
 * @returns {Array} Array of positions [{x, y}, ...]
 */
export function calculateCirclePositions(numWindows, radius, center) {
  const positions = [];
  
  for (let i = 0; i < numWindows; i++) {
    const angle = (2 * Math.PI * i) / numWindows;
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    
    positions.push({ x, y });
  }
  
  return positions;
}

/**
 * Calculate positions for grid arrangement
 * @param {number} numWindows - Number of windows
 * @param {number} spacing - Space between windows
 * @param {Object} startPos - Starting position {x, y}
 * @returns {Array} Array of positions [{x, y}, ...]
 */
export function calculateGridPositions(numWindows, spacing = 120, startPos = { x: 100, y: 100 }) {
  const positions = [];
  const cols = Math.ceil(Math.sqrt(numWindows));
  
  for (let i = 0; i < numWindows; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    
    positions.push({
      x: startPos.x + col * spacing,
      y: startPos.y + row * spacing
    });
  }
  
  return positions;
}