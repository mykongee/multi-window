<script setup>
import { generateCoolColors } from '../utils/colorUtils.js';
import { createWindow, calculateSafeBounds, moveWindow } from '../utils/windowUtils.js';
import { WINDOW_CONFIG } from '../utils/constants.js';

let currentWindows = [];
let animationId = null;
let boidsData = [];

// Boids parameters
const BOID_COUNT = 12;
const WINDOW_SIZE = 40;
const MAX_SPEED = 3;
const MAX_FORCE = 0.1;

// Rule weights
const SEPARATION_RADIUS = 80;
const ALIGNMENT_RADIUS = 100;
const COHESION_RADIUS = 100;
const SEPARATION_WEIGHT = 1.5;
const ALIGNMENT_WEIGHT = 1.0;
const COHESION_WEIGHT = 1.0;

// Title animation configuration
const TITLE_MODES = {
    DIRECTION_ARROWS: 'direction_arrows',
    DIRECTION_SIMPLE: 'direction_simple', 
    RANDOM_CHARS: 'random_chars',
    SPINNING: 'spinning',
    STATIC: 'static'
};

const TITLE_CHAR_SETS = {
    arrows: ['→', '↓', '←', '↑'],
    simple: ['/', '\\', '|', '-'],
    random: ['/', '\\', '|', '-', '•', '○', '●', '◦', '◯', '⚬'],
    spinning: ['|', '/', '-', '\\'],
    birds: ['🐦', '🐤', '🕊️', '🦅', '🦜'],
    symbols: ['★', '☆', '♦', '◆', '▲', '▼', '◀', '▶']
};

// Current title configuration
let titleMode = TITLE_MODES.DIRECTION_ARROWS;
let titleCharSet = TITLE_CHAR_SETS.arrows;

function createBoidsFlocking(mode = TITLE_MODES.DIRECTION_ARROWS, charSet = 'arrows') {
    // Set title animation mode
    titleMode = mode;
    titleCharSet = TITLE_CHAR_SETS[charSet] || TITLE_CHAR_SETS.arrows;
    
    // Clear any existing animation
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
    boidsData = [];
    
    const bounds = calculateSafeBounds(WINDOW_SIZE);
    const colors = generateCoolColors(BOID_COUNT);
    
    // Create boids with random positions and velocities
    for (let i = 0; i < BOID_COUNT; i++) {
        const x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
        const y = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);
        
        const window = createWindow({
            width: WINDOW_SIZE,
            height: WINDOW_SIZE,
            x: x - WINDOW_SIZE / 2,
            y: y - WINDOW_SIZE / 2,
            title: '🐦',
            backgroundColor: colors[i],
            autoCloseDelay: 0
        });
        
        currentWindows.push(window);
        
        // Initialize boid with position and velocity
        boidsData.push({
            window: window,
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2, // Random velocity -1 to 1
            vy: (Math.random() - 0.5) * 2,
            bounds: bounds
        });
    }
    
    // Start the flocking animation
    startFlockingAnimation();
}

function startFlockingAnimation() {
    // Direction characters for title animation
    const directionChars = ['/', '\\', '|', '-'];
    let frameCount = 0;
    
    function animate() {
        frameCount++;
        
        boidsData.forEach(boid => {
            if (!boid.window.closed) {
                // Apply the three boids rules
                const separation = getSeparation(boid);
                const alignment = getAlignment(boid);
                const cohesion = getCohesion(boid);
                
                // Apply forces
                boid.vx += separation.x * SEPARATION_WEIGHT;
                boid.vy += separation.y * SEPARATION_WEIGHT;
                boid.vx += alignment.x * ALIGNMENT_WEIGHT;
                boid.vy += alignment.y * ALIGNMENT_WEIGHT;
                boid.vx += cohesion.x * COHESION_WEIGHT;
                boid.vy += cohesion.y * COHESION_WEIGHT;
                
                // Limit speed
                const speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
                if (speed > MAX_SPEED) {
                    boid.vx = (boid.vx / speed) * MAX_SPEED;
                    boid.vy = (boid.vy / speed) * MAX_SPEED;
                }
                
                // Update position
                boid.x += boid.vx;
                boid.y += boid.vy;
                
                // Handle screen boundaries (wrap around)
                if (boid.x < boid.bounds.minX) boid.x = boid.bounds.maxX;
                if (boid.x > boid.bounds.maxX) boid.x = boid.bounds.minX;
                if (boid.y < boid.bounds.minY) boid.y = boid.bounds.maxY;
                if (boid.y > boid.bounds.maxY) boid.y = boid.bounds.minY;
                
                // Update window title based on movement direction (every 10 frames for readability)
                if (frameCount % 10 === 0) {
                    updateBoidTitle(boid, frameCount);
                }
                
                // Move the window
                moveWindow(boid.window, boid.x - WINDOW_SIZE / 2, boid.y - WINDOW_SIZE / 2);
            }
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Auto-stop after 30 seconds
    setTimeout(() => {
        stopFlocking();
    }, 30000);
}

// Rule 1: Separation - avoid crowding neighbors
function getSeparation(boid) {
    let steerX = 0;
    let steerY = 0;
    let count = 0;
    
    boidsData.forEach(other => {
        if (other !== boid && !other.window.closed) {
            const dx = boid.x - other.x;
            const dy = boid.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < SEPARATION_RADIUS && distance > 0) {
                // Steer away from neighbor
                const normalizedX = dx / distance;
                const normalizedY = dy / distance;
                steerX += normalizedX;
                steerY += normalizedY;
                count++;
            }
        }
    });
    
    if (count > 0) {
        steerX /= count;
        steerY /= count;
        
        // Limit force
        const force = Math.sqrt(steerX * steerX + steerY * steerY);
        if (force > MAX_FORCE) {
            steerX = (steerX / force) * MAX_FORCE;
            steerY = (steerY / force) * MAX_FORCE;
        }
    }
    
    return { x: steerX, y: steerY };
}

// Rule 2: Alignment - steer towards average heading of neighbors
function getAlignment(boid) {
    let avgVx = 0;
    let avgVy = 0;
    let count = 0;
    
    boidsData.forEach(other => {
        if (other !== boid && !other.window.closed) {
            const dx = boid.x - other.x;
            const dy = boid.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < ALIGNMENT_RADIUS) {
                avgVx += other.vx;
                avgVy += other.vy;
                count++;
            }
        }
    });
    
    if (count > 0) {
        avgVx /= count;
        avgVy /= count;
        
        // Limit force
        const force = Math.sqrt(avgVx * avgVx + avgVy * avgVy);
        if (force > MAX_FORCE) {
            avgVx = (avgVx / force) * MAX_FORCE;
            avgVy = (avgVy / force) * MAX_FORCE;
        }
    }
    
    return { x: avgVx, y: avgVy };
}

// Rule 3: Cohesion - steer towards average position of neighbors
function getCohesion(boid) {
    let avgX = 0;
    let avgY = 0;
    let count = 0;
    
    boidsData.forEach(other => {
        if (other !== boid && !other.window.closed) {
            const dx = boid.x - other.x;
            const dy = boid.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < COHESION_RADIUS) {
                avgX += other.x;
                avgY += other.y;
                count++;
            }
        }
    });
    
    if (count > 0) {
        avgX /= count;
        avgY /= count;
        
        // Steer towards center of mass
        let steerX = avgX - boid.x;
        let steerY = avgY - boid.y;
        
        // Limit force
        const force = Math.sqrt(steerX * steerX + steerY * steerY);
        if (force > MAX_FORCE) {
            steerX = (steerX / force) * MAX_FORCE;
            steerY = (steerY / force) * MAX_FORCE;
        }
        
        return { x: steerX, y: steerY };
    }
    
    return { x: 0, y: 0 };
}

// Flexible title update system
function updateBoidTitle(boid, frameCount) {
    let char;
    
    switch (titleMode) {
        case TITLE_MODES.DIRECTION_ARROWS:
            char = getDirectionChar(boid, ['→', '↓', '←', '↑']);
            break;
            
        case TITLE_MODES.DIRECTION_SIMPLE:
            char = getDirectionChar(boid, ['-', '\\', '-', '/']);
            break;
            
        case TITLE_MODES.RANDOM_CHARS:
            char = titleCharSet[Math.floor(Math.random() * titleCharSet.length)];
            break;
            
        case TITLE_MODES.SPINNING:
            const spinIndex = Math.floor(frameCount / 10) % titleCharSet.length;
            char = titleCharSet[spinIndex];
            break;
            
        case TITLE_MODES.STATIC:
            char = titleCharSet[0] || '•';
            break;
            
        default:
            char = '•';
    }
    
    boid.window.document.title = char;
}

// Helper function to get direction-based character
function getDirectionChar(boid, directionChars) {
    const speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
    
    if (speed < 0.5) {
        return '•'; // Stationary
    }
    
    // Calculate movement angle
    const angle = Math.atan2(boid.vy, boid.vx);
    const degrees = (angle * 180 / Math.PI + 360) % 360;
    
    // Map angle to direction character
    if (degrees >= 315 || degrees < 45) {
        return directionChars[0]; // Right
    } else if (degrees >= 45 && degrees < 135) {
        return directionChars[1]; // Down
    } else if (degrees >= 135 && degrees < 225) {
        return directionChars[2]; // Left
    } else {
        return directionChars[3]; // Up
    }
}

function stopFlocking() {
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
    boidsData = [];
}
</script>

<template>
    <div class="boids-controls">
        <div class="boids-row">
            <button @click="createBoidsFlocking(TITLE_MODES.DIRECTION_ARROWS, 'arrows')">
                🐦 Arrows
            </button>
            <button @click="createBoidsFlocking(TITLE_MODES.DIRECTION_SIMPLE, 'simple')">
                🐦 Simple
            </button>
            <button @click="createBoidsFlocking(TITLE_MODES.RANDOM_CHARS, 'random')">
                🐦 Random
            </button>
        </div>
        <div class="boids-row">
            <button @click="createBoidsFlocking(TITLE_MODES.SPINNING, 'spinning')">
                🐦 Spinning
            </button>
            <button @click="createBoidsFlocking(TITLE_MODES.RANDOM_CHARS, 'birds')">
                🐦 Birds
            </button>
            <button @click="stopFlocking">Stop All</button>
        </div>
    </div>
</template>

<style scoped>
.boids-controls {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.boids-row {
    display: flex;
    gap: 5px;
}

button {
    font-size: 14px;
    padding: 6px 12px;
    min-width: 80px;
}
</style>