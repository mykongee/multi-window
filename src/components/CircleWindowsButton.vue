<script setup>
import { generatePastelColors } from '../utils/colorUtils.js';
import { getRandomCircleCenter, calculateCirclePositions, createWindow } from '../utils/windowUtils.js';
import { ANIMATION, WINDOW_CONFIG } from '../utils/constants.js';


function openCircularWindows(numWindows) {
    const radius = ANIMATION.CIRCLE_RADIUS;
    const windowSize = WINDOW_CONFIG.DEFAULT_SIZE;
    
    // Get random center within safe bounds
    const center = getRandomCircleCenter(radius, windowSize);
    
    // Calculate positions for all windows
    const positions = calculateCirclePositions(numWindows, radius, center);
    
    // Generate color palette
    const colorPalette = generatePastelColors(numWindows);
    console.log(colorPalette);

    // Create all windows
    positions.forEach((position, i) => {
        const windowConfig = {
            width: windowSize + 20 * i + 1,
            height: windowSize + 20 * i + 1,
            x: position.x - (windowSize / 2),
            y: position.y - (windowSize / 2),
            title: `${i + 1}`,
            backgroundColor: colorPalette[i],
            autoCloseDelay: WINDOW_CONFIG.AUTO_CLOSE_DELAY
        };
        
        createWindow(windowConfig);
    });
}

</script>

<template>
    <button @click="openCircularWindows(8)">circular pattern</button>
</template>

<style>
</style>