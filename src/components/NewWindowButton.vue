<script setup>
import { ref } from 'vue';

function generateRandomDimensions() {
    const dimensions = {
        w: undefined,
        h: undefined,
        x: undefined,
        y: undefined
    };
    dimensions.w = Math.round(Math.random() * 400);
    dimensions.h = Math.round(Math.random() * 400);
    dimensions.x = Math.round(Math.random() * 1000);
    dimensions.y = Math.round(Math.random() * 1000);
    return dimensions;
}

function openNewWindow() {
    const dimensions = generateRandomDimensions();
    console.log(dimensions);

    const uniqueName = `window_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newWindow = window.open(
        `about:${uniqueName}`,
        uniqueName,
        `width=${dimensions.w},height=${dimensions.h},left=${dimensions.x},top=${dimensions.y},popup=yes,menubar='',toolbar='',resizable=''`
    );

    setTimeout(() => {
        newWindow.focus();
    }, 1000);

    setTimeout(() => {
        if (!newWindow.closed) {
            newWindow.close();
        }
    }, 5000);
}

</script>

<template>
    <button @click="openNewWindow">NEW WINDOW</button>
</template>

<style>
</style>