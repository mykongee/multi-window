<script setup>
import { ref } from 'vue';

// generate 12 browser windows
// open them in a circular pattern
// calculate circle dimensions
// sample circle on 12 points
// use those 12 points to generate new window

// Given:
const centerX = 1000;  // Center of circle
const centerY = 1000;
const radius = 200;   // Distance from center
const numWindows = 8;

function generatePastelColors(numColors) {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
        // Generate random RGB but keep values high (pastel effect)
        const r = 180 + Math.floor(Math.random() * 75);  // 180-255
        const g = 180 + Math.floor(Math.random() * 75);  // 180-255  
        const b = 180 + Math.floor(Math.random() * 75);  // 180-255
        
        colors.push(`rgb(${r}, ${g}, ${b})`);
    }
    return colors;
}

function openCircularWindows(numWindows) {
    // Use smaller, more predictable values
    // const centerX = 400;  // Fixed center instead of screen.width/2
    // const centerY = 300;  // Fixed center instead of screen.height/2
    const radius = 300;   // Smaller radius
    const windowSize = 150; // Smaller windows
    
    // Calculate safe bounds so the entire circle stays visible
    const margin = radius + (windowSize / 2);
    const minX = margin;
    const maxX = window.screen.availWidth - margin;
    const minY = margin;
    const maxY = window.screen.availHeight - margin;
    
    // Pick random center within safe bounds
    const centerX = minX + Math.random() * (maxX - minX);
    const centerY = minY + Math.random() * (maxY - minY);

    const colorPalette = generatePastelColors(numWindows);
    console.log(colorPalette);

    for (let i = 0; i < numWindows; i++) {
        const angle = (2 * Math.PI * i) / numWindows;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const windowX = x - (windowSize / 2);
        const windowY = y - (windowSize / 2);
        
        const features = `width=${windowSize+20*i+1},height=${windowSize+20*i+1},left=${windowX},top=${windowY},menubar=no,toolbar=no,location=no,status=no,scrollbars=no`;
        const newWindow = window.open('', `circle_window_${Date.now()}_${i}`, features);
    
        newWindow.document.title = `${i + 1}`;

        // set background color of new windows
        // using pastel colors
        newWindow.document.body.style.backgroundColor = colorPalette[i];

        setTimeout(() => {
            if (!newWindow.closed) {
                newWindow.close();
            }
        }, 5000);
    }
}

</script>

<template>
    <button @click="openCircularWindows(8)">circular pattern</button>
</template>

<style>
</style>