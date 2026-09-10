<script setup lang="ts">
const {
  avatarUrl,
  size = 54,
  userName,
  online,
} = defineProps<{
  avatarUrl: string
  size?: number
  userName: string
  online?: boolean
}>()
</script>

<template>
  <div class="avatar-wrapper">
    <img
      class="avatar"
      :src="avatarUrl"
      :alt="userName"
      :style="{ width: `${size}px`, 'max-width': `${size}px` }"
    />
    <Transition name="fade" appear>
      <div v-if="online" class="online-status"></div>
    </Transition>
  </div>
</template>

<style lang="css" scoped>
.avatar {
  aspect-ratio: 1 / 1;
  border-radius: 99999px;
  object-fit: cover;
}

.avatar-wrapper {
  position: relative;
}

.online-status {
  position: absolute;
  content: '';
  display: block;
  width: 10px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  border: 4px solid var(--page-bg);
  box-sizing: content-box;
  background-color: var(--p-green-500);
  bottom: 0;
  right: 0;
  translate: -2px -2px;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.25s ease,
    translate 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  translate: 0 -10px;
}
</style>
