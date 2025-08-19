<script setup>
import { generateMonochromaticColors, generatePastelColors } from '../utils/colorUtils.js';
import { createWindow, calculateSafeBounds, moveWindow } from '../utils/windowUtils.js';
import { WINDOW_CONFIG } from '../utils/constants.js';

let currentWindows = [];
let expansionTimeout = null;
let animationId = null;
let windowsData = []; // Store window positions and metadata

function createAnimatedCross() {
    // Clear any existing animation
    if (expansionTimeout) {
        clearTimeout(expansionTimeout);
    }
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    // Close existing windows
    currentWindows.forEach(window => {
        if (window && !window.closed) {
            window.close();
        }
    });
    currentWindows = [];
    windowsData = [];
    
    const windowSize = 80;
    const spacing = windowSize + 50; // Small gap between windows
    
    // Calculate center of screen
    const bounds = calculateSafeBounds(windowSize);
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    
    // Generate colors
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
    
    // Calculate max steps for each direction (smaller for better animation)
    expansionState.forEach(state => {
        const maxSteps = 4; // Limit to 4 steps per direction for cleaner animation
        if (state.name === 'North') {
            state.maxSteps = Math.min(maxSteps, Math.floor((centerY - bounds.minY) / spacing));
        } else if (state.name === 'South') {
            state.maxSteps = Math.min(maxSteps, Math.floor((bounds.maxY - centerY) / spacing));
        } else if (state.name === 'East') {
            state.maxSteps = Math.min(maxSteps, Math.floor((bounds.maxX - centerX) / spacing));
        } else if (state.name === 'West') {
            state.maxSteps = Math.min(maxSteps, Math.floor((centerX - bounds.minX) / spacing));
        }
    });
    
    // Create center window first (this one stays still)
    const centerWindow = createWindow({
        width: windowSize,
        height: windowSize,
        x: centerX - windowSize / 2,
        y: centerY - windowSize / 2,
        title: '✜',
        backgroundColor: colors[colorIndex++],
        autoCloseDelay: 0
    });
    
    currentWindows.push(centerWindow);
    windowsData.push({
        window: centerWindow,
        baseX: centerX - windowSize / 2,
        baseY: centerY - windowSize / 2,
        direction: 'center',
        step: 0,
        shouldAnimate: false // Center window doesn't move
    });
    
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
                    title: `${state.currentStep}`,
                    backgroundColor: colors[colorIndex % colors.length],
                    autoCloseDelay: 0
                });
                
                currentWindows.push(window);
                
                // Store window data for animation
                windowsData.push({
                    window: window,
                    baseX: x,
                    baseY: y,
                    direction: state.name,
                    step: state.currentStep,
                    shouldAnimate: true,
                    velocity: 0.5 + Math.random() * 2 // Random velocity between 0.5 and 2.5 pixels per frame
                });
                
                colorIndex++;
                
                // Check if this direction is done
                if (state.currentStep >= state.maxSteps) {
                    state.active = false;
                }
            }
        });
        
        // Continue if any direction is still active
        if (anyActive) {
            expansionTimeout = setTimeout(expandStep, 400); // 400ms between spawns
        } else {
            // All directions complete, start the movement animation
            setTimeout(startMovementAnimation, 500);
        }
    }
    
    // Start expansion after a short delay
    setTimeout(expandStep, 500);
}

function startMovementAnimation() {
    // Track individual time/distance for each window
    windowsData.forEach(winData => {
        winData.distance = 0; // Initialize distance traveled for each window
    });
    
    function animate() {
        windowsData.forEach(winData => {
            if (!winData.window.closed && winData.shouldAnimate) {
                // Update distance based on this window's unique velocity
                winData.distance += winData.velocity;
                
                let newX = winData.baseX;
                let newY = winData.baseY;
                
                // East/West windows: alternate up/down drift
                if (winData.direction === 'East' || winData.direction === 'West') {
                    const isOdd = winData.step % 2 === 1;
                    const direction = isOdd ? 1 : -1; // Odd steps drift down, even steps drift up
                    newY = winData.baseY + direction * winData.distance;
                }
                
                // North/South windows: alternate left/right drift  
                if (winData.direction === 'North' || winData.direction === 'South') {
                    const isOdd = winData.step % 2 === 1;
                    const direction = isOdd ? 1 : -1; // Odd steps drift right, even steps drift left
                    newX = winData.baseX + direction * winData.distance;
                }
                
                moveWindow(winData.window, newX, newY);
            }
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Auto-stop after 15 seconds
    setTimeout(() => {
        stopAnimatedCross();
    }, 15000);
}

function stopAnimatedCross() {
    if (expansionTimeout) {
        clearTimeout(expansionTimeout);
        expansionTimeout = null;
    }
    
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    currentWindows.forEach(window => {
        if (window && !window.closed) {
            window.close();
        }
    });
    currentWindows = [];
    windowsData = [];
}
</script>

<template>
    <button @click="createAnimatedCross()">
        ✜ Animated Cross
    </button>
    <button @click="stopAnimatedCross">Stop Animated Cross</button>
</template>

<style scoped>
button {
    font-size: 16px;
    padding: 8px 16px;
}
</style>