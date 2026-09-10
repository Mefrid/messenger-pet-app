<script setup lang="ts">
import type { ROUTE_NAMES } from '@/application/ports/router'
import AvatarPhoto from '@/infrastructure/shared/ui/components/AvatarPhoto.vue'
import BaseIcon from '@/infrastructure/shared/ui/components/BaseIcon.vue'
const {
  title,
  subtitle,
  avatarUrl,
  avatarSize = 54,
  backRouteName,
  online,
  sticky,
} = defineProps<{
  title: string
  subtitle?: string
  avatarUrl: string
  avatarSize?: number
  backRouteName?: ROUTE_NAMES
  online?: boolean
  sticky?: boolean
}>()
</script>

<template>
  <div :class="{ row: true, sticky }">
    <RouterLink v-if="backRouteName" :to="{ name: backRouteName }">
      <BaseIcon :icon-name="'arrow-left'" :size="32" />
    </RouterLink>
    <AvatarPhoto :avatar-url="avatarUrl" :user-name="title" :size="avatarSize" :online="online" />
    <div class="text-content">
      <span class="title">{{ title }}</span>
      <span class="subtitle" v-if="subtitle">{{ subtitle }}</span>
    </div>
    <div class="end-content">
      <slot name="endContent"></slot>
    </div>
  </div>
</template>

<style lang="css" scoped>
.row {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--p-text-color);

  &.sticky {
    position: sticky;
    padding-block: 12px;
    padding-inline: var(--page-padding-x);
    background-color: var(--page-bg);
    top: 0;
    z-index: 2;

    transition:
      box-shadow 0.3s,
      border-bottom 0.3s;

    animation: stickify linear both;
    animation-timeline: scroll();
    animation-range: 0px 50px;
  }
}

.text-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 6px;
  overflow: hidden;
}

.title {
  font-size: 16px;
}

.subtitle {
  font-size: 14px;
  color: var(--p-text-muted-color);
}

.title,
.subtitle {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  max-width: 100%;
}

.end-content {
  flex-shrink: 0;
  align-self: stretch;
}

@keyframes stickify {
  to {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid var(--p-neutral-700);
  }
}
</style>
