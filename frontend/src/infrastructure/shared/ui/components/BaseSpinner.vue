<script setup lang="ts">
import { ProgressSpinner } from 'primevue'
</script>

<template>
  <div class="container">
    <ProgressSpinner />
  </div>
</template>

<style lang="css" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}
</style>
