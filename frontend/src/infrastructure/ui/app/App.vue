<script setup lang="ts">
import AuthGuard from './AuthGuard.vue'
import './css/global.css'
import './css/media.css'
</script>

<template>
  <main>
    <AuthGuard>
      <RouterView />
    </AuthGuard>
  </main>
</template>

<style scoped>
main {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: var(--page-bg);
}
</style>
