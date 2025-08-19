<script setup>
import { generatePastelColors } from '../utils/colorUtils.js';
import { createWindow, getRandomCircleCenter } from '../utils/windowUtils.js';
import { createAnimation, animateFireworkBurst } from '../utils/animationUtils.js';
import { WINDOW_CONFIG, ANIMATION } from '../utils/constants.js';

let currentAnimationStop = null;

function createFireworkBurst(numWindows = 12) {
    // Stop any existing animation
    if (currentAnimationStop) {
        currentAnimationStop();
    }
    
    const windowSize = 60;
    
    // Get random center point for the firework
    const center = getRandomCircleCenter(200, windowSize);
    
    // Generate warm colors for firework effect
    const colors = generatePastelColors(numWindows);
    
    // Create all windows at the center point initially
    const windows = Array.from({ length: numWindows }, (_, i) => {
        const windowConfig = {
            width: windowSize,
            height: windowSize,
            x: center.x - windowSize / 2,
            y: center.y - windowSize / 2,
            title: `💥${i + 1}`,
            backgroundColor: colors[i],
            autoCloseDelay: 6000 // Slightly longer for firework effect
        };
        
        const newWindow = createWindow(windowConfig);
        
        return {
            window: newWindow,
            index: i,
            centerX: center.x,
            centerY: center.y
        };
    });
    
    // Start the firework burst animation
    currentAnimationStop = createAnimation('firework-burst', windows, animateFireworkBurst, {
        centerX: center.x,
        centerY: center.y,
        burstSpeed: ANIMATION.FIREWORK_BURST_SPEED,
        gravity: 0.8,
        duration: 5 // Animation duration in seconds
    });
}

function stopAnimation() {
    if (currentAnimationStop) {
        currentAnimationStop();
        currentAnimationStop = null;
    }
}
</script>

<template>
    <button @click="createFireworkBurst(12)">
        🎆 Firework Burst
    </button>
    <button @click="stopAnimation">Stop Firework</button>
</template>

<style scoped>
button {
    font-size: 16px;
    padding: 8px 16px;
}
</style>