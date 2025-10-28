<script setup lang="ts">
import { computed } from 'vue'         // 반응형 계산 속성 사용
import { useRoute } from 'vue-router'  // 현재 라우트 정보 가져오기
import AppHeader from './components/AppHeader.vue';
import PopularPlaces from './components/PopularPlaces.vue';

const route = useRoute() // 현재 URL 정보
// MapView일 때는 AppHeader 숨기기
const showAppHeader = computed(() => route.name !== 'map')
</script>

<template>
  <AppHeader v-if="showAppHeader" />
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
