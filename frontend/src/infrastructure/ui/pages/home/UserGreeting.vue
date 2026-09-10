<script setup lang="ts">
import AvatarPhoto from '@/infrastructure/shared/ui/components/AvatarPhoto.vue'

const { firstName, avatarUrl } = defineProps<{
  firstName: string
  avatarUrl: string
}>()
</script>

<template>
  <div class="greeting">
    <AvatarPhoto :avatarUrl="avatarUrl" :userName="firstName" />
    <p>
      Hello, <b>{{ firstName }}</b> <span class="emoji">👋</span>
    </p>
  </div>
</template>

<style lang="css" scoped>
.greeting {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
}

.emoji {
  font-size: 20px;
}
</style>
