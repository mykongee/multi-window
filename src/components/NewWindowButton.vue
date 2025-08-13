<script setup>
import { getRandomDimensions, getRandomPosition, createWindow } from '../utils/windowUtils.js';
import { WINDOW_CONFIG } from '../utils/constants.js';

function openNewWindow() {
    const dimensions = getRandomDimensions();
    const position = getRandomPosition(Math.max(dimensions.width, dimensions.height));
    
    console.log({ dimensions, position });

    const windowConfig = {
        width: dimensions.width,
        height: dimensions.height,
        x: position.x,
        y: position.y,
        title: 'Random Window',
        backgroundColor: '#ffffff',
        autoCloseDelay: WINDOW_CONFIG.AUTO_CLOSE_DELAY
    };
    
    const newWindow = createWindow(windowConfig);

    // Focus the window after a short delay
    setTimeout(() => {
        if (newWindow && !newWindow.closed) {
            newWindow.focus();
        }
    }, 1000);
}

</script>

<template>
    <button @click="openNewWindow">NEW WINDOW</button>
</template>

<style>
</style>