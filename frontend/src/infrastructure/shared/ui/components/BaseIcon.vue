<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from 'vue'

const { iconName, size } = defineProps<{
  iconName: string
  size?: number
}>()

const icons = import.meta.glob('/src/infrastructure/shared/ui/icons/*.svg') as Record<
  string,
  () => Promise<Component>
>

const iconComponent = computed(() => {
  // 2. Resolve the path based on the prop string
  const fileKey = `/src/infrastructure/shared/ui/icons/${iconName}.svg`

  if (!icons[fileKey]) {
    console.warn(`Icon "${iconName}" not found.`)
    return null
  }

  // 3. Lazily load the component using Vue's defineAsyncComponent
  return defineAsyncComponent(icons[fileKey])
})
</script>

<template>
  <component :is="iconComponent" v-if="iconComponent" class="icon" :style="{ width: size }" />
</template>

<style scoped>
.icon {
  display: inline-block;
  flex-shrink: 0;
}
</style>
