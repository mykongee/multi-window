<script setup>
import { ref } from 'vue';

const animatedWindows = []; // Store window references
let animationId = null;   // For stopping animation

function createAnimatedWindows(numWindows) {
    const windowSize = 80;
    const startY = 300; // Baseline Y position
    
    // Create windows in a horizontal line first
    for (let i = 0; i < numWindows; i++) {
        const x = 100 + i * 100; // Spread them horizontally
        const y = startY;
        
        const features = `width=${windowSize},height=${windowSize},left=${x},top=${y},menubar=no,toolbar=no,location=no,status=no,scrollbars=no`;
        const newWindow = window.open('', `wave_window_${Date.now()}_${i}`, features);
        
        newWindow.document.title = `${i + 1}`;
        newWindow.document.body.style.backgroundColor = `hsl(${(360 * i) / numWindows}, 60%, 80%)`;
        
        setTimeout(() => {
            if (!newWindow.closed) {
                newWindow.close();
            }
        }, 10000);

        // Store window reference with its index
        animatedWindows.push({
            window: newWindow,
            index: i,
            baseX: x,
            baseY: startY
        });
    }
    
    // Start the animation
    // startSineWaveAnimation();
    // startTravelingWave();
    startTrueTravelingWave();
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
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    // Close all windows
    animatedWindows.forEach(winObj => {
        if (!winObj.window.closed) {
            winObj.window.close();
        }
    });
    
    animatedWindows = [];
}

</script>

<template>
    <button @click="createAnimatedWindows(8)">
        Sine Wave Pattern
    </button>
    <button @click="stopAnimation">Stop Wave Pattern</button>
</template>