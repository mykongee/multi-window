<script setup>
import { generateMonochromaticColors, generatePastelColors } from '../utils/colorUtils.js';
import { createWindow, calculateSafeBounds } from '../utils/windowUtils.js';
import { WINDOW_CONFIG, SCREEN } from '../utils/constants.js';

let currentWindows = [];
let expansionTimeout = null;

function createCrossExpansion() {
    // Clear any existing animation
    if (expansionTimeout) {
        clearTimeout(expansionTimeout);
    }
    
    // Close existing windows
    currentWindows.forEach(window => {
        if (window && !window.closed) {
            window.close();
        }
    });
    currentWindows = [];
    
    const windowSize = 80;
    const spacing = windowSize + 50; // Small gap between windows
    
    // Calculate center of screen
    const bounds = calculateSafeBounds(windowSize);
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    
    // Generate colors (blue monochromatic for clean look)
    const colors = generatePastelColors(200, 50); // Base hue: blue, lots of colors
    let colorIndex = 0;
    
    // Directions: North, East, South, West
    const directions = [
        { dx: 0, dy: -1, name: 'North' },   // Up
        { dx: 1, dy: 0, name: 'East' },     // Right  
        { dx: 0, dy: 1, name: 'South' },    // Down
        { dx: -1, dy: 0, name: 'West' }     // Left
    ];
    
    // Track expansion state for each direction
    const expansionState = directions.map(dir => ({
        ...dir,
        currentStep: 0,
        maxSteps: 0,
        active: true
    }));
    
    // Calculate max steps for each direction based on screen bounds
    expansionState.forEach(state => {
        if (state.name === 'North') {
            state.maxSteps = Math.floor((centerY - bounds.minY) / spacing);
        } else if (state.name === 'South') {
            state.maxSteps = Math.floor((bounds.maxY - centerY) / spacing);
        } else if (state.name === 'East') {
            state.maxSteps = Math.floor((bounds.maxX - centerX) / spacing);
        } else if (state.name === 'West') {
            state.maxSteps = Math.floor((centerX - bounds.minX) / spacing);
        }
    });
    
    // Create center window first
    const centerWindow = createWindow({
        width: windowSize,
        height: windowSize,
        x: centerX - windowSize / 2,
        y: centerY - windowSize / 2,
        title: 'Center',
        backgroundColor: colors[colorIndex++],
        autoCloseDelay: 0 // Don't auto-close, we'll manage this
    });
    
    currentWindows.push(centerWindow);
    
    // Start the expansion animation
    function expandStep() {
        let anyActive = false;
        
        // For each active direction, spawn the next window
        expansionState.forEach(state => {
            if (state.active && state.currentStep < state.maxSteps) {
                anyActive = true;
                state.currentStep++;
                
                const x = centerX + (state.dx * state.currentStep * spacing) - windowSize / 2;
                const y = centerY + (state.dy * state.currentStep * spacing) - windowSize / 2;
                
                const window = createWindow({
                    width: windowSize,
                    height: windowSize,
                    x: x,
                    y: y,
                    title: `${state.name}-${state.currentStep}`,
                    backgroundColor: colors[colorIndex % colors.length],
                    autoCloseDelay: 0
                });
                
                currentWindows.push(window);
                colorIndex++;
                
                // Check if this direction is done
                if (state.currentStep >= state.maxSteps) {
                    state.active = false;
                }
            }
        });
        
        // Continue if any direction is still active
        if (anyActive) {
            expansionTimeout = setTimeout(expandStep, 300); // 300ms between spawns
        } else {
            // All directions complete, set auto-close after a delay
            setTimeout(() => {
                currentWindows.forEach(window => {
                    if (window && !window.closed) {
                        window.close();
                    }
                });
                currentWindows = [];
            }, 3000);
        }
    }
    
    // Start expansion after a short delay
    setTimeout(expandStep, 500);
}

function stopExpansion() {
    if (expansionTimeout) {
        clearTimeout(expansionTimeout);
        expansionTimeout = null;
    }
    
    currentWindows.forEach(window => {
        if (window && !window.closed) {
            window.close();
        }
    });
    currentWindows = [];
}
</script>

<template>
    <button @click="createCrossExpansion()">
        ➕ Cross Expansion
    </button>
    <button @click="stopExpansion">Stop Expansion</button>
</template>

<style scoped>
button {
    font-size: 16px;
    padding: 8px 16px;
}
</style>