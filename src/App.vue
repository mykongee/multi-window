<script setup>
import NewWindow from './components/NewWindowButton.vue';
import CircleWindowsButton from './components/CircleWindowsButton.vue';
import SineWaveAnimationButton from './components/SineWaveAnimationButton.vue';
</script>

<template>
  <div class="btn-list">
    <CircleWindowsButton />  
    <NewWindow />
    <SineWaveAnimationButton />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.btn-list {
  display: flex;
  flex-direction: column;
}

button {
  margin: 5px;
}
</style>
