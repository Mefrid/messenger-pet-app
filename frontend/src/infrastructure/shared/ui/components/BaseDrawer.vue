<script setup lang="ts">
import { Drawer } from 'primevue'
const { header, height } = defineProps<{
  header: string
  height?: 'auto' | 'full-height'
}>()
const isVisible = defineModel('isVisible', {
  required: true,
  default: false,
})
</script>

<template>
  <Drawer
    class="drawer"
    :header="header"
    v-model:visible="isVisible"
    position="bottom"
    blockScroll
    :show-close-icon="false"
    :pt="{ root: 'custom-drawer', header: 'custom-drawer-header' }"
    :style="{ height: height === 'auto' ? 'auto' : 'calc(100% - 48px)' }"
  >
    <slot />
  </Drawer>
</template>

<style lang="css">
.custom-drawer {
  border-style: hidden !important;
  border-radius: 16px 16px 0 0;
  margin-top: 16px;
}

.custom-drawer-header {
  justify-content: center !important;
  padding: 18px 18px 24px 18px !important;
}
</style>
