<script setup lang="ts">
import BaseIcon from './BaseIcon.vue'

const { title, description, iconName } = defineProps<{
  title: string
  description?: string
  iconName?: string
}>()
</script>

<template>
  <div class="stub">
    <BaseIcon :iconName="iconName" v-if="iconName" :size="80" />
    <p class="title">{{ title }}</p>
    <p class="description" v-if="description">{{ description }}</p>
    <slot></slot>
  </div>
</template>

<style scoped>
p {
  margin: 0;
}

.stub {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1;
  color: var(--p-text-color);
}

.icon {
  stroke: currentColor;
}

.title {
  font-size: 28px;
  font-weight: 700;
  text-align: center;
}

.description {
  font-size: 16px;
  font-weight: 400;
  margin-top: -8px;
  color: var(--p-text-muted-color);
}
</style>
