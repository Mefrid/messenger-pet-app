<script setup lang="ts">
const { noPadding } = defineProps<{
  noPadding?: boolean
}>()
</script>

<template>
  <section :class="{ page: true, 'no-padding': noPadding }">
    <slot />
  </section>
</template>

<style lang="css" scoped>
.page {
  padding-top: var(--page-padding-top);
  padding-inline: var(--page-padding-x);
  padding-bottom: var(--page-padding-bottom);
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  &.no-padding {
    padding: 0;
  }
}
</style>
