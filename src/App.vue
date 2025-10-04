<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';

</script>

<template>
  <AppHeader/>
  <RouterView />
</template>

<style>
/* Global styles for the entire application */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  overflow-y: scroll;
}

html, body {
  height: 100%;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.5;
  color: #1f2937;
  background-color: #ffffff;
}

#app {
  height: 100%;
  width: 100%;
}
</style>
