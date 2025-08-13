<script setup>
import { generateRainbowColors } from '../utils/colorUtils.js';
import { createWindow, calculateGridPositions } from '../utils/windowUtils.js';
import { createAnimation, animationManager, animateSineWave, animateTravelingWave } from '../utils/animationUtils.js';
import { WINDOW_CONFIG, ANIMATION } from '../utils/constants.js';

let currentAnimationStop = null;

function createAnimatedWindows(numWindows) {
    // Stop any existing animation
    if (currentAnimationStop) {
        currentAnimationStop();
    }
    
    const windowSize = 80;
    const startY = 300;
    const spacing = 100;
    
    // Generate positions and colors
    const positions = calculateGridPositions(numWindows, spacing, { x: 100, y: startY });
    const colors = generateRainbowColors(numWindows, 60, 80);
    
    // Create windows with metadata
    const windows = positions.map((position, i) => {
        const windowConfig = {
            width: windowSize,
            height: windowSize,
            x: position.x,
            y: position.y,
            title: `${i + 1}`,
            backgroundColor: colors[i],
            autoCloseDelay: ANIMATION.ANIMATION_CLOSE_DELAY
        };
        
        const newWindow = createWindow(windowConfig);
        
        return {
            window: newWindow,
            index: i,
            baseX: position.x,
            baseY: position.y
        };
    });
    
    // Start the traveling wave animation
    currentAnimationStop = createAnimation('traveling-wave', windows, animateTravelingWave, {
        amplitude: 80,
        waveLength: 3,
        speed: 0.15
    });
}

function startSineWaveAnimation() {
    let time = 0;
    
    function animate() {
        time += 0.1; // Animation speed
        
        animatedWindows.forEach((winObj) => {
            if (!winObj.window.closed) {
                // Sine wave calculation
                const amplitude = 100; // How high/low the wave goes
                const frequency = 0.5;  // How "wavy" it is
                const phase = winObj.index * 0.5; // Offset between windows
                
                const newY = winObj.baseY + amplitude * Math.sin(frequency * winObj.index + time + phase);
                
                // Move the window
                winObj.window.moveTo(winObj.baseX, newY);
            }
        });
        
        // Continue animation
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
}

function startTrueTravelingWave() {
    let time = 0;
    
    function animate() {
        time += 0.1;
        
        animatedWindows.forEach((winObj) => {
            if (!winObj.window.closed) {
                // X position moves forward
                const newX = winObj.baseX + time * 3;
                
                // Y follows sine wave based on current X position
                const waveLength = 200; // Distance between wave peaks
                const amplitude = 80;
                const newY = winObj.baseY + amplitude * Math.sin((newX / waveLength) * 2 * Math.PI);
                
                winObj.window.moveTo(newX, newY);
                
                // Reset when off screen
                if (newX > window.screen.availWidth + 100) {
                    winObj.baseX = -100;
                }
            }
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
}

function startTravelingWave() {
    let time = 0;
    
    function animate() {
        time += 0.15;
        
        animatedWindows.forEach((winObj) => {
            if (!winObj.window.closed) {
                const amplitude = 80;
                const waveLength = 3; // How many windows per wave cycle
                
                // Wave travels from left to right
                const newY = winObj.baseY + amplitude * Math.sin((2 * Math.PI * winObj.index / waveLength) - time);
                
                winObj.window.moveTo(winObj.baseX, newY);
            }
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
}

function stopAnimation() {
    // if (animationId) {
    //     cancelAnimationFrame(animationId);
    //     animationId = null;
    // }
    if (currentAnimationStop) {
        currentAnimationStop();
        currentAnimationStop = null;
    }

    // // Close all windows
    // animatedWindows.forEach(winObj => {
    //     if (!winObj.window.closed) {
    //         winObj.window.close();
    //     }
    // });
    
    // animatedWindows = [];
}

</script>

<template>
    <button @click="createAnimatedWindows(8)">
        Sine Wave Pattern
    </button>
    <button @click="stopAnimation">Stop Wave Pattern</button>
</template>